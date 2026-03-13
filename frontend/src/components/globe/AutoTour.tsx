import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRaces } from '../../context/RaceContext';
import { latLngTo3D } from '../../utils/geo';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const IDLE_TIMEOUT = 10_000;   // 10 seconds before first auto-tour
const SLERP_DURATION = 2.0;    // 2 seconds to animate camera to venue
const HOLD_DURATION = 4.0;     // 4 seconds hold at each venue
const CAMERA_RADIUS = 2.8;     // distance from globe centre during tour
const GLOBE_RADIUS = 1.02;     // arc sits just above the globe surface
const ARC_SEGMENTS = 64;       // smoothness of the arc line
const ARC_LIFT = 0.005;        // tiny lift so the tube doesn't z-fight with the globe

interface AutoTourProps {
  touring: boolean;
  onTourChange: (touring: boolean) => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

type TourPhase = 'idle' | 'slerp' | 'hold';

/**
 * Build a great-circle arc between two points that hugs the globe surface.
 */
function buildArcPoints(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const fromDir = from.clone().normalize();
  const toDir = to.clone().normalize();

  for (let i = 0; i <= ARC_SEGMENTS; i++) {
    const t = i / ARC_SEGMENTS;

    // Slerp along the surface
    const qFrom = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), fromDir);
    const qTo = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), toDir);
    const qInterp = qFrom.clone().slerp(qTo, t);
    const dir = new THREE.Vector3(0, 0, 1).applyQuaternion(qInterp);

    // Sit just above the surface to avoid z-fighting
    const r = GLOBE_RADIUS + ARC_LIFT;

    points.push(dir.multiplyScalar(r));
  }
  return points;
}

