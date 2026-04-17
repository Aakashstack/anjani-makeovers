
-- 1. Site content (key/value JSON for editable homepage sections)
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site_content" ON public.site_content
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert site_content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update site_content" ON public.site_content
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete site_content" ON public.site_content
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default site content
INSERT INTO public.site_content (key, value) VALUES
  ('hero', '{"title":"Bridal Glow & Beyond","subtitle":"Professional makeup artistry that brings out your natural beauty","cta":"Book Your Look"}'::jsonb),
  ('about', '{"name":"Anjani","photo_url":"","bio1":"With over 5 years of professional experience, I specialize in creating flawless, stunning looks that enhance your natural beauty. From dreamy bridal looks to glamorous party makeovers, every brushstroke is crafted with passion and precision.","bio2":"Trained in HD, airbrush, and traditional techniques, I stay updated with the latest trends to offer you the most sophisticated and personalized makeup experience."}'::jsonb),
  ('stats', '{"clients":"500+","experience":"5+","weddings":"200+","rating":"5.0"}'::jsonb),
  ('services_intro', '{"title":"Our Services","subtitle":"Crafted experiences for every occasion"}'::jsonb);

-- 2. About highlights (the 4 badges)
CREATE TABLE public.about_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Star',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.about_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view about_highlights" ON public.about_highlights
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert about_highlights" ON public.about_highlights
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update about_highlights" ON public.about_highlights
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete about_highlights" ON public.about_highlights
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.about_highlights (label, icon, display_order) VALUES
  ('Certified Artist', 'Award', 0),
  ('5+ Years Experience', 'Star', 1),
  ('500+ Happy Clients', 'Users', 2),
  ('Passion for Beauty', 'Heart', 3);

-- 3. Instagram: add embed_url for real IG post/reel embeds
ALTER TABLE public.instagram_posts
  ADD COLUMN embed_url text;

-- Make image_url nullable (URL embeds don't need an uploaded image)
ALTER TABLE public.instagram_posts
  ALTER COLUMN image_url DROP NOT NULL;

-- 4. Bookings: alternative slots + admin notes + customer email tracking
ALTER TABLE public.bookings
  ADD COLUMN alternative_slots text[],
  ADD COLUMN admin_notes text,
  ADD COLUMN pending_email_sent_at timestamptz,
  ADD COLUMN status_email_sent_at timestamptz;

-- 5. Storage bucket for about photo
INSERT INTO storage.buckets (id, name, public)
VALUES ('about-images', 'about-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view about images" ON storage.objects
  FOR SELECT USING (bucket_id = 'about-images');
CREATE POLICY "Admins can upload about images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'about-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update about images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'about-images' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete about images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'about-images' AND has_role(auth.uid(), 'admin'::app_role));
