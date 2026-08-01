import React, { useEffect, useState } from 'react';

export const ParallaxBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Neumorphic Floating Sphere 1 - Top Right */}
      <div
        className="absolute top-20 -right-16 w-72 h-72 rounded-full neu-flat opacity-60 animate-float-slow"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`
        }}
      />

      {/* Neumorphic Floating Sphere 2 - Mid Left */}
      <div
        className="absolute top-[35%] -left-20 w-80 h-80 rounded-full neu-flat opacity-50 animate-float-reverse"
        style={{
          transform: `translateY(${scrollY * -0.1}px)`
        }}
      />

      {/* Neumorphic Floating Disk - Bottom Right */}
      <div
        className="absolute top-[65%] right-10 w-60 h-60 rounded-full neu-pressed opacity-40 animate-float-slow"
        style={{
          transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.05}deg)`
        }}
      />

      {/* Soft Gradient Mesh Blurs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#386652]/15 rounded-full filter blur-3xl" />
      <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[#d4af37]/15 rounded-full filter blur-3xl" />
    </div>
  );
};