export function AutoTour({ touring, onTourChange, controlsRef }: AutoTourProps) {
  const { camera, scene } = useThree();
  const { races, selectRace } = useRaces();

  // Sort races chronologically by their first session time
  const sortedF1Races = useMemo(() => {
    return races
      .filter((r) => r.series.includes('f1'))
      .sort((a, b) => {
        const aTime = a.sessions ? Object.values(a.sessions)[0] : '';
        const bTime = b.sessions ? Object.values(b.sessions)[0] : '';
        return aTime.localeCompare(bTime);
      });
  }, [races]);

  // Track whether the user has ever manually stopped the tour.
  // Once stopped, we never auto-restart — only the Play button can.
  const userStoppedRef = useRef(false);

  // Idle timer — fires only once on first load, never again after user stops
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // On mount, start a single idle timer for the initial auto-start
    if (!touring && !userStoppedRef.current) {
      idleTimerRef.current = setTimeout(() => {
        onTourChange(true);
      }, IDLE_TIMEOUT);
    }

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When touring becomes false after it was true, mark user-stopped
  const wasTouringRef = useRef(false);
  useEffect(() => {
    if (wasTouringRef.current && !touring) {
      userStoppedRef.current = true;
      // Clear the idle timer so it never auto-restarts
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    }
    wasTouringRef.current = touring;
  }, [touring]);

  // When user manually clicks Play (touring goes true after user stopped),
  // reset the stopped flag so the tour runs
  useEffect(() => {
    if (touring && userStoppedRef.current) {
      userStoppedRef.current = false;
    }
  }, [touring]);

  // Tour state refs
  const tourIndexRef = useRef(0);
  const phaseRef = useRef<TourPhase>('idle');
  const phaseTimeRef = useRef(0);
  const targetPosRef = useRef(new THREE.Vector3(0, 0, CAMERA_RADIUS));
  const prevPosRef = useRef<THREE.Vector3 | null>(null);

  // Arc mesh ref — TubeGeometry for thick lines (WebGL ignores linewidth)
  const arcMeshRef = useRef<THREE.Mesh | null>(null);

  const removeArc = () => {
    if (arcMeshRef.current) {
      scene.remove(arcMeshRef.current);
      arcMeshRef.current.geometry.dispose();
      (arcMeshRef.current.material as THREE.Material).dispose();
      arcMeshRef.current = null;
    }
  };

  const createArc = (from: THREE.Vector3, to: THREE.Vector3) => {
    removeArc();
    const points = buildArcPoints(from, to);
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, ARC_SEGMENTS, 0.006, 8, false);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      transparent: true,
      opacity: 0.85,
    });
    const mesh = new THREE.Mesh(geometry, material);
    arcMeshRef.current = mesh;
    scene.add(mesh);
  };

  // When touring starts, begin at the first race
  useEffect(() => {
    if (touring && sortedF1Races.length > 0) {
      tourIndexRef.current = 0;
      phaseRef.current = 'slerp';
      phaseTimeRef.current = 0;

      // Compute target position for first race
      const race = sortedF1Races[0];
      const target = latLngTo3D(race.lat, race.lng, CAMERA_RADIUS);
      targetPosRef.current = target;

      // For the first race, the "previous" position is where the camera is now
      prevPosRef.current = latLngTo3D(
        // approximate current camera lat/lng from camera position
        // by projecting to globe surface
        race.lat, race.lng, GLOBE_RADIUS
      );
      // No arc for the first fly-in — just move there
      prevPosRef.current = null;

      selectRace(race);
    } else if (!touring) {
      phaseRef.current = 'idle';
      removeArc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touring, sortedF1Races, selectRace]);

  // Cleanup arc on unmount
  useEffect(() => {
    return () => removeArc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (!touring || sortedF1Races.length === 0) return;

    const controls = controlsRef.current;

    if (phaseRef.current === 'slerp') {
      phaseTimeRef.current += delta;
      const t = Math.min(phaseTimeRef.current / SLERP_DURATION, 1);

      // Smooth ease-in-out
      const smoothT = t * t * (3 - 2 * t);

      // Slerp camera position toward target
      const currentPos = camera.position.clone();
      const currentDir = currentPos.clone().normalize();
      const targetDir = targetPosRef.current.clone().normalize();

      // Slerp the direction
      const qFrom = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        currentDir
      );
      const qTo = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        targetDir
      );
      const qInterp = qFrom.clone().slerp(qTo, smoothT);

      const newDir = new THREE.Vector3(0, 0, 1).applyQuaternion(qInterp);
      const currentRadius = currentPos.length();
      const targetRadius = CAMERA_RADIUS;
      const interpRadius = currentRadius + (targetRadius - currentRadius) * smoothT;

      camera.position.copy(newDir.multiplyScalar(interpRadius));
      camera.lookAt(0, 0, 0);

      // Update OrbitControls target to keep in sync
      if (controls) {
        controls.target.set(0, 0, 0);
        controls.update();
      }

      if (t >= 1) {
        // Arrived — remove the arc and switch to hold
        removeArc();
        phaseRef.current = 'hold';
        phaseTimeRef.current = 0;
      }
    } else if (phaseRef.current === 'hold') {
      phaseTimeRef.current += delta;

      if (phaseTimeRef.current >= HOLD_DURATION) {
        // Store current race's globe-surface position as "from" for the arc
        const currentRace = sortedF1Races[tourIndexRef.current];
        const fromPos = latLngTo3D(currentRace.lat, currentRace.lng, GLOBE_RADIUS);

        // Advance to next race
        const nextIndex = (tourIndexRef.current + 1) % sortedF1Races.length;
        tourIndexRef.current = nextIndex;

        const race = sortedF1Races[nextIndex];
        const toPos = latLngTo3D(race.lat, race.lng, GLOBE_RADIUS);
        targetPosRef.current = latLngTo3D(race.lat, race.lng, CAMERA_RADIUS);

        // Draw the red arc between previous and next venue
        createArc(fromPos, toPos);

        selectRace(race);

        phaseRef.current = 'slerp';
        phaseTimeRef.current = 0;
      }
    }
  });

  return null; // Logic-only component, no JSX output
}
