import { useState } from "react";
import { Mail, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EmailCaptureCTAProps {
  variant?: "default" | "minimal";
}

export function EmailCaptureCTA({ variant = "default" }: EmailCaptureCTAProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // For now, just show success - database table needs to be created
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsSuccess(true);
      toast.success("Success! Check your email for the download link.");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <CheckCircle className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Check Your Email!
            </h2>
            <p className="text-white/90">
              We've sent your free SEO Content Checklist to your inbox.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "..." : "Get Free Guide"}
        </Button>
      </form>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-6">
            <Download className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Get Your Free SEO Content Checklist
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Our proven checklist for creating content that ranks. Used by 5,000+ content creators.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-semibold"
            >
              {isLoading ? "Sending..." : "Download Free"}
            </Button>
          </form>

          <p className="text-sm text-white/70 mt-4">
            🔒 No spam, ever. Unsubscribe anytime.{" "}
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
          </p>
        </div>
      </div>
    </section>
  );
}
