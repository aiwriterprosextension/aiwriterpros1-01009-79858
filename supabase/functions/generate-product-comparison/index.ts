import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Word count enforcement generator
const generateWordCountEnforcement = (minimumRequired: number, competitorWordCount: number): string => {
  return `
═══════════════════════════════════════════════════════════
🚨 CRITICAL WORD COUNT REQUIREMENT 🚨
═══════════════════════════════════════════════════════════

MANDATORY MINIMUM: ${minimumRequired} WORDS

This is NON-NEGOTIABLE. Your article MUST contain at least ${minimumRequired} words.

CONTEXT:
• Top ranking competitors have approximately ${competitorWordCount} words
• You MUST write at least ${minimumRequired} words to outrank them
• This is ${Math.round((minimumRequired / competitorWordCount - 1) * 100)}% longer than competitors

══ REQUIRED WORD COUNT BREAKDOWN ══

• Quick Verdict & Summary: 300-400 words
• Product Overviews: 500-700 words (combined)
• Detailed Feature Comparison: 1200-1500 words
• Pros & Cons: 400-500 words
• Use Case Analysis: 500-700 words
• Price & Value: 400-500 words
• Testing Results: 500-600 words
• Expert Recommendations: 400-500 words
• FAQ Section: 500-700 words (15-20 questions)
• Final Verdict: 400-500 words

══ MANDATORY EXPANSION STRATEGIES ══

✓ Detailed real-world examples and specific use cases
✓ Expert tips and insider knowledge for every comparison point
✓ Explain the WHY behind winner selections, not just WHAT
✓ Comprehensive comparison tables WITH detailed explanations
✓ Multiple user scenarios and personas for each product
✓ Technical specifications with context and real-world implications
✓ Head-to-head testing results with specific metrics
✓ Long-term ownership considerations

══ FORBIDDEN ACTIONS ══

❌ DO NOT summarize or condense information
❌ DO NOT skip comparison categories
❌ DO NOT use brief, surface-level descriptions
❌ DO NOT declare winners without detailed justification
❌ DO NOT end the article prematurely

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

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate minimum word count
    const targetWordCount = configuration.wordCount || 3500;
    const competitorWordCount = configuration.competitorData?.targetWordCount || 3500;
    const longestCompetitor = configuration.competitorData?.longestCompetitor || 3500;
    const minimumRequired = Math.max(targetWordCount, competitorWordCount, Math.ceil(longestCompetitor * 1.25), 3500);

    console.log(`Generating product comparison for: ${topic}, minimum words: ${minimumRequired}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert comparison writer specializing in detailed side-by-side product analysis. You create comprehensive, SEO-optimized comparison content that helps buyers make informed decisions between specific products.

${wordCountEnforcement}`;

    const userPrompt = `Create a comprehensive product comparison article about: ${topic}

CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM - do not write less than this)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Products to Compare: ${configuration.productCount || 2}
- Comparison Categories: ${configuration.comparisonCategories || 8}
- Schema Type: ${configuration.schemaType}
- Include Winner Selection: ${configuration.includeWinner !== false}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta
- H1: "[Product A] vs [Product B]: Which Should You Buy? [Year]"
- Meta Description (150-160 chars): Comparison hook with primary keyword
- URL Slug: [product-a]-vs-[product-b]-comparison

## 2. Quick Verdict (300-400 words)
- At-a-glance winner announcement with detailed reasoning
- Key differentiators summary (5-7 points)
- Who should buy Product A (detailed profile)
- Who should buy Product B (detailed profile)
- Price difference highlight and value analysis
- TL;DR recommendation table with scores

## 3. Side-by-Side Comparison Table
**Quick Specs Comparison:**
| Feature | Product A | Product B | Winner |
|---------|-----------|-----------|--------|
| Price | $XXX | $XXX | 🏆 |
| Key Spec 1 | Value | Value | 🏆 |
| Key Spec 2 | Value | Value | 🏆 |
[10-12 key specifications with explanations]

## 4. Product Overviews (500-700 words total)

### Product A Overview (250-350 words)
- Brief history/background and brand reputation
- Target audience and ideal user profile
- Key selling points (5-7)
- Market position and competitive landscape
- Overall rating with breakdown: ⭐⭐⭐⭐⭐

### Product B Overview (250-350 words)
- Brief history/background and brand reputation
- Target audience and ideal user profile
- Key selling points (5-7)
- Market position and competitive landscape
- Overall rating with breakdown: ⭐⭐⭐⭐⭐

**First Impressions:**
- Unboxing experience comparison
- Build quality observations
- Initial setup differences

## 5. Detailed Feature Comparison (1200-1500 words)

For each of ${configuration.comparisonCategories || 8} categories:

### Category: [e.g., Performance]
**Product A (150-200 words):**
- Detailed analysis with specific metrics
- Benchmark results where applicable
- Real-world performance scenarios
- Strengths in this category
- Weaknesses in this category

**Product B (150-200 words):**
- Detailed analysis with specific metrics
- Benchmark results where applicable
- Real-world performance scenarios
- Strengths in this category
- Weaknesses in this category

**Winner:** [Product] because [detailed reason with data]
**Margin:** Significant/Moderate/Slight
**Who This Matters To:** [Specific user profiles]

Categories to cover:
1. Performance
2. Design & Build Quality
3. Features & Functionality
4. User Experience
5. Value for Money
6. Durability & Reliability
7. Customer Support & Warranty
8. Ecosystem & Compatibility

