import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-background mb-4">
              Anjani <span className="text-primary">Makeovers</span>
            </h3>
            <p className="text-background/60 text-sm leading-relaxed">
              Enhancing your natural beauty with professional makeup artistry. Every face tells a beautiful story.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4 tracking-wide uppercase text-sm">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Book Appointment", href: "/book" },
              ].map((l) => (
                <Link key={l.href} to={l.href} className="block text-sm text-background/60 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-background mb-4 tracking-wide uppercase text-sm">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "https://instagram.com/anjanimakeovers" },
                { icon: Phone, href: "tel:+919876543210" },
                { icon: Mail, href: "mailto:hello@anjanimakeovers.com" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center">
          <p className="text-sm text-background/40 flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-primary fill-primary" /> Anjani Makeovers © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
