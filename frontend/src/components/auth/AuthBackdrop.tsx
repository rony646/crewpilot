import { useRef, useState } from "react";

export function AuthBackdrop({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMouse({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  const handlePointerLeave = () => {
    setMouse({ x: 0.5, y: 0.5 });
  };

  const offset = (strength: number) => ({
    x: (mouse.x - 0.5) * strength,
    y: (mouse.y - 0.5) * strength,
  });

  const primary = offset(280);
  const accent = offset(-180);
  const cursor = offset(120);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="min-h-[calc(100vh-3.5rem)] bg-background flex items-center justify-center px-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translate(calc(-50% + ${primary.x}px), calc(-50% + ${primary.y}px))`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate(${accent.x}px, ${accent.y}px)` }}
        />
        <div
          className="absolute w-64 h-64 rounded-full blur-3xl transition-transform duration-300 ease-out will-change-transform"
          style={{
            left: `${mouse.x * 100}%`,
            top: `${mouse.y * 100}%`,
            transform: `translate(calc(-50% + ${cursor.x}px), calc(-50% + ${cursor.y}px))`,
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 18%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}
