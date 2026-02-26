import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildProductDataSection(productData: any): string {
  if (!productData) return '';
  let section = `\n═══════════════════════════════════════════════════════════
REAL PRODUCT DATA (Use as Product A in the comparison)
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
  section += `\n\nIMPORTANT: Use REAL data for Product A. Use actual specs, price, and reviews.\n`;
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

    console.log(`Generating density-first comparison for: ${topic}, target: ~${densityTarget} words, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an expert comparison writer focused on MAXIMUM information density. Google often ranks a 500-word page with a great comparison table over a 5,000-word essay. Create the shortest possible comparison that dominates SERPs.

═══════════════════════════════════════════════════════════
🎯 DENSITY-FIRST CONTENT STRATEGY 🎯
TARGET: ~${densityTarget} WORDS (every sentence must earn its place)
RULE: Comparison tables are king. Data over prose.
═══════════════════════════════════════════════════════════

- Featured Snippet Bait: 40-word direct comparison verdict
- Use extensive HTML/markdown comparison tables
- Keep ALL Schema.org and E-E-A-T signals
- Include Affiliate Disclosure

${hasRealData ? 'You have REAL scraped product data for Product A. Use actual specs, price, rating, and reviews.' : ''}`;

    const userPrompt = `Create a HIGH-DENSITY product comparison about: ${topic}
${productDataSection}
CONFIGURATION:
- Target: ~${densityTarget} words (lean & mean)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Products: ${configuration.productCount || 2}
- Schema Type: ${configuration.schemaType}
- FAQ: ${configuration.faqCount || 8} questions

DENSITY-FIRST STRUCTURE:

## 1. Quick Verdict (EXACTLY 40 words)
Single paragraph: "[Product A] vs [Product B]: [direct winner declaration with key reason]" — Featured Snippet bait.

## 2. Side-by-Side Comparison Table (12-15 specs)
| Feature | Product A | Product B |
${hasRealData ? 'Use REAL specs for Product A.' : ''}
This table IS the article. Make it comprehensive.

## 3. Winner by Category Table
| Category | Winner | Why (1 sentence) |
6-8 categories.

## 4. Key Differences (bulleted list, 80-120 words)
5-6 bullet points highlighting the most important differentiators.

## 5. Pros & Cons Side-by-Side
| | Product A Pros | Product B Pros |
| | Product A Cons | Product B Cons |

## 6. Best For (bulleted list, 60 words)
- Product A: best for [use case]
- Product B: best for [use case]

## 7. FAQ (${configuration.faqCount || 8} questions)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include real customer Q&A.' : ''}
1-2 sentence answers. Direct comparisons.

## 8. Final Verdict (40-60 words)
Clear winner with CTA.

CRITICAL: Tables should dominate this article. Return ONLY complete markdown.`;

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
      if (response.status === 429) throw new Error("Rate limit exceeded.");
      if (response.status === 402) throw new Error("API credits exhausted.");
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    const wordCount = generatedContent.split(/\s+/).length;

    console.log(`Comparison generated. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ content: generatedContent, wordCount, targetWordCount: densityTarget, generatedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-product-comparison:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
