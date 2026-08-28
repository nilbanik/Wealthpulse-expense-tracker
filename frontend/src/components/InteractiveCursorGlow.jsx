import React, { useEffect } from 'react';

export const InteractiveCursorGlow = () => {
  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      // Direct update to CSS custom properties on document root for high-performance 120fps hardware acceleration
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 
        1. Full-Screen Atmospheric Aurora Wave (No Circles, Pure Organic Ambient Horizontal Wash)
      */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 120% 60% at 50% -10%, rgba(16, 185, 129, 0.12), transparent 70%),
            radial-gradient(ellipse 80% 50% at 90% 60%, rgba(234, 179, 8, 0.05), transparent 70%),
            radial-gradient(ellipse 90% 70% at 10% 80%, rgba(5, 150, 105, 0.08), transparent 75%)
          `,
        }}
      />

      {/* 
        2. Dynamic Global Cursor Spotlight (Soft Full-Screen Specular Beam with Noise Dithering to eliminate color banding)
      */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(
              700px circle at var(--mouse-x, -2000px) var(--mouse-y, -2000px),
              rgba(16, 185, 129, 0.07) 0%,
              rgba(234, 179, 8, 0.03) 40%,
              transparent 70%
            )
          `,
        }}
      />

      {/* 
        3. Subtle Micro-Texture SVG Noise to kill any 8-bit monitor banding
      */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};
