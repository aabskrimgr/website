import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export default function ParticleField() {
  const starsRef = useRef<any>(null);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      starsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={15}
      depth={50}
      count={2000}
      factor={4}
      saturation={0}
      fade
      speed={1}
    />
  );
}
