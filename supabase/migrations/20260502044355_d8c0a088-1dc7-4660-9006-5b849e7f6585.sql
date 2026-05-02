
-- SERVICES
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

INSERT INTO public.services (icon, title, description, price, duration, display_order) VALUES
('Crown','Bridal Makeup','Your dream bridal look, crafted to perfection. HD & airbrush techniques for a flawless finish that lasts all day.','₹15,000 – ₹35,000','3–4 hours',0),
('PartyPopper','Party Makeup','Glamorous looks for every occasion. From cocktail evenings to festive celebrations, shine like a star.','₹3,000 – ₹8,000','1–2 hours',1),
('Heart','Engagement Makeup','Subtle elegance meets modern glam. A perfectly balanced look for your special engagement ceremony.','₹8,000 – ₹18,000','2–3 hours',2),
('Camera','Photoshoot Makeup','Camera-ready makeup for portfolios, editorials, and pre-wedding shoots. Designed to photograph beautifully.','₹5,000 – ₹12,000','1.5–2 hours',3);

-- BRANDS
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

INSERT INTO public.brands (name, display_order) VALUES
('MAC',0),('Lakmé',1),('Bobbi Brown',2),('Charlotte Tilbury',3),('Huda Beauty',4),
('NARS',5),('Urban Decay',6),('Estée Lauder',7),('Maybelline',8),('L''Oréal',9),
('Kryolan',10),('M·A·C Pro',11),('Fenty Beauty',12),('Too Faced',13);

-- SITE SETTINGS (whatsapp, footer)
INSERT INTO public.site_content (key, value) VALUES
('site_settings', '{
  "whatsapp_number": "919876543210",
  "whatsapp_message": "Hi Anjani! I''d like to inquire about your makeup services.",
  "footer_tagline": "Enhancing your natural beauty with professional makeup artistry. Every face tells a beautiful story.",
  "instagram_url": "https://instagram.com/anjanimakeovers",
  "brand_name": "Anjani Makeovers"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;
