import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function buildProductDataSection(productData: any): string {
  if (!productData) return '';
  let section = `\n═══════════════════════════════════════════════════════════
REAL PRODUCT DATA (Feature as #1 pick in the roundup)
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
  section += `\n\nIMPORTANT: Feature this REAL product as "Best Overall" with actual data.\n`;
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

    console.log(`Generating density-first roundup for: ${topic}, target: ~${densityTarget} words, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an expert product roundup writer focused on MAXIMUM information density. Create the shortest possible "best of" list that dominates SERPs with data-rich tables.

═══════════════════════════════════════════════════════════
🎯 DENSITY-FIRST CONTENT STRATEGY 🎯
TARGET: ~${densityTarget} WORDS (every sentence must earn its place)
RULE: Product tables and quick-pick lists over long prose. Zero fluff.
═══════════════════════════════════════════════════════════

- Featured Snippet Bait: 40-word "best overall" declaration
- Use product comparison tables as the backbone
- Keep ALL Schema.org and E-E-A-T signals
- Include Affiliate Disclosure

${hasRealData ? 'You have REAL scraped product data. Feature it as #1 pick with actual specs, price, and reviews.' : ''}`;

    const userPrompt = `Create a HIGH-DENSITY product roundup about: ${topic}
${productDataSection}
CONFIGURATION:
- Target: ~${densityTarget} words (lean & mean)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Products: ${configuration.productCount || 5}
- Schema Type: ${configuration.schemaType}
- FAQ: ${configuration.faqCount || 8} questions

DENSITY-FIRST STRUCTURE:

## 1. Quick Verdict (EXACTLY 40 words)
"The best [category] is [Product]. Here's why:" — Featured Snippet bait for Position 0.

## 2. Quick-Pick Table
| Award | Product | Price | Rating | Best For |
${hasRealData ? 'Use REAL data for #1 pick.' : ''}
Best Overall, Best Value, Best Premium, Best for [use case].

## 3. Full Comparison Table (8-10 specs)
| Spec | Product 1 | Product 2 | Product 3 | Product 4 | Product 5 |
${hasRealData ? 'Use REAL specs for the scraped product.' : ''}

## 4. Mini-Reviews (${configuration.productCount || 5} products, 60-80 words each)
For each: **Product Name** — 1-sentence verdict. Key pro. Key con. Best for [use case].
${hasRealData ? 'Use REAL features and customer quotes for the scraped product.' : ''}

## 5. How We Tested (60-80 words)
Bulleted list of testing criteria. Builds E-E-A-T.

## 6. FAQ (${configuration.faqCount || 8} questions)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Include real customer Q&A.' : ''}
1-2 sentence answers.

## 7. Final Verdict (40-60 words)
Restate top pick with CTA.

CRITICAL: Tables dominate. Return ONLY complete markdown.`;

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

    console.log(`Roundup generated. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ content: generatedContent, wordCount, targetWordCount: densityTarget, generatedAt: new Date().toISOString() }),
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
