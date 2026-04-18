import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Calendar, Send, MessageCircle, CheckCircle2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const serviceOptions = ["Bridal Makeup", "Party Makeup", "Engagement Makeup", "Photoshoot Makeup", "Other"];

export default function BookingSection() {
  const { ref, isVisible } = useScrollAnimation();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState<{ token: string; code: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.from("bookings").insert({
      name: form.name, phone: form.phone, email: form.email || null,
      date: form.date || null, service: form.service, message: form.message || null,
    }).select("tracking_token").single();
    setSubmitting(false);
    if (error || !data) {
      toast({ title: "Something went wrong", description: error?.message, variant: "destructive" });
      return;
    }
    const token = data.tracking_token as string;
    setSubmitted({ token, code: token.slice(-6).toUpperCase() });
    setForm({ name: "", phone: "", email: "", date: "", service: "", message: "" });
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  if (submitted) {
    const trackingUrl = `${window.location.origin}/track/${submitted.token}`;
    return (
      <section id="booking" className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-lg text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground">Request Sent! ✨</h2>
            <p className="text-muted-foreground">We'll confirm your slot within 24 hours. Save your booking code to track your status anytime.</p>

            <div className="rounded-xl bg-secondary/70 border border-border p-5 text-left space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Your booking code</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-bold tracking-widest text-primary">{submitted.code}</code>
                  <button onClick={() => { navigator.clipboard.writeText(submitted.code); toast({ title: "Code copied!" }); }} className="p-1.5 rounded hover:bg-muted">
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tracking link</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(trackingUrl); toast({ title: "Link copied!" }); }}
                  className="text-sm text-primary hover:underline break-all text-left"
                >
                  {trackingUrl}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                to={`/track/${submitted.token}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
              >
                Track my booking →
              </Link>
              <button
                onClick={() => setSubmitted(null)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-muted"
              >
                Book another
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 md:py-32 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium tracking-widest uppercase text-sm">Book Now</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 text-foreground">
            Schedule Your <span className="text-primary italic">Session</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm">
            Already booked? <Link to="/track" className="text-primary hover:underline">Track your booking →</Link>
          </p>
        </div>

        <div className={`max-w-2xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-lg space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input required value={form.name} onChange={(e) => update("name", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> Event Date
                </label>
                <input required type="date" value={form.date} onChange={(e) => update("date", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Type</label>
              <select required value={form.service} onChange={(e) => update("service", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all">
                <option value="">Select a service</option>
                {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message (Optional)</label>
              <textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all resize-none"
                placeholder="Tell us about your event..." />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={submitting}
                className="flex-1 shimmer-btn inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-semibold text-sm uppercase tracking-widest transition-transform hover:scale-105 disabled:opacity-60">
                <Send size={16} /> {submitting ? "Sending..." : "Send Booking Request"}
              </button>
              <a href="https://wa.me/919876543210?text=Hi%20Anjani!%20I'd%20like%20to%20book%20a%20makeup%20session." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-emerald-500 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 transition-colors">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
