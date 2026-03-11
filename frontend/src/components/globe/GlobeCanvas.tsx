import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Earth } from './Earth';
import { CityMarkers } from './CityMarkers';
import { Atmosphere } from './Atmosphere';
import { useTheme } from '../../context/ThemeContext';

export function GlobeCanvas() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#07070f' : '#d8e4f0';

  return (
    <div className="globe-container">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: bgColor }}
      >
        <ambientLight intensity={0.4} color="#111122" />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Earth />
          <CityMarkers />
          <Atmosphere />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={5}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
