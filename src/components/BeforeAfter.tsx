import { useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref, isVisible } = useScrollAnimation();

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <section className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Transformations</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Before & <span className="text-primary italic">After</span>
          </h2>
        </div>

        <div
          className={`max-w-2xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div
            ref={containerRef}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize shadow-2xl select-none"
            onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          >
            {/* Before */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-secondary">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-2xl text-muted-foreground/50 italic">Before</span>
              </div>
            </div>

            {/* After */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-pink via-accent to-gold-light/30"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-2xl text-primary/60 italic">After</span>
              </div>
            </div>

            {/* Slider line */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-lg" style={{ left: `${position}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary-foreground shadow-lg flex items-center justify-center">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-4 bg-primary/60 rounded-full" />
                  <div className="w-0.5 h-4 bg-primary/60 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
