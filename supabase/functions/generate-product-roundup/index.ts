import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildProductDataSection(productData: any): string {
  if (!productData) return '';
  let section = `\n═══════════════════════════════════════════════════════════
REAL PRODUCT DATA (Feature this product in the roundup)
═══════════════════════════════════════════════════════════\n`;
  if (productData.title) section += `\nProduct Title: ${productData.title}`;
  if (productData.price) section += `\nPrice: ${productData.price}`;
  if (productData.rating) section += `\nAverage Rating: ${productData.rating}/5`;
  if (productData.totalReviews) section += `\nTotal Reviews: ${productData.totalReviews}`;
  if (productData.features?.length) {
    section += `\n\nKey Features:`;
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
  section += `\n\nIMPORTANT: Feature this REAL product as the #1 pick or "Best Overall" in the roundup with actual data.\n`;
  return section;
}

const generateWordCountEnforcement = (minimumRequired: number, competitorWordCount: number): string => {
  return `
═══════════════════════════════════════════════════════════
🚨 CRITICAL WORD COUNT REQUIREMENT 🚨
MANDATORY MINIMUM: ${minimumRequired} WORDS
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

    console.log(`Generating product roundup for: ${topic}, minimum words: ${minimumRequired}, hasRealData: ${hasRealData}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert product reviewer specializing in "Best of" roundup articles. You create comprehensive, SEO-optimized comparison content that showcases multiple products with detailed analysis.

${wordCountEnforcement}

${hasRealData ? 'You have REAL scraped Amazon product data for one product. Feature it prominently with actual specs, price, rating, and customer reviews.' : ''}`;

    const userPrompt = `Create a comprehensive product roundup article about: ${topic}
${productDataSection}
CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Number of Products: ${configuration.productCount || 10}
- Schema Type: ${configuration.schemaType}
- Include Comparison Table: ${configuration.includeComparison}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta - "Best [Category] of [Year] - Top ${configuration.productCount || 10} Picks"
## 2. At-a-Glance Summary (300-400 words)
## 3. Quick Comparison Table
${hasRealData ? 'Include the real product with its actual specs in the comparison table.' : ''}
## 4. How We Test & Review (400-500 words)
## 5. Category Winners (300-400 words)
${hasRealData ? 'Consider the real product for "Best Overall" or relevant category.' : ''}
## 6. Detailed Product Reviews (200-250 words each, ${configuration.productCount || 10} products)
${hasRealData ? 'Use REAL data for the scraped product review: actual title, price, rating, features, pros/cons from reviews.' : ''}
## 7. Head-to-Head Comparisons (500-700 words)
## 8. Buying Considerations (600-800 words)
## 9. What to Avoid (400-500 words)
## 10. Price & Value Analysis (400-500 words)
${hasRealData && configuration.productData?.price ? `Real product price: ${configuration.productData.price}` : ''}
## 11. Alternative & Runner-Up Products (300-400 words)
## 12. FAQ Section (${configuration.faqCount || 20} questions, 500-700 words)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include real customer Q&A.' : ''}
## 13. Expert Shopping Tips (400-500 words)
## 14. Final Recommendations (400-500 words)

WRITING STYLE: ${configuration.tone}, ${configuration.readingLevel}, active voice 80%+
ENGAGEMENT: ${configuration.ctaCount} strategic CTAs

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
      if (response.status === 429) throw new Error("Rate limit exceeded.");
      if (response.status === 402) throw new Error("API credits exhausted.");
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
    console.error("Error in generate-product-roundup:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
