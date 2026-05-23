import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number;
    let height: number;
    let frame = 0;

    interface Blob {
      x: number;
      y: number;
      r: number;
      color: string;
      vx: number;
      vy: number;
      phase: number;
    }

    let blobs: Blob[] = [];

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      blobs = [
        {
          x: width * 0.2,
          y: height * 0.2,
          r: width * 0.5,
          color: 'rgba(56, 189, 248, 0.15)', // sky-400
          vx: 0.2,
          vy: 0.1,
          phase: 0
        },
        {
          x: width * 0.8,
          y: height * 0.4,
          r: width * 0.6,
          color: 'rgba(129, 140, 248, 0.12)', // indigo-400
          vx: -0.15,
          vy: 0.2,
          phase: Math.PI / 3
        },
        {
          x: width * 0.5,
          y: height * 0.8,
          r: width * 0.55,
          color: 'rgba(45, 212, 191, 0.1)', // teal-400
          vx: 0.1,
          vy: -0.1,
          phase: Math.PI / 1.5
        },
        {
          x: width * 0.1,
          y: height * 0.7,
          r: width * 0.4,
          color: 'rgba(244, 114, 182, 0.08)', // pink-400
          vx: 0.05,
          vy: 0.05,
          phase: Math.PI
        }
      ];
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Background fill
      ctx.fillStyle = '#FBFCFE'; // Very light grey/blue
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      const time = frame * 0.005;

      // Draw Aurora Blobs
      blobs.forEach((blob, i) => {
        // Move with bounds wrap
        blob.x += blob.vx + (Math.sin(time + blob.phase) * 0.5);
        blob.y += blob.vy + (Math.cos(time + blob.phase) * 0.5);

        // Interaction with mouse
        const dx = blob.x - mouseRef.current.x;
        const dy = blob.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 400) {
          blob.x += dx * 0.001;
          blob.y += dy * 0.001;
        }

        if (blob.x < -blob.r) blob.x = width + blob.r;
        if (blob.x > width + blob.r) blob.x = -blob.r;
        if (blob.y < -blob.r) blob.y = height + blob.r;
        if (blob.y > height + blob.r) blob.y = -blob.r;

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle Crystalline Floating Shapes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time * 0.4 + i) * 0.4 + 0.5) * width;
        const y = (Math.cos(time * 0.3 + i * 2) * 0.4 + 0.5) * height;
        const size = 60 + Math.sin(time + i) * 20;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time * 0.2 + i);
        
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j / 6) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Add a tiny bit of glass fill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fill();
        ctx.restore();
      }

      // Stardust
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.7 + i * 50) * 0.5 + 0.5) * width;
        const y = (Math.cos(time * 0.5 + i * 33) * 0.5 + 0.5) * height;
        const opacity = (Math.sin(time * 2 + i) * 0.5 + 0.5) * 0.4;
        
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX;
      mouseRef.current.ty = e.clientY;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    init();
    const frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-20 opacity-100 pointer-events-none"
    />
  );
}
