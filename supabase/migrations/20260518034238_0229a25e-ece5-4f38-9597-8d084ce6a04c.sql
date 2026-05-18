-- Add phone column to promo_signups table
ALTER TABLE public.promo_signups ADD COLUMN phone TEXT;

-- Update unique constraint if needed (optional - allow duplicate phone or email if one is null)
-- Note: 23505 duplicate handling in code already covers this