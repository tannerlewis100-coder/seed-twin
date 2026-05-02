CREATE TABLE public.promo_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'popup',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX promo_signups_email_unique ON public.promo_signups (lower(email));

ALTER TABLE public.promo_signups ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) may submit their email
CREATE POLICY "Anyone can submit a signup"
ON public.promo_signups
FOR INSERT
WITH CHECK (true);

-- No public read/update/delete; admin can use service role
