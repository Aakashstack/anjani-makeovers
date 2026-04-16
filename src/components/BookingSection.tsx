import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Calendar, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const serviceOptions = ["Bridal Makeup", "Party Makeup", "Engagement Makeup", "Photoshoot Makeup", "Other"];

export default function BookingSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", service: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("bookings").insert({
      name: form.name, phone: form.phone, email: form.email || null,
      date: form.date || null, service: form.service, message: form.message || null,
    });
    toast({
      title: "Booking Request Sent! ✨",
      description: "Thank you! We'll get back to you within 24 hours to confirm your appointment.",
    });
    setForm({ name: "", phone: "", email: "", date: "", service: "", message: "" });
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <section id="booking" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Book Now</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Schedule Your <span className="text-primary italic">Session</span>
          </h2>
        </div>

        <div
          className={`max-w-2xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-lg space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input
                  required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input
                  required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> Event Date
                </label>
                <input
                  required type="date" value={form.date} onChange={(e) => update("date", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Type</label>
              <select
                required value={form.service} onChange={(e) => update("service", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message (Optional)</label>
              <textarea
                rows={4} value={form.message} onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                placeholder="Tell us about your event..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="flex-1 shimmer-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-semibold text-sm uppercase tracking-widest transition-transform hover:scale-105"
              >
                <Send size={16} /> Send Booking Request
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi%20Anjani!%20I'd%20like%20to%20book%20a%20makeup%20session."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-green-500 text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
