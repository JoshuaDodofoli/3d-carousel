'use client';

import { Canvas } from '@react-three/fiber';
import CylinderCarousel from './components/CylinderCarousel';

const sampleImages = [
  '/img1.jpg',
  '/img2.jpg',
  '/img3.png',
  '/img4.jpg',
  '/img5.jpg',
  '/img6.png',
  '/img7.jpg',
  '/img8.jpg',
];

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Absolute overlay elements like headers or branding go here */}
      <div className="absolute top-8 left-8 z-10 text-white pointer-events-none">
        <h1 className="text-xl font-mono tracking-widest uppercase">Archival / Work</h1>
      </div>

      <Canvas
        camera={{ position: [0, 0, 7.1], fov: 50 }}
        gl={{ antialias: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} />
        
        <CylinderCarousel 
          images={sampleImages} 
          radius={3.0} 
          planeWidth={1.0} 
          planeHeight={1} 
        />
      </Canvas>
    </main>
  );
}