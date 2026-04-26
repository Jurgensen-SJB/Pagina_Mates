'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;        // depth (parallax)
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

const STAR_COUNT = 260;
const SPEED = 0.018;          // drift speed
const PARALLAX_FACTOR = 0.4;  // deeper stars move slower

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef  = useRef<Star[]>([]);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef<number>(0);

  /* ── Init stars ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    starsRef.current = Array.from({ length: STAR_COUNT }, () => {
      const z = Math.random();           // 0 = far, 1 = near
      return {
        x:            Math.random() * W,
        y:            Math.random() * H,
        z,
        size:         0.4 + z * 1.8,    // near stars are larger
        opacity:      0.2 + z * 0.75,
        twinkleSpeed: 0.6 + Math.random() * 1.4,
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    });

    /* Handle resize */
    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Animate ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (timestamp: number) => {
      const dt = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const W = canvas.width;
      const H = canvas.height;

      /* Clear with the Grok warm-dark background */
      ctx.fillStyle = '#0f0d0c';
      ctx.fillRect(0, 0, W, H);

      /* Very subtle orange nebula glow at top */
      const nebulaGrad = ctx.createRadialGradient(W / 2, -H * 0.1, 0, W / 2, -H * 0.1, W * 0.7);
      nebulaGrad.addColorStop(0, 'rgba(249,115,22,0.045)');
      nebulaGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, W, H);

      /* Draw & drift stars */
      starsRef.current.forEach(star => {
        /* Slow upward drift, parallax by depth */
        star.y -= SPEED * dt * (0.1 + star.z * PARALLAX_FACTOR);
        if (star.y < -2) star.y = H + 2;

        /* Twinkle */
        const twinkle = Math.sin(timestamp * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const alpha   = Math.max(0.05, star.opacity + twinkle * 0.18);

        /* Draw star */
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        /* Near stars get a warm orange tint, far ones stay white/cool */
        const warmth = Math.round(star.z * 20);
        ctx.fillStyle = `rgba(${235 + warmth}, ${225 + warmth * 0.3}, ${215}, ${alpha})`;
        ctx.fill();

        /* Soft glow for the larger (near) stars */
        if (star.size > 1.4) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2.5);
          glow.addColorStop(0, `rgba(255,200,150,${alpha * 0.25})`);
          glow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
