import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Gift, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExitIntentConfig {
  enabled: boolean;
  title: string;
  description: string;
  cta_text: string;
  lead_magnet: string;
  trigger_delay: number;
  display_once: boolean;
}

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ExitIntentConfig | null>(null);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const shownThisSession = sessionStorage.getItem('exit-intent-shown');
    if (shownThisSession) {
      setHasShown(true);
      return;
    }

    // Load config (in a real app, fetch from popup_config table)
    const mockConfig: ExitIntentConfig = {
      enabled: true,
      title: "Wait! Get Your Free SEO Template Pack",
      description: "Download our proven SEO content templates used by top affiliate marketers. Includes article outlines, keyword research sheets, and optimization checklists.",
      cta_text: "Send Me The Templates",
      lead_magnet: "SEO Content Template Pack",
      trigger_delay: 500,
      display_once: true,
    };
    setConfig(mockConfig);

    if (!mockConfig.enabled) return;

    let timeoutId: NodeJS.Timeout;
    let isTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top
      if (e.clientY < 10 && !isTriggered && !hasShown) {
        isTriggered = true;
        timeoutId = setTimeout(() => {
          setIsOpen(true);
          if (mockConfig.display_once) {
            sessionStorage.setItem('exit-intent-shown', 'true');
            setHasShown(true);
          }
        }, mockConfig.trigger_delay);
      }
    };

    // Mobile: detect fast scroll up
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollY - currentScrollY;
      
      // Fast scroll up detected (at least 50px in one frame)
      if (scrollDiff > 50 && !isTriggered && !hasShown) {
        isTriggered = true;
        timeoutId = setTimeout(() => {
          setIsOpen(true);
          if (mockConfig.display_once) {
            sessionStorage.setItem('exit-intent-shown', 'true');
            setHasShown(true);
          }
        }, mockConfig.trigger_delay);
      }
      
      lastScrollY = currentScrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert email into email_subscribers table
      const { error } = await supabase
        .from('email_subscribers')
        .insert({
          email: email.toLowerCase().trim(),
          source: 'exit_intent',
          metadata: {
            lead_magnet: config?.lead_magnet || 'SEO Template Pack',
            page: window.location.pathname,
          },
        });

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') {
          toast.info("You're already subscribed! Check your email for the download.");
          setIsSubmitted(true);
        } else {
          console.error('Email subscription error:', error);
          toast.error('Something went wrong. Please try again.');
        }
      } else {
        setIsSubmitted(true);
        toast.success('Check your email for the download link!');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config || !config.enabled) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {!isSubmitted ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-2xl">{config.title}</DialogTitle>
              <DialogDescription className="text-base pt-2">
                {config.description}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center"
                required
              />
              <Button 
                type="submit"
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  config.cta_text
                )}
              </Button>
              <Button 
                type="button"
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                No thanks, I don't want free templates
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Check Your Email!</h3>
            <p className="text-muted-foreground mb-4">
              We've sent the {config.lead_magnet} to {email}
            </p>
            <Button onClick={() => setIsOpen(false)}>
              Continue Browsing
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
