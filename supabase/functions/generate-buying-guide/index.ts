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

• Introduction & Overview: 500-700 words
• Each Major Section: 400-600 words per section  
• Buying Guide/Criteria Section: 600-900 words
• Product Reviews/Recommendations: 500-800 words per product
• FAQ Section: 500-800 words (15-25 questions)
• Conclusion & Final Thoughts: 400-500 words

══ MANDATORY EXPANSION STRATEGIES ══

✓ Detailed real-world examples and specific use cases
✓ Expert tips and insider knowledge for every major point
✓ Explain the WHY behind recommendations, not just WHAT
✓ Comprehensive comparison tables WITH detailed explanations
✓ Multiple user scenarios and personas
✓ Technical specifications with context and real-world implications
✓ Troubleshooting tips and common problem solutions
✓ Historical context or market trend analysis
✓ Step-by-step guides where relevant
✓ Detailed pros AND cons for every option discussed

══ FORBIDDEN ACTIONS ══

❌ DO NOT summarize or condense information
❌ DO NOT skip sections or rush through topics
❌ DO NOT use brief, surface-level descriptions
❌ DO NOT end the article prematurely
❌ DO NOT use placeholder text or generic filler

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

    console.log(`Generating buying guide for: ${topic}, minimum words: ${minimumRequired}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert buying guide writer specializing in comprehensive, SEO-optimized product guides. You create authoritative content that helps buyers make informed decisions across all budget levels.

${wordCountEnforcement}`;

    const userPrompt = `Create a comprehensive buying guide about: ${topic}

CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM - do not write less than this)
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
- Meta Description (150-160 chars): Compelling summary with primary keyword
- URL Slug: SEO-friendly, keyword-rich

## 2. Executive Summary (300-400 words)
- Quick overview of the guide
- Who this guide is for
- Key takeaways and recommendations
- Article navigation preview
- Why trust this guide

## 3. Quick Reference Table
- Top 3 picks (Budget/Mid-Range/Premium)
- Key specs comparison
- Price ranges
- Best for scenarios
- Overall ratings

## 4. Understanding [Product Category] (500-700 words)
- What is it and why it matters
- Types and categories explained
- Common use cases
- Industry overview and trends
- How technology has evolved
- Future outlook

## 5. Key Features to Consider (700-900 words)
- Essential specifications explained
- Feature priority matrix
- How features impact performance
- Must-have vs nice-to-have features
- Technical terms demystified
- What to prioritize based on use case

## 6. Budget Breakdown (400-500 words)
- Entry-level ($): What to expect and who it's for
- Mid-range ($$): Sweet spot analysis and value proposition
- Premium ($$$): Professional/enthusiast tier benefits
- Value proposition for each tier
- When to upgrade and when to save

## 7. Top Product Recommendations (1500-2000 words)
For each of ${configuration.productCount || 10} recommended products:
- Product name and brief intro (50 words)
- Key specifications (bullet list)
- Pros and cons (5-6 each)
- Best for (specific use case)
- Price range and value assessment
- Where to buy
- Star rating and recommendation strength
- Expert verdict (100 words)

## 8. Detailed Comparison Table
- Side-by-side specs for all products
- Performance metrics
- Price comparison
- Value scores
- Winner by category
- Quick decision guide

## 9. Buying Factors Deep Dive (600-800 words)
- Size and portability considerations
- Compatibility requirements
- Brand reliability and warranty
- Customer service reputation
- Long-term cost of ownership
- Maintenance requirements
- Resale value considerations

## 10. Common Mistakes to Avoid (400-500 words)
- Overspending on unnecessary features
- Ignoring compatibility
- Falling for marketing hype
- Not considering long-term needs
- Skipping warranty coverage
- Buying outdated models
- Ignoring user reviews

## 11. Expert Tips & Tricks (400-500 words)
- Shopping strategies (when to buy)
- How to spot deals vs. traps
- Negotiation tactics
- Extended warranty considerations
- Return policy insights
- Setup and optimization tips
- Maintenance best practices

## 12. FAQ Section (${configuration.faqCount || 20} questions, 600-800 words)
Address:
- Common pre-purchase questions
- Technical clarifications
- Comparison queries
- Maintenance and longevity
- Value and pricing concerns
- Compatibility questions
- Setup and installation
Each with detailed, helpful answers (50-100 words)

## 13. Future-Proofing & Trends (300-400 words)
- Emerging technologies
- What's coming next year
- Should you wait or buy now?
- Upgrade path considerations
- Industry predictions

## 14. Final Verdict & Recommendations (400-500 words)
- Overall category winner with justification
- Best for specific budgets (detailed)
- Best for specific use cases (detailed)
- Editor's personal pick with reasoning
- Clear call-to-action
- Final thoughts and summary

SEO REQUIREMENTS:
- Primary keyword in H1, first paragraph, and naturally throughout
- Secondary keywords distributed naturally (10-15 instances)
- Internal linking opportunities highlighted
- Header hierarchy (H1 > H2 > H3 > H4)
- Schema markup structure for ${configuration.schemaType}
- Image alt text suggestions
- Meta title under 60 characters
- Featured snippet optimization

WRITING STYLE:
- ${configuration.tone} and authoritative
- ${configuration.readingLevel} reading level
- Active voice preferred (80%+)
- Short paragraphs (2-4 sentences)
- Bullet points for scannability
- Data and statistics where relevant
- Conversational yet professional

ENGAGEMENT ELEMENTS:
- ${configuration.ctaCount} strategic CTAs throughout
- Pro tips and expert insights highlighted
- Warning boxes for critical information
- Comparison highlights
- Money-saving tips emphasized
- Summary boxes for each major section

REMEMBER: Your article MUST be at least ${minimumRequired} words. Every section should be thorough and detailed. Do not summarize or condense.

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
    console.error("Error in generate-buying-guide:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
