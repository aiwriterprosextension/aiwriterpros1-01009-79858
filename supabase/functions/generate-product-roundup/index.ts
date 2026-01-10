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

• At-a-Glance Summary: 300-400 words
• How We Test & Review: 400-500 words
• Category Winners: 300-400 words
• Detailed Product Reviews: 200-250 words EACH (10 products = 2000-2500 words)
• Head-to-Head Comparisons: 500-700 words
• Buying Considerations: 600-800 words
• What to Avoid: 400-500 words
• Price & Value Analysis: 400-500 words
• FAQ Section: 500-700 words (15-20 questions)
• Final Recommendations: 400-500 words

══ MANDATORY EXPANSION STRATEGIES ══

✓ Detailed real-world testing results for each product
✓ Specific pros and cons with explanations
✓ Expert tips and insider knowledge
✓ Comprehensive comparison tables WITH explanations
✓ Multiple user scenarios and personas
✓ Price and value analysis for each product
✓ Long-term ownership considerations

══ FORBIDDEN ACTIONS ══

❌ DO NOT summarize or condense product reviews
❌ DO NOT skip any required sections
❌ DO NOT use brief, surface-level descriptions
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

    console.log(`Generating product roundup for: ${topic}, minimum words: ${minimumRequired}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert product reviewer specializing in "Best of" roundup articles. You create comprehensive, SEO-optimized comparison content that showcases multiple products with detailed analysis.

${wordCountEnforcement}`;

    const userPrompt = `Create a comprehensive product roundup article about: ${topic}

CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM - do not write less than this)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Number of Products: ${configuration.productCount || 10}
- Categories to Include: ${configuration.categories || 'auto-detect'}
- Schema Type: ${configuration.schemaType}
- Include Comparison Table: ${configuration.includeComparison}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta
- H1: "Best [Product Category] of [Year] - Top ${configuration.productCount || 10} Picks Reviewed"
- Meta Description (150-160 chars): Compelling summary with primary keyword
- URL Slug: best-[category]-[year]

## 2. At-a-Glance Summary (300-400 words)
- Quick verdict paragraph with key insights
- Top 3 overall winners with brief reasoning
- Who each product is best for (detailed)
- Key takeaway highlights (5-7 points)
- Updated date badge and testing info
- Why trust this roundup

## 3. Quick Comparison Table
- All ${configuration.productCount || 10} products side-by-side
- Key specs (6-8 columns)
- Ratings (out of 5 with decimal)
- Price points
- Best for categories
- Editor's choice badges

## 4. How We Test & Review (400-500 words)
- Testing methodology explained in detail
- Criteria and weighting system
- Hands-on experience duration
- Lab tests performed (if applicable)
- Real-world usage scenarios tested
- Rating system explained
- Editorial independence statement
- Expert credentials

## 5. Category Winners (300-400 words)
- Best Overall (with justification)
- Best Value (with price/performance analysis)
- Best Premium (with luxury features)
- Best for Beginners (with ease-of-use focus)
- Best for Professionals (with advanced features)
- Most Innovative (with unique features)
- Editor's Choice (personal recommendation)
Brief 40-60 word explanation for each

## 6. Detailed Product Reviews (200-250 words each, ${configuration.productCount || 10} products)
For each product:

### [Product Name] - [Short Tagline]
- Overall Rating: ⭐⭐⭐⭐⭐ X.X/5
- Quick Verdict (3-4 sentences)
- Image placement suggestion

**Key Specifications:**
- Spec 1
- Spec 2
- Spec 3
- Spec 4
- Price: $XXX

**What We Love (5-6 points):**
- Pro 1 (with brief explanation)
- Pro 2
- Pro 3
- Pro 4
- Pro 5

**What Could Be Better (3-4 points):**
- Con 1 (with context)
- Con 2
- Con 3

**Best For:** Specific use case and user profile

**Performance Analysis (80-100 words):**
- Real-world testing results
- Standout features
- Unique selling points
- Comparison to alternatives

**Value Assessment (50-60 words):**
- Price-to-performance ratio
- Competitor comparison
- Long-term value

**Bottom Line (40-50 words):** Final recommendation with clear guidance

## 7. Head-to-Head Comparisons (500-700 words)
- Premium vs Mid-Range showdown (150-200 words)
- Brand A vs Brand B comparison (150-200 words)
- Feature-specific battles (100-150 words)
- Value champion analysis (100-150 words)

## 8. Buying Considerations (600-800 words)
- How to choose the right one for you
- Size and space requirements
- Budget planning guide with tiers
- Feature priority matrix
- Compatibility checklist
- Future-proofing factors
- Warranty and support considerations
- When to buy (timing advice)

## 9. What to Avoid (400-500 words)
- Red flags in this category
- Overpriced features to skip
- Common marketing traps
- Brands to be cautious of
- Features that don't justify cost
- Deal-breakers explained
- Signs of quality issues

## 10. Price & Value Analysis (400-500 words)
- Price range breakdown (budget/mid/premium)
- Best deals currently available
- Seasonal pricing patterns
- When to buy for best prices
- Refurbished vs new considerations
- Total cost of ownership
- Value picks at each price point

## 11. Alternative & Runner-Up Products (300-400 words)
- Honorable mentions (4-5 products)
- Why they didn't make the main list
- Specific scenarios where they excel
- Emerging products to watch
- Upcoming releases to consider

## 12. FAQ Section (${configuration.faqCount || 20} questions, 500-700 words)
Address:
- Product comparison questions
- Feature explanations
- Price and value queries
- Durability and longevity
- Compatibility concerns
- Maintenance questions
- Best for specific use cases
Each with comprehensive answers (60-100 words)

## 13. Expert Shopping Tips (400-500 words)
- Where to buy (online vs retail pros/cons)
- Best time of year to purchase
- How to spot fake reviews
- Extended warranty worth it?
- Negotiation strategies
- Bundle deals analysis
- Return policy insights
- Price tracking tools

## 14. Final Recommendations (400-500 words)
- Overall winner restated with detailed justification
- Best for different budgets (3 tiers with explanations)
- Best for specific use cases (4-5 scenarios)
- Future outlook for category
- Clear call-to-action
- Last updated date

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, naturally throughout
- Secondary keywords distributed (10-15 instances)
- Internal linking opportunities (8-12)
- Header hierarchy optimized
- Schema markup for ${configuration.schemaType}
- Image alt text suggestions (descriptive + keyword)
- Featured snippet optimization

WRITING STYLE:
- ${configuration.tone} and helpful
- ${configuration.readingLevel} reading level
- Active voice (80%+)
- Short paragraphs (2-4 sentences)
- Scannable with bullet points
- Data-driven where possible
- Unbiased and balanced

ENGAGEMENT ELEMENTS:
- ${configuration.ctaCount} strategic CTAs
- Summary boxes for each product
- Winner badges/icons suggestions
- Comparison highlights
- Price alerts/deals callouts
- Expert tips highlighted

REMEMBER: Your article MUST be at least ${minimumRequired} words. Every product review should be detailed. Do not summarize or condense.

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
    console.error("Error in generate-product-roundup:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
