import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildProductDataSection(productData: any): string {
  if (!productData) return '';
  let section = `\n═══════════════════════════════════════════════════════════
REAL PRODUCT DATA (Use this actual data in the article)
═══════════════════════════════════════════════════════════\n`;
  if (productData.title) section += `\nProduct Title: ${productData.title}`;
  if (productData.price) section += `\nPrice: ${productData.price}`;
  if (productData.rating) section += `\nAverage Rating: ${productData.rating}/5`;
  if (productData.totalReviews) section += `\nTotal Reviews: ${productData.totalReviews}`;
  if (productData.categories?.length) section += `\nCategory: ${productData.categories.join(' > ')}`;
  if (productData.colors?.length) section += `\nAvailable Colors: ${productData.colors.join(', ')}`;
  if (productData.sizes?.length) section += `\nAvailable Sizes: ${productData.sizes.join(', ')}`;
  if (productData.features?.length) {
    section += `\n\nKey Features (About This Item):`;
    productData.features.forEach((f: string, i: number) => { section += `\n${i + 1}. ${f}`; });
  }
  if (productData.attributes && Object.keys(productData.attributes).length) {
    section += `\n\nProduct Attributes:`;
    for (const [key, value] of Object.entries(productData.attributes)) { section += `\n- ${key}: ${value}`; }
  }
  if (productData.reviews?.length) {
    section += `\n\nCustomer Reviews:`;
    productData.reviews.slice(0, 6).forEach((r: any, i: number) => {
      section += `\n[${i + 1}] ⭐${r.stars}/5 "${r.title}": ${r.text?.substring(0, 200)}`;
    });
  }
  if (productData.customerQuestions?.length) {
    section += `\n\nCustomer Q&A:`;
    productData.customerQuestions.slice(0, 6).forEach((q: any) => {
      section += `\nQ: ${q.question}\nA: ${q.answer}`;
    });
  }
  section += `\n\nIMPORTANT: Use REAL data above for authenticity.\n`;
  return section;
}

const generateWordCountEnforcement = (minimumRequired: number, competitorWordCount: number): string => {
  return `
═══════════════════════════════════════════════════════════
🚨 CRITICAL WORD COUNT REQUIREMENT 🚨
MANDATORY MINIMUM: ${minimumRequired} WORDS
Top ranking competitors have approximately ${competitorWordCount} words.
You MUST write at least ${minimumRequired} words to outrank them.
IF YOUR ARTICLE IS UNDER ${minimumRequired} WORDS, YOU HAVE FAILED THIS TASK.
═══════════════════════════════════════════════════════════
`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, configuration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const targetWordCount = configuration.wordCount || 3500;
    const competitorWordCount = configuration.competitorData?.targetWordCount || 3500;
    const longestCompetitor = configuration.competitorData?.longestCompetitor || 3500;
    const minimumRequired = Math.max(targetWordCount, competitorWordCount, Math.ceil(longestCompetitor * 1.25), 3500);

    const productDataSection = buildProductDataSection(configuration.productData);
    const hasRealData = !!configuration.productData;

    console.log(`Generating buying guide for: ${topic}, minimum words: ${minimumRequired}, hasRealData: ${hasRealData}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert buying guide writer specializing in comprehensive, SEO-optimized product guides. You create authoritative content that helps buyers make informed decisions across all budget levels.

${wordCountEnforcement}

${hasRealData ? 'You have REAL scraped Amazon product data. Use actual product details, prices, ratings, and customer reviews for authenticity.' : ''}`;

    const userPrompt = `Create a comprehensive buying guide about: ${topic}
${productDataSection}
CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Budget Tiers: ${configuration.budgetTiers || 3}
- Product Recommendations: ${configuration.productCount || 10}
- Schema Type: ${configuration.schemaType}
- Include Comparison Table: ${configuration.includeComparison}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta
- H1: "[Primary Keyword] - Complete Buying Guide [Current Year]"
- Meta Description (150-160 chars)

## 2. Executive Summary (300-400 words)
## 3. Quick Reference Table - Top 3 picks
## 4. Understanding [Product Category] (500-700 words)
## 5. Key Features to Consider (700-900 words)
## 6. Budget Breakdown (400-500 words)
## 7. Top Product Recommendations (1500-2000 words)
${hasRealData ? 'Feature the real product from scraped data as one of the top recommendations with its actual specs, price, and reviews.' : ''}
## 8. Detailed Comparison Table
## 9. Buying Factors Deep Dive (600-800 words)
## 10. Common Mistakes to Avoid (400-500 words)
## 11. Expert Tips & Tricks (400-500 words)
## 12. FAQ Section (${configuration.faqCount || 20} questions, 600-800 words)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include the real customer Q&A provided in the product data.' : ''}
## 13. Future-Proofing & Trends (300-400 words)
## 14. Final Verdict & Recommendations (400-500 words)

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, naturally throughout
- Secondary keywords distributed (10-15 instances)
- Header hierarchy optimized
- Schema markup for ${configuration.schemaType}

WRITING STYLE:
- ${configuration.tone} and authoritative
- ${configuration.readingLevel} reading level
- Active voice (80%+), short paragraphs, bullet points

ENGAGEMENT: ${configuration.ctaCount} strategic CTAs throughout

REMEMBER: MUST be at least ${minimumRequired} words. Return ONLY the complete markdown article.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) throw new Error("Rate limit exceeded. Please try again in a few moments.");
      if (response.status === 402) throw new Error("API credits exhausted. Please add credits to continue.");
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    const wordCount = generatedContent.split(/\s+/).length;

    console.log(`Article generated successfully. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ content: generatedContent, wordCount, targetWordCount: minimumRequired, generatedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-buying-guide:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
