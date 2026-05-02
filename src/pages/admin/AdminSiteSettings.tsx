import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle } from "lucide-react";

type Settings = {
  whatsapp_number: string;
  whatsapp_message: string;
  footer_tagline: string;
  instagram_url: string;
  brand_name: string;
};

const defaults: Settings = {
  whatsapp_number: "919876543210",
  whatsapp_message: "Hi Anjani! I'd like to inquire about your makeup services.",
  footer_tagline: "Enhancing your natural beauty with professional makeup artistry. Every face tells a beautiful story.",
  instagram_url: "https://instagram.com/anjanimakeovers",
  brand_name: "Anjani Makeovers",
};

export default function AdminSiteSettings() {
  const [s, setS] = useState<Settings>(defaults);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_content").select("value").eq("key", "site_settings").maybeSingle();
      if (data?.value) setS({ ...defaults, ...(data.value as any) });
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const cleanedNumber = s.whatsapp_number.replace(/[^0-9]/g, "");
    const next = { ...s, whatsapp_number: cleanedNumber };
    const { error } = await supabase.from("site_content").upsert({ key: "site_settings", value: next as any }, { onConflict: "key" });
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { setS(next); toast({ title: "Site settings saved!" }); }
  };

  const waPreview = `https://wa.me/${s.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(s.whatsapp_message)}`;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">Site Settings</h2>
          <p className="text-sm text-muted-foreground">WhatsApp, footer, social — applied across the whole site.</p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save All"}</Button>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-serif text-lg font-bold text-foreground">WhatsApp</h3>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">WhatsApp number (with country code, no +)</label>
          <Input value={s.whatsapp_number} onChange={(e) => setS({ ...s, whatsapp_number: e.target.value })} placeholder="919876543210" />
          <p className="text-xs text-muted-foreground mt-1">Example: <code>919876543210</code> for India +91 98765 43210</p>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Default message</label>
          <Textarea value={s.whatsapp_message} onChange={(e) => setS({ ...s, whatsapp_message: e.target.value })} rows={3} />
        </div>
        <a href={waPreview} target="_blank" rel="noopener noreferrer" className="inline-flex text-xs text-primary hover:underline">
          → Test this WhatsApp link
        </a>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold text-foreground">Brand & Footer</h3>
        <div>
          <label className="text-sm font-medium block mb-1">Brand name</label>
          <Input value={s.brand_name} onChange={(e) => setS({ ...s, brand_name: e.target.value })} />
          <p className="text-xs text-muted-foreground mt-1">Used in the navbar and footer. The last word goes gold.</p>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Footer tagline</label>
          <Textarea value={s.footer_tagline} onChange={(e) => setS({ ...s, footer_tagline: e.target.value })} rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Instagram URL</label>
          <Input value={s.instagram_url} onChange={(e) => setS({ ...s, instagram_url: e.target.value })} placeholder="https://instagram.com/yourhandle" />
        </div>
      </section>
    </div>
  );
}
