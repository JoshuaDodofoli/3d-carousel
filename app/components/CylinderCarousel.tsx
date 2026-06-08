'use client';

import { useRef, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

interface CarouselProps {
  images: string[];
  radius?: number;
  planeWidth?: number;
  planeHeight?: number;
}

interface BentImageProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number];
  velocityRef: React.MutableRefObject<number>;
}

function BentImage({ url, position, rotation, scale, velocityRef }: BentImageProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);

  useLayoutEffect(() => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry;
      // Clone original vertices once
      (originalPositions.current) as any = geo.attributes.position.array.slice();
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current || !originalPositions.current) return;
    const geo = meshRef.current.geometry;
    const positions = geo.attributes.position.array;
    const orig = originalPositions.current;
    
    // The velocity describes how fast the carousel is spinning.
    const v = velocityRef.current;
    
    // Adjust bend multiplier for dramatic effect
    const bendAmount = v * 2.5; 
    
    let needsUpdate = false;

    // We iterate through the vertices of the PlaneGeometry.
    // Each vertex has an x, y, z component.
    for (let i = 0; i < positions.length; i += 3) {
      const x = orig[i];
      const z = orig[i + 2];
      
      // Calculate a parabolic bend on the Z axis based on X position.
      // This makes the edges of the plane bend backwards/forwards depending on scroll direction.
      const newZ = z + (x * x) * bendAmount;
      
      if (Math.abs(positions[i + 2] - newZ) > 0.0001) {
        positions[i + 2] = newZ;
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Image
      ref={meshRef}
      url={url}
      position={position}
      rotation={rotation}
      scale={scale}
      segments={16} // Higher segments allow the plane to curve smoothly
      transparent
      side={THREE.DoubleSide}
    />
  );
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
  const velocityRef = useRef(0);
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

    // Update current rotation towards target
    scrollRotation.current += (targetRotation.current - scrollRotation.current) * easing;
    groupRef.current.rotation.y = scrollRotation.current;

    // Calculate how far we still need to go - this is our "velocity"
    velocityRef.current = targetRotation.current - scrollRotation.current;
  });

  return (
    <group ref={groupRef}>
      {images.map((url, i) => {
        const angle = (i / count) * Math.PI * 2;

        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <BentImage
            key={i}
            url={url}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
            scale={[planeWidth, planeHeight]}
            velocityRef={velocityRef}
          />
        );
      })}
    </group>
  );
}