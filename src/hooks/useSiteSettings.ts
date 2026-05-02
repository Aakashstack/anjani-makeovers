import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  whatsapp_number: string;
  whatsapp_message: string;
  footer_tagline: string;
  instagram_url: string;
  brand_name: string;
};

const defaults: SiteSettings = {
  whatsapp_number: "919876543210",
  whatsapp_message: "Hi Anjani! I'd like to inquire about your makeup services.",
  footer_tagline: "Enhancing your natural beauty with professional makeup artistry. Every face tells a beautiful story.",
  instagram_url: "https://instagram.com/anjanimakeovers",
  brand_name: "Anjani Makeovers",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", "site_settings")
        .maybeSingle();
      if (data?.value) setSettings({ ...defaults, ...(data.value as any) });
    })();
  }, []);

  const waLink = `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  return { settings, waLink };
}
