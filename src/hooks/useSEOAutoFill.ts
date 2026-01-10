import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SEOTitle {
  type: "keyword-focused" | "benefit-driven" | "question";
  text: string;
  charCount: number;
}

interface SEOMetadata {
  titles: SEOTitle[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  metaDescription: string;
  characterCounts: {
    metaDescription: number;
    selectedTitle?: number;
  };
}

interface UseSEOAutoFillReturn {
  isLoading: boolean;
  error: string | null;
  seoData: SEOMetadata | null;
  generateSEO: (topic: string, articleType: string, productName?: string) => Promise<SEOMetadata | null>;
}

export function useSEOAutoFill(): UseSEOAutoFillReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);

  const generateSEO = async (
    topic: string,
    articleType: string,
    productName?: string
  ): Promise<SEOMetadata | null> => {
    if (!topic) {
      toast.error("Please provide a topic or keyword");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-seo-metadata",
        {
          body: {
            topic,
            articleType,
            productName,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setSeoData(data);
      toast.success("SEO metadata generated successfully!");
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate SEO metadata";
      setError(message);
      
      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please try again in a few moments.");
      } else if (message.includes("Payment required")) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error(message);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    seoData,
    generateSEO,
  };
}
