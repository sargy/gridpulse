import { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use publicly available earth textures
  const [dayMap, nightMap, bumpMap, specMap] = useTexture([
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png',
  ]);

  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    if (shaderRef.current) {
      // Update sun direction based on time
      const now = new Date();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
      const hourAngle = ((now.getUTCHours() + now.getUTCMinutes() / 60) / 24) * Math.PI * 2 - Math.PI;
      const declination = 23.44 * Math.sin(((dayOfYear - 81) / 365) * Math.PI * 2) * (Math.PI / 180);

      shaderRef.current.uniforms.sunDir.value.set(
        Math.cos(declination) * Math.cos(hourAngle),
        Math.sin(declination),
        Math.cos(declination) * Math.sin(hourAngle)
      ).normalize();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={shaderRef}
        uniforms={{
          dayTexture: { value: dayMap },
          nightTexture: { value: nightMap },
          bumpTexture: { value: bumpMap },
          specTexture: { value: specMap },
          sunDir: { value: new THREE.Vector3(1, 0, 0) },
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D dayTexture;
          uniform sampler2D nightTexture;
          uniform vec3 sunDir;
          varying vec2 vUv;
          varying vec3 vNormal;

          void main() {
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;

            float cosAngle = dot(vNormal, sunDir);
            float blend = smoothstep(-0.15, 0.15, cosAngle);

            vec3 color = mix(nightColor, dayColor, blend);

            // Limb darkening
            float limb = 1.0 - pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 0.8);
            color *= 0.4 + 0.6 * limb;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}
