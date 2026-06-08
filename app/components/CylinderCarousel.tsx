'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

interface CarouselProps {
  images: string[];
  radius?: number;
  planeWidth?: number;
  planeHeight?: number;
}

export default function CylinderCarousel({
  images,
  radius = 3.5,
  planeWidth = 1.8,
  planeHeight = 2.5,
}: CarouselProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const scrollRotation = useRef(0);
  const targetRotation = useRef(0);
  const easing = 0.05; 

  const count = images.length;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      targetRotation.current += e.deltaY * 0.0015;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    scrollRotation.current += (targetRotation.current - scrollRotation.current) * easing;
    groupRef.current.rotation.y = scrollRotation.current;
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => {
        const angle = (i / count) * Math.PI * 2;

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <Image
            key={i}
            url={url}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            scale={[planeWidth, planeHeight]}
            transparent
            side={THREE.DoubleSide}
          />
        );
      })}
    </group>
  );
}