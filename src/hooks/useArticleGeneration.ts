import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ArticleConfiguration {
  // Core settings
  articleType: string;
  niche: string;
  productUrl?: string;
  productName?: string;
  productBrand?: string;
  
  // SEO settings
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  
  // Image settings
  includeFeaturedImage: boolean;
  bodyImageCount: number;
  imageSource: "amazon" | "ai";
  
  // Affiliate settings
  affiliateId?: string;
  ctaStyle: string;
  ctaPlacement: string;
  
  // Content settings
  wordCount?: number;
  tone?: string;
  readingLevel?: string;
  
  // Enhanced competitor data
  competitorData?: {
    targetWordCount?: number;
    longestCompetitor?: number;
    shortestCompetitor?: number;
    averageCompetitor?: number;
    recommendedArticleType?: string;
    articleTypeReason?: string;
    contentGaps?: string[];
    suggestedHeadings?: string[];
    recommendations?: string[];
  };
}

interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  markdownContent: string;
  htmlContent: string;
}

const EDGE_FUNCTION_MAP: Record<string, string> = {
  "amazon-review": "generate-amazon-review",
  "product-comparison": "generate-product-comparison",
  "buying-guide": "generate-buying-guide",
  "how-to-article": "generate-how-to-article",
  "product-roundup": "generate-product-roundup",
};

export function useArticleGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const { user } = useAuth();

  const generateArticle = async (config: ArticleConfiguration): Promise<GeneratedArticle | null> => {
    if (!user) {
      toast.error("Please sign in to generate articles");
      return null;
    }

    setIsGenerating(true);
    setProgress(10);
    setProgressMessage("Preparing article configuration...");

    try {
      const edgeFunctionName = EDGE_FUNCTION_MAP[config.articleType];
      if (!edgeFunctionName) {
        throw new Error(`Unknown article type: ${config.articleType}`);
      }

      setProgress(20);
      setProgressMessage("Connecting to AI engine...");

      // Enhanced word count calculation
      const calculatedWordCount = Math.max(
        config.wordCount || 3500,
        config.competitorData?.targetWordCount || 3500,
        config.competitorData?.longestCompetitor 
          ? Math.ceil(config.competitorData.longestCompetitor * 1.25) 
          : 3500,
        3500 // Absolute minimum floor
      );

      console.log('Enforcing minimum word count:', calculatedWordCount);

      // Build configuration for edge function
      const edgeConfig = {
        wordCount: calculatedWordCount,
        tone: config.tone || "Balanced & Authoritative",
        readingLevel: config.readingLevel || "8th Grade",
        primaryKeyword: config.primaryKeyword,
        secondaryKeywords: config.secondaryKeywords,
        metaDescription: config.metaDescription,
        schemaType: "Product + Review",
        includeComparison: true,
        includeFaq: true,
        faqCount: 20,
        analyzeReviews: true,
        imageCount: config.bodyImageCount,
        imageFormat: "WebP",
        enableAffiliate: !!config.affiliateId,
        amazonAffiliateId: config.affiliateId || "",
        ctaCount: config.ctaPlacement === "after-sections" ? 6 : 2,
        ctaStyle: config.ctaStyle,
        // Enhanced competitor data
        competitorData: {
          targetWordCount: config.competitorData?.targetWordCount || 3500,
          longestCompetitor: config.competitorData?.longestCompetitor || 3500,
          shortestCompetitor: config.competitorData?.shortestCompetitor || 3500,
          recommendedArticleType: config.competitorData?.recommendedArticleType,
          contentGaps: config.competitorData?.contentGaps || [],
          suggestedHeadings: config.competitorData?.suggestedHeadings || [],
          recommendations: config.competitorData?.recommendations || [],
        },
        contentGaps: config.competitorData?.contentGaps || [],
        suggestedHeadings: config.competitorData?.suggestedHeadings || [],
      };

      setProgress(30);
      setProgressMessage(`Generating ${calculatedWordCount.toLocaleString()}+ word article...`);

      // Call the appropriate edge function
      const requestBody = config.articleType === "amazon-review" 
        ? { productUrl: config.productUrl || config.productName, configuration: edgeConfig }
        : { topic: config.productName || config.productUrl, configuration: edgeConfig };

      const { data, error } = await supabase.functions.invoke(edgeFunctionName, {
        body: requestBody,
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Failed to generate article");
      }

      if (!data?.content) {
        throw new Error("No content received from AI");
      }

      setProgress(70);
      setProgressMessage("Processing generated content...");

      const generatedContent = data.content;
      const actualWordCount = generatedContent.split(/\s+/).length;

      // Extract title from generated content (usually first H1)
      const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1] : config.seoTitle;

      setProgress(80);
      setProgressMessage("Saving article to database...");

      // Save to database
      const articleData = {
        user_id: user.id,
        title: config.seoTitle || extractedTitle,
        content: generatedContent,
        markdown_content: generatedContent,
        html_content: generatedContent,
        article_type: config.articleType,
        product_url: config.productUrl || null,
        affiliate_enabled: !!config.affiliateId,
        affiliate_id: config.affiliateId || null,
        featured_image_url: null,
        featured_image_alt: config.includeFeaturedImage ? `${config.productName} featured image` : null,
        configuration: {
          niche: config.niche,
          productName: config.productName,
          productBrand: config.productBrand,
          seoTitle: config.seoTitle,
          metaDescription: config.metaDescription,
          primaryKeyword: config.primaryKeyword,
          secondaryKeywords: config.secondaryKeywords,
          includeFeaturedImage: config.includeFeaturedImage,
          bodyImageCount: config.bodyImageCount,
          imageSource: config.imageSource,
          ctaStyle: config.ctaStyle,
          ctaPlacement: config.ctaPlacement,
          wordCount: calculatedWordCount,
          actualWordCount: actualWordCount,
          tone: edgeConfig.tone,
          readingLevel: edgeConfig.readingLevel,
          competitorData: config.competitorData,
        },
        seo_score: {
          score: 85,
          titleLength: config.seoTitle.length,
          metaDescriptionLength: config.metaDescription.length,
          primaryKeywordPresent: generatedContent.toLowerCase().includes(config.primaryKeyword.toLowerCase()),
        },
        word_count: actualWordCount,
      };

      const { data: savedArticle, error: saveError } = await supabase
        .from("articles")
        .insert(articleData)
        .select()
        .single();

      if (saveError) {
        console.error("Database save error:", saveError);
        throw new Error("Failed to save article to database");
      }

      setProgress(90);
      setProgressMessage("Finalizing...");

      // Generate images if AI source selected
      if (config.imageSource === "ai" && config.bodyImageCount > 0) {
        setProgressMessage("Generating images (background)...");
        supabase.functions.invoke("generate-article-images", {
          body: {
            articleId: savedArticle.id,
            articleContent: generatedContent.substring(0, 2000),
            imageCount: config.bodyImageCount,
            includeFeatured: config.includeFeaturedImage,
          },
        }).catch(err => console.error("Image generation error:", err));
      }

      setProgress(100);
      setProgressMessage(`Article generated successfully! (${actualWordCount.toLocaleString()} words)`);

      return {
        id: savedArticle.id,
        title: savedArticle.title,
        content: generatedContent,
        markdownContent: generatedContent,
        htmlContent: generatedContent,
      };

    } catch (error) {
      console.error("Article generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate article");
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  return {
    generateArticle,
    isGenerating,
    progress,
    progressMessage,
  };
}
