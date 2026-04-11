import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Award, Heart, Star, Users } from "lucide-react";

const highlights = [
  { icon: Award, label: "Certified Artist" },
  { icon: Star, label: "5+ Years Experience" },
  { icon: Users, label: "500+ Happy Clients" },
  { icon: Heart, label: "Passion for Beauty" },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-pink via-accent to-nude overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-primary/30">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Heart size={48} className="text-primary/40" />
                    </div>
                    <p className="font-serif text-lg italic text-muted-foreground">Artist Photo</p>
                  </div>
                </div>
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-primary/30 rounded-2xl -z-10" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm">About Me</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-foreground">
              Meet <span className="text-primary italic">Anjani</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              With over 5 years of professional experience, I specialize in creating flawless, stunning looks
              that enhance your natural beauty. From dreamy bridal looks to glamorous party makeovers,
              every brushstroke is crafted with passion and precision.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Trained in HD, airbrush, and traditional techniques, I stay updated with the latest trends
              to offer you the most sophisticated and personalized makeup experience.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border/50 transition-all duration-500 hover:shadow-md hover:-translate-y-1 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${0.5 + i * 0.15}s` }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <h.icon size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
