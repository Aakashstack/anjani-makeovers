
-- Create role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles: only admins can read
CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date TEXT,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Portfolio items
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Bridal',
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio" ON public.portfolio_items
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert portfolio" ON public.portfolio_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update portfolio" ON public.portfolio_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio" ON public.portfolio_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Before/After items
CREATE TABLE public.before_after_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.before_after_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view before_after" ON public.before_after_items
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert before_after" ON public.before_after_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update before_after" ON public.before_after_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete before_after" ON public.before_after_items
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Instagram posts
CREATE TABLE public.instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  likes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  link TEXT NOT NULL DEFAULT 'https://instagram.com/anjanimakeovers',
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view instagram" ON public.instagram_posts
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert instagram" ON public.instagram_posts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update instagram" ON public.instagram_posts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete instagram" ON public.instagram_posts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Contact info
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'phone',
  link TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contact" ON public.contact_info
  FOR SELECT USING (true);
CREATE POLICY "Admins can update contact" ON public.contact_info
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert contact" ON public.contact_info
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_updated_at BEFORE UPDATE ON public.contact_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('before-after-images', 'before-after-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('instagram-images', 'instagram-images', true);

-- Storage policies: public read
CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public read before-after" ON storage.objects FOR SELECT USING (bucket_id = 'before-after-images');
CREATE POLICY "Public read instagram" ON storage.objects FOR SELECT USING (bucket_id = 'instagram-images');

-- Storage policies: admin upload/delete
CREATE POLICY "Admin upload portfolio" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete portfolio" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update portfolio" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload before-after" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'before-after-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete before-after" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'before-after-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update before-after" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'before-after-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin upload instagram" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'instagram-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete instagram" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'instagram-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update instagram" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'instagram-images' AND public.has_role(auth.uid(), 'admin'));
