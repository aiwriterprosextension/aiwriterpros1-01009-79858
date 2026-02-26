import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { AmazonProductData } from "@/utils/amazonScraper";

interface ArticleConfiguration {
  articleType: string;
  niche: string;
  productUrl?: string;
  productName?: string;
  productBrand?: string;
  seoTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  includeFeaturedImage: boolean;
  bodyImageCount: number;
  imageSource: "amazon" | "ai";
  affiliateId?: string;
  ctaStyle: string;
  ctaPlacement: string;
  wordCount?: number;
  tone?: string;
  readingLevel?: string;
  amazonProductData?: AmazonProductData;
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

      // Density-first strategy: aim for lean, high-authority content
      // Target ~1500 words or match the shortest competitive content, whichever is lower
      const competitorShortest = config.competitorData?.shortestCompetitor || 1500;
      const calculatedWordCount = Math.min(
        config.wordCount || 1500,
        competitorShortest,
        2000 // hard cap for density-first approach
      );

      console.log('Density-first target word count:', calculatedWordCount);

      // Build product data summary for edge functions
      const productDataSummary = config.amazonProductData ? {
        title: config.amazonProductData.productTitle,
        price: config.amazonProductData.price,
        rating: config.amazonProductData.averageRating,
        totalReviews: config.amazonProductData.totalVotes,
        features: config.amazonProductData.aboutThisItem || [],
        images: config.amazonProductData.productImages || [],
        attributes: config.amazonProductData.attributes || {},
        reviews: [
          ...(config.amazonProductData.localReviewsData || []),
          ...(config.amazonProductData.globalReviewsData || []),
        ].slice(0, 10),
        customerQuestions: (config.amazonProductData.customerQuestions || []).slice(0, 10),
        colors: config.amazonProductData.colors || [],
        sizes: config.amazonProductData.sizes || [],
        categories: config.amazonProductData.productCategoryBreadcrumbs || [],
        asin: config.amazonProductData.productASIN,
        details: config.amazonProductData.details || [],
      } : null;

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
        faqCount: 8,
        analyzeReviews: true,
        contentStrategy: "density-first",
        imageCount: config.bodyImageCount,
        imageFormat: "WebP",
        enableAffiliate: !!config.affiliateId,
        amazonAffiliateId: config.affiliateId || "",
        ctaCount: config.ctaPlacement === "after-sections" ? 3 : 1,
        ctaStyle: config.ctaStyle,
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
        productData: productDataSummary,
      };

      setProgress(30);
      setProgressMessage(`Generating high-density article (~${calculatedWordCount.toLocaleString()} words)${productDataSummary ? ' with real product data' : ''}...`);

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

      const titleMatch = generatedContent.match(/^#\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1] : config.seoTitle;

      setProgress(80);
      setProgressMessage("Saving article to database...");

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
        amazon_product_data: productDataSummary as any,
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

      if (config.imageSource === "ai" && config.bodyImageCount > 0) {
        setProgressMessage("Generating images (background)...");
        supabase.functions.invoke("generate-article-images", {
          body: {
            articleId: savedArticle.id,
            articleContent: generatedContent.substring(0, 2000),
            imageCount: config.bodyImageCount,
            includeFeatured: config.includeFeaturedImage,
            productData: productDataSummary,
          },
        }).catch(err => console.error("Image generation error:", err));
      }

      // Download Amazon images if selected
      if (config.imageSource === "amazon" && config.amazonProductData?.productImages?.length) {
        setProgressMessage("Downloading product images (background)...");
        supabase.functions.invoke("download-amazon-images", {
          body: {
            articleId: savedArticle.id,
            imageUrls: config.amazonProductData.productImages.slice(0, config.bodyImageCount + (config.includeFeaturedImage ? 1 : 0)),
            productName: config.productName || config.amazonProductData.productTitle,
          },
        }).catch(err => console.error("Image download error:", err));
      }

      setProgress(100);
      setProgressMessage(`High-density article generated! (${actualWordCount.toLocaleString()} words)`);

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
