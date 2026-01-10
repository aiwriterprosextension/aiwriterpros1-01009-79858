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

• Introduction & Overview: 300-400 words
• What You'll Need: 200-300 words
• Before You Begin: 300-400 words
• Step-by-Step Instructions: 1500-2000 words (150-200 per step)
• Verification & Quality Check: 300-400 words
• Troubleshooting Guide: 500-700 words
• Advanced Tips & Variations: 400-500 words
• Common Mistakes: 400-500 words
• FAQ Section: 500-700 words (15-20 questions)
• Conclusion & Next Steps: 300-400 words

══ MANDATORY EXPANSION STRATEGIES ══

✓ Detailed step-by-step explanations with reasoning
✓ Pro tips for each major step
✓ Common mistakes and how to avoid them
✓ Time estimates and difficulty indicators
✓ Alternative methods and variations
✓ Troubleshooting for each step
✓ Visual description suggestions

══ FORBIDDEN ACTIONS ══

❌ DO NOT summarize or condense steps
❌ DO NOT skip troubleshooting section
❌ DO NOT use brief instructions without context
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

    console.log(`Generating how-to article for: ${topic}, minimum words: ${minimumRequired}`);

    const wordCountEnforcement = generateWordCountEnforcement(minimumRequired, competitorWordCount);

    const systemPrompt = `You are an expert tutorial writer specializing in clear, actionable how-to guides. You create comprehensive, SEO-optimized instructional content that helps readers accomplish specific tasks successfully.

${wordCountEnforcement}`;

    const userPrompt = `Create a comprehensive how-to article about: ${topic}

CONFIGURATION:
- Target Word Count: ${minimumRequired} words (MINIMUM - do not write less than this)
- Tone: ${configuration.tone}
- Reading Level: ${configuration.readingLevel}
- Primary Keyword: ${configuration.primaryKeyword || 'auto-detect'}
- Secondary Keywords: ${configuration.secondaryKeywords || 'auto-detect'}
- Meta Description: ${configuration.metaDescription || 'auto-generate'}
- Difficulty Level: ${configuration.difficulty || 'Beginner to Intermediate'}
- Number of Steps: ${configuration.stepCount || '10-15'}
- Schema Type: ${configuration.schemaType}
- Include Troubleshooting: ${configuration.includeTroubleshooting !== false}
- FAQ Count: ${configuration.faqCount || 20}
- Image Guidelines: ${configuration.imageCount} images in ${configuration.imageFormat} format

STRUCTURE (14 Comprehensive Sections):

## 1. Title & Meta
- H1: "How to [Task]: Complete Step-by-Step Guide [Year]"
- Meta Description (150-160 chars): Action-oriented with primary keyword
- URL Slug: how-to-[task-description]

## 2. Introduction & Overview (300-400 words)
- What you'll learn (5-7 key outcomes)
- Why this matters/benefits (detailed)
- Who this guide is for (specific personas)
- Difficulty level and time required
- Final outcome preview with expectations
- Prerequisites check
- Quick success indicators

## 3. What You'll Need (200-300 words)
**Required Materials/Tools:**
- Item 1 (with specs, alternatives, and where to get it)
- Item 2
- Item 3
- Item 4

**Optional But Helpful:**
- Item A (why it helps)
- Item B (when to consider)

**Skills/Knowledge Required:**
- Prerequisite 1 (with learning resources)
- Prerequisite 2

**Estimated Time:** X hours/minutes (breakdown by section)
**Difficulty:** Beginner/Intermediate/Advanced (with explanation)
**Cost:** Estimated budget range

## 4. Before You Begin (300-400 words)
- Safety precautions and warnings (detailed)
- Workspace preparation checklist
- Important things to know (5-7 points)
- Common pitfalls to avoid
- When to seek professional help
- Legal/warranty considerations if applicable
- Preparation timeline
- Mental preparation and expectations

## 5. Quick Reference Summary
- TL;DR version (7-10 bullet points)
- Key steps at a glance
- Critical success factors (5-6 points)
- Estimated completion time breakdown
- Checkpoints for progress

## 6. Step-by-Step Instructions (1500-2000 words total)

For each of ${configuration.stepCount || '10-15'} steps (150-200 words each):

### Step [X]: [Action Title]
**Time Required:** X minutes
**Difficulty:** Easy/Medium/Hard
**Tools Needed:** List specific tools for this step

[Detailed 80-100 word paragraph explaining what to do and why, with context and reasoning]

**How to do it:**
1. Specific action 1 (with detail)
2. Specific action 2 (with detail)
3. Specific action 3 (with detail)
4. Specific action 4 (with detail)

**Pro Tips:**
- Expert insight 1 (with reasoning)
- Expert insight 2 (with benefit)

**Common Mistakes at This Step:**
- What to avoid and why
- How to fix if you make the mistake

**You'll know you're done when:** Success indicator (specific and measurable)

**Image suggestion:** [Detailed description of helpful visual]

**Checkpoint:** What you should have completed before moving on

## 7. Verification & Quality Check (300-400 words)
- How to verify you did it correctly (step by step)
- Quality checkpoints (10+ items)
- Testing procedures (detailed)
- What success looks like (specific indicators)
- Signs something went wrong (5-7 warning signs)
- How to measure results
- Before and after comparison guide

## 8. Troubleshooting Guide (500-700 words)

**Problem 1:** [Common Issue]
- **Symptoms:** What you'll notice (detailed)
- **Likely Causes:** Why it happens (3-4 reasons)
- **Solutions:** How to fix it (step by step)
- **Prevention:** How to avoid it next time

**Problem 2:** [Another Issue]
[Same format - 80-100 words]

**Problem 3:** [Third Issue]
[Same format]

**Problem 4:** [Fourth Issue]
[Same format]

**Problem 5:** [Fifth Issue]
[Same format]

[Include 6-8 common problems total]

**Still Having Issues?**
- When to start over (specific criteria)
- Expert help resources (where to find)
- Community forums/support (links)
- Professional services (when needed)

## 9. Advanced Tips & Variations (400-500 words)
- Professional-level techniques (4-5 tips)
- Time-saving shortcuts (3-4 methods)
- Alternative methods (2-3 options)
- Customization options
- How to adapt for different scenarios
- Scaling up or down
- Advanced optimizations
- Expert secrets

## 10. Common Mistakes & How to Avoid Them (400-500 words)

**Mistake 1:** [Description]
- Why people make this error
- Consequences
- How to avoid it
- How to fix if you've already made it

[Repeat for 6-8 common mistakes, 50-70 words each]

## 11. Maintenance & Longevity (250-350 words)
- How to maintain results
- Upkeep schedule (timeline)
- When to redo/refresh
- Long-term care tips
- Extending lifespan
- When replacement is needed
- Signs of wear or degradation

## 12. Cost Breakdown & Budgeting (250-350 words)
- Total cost estimate (breakdown by item)
- Budget-friendly alternatives
- Where to save money (with recommendations)
- Where NOT to cheap out (with reasoning)
- DIY vs professional cost comparison
- Hidden costs to consider
- Investment vs expense analysis

## 13. FAQ Section (${configuration.faqCount || 20} questions, 500-700 words)
Address:
- "How long does this take?"
- "Is this suitable for beginners?"
- "What if I don't have [tool/material]?"
- "Can I do this without [something]?"
- "How much does this cost?"
- "What's the hardest part?"
- "What if I make a mistake?"
- "Do I need help from someone else?"
- Process questions
- Troubleshooting questions
Each with detailed answers (60-100 words)

## 14. Conclusion & Next Steps (300-400 words)
- Recap of what was accomplished
- Benefits of following this guide
- What to do next (specific actions)
- Related skills to learn (with resources)
- Upgrades and improvements
- Share your results (social CTA)
- Questions? (community engagement)
- Encouragement and next steps

SEO REQUIREMENTS:
- Primary keyword in H1, first 100 words, H2s where natural
- Secondary keywords distributed naturally (10-15 instances)
- Action words and power verbs throughout
- Header hierarchy (H1 > H2 > H3 > H4)
- Schema markup for ${configuration.schemaType} (HowTo structured data)
- Image suggestions with descriptive alt text
- Featured snippet optimization (numbered steps)

WRITING STYLE:
- ${configuration.tone} and encouraging
- ${configuration.readingLevel} reading level
- Second person ("you") throughout
- Active voice and imperative mood
- Clear, concise instructions
- One action per numbered step
- Short sentences (10-15 words average)
- White space and formatting for scannability

ENGAGEMENT ELEMENTS:
- ${configuration.ctaCount} strategic CTAs
- Encouragement after difficult steps
- Progress indicators
- Safety warnings highlighted
- Pro tips in callout boxes
- Before/after comparisons
- Success stories if relevant

REMEMBER: Your article MUST be at least ${minimumRequired} words. Every step should be detailed and helpful. Do not summarize or condense.

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
    console.error("Error in generate-how-to-article:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
