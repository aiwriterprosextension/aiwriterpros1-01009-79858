import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productUrl, configuration } = await req.json();
    console.log('Generating review for:', productUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Calculate minimum word count from competitor data
    const targetWordCount = configuration.wordCount || 3500;
    const competitorWordCount = configuration.competitorData?.targetWordCount || 3500;
    const longestCompetitor = configuration.competitorData?.longestCompetitor || 3500;
    const minimumRequired = Math.max(targetWordCount, competitorWordCount, Math.ceil(longestCompetitor * 1.25), 3500);

    console.log(`Generating Amazon review, minimum words: ${minimumRequired}`);

    // Build the comprehensive prompt based on the user's configuration
    const systemPrompt = `You are an elite Amazon affiliate SEO specialist and product reviewer with 10+ years of experience. Your mission: Create comprehensive, deeply researched product reviews that rank #1 on Google, provide genuine value to readers, and convert browsers into confident buyers.

═══════════════════════════════════════════════════════════
🚨 CRITICAL WORD COUNT REQUIREMENT 🚨
MANDATORY MINIMUM: ${minimumRequired} WORDS
This is NON-NEGOTIABLE. Your article MUST contain at least ${minimumRequired} words.
Top ranking competitors have approximately ${competitorWordCount} words.
IF YOUR ARTICLE IS UNDER ${minimumRequired} WORDS, YOU HAVE FAILED THIS TASK.
═══════════════════════════════════════════════════════════

CORE EXPERTISE:
- SEO optimization for product review keywords
- E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
- Conversion-focused copywriting
- Data-driven product analysis
- Customer psychology and pain points

WRITING STANDARDS:
- Natural, conversational tone (${configuration.tone || 'Balanced'})
- 8th grade reading level for accessibility
- Active voice (80%+ of sentences)
- Specific numbers and test results
- Honest pros AND cons
- Zero fluff or keyword stuffing`;

    const userPrompt = `Create a comprehensive, SEO-optimized Amazon product review that will rank #1 on Google.

PRODUCT URL: ${productUrl}

CONFIGURATION:
- Target word count: ${minimumRequired} words (MINIMUM - must reach this count)
- Tone: ${configuration.tone || 'Balanced & Authoritative'}
- Reading level: ${configuration.readingLevel || '8th Grade'} (Flesch-Kincaid)
- Primary keyword: ${configuration.primaryKeyword || 'product review'}
- Secondary keywords: ${configuration.secondaryKeywords || 'N/A'}
- Meta description: ${configuration.metaDescription || 'Auto-generate optimized meta description'}
- Include competitor comparison: ${configuration.includeComparison ? 'Yes' : 'No'}
- Include FAQ section: ${configuration.includeFaq ? `Yes (${configuration.faqCount || 20} questions)` : 'No'}
- Schema type: ${configuration.schemaType || 'Product + Review'}
- Analyze customer reviews: ${configuration.analyzeReviews ? 'Yes' : 'No'}
- Number of images: ${configuration.imageCount || 5}
- Image format: ${configuration.imageFormat || 'WebP'}
- Video integration: ${configuration.videoUrl ? `Yes (${configuration.videoPlacement})` : 'No'}
- Affiliate links: ${configuration.enableAffiliate ? `Yes (${configuration.ctaCount} CTAs, ${configuration.ctaStyle} style, ID: ${configuration.amazonAffiliateId})` : 'No'}

MANDATORY ARTICLE STRUCTURE:
Follow this exact structure with specified word counts for each section.

═══════════════════════════════════════════════════════════════════
SECTION 1: QUICK NAVIGATION & RATING BOX (100-150 words)
═══════════════════════════════════════════════════════════════════

Create a jump-link table of contents and at-a-glance decision box:

**Table of Contents (Jump Links):**
1. Product Overview & Key Specifications
2. Who Should (and Shouldn't) Buy This
3. Unboxing & First Impressions
4. Features & Performance Deep-Dive
5. Real-World Use Cases & Testing
6. Pros & Cons Analysis
7. Comparison with Top Alternatives
8. Price Analysis & Value Assessment
9. Customer Reviews Summary
10. Maintenance & Care Guide
11. FAQ - Your Questions Answered
12. Final Verdict & Recommendation

**At-A-Glance Rating Box:**
| Criteria | Rating/Info |
|----------|-------------|
| Overall Rating | ⭐ X.X/5.0 Stars |
| Price Range | $XXX - $XXX |
| Best For | [3 specific buyer types] |
| Standout Feature | [One key differentiator] |
| Quick Verdict | [1 sentence summary] |
| Top Alternative | [If this doesn't fit] |

═══════════════════════════════════════════════════════════════════
SECTION 2: INTRODUCTION (300-400 words)
═══════════════════════════════════════════════════════════════════

**Opening Hook:** Start with a relatable problem or pain point that this product solves.

**Credibility Statement:** "We tested the [Product Name] for [X weeks/months] in real-world conditions to bring you this comprehensive, unbiased review."

**What Makes This Review Different:**
- Hands-on testing with specific metrics
- Honest pros and cons (not a sales pitch)
- Comparison with [X] alternatives we also tested
- Real customer feedback analysis

**Primary Keyword Integration:** Include "${configuration.primaryKeyword || 'product review'}" naturally in first 100 words.

**Preview Key Findings:** Tease 2-3 major discoveries without spoiling the full analysis.

═══════════════════════════════════════════════════════════════════
SECTION 3: PRODUCT OVERVIEW & KEY SPECIFICATIONS (400-500 words)
═══════════════════════════════════════════════════════════════════

**Product Positioning:** What is this product? Who makes it? What market segment does it target?

**Key Specifications Table:**
Create a detailed table with 10-15 core specs:
- Model number/name
- Dimensions and weight
- Key technical specs
- Materials/build quality
- Warranty information
- Available colors/variants
- Power/battery specs (if applicable)

**What's In The Box:**
List everything included with detailed descriptions.

**Model Variations:**
Explain different models/versions if applicable.

**Brief Manufacturer Background:**
Company reputation, product line context, notable innovations.

═══════════════════════════════════════════════════════════════════
SECTION 4: WHO SHOULD (AND SHOULDN'T) BUY THIS (350-400 words)
═══════════════════════════════════════════════════════════════════

**✅ Perfect For:**
1. [Specific user profile with details] - Why it's ideal
2. [Another user type] - Key benefits for them
3. [Third user scenario] - Specific advantages
4. [Fourth profile] - How it solves their problem
5. [Fifth scenario] - Unique fit reasons

**❌ Not Ideal For:**
1. [Scenario where it falls short] - Better alternatives
2. [User type that should avoid] - Specific reasons why
3. [Situation where it's overkill/insufficient] - What to consider instead
4. [Use case it doesn't handle well] - Limitations explained

**Key Decision Factors:**
- Budget consideration: Value at this price point
- Primary use case: Best applications
- Experience level: Technical skill required
- Long-term needs: Scalability and future-proofing

═══════════════════════════════════════════════════════════════════
SECTION 5: UNBOXING & FIRST IMPRESSIONS (350-400 words)
═══════════════════════════════════════════════════════════════════

**Packaging Quality:**
- Retail vs. Amazon packaging
- Protection during shipping
- Presentation and unboxing experience
- Environmental considerations

**Initial Build Quality Assessment:**
- Materials and construction
- Fit and finish
- Quality compared to price point
- First impression vs. specifications

**Setup/Assembly Process:**
- Time required: [X minutes]
- Difficulty level: [Easy/Moderate/Complex]
- Instructions clarity
- Tools required
- Common setup challenges

**Out-of-Box Functionality:**
- Charge level (if applicable)
- Pre-configuration
- Initial power-on experience
- Time to first use

═══════════════════════════════════════════════════════════════════
SECTION 6: FEATURES & PERFORMANCE DEEP-DIVE (2000-2500 words)
═══════════════════════════════════════════════════════════════════

Identify 5-7 major features. For EACH feature, create a comprehensive analysis:

### [Feature Name]: [Descriptive Subtitle]

**What It Does (50-75 words):**
Clear, jargon-free explanation of the feature's purpose and function.

**How It Works (50-75 words):**
Technical details about the mechanism or technology behind it.

**Real-World Testing Results (150-200 words):**
Specific, measurable performance data:
- Test conditions: [environment, settings, parameters]
- Quantitative results: [speeds, distances, times, weights, temperatures]
- Performance metrics with numbers
- Multiple test scenarios
- Consistency across repeated tests
- Comparison baseline (control group or standard)

**Testing Data Points:**
- Metric 1: [Specific measurement with units]
- Metric 2: [Another measurement]
- Metric 3: [Additional data point]
- Conditions: [Testing environment details]

**Comparison to Competitors:**
Head-to-head performance vs. [Competitor A] and [Competitor B]
- Where this product wins: [Specific advantages with percentages]
- Where competitors edge ahead: [Honest assessment]

**Strengths:**
• [Specific advantage with supporting data]
• [Another strength with example]
• [Third benefit with user scenario]

**Limitations:**
• [Honest limitation with context]
• [Another constraint with workaround if available]

**User Feedback on This Feature:**
"[Specific customer quote from Amazon reviews]" - [Verified Purchase designation]

**Best Use Cases for This Feature:**
1. [Specific scenario where it excels]
2. [Another ideal application]

[REPEAT THIS STRUCTURE FOR EACH OF THE 5-7 MAJOR FEATURES]

═══════════════════════════════════════════════════════════════════
SECTION 7: REAL-WORLD USE CASES & TESTING (600-700 words)
═══════════════════════════════════════════════════════════════════

Create 5-6 detailed, specific scenarios (100-120 words each):

**Use Case 1: [Scenario Name & User Profile]**
[Detailed user description]: [Name]'s specific situation
**The Challenge:** [Specific problem they faced]
**How This Product Helped:** [Concrete solution with details]
**Results:** [Quantifiable outcomes - time saved, money saved, efficiency gained]
**Real Numbers:** [Distance covered, time reduced, capacity handled, etc.]

[REPEAT FOR 5-6 DIFFERENT USE CASES]

Each scenario must include:
- Specific user profile
- Clear problem statement
- How product solved it
- Measurable results
- Time/money/efficiency gains

═══════════════════════════════════════════════════════════════════
SECTION 8: PROS & CONS ANALYSIS (450-500 words)
═══════════════════════════════════════════════════════════════════

### ✅ The Pros (What We Loved)

**1. [Specific Advantage]** (50-75 words)
Detailed explanation with supporting evidence from testing.

**2. [Second Strength]** (50-75 words)
How this benefits users with specific examples.

**3. [Third Positive]** (50-75 words)
Why this matters and who benefits most.

[Continue for 6-8 total pros]

### ❌ The Cons (Areas for Improvement)

**1. [Honest Limitation]** (40-60 words)
Fair assessment with context about impact on different users.

**2. [Second Drawback]** (40-60 words)
When this matters and potential workarounds.

**3. [Third Constraint]** (40-60 words)
Who this affects most and alternative solutions if available.

[Continue for 5-6 total cons]

**Overall Balance:** [1-2 sentences on whether pros outweigh cons for target users]

═══════════════════════════════════════════════════════════════════
SECTION 9: COMPARISON WITH TOP ALTERNATIVES (900-1000 words)
═══════════════════════════════════════════════════════════════════

**Detailed Comparison Table:**
| Feature | [This Product] | [Competitor A] | [Competitor B] | [Competitor C] |
|---------|---------------|----------------|----------------|----------------|
| Price | $XXX | $XXX | $XXX | $XXX |
| [Key Spec 1] | [Value] | [Value] | [Value] | [Value] |
| [Key Spec 2] | [Value] | [Value] | [Value] | [Value] |
[10-12 feature rows total]
| Overall Rating | X.X/5 | X.X/5 | X.X/5 | X.X/5 |
| Best For | [User type] | [User type] | [User type] | [User type] |

**Head-to-Head Analysis:**

### vs. [Competitor A Name] (200-250 words)
**Where [This Product] Wins:**
• [Specific advantage with data]
• [Another win with example]
• [Third benefit]

**Where [Competitor A] Wins:**
• [Honest assessment of competitor strength]
• [Another area they excel]
• [Third advantage they have]

**Price Difference Justification:**
[Is the price difference worth it? For whom?]

**Who Should Choose Which:**
- Choose [This Product] if: [Specific scenarios]
- Choose [Competitor A] if: [Different scenarios]

[REPEAT FOR EACH COMPETITOR]

═══════════════════════════════════════════════════════════════════
SECTION 10: PRICE ANALYSIS & VALUE ASSESSMENT (400-500 words)
═══════════════════════════════════════════════════════════════════

**Current Pricing:**
- MSRP: $XXX
- Typical street price: $XXX
- Current Amazon price: $XXX
- Sale price range: $XXX - $XXX

**Historical Price Trends:**
- Launch price: $XXX
- Average price over last 12 months
- Seasonal fluctuations
- Best time to buy

**Value Analysis:**

**vs. Entry-Level Alternatives ($XXX less):**
What you sacrifice at lower price points.

**vs. Mid-Range Competitors (Similar price):**
How value compares in this price bracket.

**vs. Premium Options ($XXX more):**
Whether premium features justify the cost increase.

**Long-Term Value Considerations:**
- Durability and expected lifespan
- Warranty coverage and terms
- Maintenance costs
- Resale value

**When to Buy:**
- Best seasons for discounts
- Major sale events
- Price drop predictions

═══════════════════════════════════════════════════════════════════
SECTION 11: CUSTOMER REVIEWS SUMMARY (450-500 words)
═══════════════════════════════════════════════════════════════════

**Overall Rating Distribution:**
- 5 Stars: XX% ([number] reviews)
- 4 Stars: XX% ([number] reviews)
- 3 Stars: XX% ([number] reviews)
- 2 Stars: XX% ([number] reviews)
- 1 Star: XX% ([number] reviews)
- **Total Reviews:** [number]

**Common Praise from Verified Buyers:**

1. **[Praise Theme]** (mentioned in XX% of positive reviews)
"[Specific customer quote]" - Verified Purchase

2. **[Second Praise Point]**
"[Another customer quote]" - Verified Purchase

[7 total praise themes with supporting quotes]

**Common Complaints:**

1. **[Complaint Theme]** (mentioned in XX% of critical reviews)
Context: [Is this a universal issue or isolated cases?]
Our take: [Your assessment based on testing]

2. **[Second Complaint]**
[Similar analysis]

[5 total complaint themes with context]

**Verified Buyer Insights:**
- [Key pattern from reviews that aligns with our testing]
- [Another insight that adds perspective]
- [Third observation from customer feedback]

═══════════════════════════════════════════════════════════════════
SECTION 12: MAINTENANCE & CARE GUIDE (350-400 words)
═══════════════════════════════════════════════════════════════════

**Regular Cleaning & Care:**
- Recommended cleaning frequency
- Proper cleaning methods and products
- What to avoid
- Storage recommendations

**Battery/Power Maintenance:** (if applicable)
- Charging best practices
- Battery lifespan optimization
- Storage for long periods

**Component-Specific Care:**
- [Component A]: [Maintenance instructions]
- [Component B]: [Care guidelines]
- [Component C]: [Upkeep recommendations]

**Troubleshooting Common Issues:**

**Issue:** [Common problem]
**Solution:** [Step-by-step fix]

[3-5 common issues with solutions]

**Warranty Information:**
- Warranty period: [X years/months]
- What's covered
- What's not covered
- How to file a claim
- Manufacturer customer service quality

═══════════════════════════════════════════════════════════════════
SECTION 13: FAQ - YOUR QUESTIONS ANSWERED (700-800 words)
═══════════════════════════════════════════════════════════════════

Create 20-25 questions covering these categories:

**Product Specifications (5-7 questions):**

Q: [Specific technical question]?
A: [Concise 2-4 sentence answer with specific details]

**Performance & Usage (6-8 questions):**

Q: [Question about real-world performance]?
A: [Answer with testing data and specific examples]

**Maintenance & Safety (4-5 questions):**

Q: [Care or safety question]?
A: [Practical answer with recommendations]

**Purchasing & Warranty (3-4 questions):**

Q: [Buying or warranty question]?
A: [Clear answer with useful information]

[Target "People Also Ask" queries from Google]
[Use natural question phrasing]
[Answers must be direct and complete]
[Include long-tail keyword variations]

═══════════════════════════════════════════════════════════════════
SECTION 14: FINAL VERDICT & RECOMMENDATION (400-450 words)
═══════════════════════════════════════════════════════════════════

### Overall Rating: ★★★★☆ X.X/5.0 Stars

**Rating Breakdown:**
- Build Quality: X.X/5
- Performance: X.X/5
- Features: X.X/5
- Value: X.X/5
- User Experience: X.X/5

### Who Should Buy This Product

**Ideal Buyers:**
1. [Specific buyer profile] - This product will [specific benefit]
2. [Second profile] - Perfect for [use case]
3. [Third profile] - Solves [specific problem]
4. [Fourth profile] - Best option for [scenario]

### Who Should Consider Alternatives

**Better Options Exist For:**
1. [Scenario] - Consider [Alternative Product] instead
2. [User type] - [Different Product] might be better because [reason]
3. [Situation] - [Another Option] offers [specific advantage]

### The Bottom Line

**Key Strengths Recap:**
• [Top strength]
• [Second major positive]
• [Third key advantage]

**Main Limitations:**
• [Most significant drawback]
• [Secondary concern]

**Final Recommendation:**
[2-3 sentences with clear, honest recommendation about who will love this product and who won't]

**Our Verdict in One Sentence:**
[Concise summary of whether it's worth buying and for whom]

═══════════════════════════════════════════════════════════════════
CRITICAL WRITING REQUIREMENTS:
═══════════════════════════════════════════════════════════════════

1. **Word Count:** Hit ${configuration.wordCount || 3000} words ±5% (${Math.floor((configuration.wordCount || 3000) * 0.95)}-${Math.floor((configuration.wordCount || 3000) * 1.05)} words)

2. **SEO Optimization:**
   - Primary keyword "${configuration.primaryKeyword || 'product review'}" in: H1, first 100 words, 3+ H2 headings, conclusion
   - Keyword density: 0.8-1.2%
   - Natural keyword variations throughout
   - LSI keywords related to product category

3. **Readability:**
   - 8th grade Flesch-Kincaid level
   - Average sentence length: 15-20 words
   - Paragraph length: 3-5 sentences maximum
   - Active voice: 80%+ of sentences
   - Transition words for flow

4. **Evidence & Credibility:**
   - Include specific test results with numbers
   - Reference actual testing conditions
   - Use customer quotes from reviews
   - Cite measurable baselines
   - Acknowledge limitations honestly

5. **Formatting:**
   - Use bullet points for 3+ item lists
   - Bold key specifications and numbers
   - Tables for comparison data
   - Clear heading hierarchy (H2, H3, H4)
   - Short paragraphs with white space

6. **E-E-A-T Signals:**
   - Mention testing methodology
   - Include specific measurements
   - Reference hands-on experience
   - Compare to actual alternatives tested
   - Use current year (2025) in references

Generate the complete ${configuration.wordCount || 3000}-word article now following this exact structure.`;

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Article generated successfully');

    // Generate schema markup if requested
    let schemaMarkup = null;
    if (configuration.includeSchema) {
      schemaMarkup = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": "[Product Name]",
            "description": "[Product Description]",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.6",
              "reviewCount": "8247"
            }
          },
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5"
            },
            "author": {
              "@type": "Person",
              "name": "AIWriterPros"
            }
          }
        ]
      };
    }

    return new Response(JSON.stringify({ 
      content: generatedContent,
      schema: schemaMarkup,
      wordCount: generatedContent.split(/\s+/).length,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-amazon-review function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate review' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
