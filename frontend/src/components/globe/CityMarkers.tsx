import { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRaces } from '../../context/RaceContext';
import { latLngTo3D } from '../../utils/geo';
import { getPhase, phaseColor } from '../../utils/time';

const DOT_RADIUS = 0.018;
const GLOBE_RADIUS = 1;

export function CityMarkers() {
  const { filteredRaces, selectRace } = useRaces();
  const groupRef = useRef<THREE.Group>(null);
  const { raycaster, camera, pointer } = useThree();

  const markers = useMemo(() => {
    return filteredRaces.map((race) => {
      const pos = latLngTo3D(race.lat, race.lng, GLOBE_RADIUS + 0.025);
      const phase = getPhase(race.timezone);
      const color = phaseColor(phase);
      return { race, position: pos, color };
    });
  }, [filteredRaces]);

  // Update colors based on local time every 60 frames
  const frameCount = useRef(0);
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 60 !== 0 || !groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      if (i < markers.length) {
        const phase = getPhase(markers[i].race.timezone);
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: phaseColor(phase),
        });
      }
    });
  });

  const handleClick = useCallback(() => {
    if (!groupRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(groupRef.current.children);
    if (intersects.length > 0) {
      const idx = groupRef.current.children.indexOf(intersects[0].object);
      if (idx >= 0 && idx < markers.length) {
        selectRace(markers[idx].race);
      }
    }
  }, [markers, selectRace, raycaster, camera, pointer]);

  return (
    <group ref={groupRef} onClick={handleClick}>
      {markers.map(({ race, position, color }) => (
        <mesh
          key={race.id}
          position={[position.x, position.y, position.z]}
        >
          <sphereGeometry args={[DOT_RADIUS, 10, 10]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
