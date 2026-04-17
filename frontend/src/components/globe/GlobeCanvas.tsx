import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from './Earth';
import { CityMarkers } from './CityMarkers';
import { Atmosphere } from './Atmosphere';
import { AutoTour } from './AutoTour';
import { useTheme } from '../../context/ThemeContext';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface GlobeCanvasProps {
  touring: boolean;
  onTourChange: (touring: boolean) => void;
}

export function GlobeCanvas({ touring, onTourChange }: GlobeCanvasProps) {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#07070f' : '#d8e4f0';
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleStart = useCallback(() => {
    setAutoRotate(false);
    // User interaction cancels the tour and resets idle timer
    if (touring) {
      onTourChange(false);
    }
  }, [touring, onTourChange]);

  return (
    <div className="globe-container">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: bgColor }}
      >
        <ambientLight intensity={0.4} color="#111122" />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        {theme === 'dark' && (
          <Stars radius={80} depth={60} count={3000} factor={4} saturation={0} fade speed={1} />
        )}
        <Suspense fallback={null}>
          <Earth />
          <CityMarkers />
          <Atmosphere />
        </Suspense>
        <AutoTour
          touring={touring}
          onTourChange={onTourChange}
          controlsRef={controlsRef}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate={autoRotate && !touring}
          autoRotateSpeed={0.3}
          onStart={handleStart}
        />
      </Canvas>
    </div>
  );
}
