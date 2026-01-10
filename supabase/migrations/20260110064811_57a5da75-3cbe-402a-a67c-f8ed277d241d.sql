-- Create email_subscribers table for lead capture
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'unknown',
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for public signup forms)
CREATE POLICY "Anyone can subscribe"
ON public.email_subscribers
FOR INSERT
WITH CHECK (true);

-- Only service role can read/update/delete (admin only)
CREATE POLICY "Service role can manage subscribers"
ON public.email_subscribers
FOR ALL
USING (auth.role() = 'service_role');

-- Add index for email lookups
CREATE INDEX idx_email_subscribers_email ON public.email_subscribers(email);

-- Add index for source analytics
CREATE INDEX idx_email_subscribers_source ON public.email_subscribers(source);