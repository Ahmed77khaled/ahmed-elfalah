import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacityDir: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        opacityDir: (Math.random() > 0.5 ? 1 : -1) * 0.005,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw dot grid
      ctx.fillStyle = "rgba(0, 212, 255, 0.06)";
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacityDir;
        if (p.opacity > 0.6 || p.opacity < 0.05) p.opacityDir *= -1;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blobs */}
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, hsl(190 100% 50% / 0.4) 0%, transparent 70%)",
          top: "-100px",
          left: "-100px",
          filter: "blur(80px)",
          animation: "blob-drift 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-15"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, hsl(262 83% 57% / 0.35) 0%, transparent 70%)",
          bottom: "10%",
          right: "-150px",
          filter: "blur(100px)",
          animation: "blob-drift-2 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full opacity-10"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, hsl(190 100% 50% / 0.3) 0%, transparent 70%)",
          top: "50%",
          left: "30%",
          filter: "blur(90px)",
          animation: "blob-drift-3 20s ease-in-out infinite",
        }}
      />
      {/* Canvas for particles + grid */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />
    </div>
  );
}
