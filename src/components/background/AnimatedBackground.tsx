import { useEffect, useRef, memo } from 'react';

function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07] blur-[160px] animate-orb1"
        style={{ background: 'radial-gradient(circle, hsl(345 82% 55%), transparent 70%)', top: '-10%', left: '-10%' }} />
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[140px] animate-orb2"
        style={{ background: 'radial-gradient(circle, hsl(330 70% 50%), transparent 70%)', bottom: '-5%', right: '-5%' }} />
      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[150px] animate-orb3"
        style={{ background: 'radial-gradient(circle, hsl(280 60% 50%), transparent 70%)', top: '30%', left: '40%' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[130px] animate-orb4"
        style={{ background: 'radial-gradient(circle, hsl(15 80% 50%), transparent 70%)', top: '60%', left: '10%' }} />
    </div>
  );
}

function PointerLight() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };

    let raf: number;
    const animate = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.08;
      p.y += (p.ty - p.y) * 0.08;
      if (el) {
        el.style.transform = `translate(${p.x - 300}px, ${p.y - 300}px)`;
        el.style.opacity = '1';
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="fixed w-[600px] h-[600px] rounded-full pointer-events-none opacity-0 transition-opacity duration-1000"
      style={{ background: 'radial-gradient(circle, hsl(345 82% 60% / 0.04), transparent 70%)', zIndex: 0 }} />
  );
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const isMobile = w < 768;
    const count = isMobile ? 20 : 40;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1 - 0.05,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    }));

    let raf: number;
    let hidden = false;

    const draw = () => {
      if (hidden) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    const onVisibility = () => { hidden = document.hidden; };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

export const AnimatedBackground = memo(function AnimatedBackground() {
  return (
    <>
      <GradientOrbs />
      <ParticleCanvas />
      <PointerLight />
      <div className="noise-overlay" />
    </>
  );
});
