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
  section += `\n\nIMPORTANT: Use REAL data above for authenticity.\n`;
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

    console.log(`Generating how-to article for: ${topic}, minimum words: ${minimumRequired}, hasRealData: ${hasRealData}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert tutorial writer specializing in clear, actionable how-to guides. You create comprehensive, SEO-optimized instructional content that helps readers accomplish specific tasks successfully.

${wordCountEnforcement}

${hasRealData ? 'You have REAL scraped Amazon product data. Reference actual product specs, features, and user feedback when recommending products within the tutorial.' : ''}`;

    const userPrompt = `Create a comprehensive how-to article about: ${topic}
${productDataSection}
CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Difficulty Level: ${configuration.difficulty || 'Beginner to Intermediate'}
- Number of Steps: ${configuration.stepCount || '10-15'}
- Schema Type: ${configuration.schemaType}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta - "How to [Task]: Complete Step-by-Step Guide [Year]"
## 2. Introduction & Overview (300-400 words)
## 3. What You'll Need (200-300 words)
${hasRealData ? 'Include the real product as a recommended tool/material with its actual price and features.' : ''}
## 4. Before You Begin (300-400 words)
## 5. Quick Reference Summary
## 6. Step-by-Step Instructions (1500-2000 words, 150-200 words per step)
${hasRealData ? 'Reference the real product in relevant steps, using actual specs and features.' : ''}
## 7. Verification & Quality Check (300-400 words)
## 8. Troubleshooting Guide (500-700 words, 6-8 problems)
## 9. Advanced Tips & Variations (400-500 words)
## 10. Common Mistakes & How to Avoid Them (400-500 words, 6-8 mistakes)
## 11. Maintenance & Longevity (250-350 words)
## 12. Cost Breakdown & Budgeting (250-350 words)
## 13. FAQ Section (${configuration.faqCount || 20} questions, 500-700 words)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include real customer Q&A from the product data.' : ''}
## 14. Conclusion & Next Steps (300-400 words)

WRITING STYLE: ${configuration.tone}, ${configuration.readingLevel}, active voice, imperative mood
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
    console.error("Error in generate-how-to-article:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
