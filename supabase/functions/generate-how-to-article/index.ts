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

    console.log(`Generating density-first how-to for: ${topic}, target: ~${densityTarget} words, hasRealData: ${hasRealData}`);

    const systemPrompt = `You are an expert tutorial writer focused on MAXIMUM information density. Create the shortest possible how-to guide that contains 100% of the SEO signals needed to outrank long-form competitors.

═══════════════════════════════════════════════════════════
🎯 DENSITY-FIRST CONTENT STRATEGY 🎯
TARGET: ~${densityTarget} WORDS (every sentence must earn its place)
RULE: Numbered steps, data tables, and bulleted lists over prose.
═══════════════════════════════════════════════════════════

- Featured Snippet Bait: 40-word summary that captures the HowTo rich result
- Use HowTo schema-friendly formatting (numbered steps with clear names)
- Keep ALL Schema.org and E-E-A-T signals
- Include Affiliate Disclosure

${hasRealData ? 'You have REAL scraped Amazon product data. Reference actual specs and features when recommending products.' : ''}`;

    const userPrompt = `Create a HIGH-DENSITY how-to article about: ${topic}
${productDataSection}
CONFIGURATION:
- Target: ~${densityTarget} words (lean & mean)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Steps: ${configuration.stepCount || '8-10'}
- Schema Type: ${configuration.schemaType}
- FAQ: ${configuration.faqCount || 8} questions

DENSITY-FIRST STRUCTURE:

## 1. Quick Answer (EXACTLY 40 words)
Single paragraph directly answering "How to [task]?" — Featured Snippet / HowTo rich result bait.

## 2. What You'll Need Table
| Item | Why | Est. Cost |
${hasRealData ? 'Include the real product with actual price.' : ''}

## 3. Step-by-Step Instructions (${configuration.stepCount || '8-10'} steps)
Each step: **Step Name** → 2-3 sentences max → Pro tip (1 sentence).
${hasRealData ? 'Reference the real product in relevant steps with actual specs.' : ''}

## 4. Quick Troubleshooting Table
| Problem | Fix |
4-5 common issues, 1-sentence fixes.

## 5. FAQ (${configuration.faqCount || 8} questions)
${hasRealData && configuration.productData?.customerQuestions?.length ? 'Use real customer Q&A.' : ''}
1-2 sentence answers. Direct and factual.

## 6. Summary Checklist
Bulleted checklist of all steps for quick reference.

CRITICAL: Use markdown tables and numbered lists extensively. Maintain E-E-A-T signals. Return ONLY complete markdown.`;

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

    console.log(`How-to generated. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ content: generatedContent, wordCount, targetWordCount: densityTarget, generatedAt: new Date().toISOString() }),
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
