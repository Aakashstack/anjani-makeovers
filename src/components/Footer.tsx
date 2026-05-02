import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Footer() {
  const { settings } = useSiteSettings();
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("contact_info").select("key,value,link");
      if (data) {
        const p = data.find((d: any) => d.key === "phone");
        const m = data.find((d: any) => d.key === "email");
        if (p) setPhone(p.link || `tel:${p.value}`);
        if (m) setEmail(m.link || `mailto:${m.value}`);
      }
    })();
  }, []);

  const brandParts = settings.brand_name.split(" ");
  const brandHead = brandParts.slice(0, -1).join(" ");
  const brandTail = brandParts[brandParts.length - 1];

  return (
    <footer className="bg-foreground text-background/80 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold text-background mb-4">
              {brandHead && <>{brandHead} </>}<span className="text-primary">{brandTail}</span>
            </h3>
            <p className="text-background/60 text-sm leading-relaxed">{settings.footer_tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 tracking-wide uppercase text-sm">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Portfolio", href: "/portfolio" },
                { label: "Book Appointment", href: "/book" },
                { label: "Track Booking", href: "/track" },
              ].map((l) => (
                <Link key={l.href} to={l.href} className="block text-sm text-background/60 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 tracking-wide uppercase text-sm">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: settings.instagram_url },
                { icon: Phone, href: phone || "#" },
                { icon: Mail, href: email || "#" },
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
            Made with <Heart size={14} className="text-primary fill-primary" /> {settings.brand_name} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
