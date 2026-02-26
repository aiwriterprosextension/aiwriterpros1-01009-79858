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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, configuration } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const targetWordCount = configuration.wordCount || 1500;
    const competitorShortest = configuration.competitorData?.shortestCompetitor || 1500;
    const densityTarget = Math.min(targetWordCount, competitorShortest, 2000);

    const productDataSection = buildProductDataSection(configuration.productData);
    const hasRealData = !!configuration.productData;

    console.log(`Generating density-first buying guide for: ${topic}, target: ~${densityTarget} words, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an expert buying guide writer focused on MAXIMUM information density. Create the shortest possible guide that contains 100% of the SEO signals needed to outrank long-form competitors.

═══════════════════════════════════════════════════════════
🎯 DENSITY-FIRST CONTENT STRATEGY 🎯
TARGET: ~${densityTarget} WORDS (every sentence must earn its place)
RULE: Data-rich tables and bulleted lists over prose. Zero fluff.
═══════════════════════════════════════════════════════════

- Featured Snippet Bait: 40-word paragraphs that directly answer search intent
- Comparison tables beat essays — Google ranks a 500-word page with a great table over 5,000 words of prose
- Keep ALL Schema.org (JSON-LD) and E-E-A-T signals
- Include Affiliate Disclosure and trust badges

${hasRealData ? 'You have REAL scraped Amazon product data. Use actual details, prices, ratings, and reviews.' : ''}`;

    const userPrompt = `Create a HIGH-DENSITY buying guide about: ${topic}
${productDataSection}
CONFIGURATION:
- Target: ~${densityTarget} words (lean & mean)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Schema Type: ${configuration.schemaType}
- FAQ: ${configuration.faqCount || 8} questions

DENSITY-FIRST STRUCTURE:

## 1. Quick Verdict (EXACTLY 40 words)
Single paragraph answering "What's the best [category] to buy?" — Featured Snippet bait.

## 2. Top 3 Picks Table
| Pick | Product | Price | Best For | Rating |
${hasRealData ? 'Feature the real product with actual data.' : ''}

## 3. Key Buying Criteria (bulleted list, 100-150 words)
5-7 criteria as bullet points with 1-sentence explanations.

## 4. Budget Breakdown Table
| Budget | Best Pick | Key Trade-offs |
3 tiers: Budget, Mid-Range, Premium.

## 5. Detailed Comparison Table (10-12 specs)
| Feature | Pick 1 | Pick 2 | Pick 3 |
${hasRealData ? 'Use REAL specs for the scraped product.' : ''}

## 6. What to Avoid (bulleted list, 60-80 words)
4-5 red flags as bullet points.

## 7. FAQ (${configuration.faqCount || 8} questions)
1-2 sentence answers max. Direct and factual.

## 8. Final Recommendation (40-60 words)
Clear verdict with CTA.

CRITICAL: Use markdown tables extensively. Maintain E-E-A-T and affiliate disclosure. Return ONLY complete markdown.`;

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
        max_tokens: 8000,
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

    console.log(`Buying guide generated. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ content: generatedContent, wordCount, targetWordCount: densityTarget, generatedAt: new Date().toISOString() }),
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