## 6. Pros & Cons Breakdown (400-500 words)

### Product A
**Strengths (6-8):**
- Pro 1 (detailed 40-50 word explanation)
- Pro 2 (detailed explanation)
[Continue for all pros]

**Weaknesses (4-5):**
- Con 1 (detailed 40-50 word explanation)
- Con 2 (detailed explanation)
[Continue for all cons]

### Product B
**Strengths (6-8):**
- Pro 1 (detailed 40-50 word explanation)
[Continue]

**Weaknesses (4-5):**
- Con 1 (detailed 40-50 word explanation)
[Continue]

## 7. Use Case Analysis (500-700 words)

**Best for Product A (250-350 words):**
- Use case 1 (detailed 60-80 word scenario)
- Use case 2 (detailed scenario)
- Use case 3 (detailed scenario)
- Ideal user profile summary

**Best for Product B (250-350 words):**
- Use case 1 (detailed 60-80 word scenario)
- Use case 2 (detailed scenario)
- Use case 3 (detailed scenario)
- Ideal user profile summary

**Scenarios Compared:**
- Scenario 1: Which performs better and why (detailed)
- Scenario 2: Which performs better and why (detailed)
- Scenario 3: Which performs better and why (detailed)

## 8. Price & Value Comparison (400-500 words)
- Current pricing (both products with links)
- Historical pricing trends and patterns
- What you get for the price (feature per dollar)
- Price-to-performance ratio analysis
- Long-term value assessment
- Total cost of ownership over 2-3 years
- When each is worth the premium/savings
- Best deals and where to buy

## 9. Real-World Testing Results (500-600 words)
- Testing methodology explained
- Duration of testing (specific timeframe)
- Conditions and scenarios tested
- Performance metrics with specific numbers
- Reliability observations over time
- User experience findings
- Unexpected discoveries
- Long-term ownership insights

## 10. Upgrade & Alternative Considerations (400-500 words)
- Is upgrading from A to B worth it? (detailed analysis)
- Is downgrading from B to A acceptable? (when it makes sense)
- Alternative products to consider (3-4 options)
- When to choose neither product
- Future models on the horizon
- Should you wait? (timing recommendations)

## 11. Expert Recommendations (400-500 words)

**Choose Product A if (detailed):**
- Criterion 1 (50-60 word explanation)
- Criterion 2 (explanation)
- Criterion 3 (explanation)

**Choose Product B if (detailed):**
- Criterion 1 (50-60 word explanation)
- Criterion 2 (explanation)
- Criterion 3 (explanation)

**Avoid both if:**
- Criterion 1 with alternatives
- Criterion 2 with alternatives

**Better alternatives if:**
- Specific needs with recommendations

## 12. Winner by Category (200-300 words)
- Overall Winner: 🏆 [Product] with justification
- Best Value: 🏆 [Product] with reasoning
- Best Performance: 🏆 [Product]
- Best Features: 🏆 [Product]
- Best Design: 🏆 [Product]
- Best for Beginners: 🏆 [Product]
- Best for Professionals: 🏆 [Product]

**Final Score:**
- Product A: X/10 (with breakdown)
- Product B: X/10 (with breakdown)

## 13. FAQ Section (${configuration.faqCount || 20} questions, 500-700 words)
Address:
- "Which is better for [specific use]?"
- "Is the price difference worth it?"
- "Can Product A do what Product B does?"
- "Which lasts longer?"
- "Which is easier to use?"
- "Which has better support?"
- Compatibility questions
- Upgrade path questions
- Technical questions
Each with comprehensive answers (60-100 words)

## 14. Final Verdict (400-500 words)
- Clear winner declaration with detailed justification
- Nuanced recommendation for different users
- Summary of key differences (bullet points)
- Bottom line for each product
- Personal recommendation with reasoning
- Future outlook for both products
- Strong call-to-action with links

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, naturally throughout
- Comparison keywords ("vs", "compared to", "better than")
- Secondary keywords distributed (10-15 instances)
- Header hierarchy optimized
- Schema markup for ${configuration.schemaType}
- Image alt text with product names
- Featured snippet optimization (comparison table)

WRITING STYLE:
- ${configuration.tone} and balanced
- ${configuration.readingLevel} reading level
- Objective and unbiased with data support
- Short paragraphs (2-4 sentences)
- Clear winner declarations with evidence
- Specific rather than vague

ENGAGEMENT ELEMENTS:
- ${configuration.ctaCount} strategic CTAs
- Winner badges throughout
- Score comparisons
- Visual comparison suggestions
- Summary boxes
- Decision flowchart suggestions

REMEMBER: Your article MUST be at least ${minimumRequired} words. Every comparison must be thorough and detailed. Do not summarize or condense.

Return ONLY the complete markdown article with all sections, no additional commentary.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
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
      
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a few moments.");
      }
      if (response.status === 402) {
        throw new Error("API credits exhausted. Please add credits to continue.");
      }
      
      throw new Error(`AI gateway returned ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    const wordCount = generatedContent.split(/\s+/).length;

    console.log(`Article generated successfully. Word count: ${wordCount}`);

    return new Response(
      JSON.stringify({ 
        content: generatedContent,
        wordCount: wordCount,
        targetWordCount: minimumRequired,
        generatedAt: new Date().toISOString()
      }),
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
