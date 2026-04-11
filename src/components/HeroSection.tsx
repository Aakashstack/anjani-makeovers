import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const words = ["Enhancing", "Your", "Natural", "Beauty"];

export default function HeroSection() {
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleWords((p) => {
        if (p >= words.length) { clearInterval(interval); return p; }
        return p + 1;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink via-accent to-nude" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

      {/* Decorative floating elements */}
      <div className="absolute top-20 right-10 w-32 h-32 rounded-full bg-primary/10 animate-float" />
      <div className="absolute bottom-32 left-10 w-20 h-20 rounded-full bg-gold-light/20 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-primary/5 animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-up">
          <Sparkles size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary tracking-wide">Professional Makeup Artist</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          {words.map((word, i) => (
            <span
              key={i}
              className={`inline-block mr-3 md:mr-5 transition-all duration-700 ${
                i < visibleWords
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } ${word === "Beauty" ? "text-primary italic" : "text-foreground"}`}
            >
              {word}
            </span>
          ))}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "1.5s" }}>
          Transform your look with expert makeup artistry. From bridal glam to editorial perfection,
          every face tells a beautiful story.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "2s" }}>
          <Link
            to="/portfolio"
            className="shimmer-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-semibold text-sm uppercase tracking-widest transition-transform hover:scale-105"
          >
            View Portfolio <ArrowRight size={18} />
          </Link>
          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary font-semibold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-primary/60 animate-fade-in-up" />
        </div>
      </div>
    </section>
  );
}
