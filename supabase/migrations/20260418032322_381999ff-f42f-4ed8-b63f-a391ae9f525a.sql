-- 1. Add tracking + whatsapp scaffolding to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS tracking_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  ADD COLUMN IF NOT EXISTS whatsapp_pending_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS whatsapp_status_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS feedback_requested_at TIMESTAMPTZ;

-- Backfill any existing rows missing a token
UPDATE public.bookings SET tracking_token = encode(gen_random_bytes(16), 'hex') WHERE tracking_token IS NULL;

ALTER TABLE public.bookings ALTER COLUMN tracking_token SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_tracking_token ON public.bookings(tracking_token);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);

-- 2. Public RPC to fetch a booking by tracking token (avoids exposing full table)
CREATE OR REPLACE FUNCTION public.get_booking_by_token(_token TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  service TEXT,
  date TEXT,
  status TEXT,
  admin_notes TEXT,
  alternative_slots TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, service, date, status, admin_notes, alternative_slots, created_at, updated_at
  FROM public.bookings
  WHERE tracking_token = _token
  LIMIT 1;
$$;

-- 3. Public lookup by phone + last 6 of token (booking code)
CREATE OR REPLACE FUNCTION public.lookup_booking(_phone TEXT, _code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  service TEXT,
  date TEXT,
  status TEXT,
  admin_notes TEXT,
  alternative_slots TEXT[],
  tracking_token TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, service, date, status, admin_notes, alternative_slots, tracking_token, created_at
  FROM public.bookings
  WHERE phone = _phone AND right(tracking_token, 6) = lower(_code)
  LIMIT 1;
$$;

-- 4. Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  service TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (approved = true);

CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Public RPC to submit feedback via tracking token (no auth required)
CREATE OR REPLACE FUNCTION public.submit_feedback(
  _token TEXT,
  _rating INT,
  _comment TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _booking RECORD;
  _new_id UUID;
BEGIN
  IF _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'Rating must be between 1 and 5';
  END IF;

  SELECT id, name, service INTO _booking
  FROM public.bookings
  WHERE tracking_token = _token
  LIMIT 1;

  IF _booking IS NULL THEN
    RAISE EXCEPTION 'Invalid tracking token';
  END IF;

  INSERT INTO public.testimonials (booking_id, customer_name, rating, comment, service, approved)
  VALUES (_booking.id, _booking.name, _rating, COALESCE(_comment, ''), _booking.service, false)
  RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;

-- 6. Storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read testimonial images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonial-images');

CREATE POLICY "Admins upload testimonial images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete testimonial images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonial-images' AND has_role(auth.uid(), 'admin'));