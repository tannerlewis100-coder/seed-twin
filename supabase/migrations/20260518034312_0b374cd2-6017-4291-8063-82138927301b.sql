-- Make email nullable since users can sign up with either email or phone
ALTER TABLE public.promo_signups ALTER COLUMN email DROP NOT NULL;