import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedImage {
  imageUrl: string;
  altText: string;
  seoFilename: string;
  caption: string;
}

interface UseImageGenerationReturn {
  isLoading: boolean;
  error: string | null;
  images: GeneratedImage[];
  generateImages: (params: {
    articleTitle: string;
    productName: string;
    keyword: string;
    imageCount: number;
    imageType: "featured" | "body";
  }) => Promise<GeneratedImage[]>;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const generateImages = async (params: {
    articleTitle: string;
    productName: string;
    keyword: string;
    imageCount: number;
    imageType: "featured" | "body";
  }): Promise<GeneratedImage[]> => {
    if (!params.articleTitle && !params.productName && !params.keyword) {
      toast.error("Please provide article title, product name, or keyword");
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-article-images",
        {
          body: params,
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const generatedImages = data.images || [];
      setImages(generatedImages);
      
      if (generatedImages.length > 0) {
        toast.success(`Generated ${generatedImages.length} image${generatedImages.length > 1 ? "s" : ""} successfully!`);
      } else {
        toast.warning("No images were generated. Please try again.");
      }
      
      return generatedImages;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate images";
      setError(message);
      
      if (message.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please try again in a few moments.");
      } else if (message.includes("Payment required")) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error(message);
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    images,
    generateImages,
  };
}
