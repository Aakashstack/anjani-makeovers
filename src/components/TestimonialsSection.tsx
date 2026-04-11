import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    event: "Bridal Makeup",
    text: "Anjani made me feel like an absolute queen on my wedding day! The makeup was flawless, lasted the entire ceremony, and I received so many compliments. Truly a talented artist!",
    rating: 5,
  },
  {
    name: "Neha Gupta",
    event: "Engagement",
    text: "I was blown away by how perfectly Anjani understood my vision. The subtle yet glamorous look she created was exactly what I wanted. Highly recommended!",
    rating: 5,
  },
  {
    name: "Ritu Agarwal",
    event: "Party Makeup",
    text: "Professional, punctual, and incredibly talented. Anjani has a magic touch that makes you look and feel beautiful. Will definitely book again for my next event!",
    rating: 5,
  },
  {
    name: "Kavita Reddy",
    event: "Photoshoot",
    text: "The makeup looked absolutely stunning in all my photographs. Anjani really knows how to make makeup camera-ready. A true professional in every sense!",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Testimonials</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Client <span className="text-primary italic">Love</span>
          </h2>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-lg">
            <Quote size={48} className="text-primary/10 absolute top-6 left-6" />

            <div className="text-center relative z-10">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>

              <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 font-serif italic">
                "{testimonials[current].text}"
              </p>

              <div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink to-primary/20 mx-auto mb-3 flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-primary">
                    {testimonials[current].name[0]}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{testimonials[current].name}</p>
                <p className="text-sm text-muted-foreground">{testimonials[current].event}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
              >
                <ChevronLeft size={18} className="text-muted-foreground" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === current ? "bg-primary w-6" : "bg-border hover:bg-primary/40"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors"
              >
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
