import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompetitorAutoFillResult {
  targetKeyword: string;
  productName: string;
  suggestedKeywords: string[];
}

interface UseCompetitorAutoFillReturn {
  isLoading: boolean;
  error: string | null;
  autoFillCompetitorFields: (
    productName: string,
    niche: string,
    articleType: string
  ) => Promise<CompetitorAutoFillResult | null>;
}

export function useCompetitorAutoFill(): UseCompetitorAutoFillReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoFillCompetitorFields = async (
    productName: string,
    niche: string,
    articleType: string
  ): Promise<CompetitorAutoFillResult | null> => {
    if (!productName && !niche) {
      toast.error("Please enter a product name or select a niche first");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-seo-metadata",
        {
          body: {
            topic: productName || niche,
            articleType,
            productName,
            generateKeywordSuggestions: true,
          },
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Generate target keyword from the data
      const targetKeyword = data.primaryKeyword || 
        (productName ? `best ${productName}` : `best ${niche.toLowerCase()} products`);
      
      // Generate product name suggestion if not provided
      const suggestedProductName = productName || 
        (data.titles?.[0]?.text?.match(/best (.+?)(?:\s+\d{4}|\s+review|\s+guide|$)/i)?.[1] || '');

      const result: CompetitorAutoFillResult = {
        targetKeyword,
        productName: suggestedProductName || productName,
        suggestedKeywords: data.secondaryKeywords || [],
      };

      toast.success("Fields auto-filled successfully!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to auto-fill fields";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    autoFillCompetitorFields,
  };
}
