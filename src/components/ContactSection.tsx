import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Phone, Mail, Instagram, MapPin } from "lucide-react";

const contactItems = [
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: Mail, label: "Email", value: "hello@anjanimakeovers.com", href: "mailto:hello@anjanimakeovers.com" },
  { icon: Instagram, label: "Instagram", value: "@anjanimakeovers", href: "https://instagram.com/anjanimakeovers" },
  { icon: MapPin, label: "Location", value: "Mumbai, Maharashtra, India", href: "#" },
];

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="contact" className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Get In Touch</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Contact <span className="text-primary italic">Me</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group p-6 rounded-2xl bg-card border border-border/50 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon size={24} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-medium text-foreground text-sm">{item.value}</p>
            </a>
          ))}
        </div>

        {/* Map placeholder */}
        <div
          className={`mt-16 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-lg transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="aspect-[16/6] bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <div className="text-center">
              <MapPin size={36} className="text-primary/30 mx-auto mb-2" />
              <p className="font-serif text-lg text-muted-foreground italic">Google Maps Embed</p>
              <p className="text-sm text-muted-foreground/60">Replace with your location</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
