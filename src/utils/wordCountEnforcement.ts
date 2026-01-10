// Shared word count enforcement prompt generator for article generation functions
export const generateWordCountEnforcement = (
  minimumRequired: number,
  competitorWordCount: number
): string => {
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

Minimum word counts per section (MUST MEET OR EXCEED):

• Introduction & Overview: 500-700 words
  - Hook and engagement
  - Problem statement
  - What readers will learn
  - Brief preview of recommendations

• Each Major Product/Section: 400-600 words per product
  - Detailed features and specifications
  - Real-world use cases and scenarios
  - Pros and cons analysis
  - Who it's best for
  - Price and value assessment

• Buying Guide/Criteria Section: 600-900 words
  - Key features to consider
  - How to evaluate options
  - Common mistakes to avoid
  - Budget considerations
  - Expert tips

• Comparison/Analysis Sections: 500-700 words
  - Side-by-side comparisons
  - Performance metrics
  - Value propositions
  - Situational recommendations

• FAQ Section: 500-800 words (15-25 questions)
  - Comprehensive Q&A coverage
  - Address common concerns
  - Technical questions
  - Buying process questions

• Conclusion & Final Thoughts: 400-500 words
  - Summary of top recommendations
  - Final buying advice
  - Call to action
  - Future outlook

══ MANDATORY EXPANSION STRATEGIES ══

To reach ${minimumRequired} words, you MUST include:

✓ Detailed real-world examples and specific use cases
✓ Expert tips and insider knowledge for every major point
✓ Explain the WHY behind recommendations, not just WHAT
✓ Add comprehensive comparison tables WITH detailed explanations
✓ Include multiple user scenarios and personas
✓ Expand technical specifications with context and real-world implications
✓ Add troubleshooting tips and common problem solutions
✓ Provide historical context or market trend analysis
✓ Include step-by-step guides where relevant
✓ Add detailed pros AND cons for every option discussed
✓ Incorporate data, statistics, and research findings
✓ Include alternative options and edge cases
✓ Add "did you know" insights and interesting facts
✓ Include warranty, support, and maintenance information
✓ Discuss long-term value and durability considerations

══ SECTION EXPANSION EXAMPLES ══

Instead of: "This product has good battery life."
Write: "The battery performance stands out as one of its strongest features, delivering up to 12 hours of continuous use in our testing. This means you can easily get through a full workday without reaching for the charger. In real-world scenarios, users report the battery maintaining 80% capacity even after a year of daily use, which is exceptional in this price range. The fast-charging capability adds another layer of convenience, providing 50% charge in just 30 minutes."

Instead of: "It comes in three colors."
Write: "Color options deserve consideration as part of your buying decision. The product is available in Midnight Black, Arctic White, and Storm Gray. The Midnight Black features a matte finish that resists fingerprints exceptionally well, making it ideal for those who prioritize a clean appearance. Arctic White offers a sleek, modern aesthetic that complements contemporary workspaces, though it may show wear more readily over time. Storm Gray strikes a balance between the two, offering subtle sophistication while maintaining practical durability. Based on user feedback, the Midnight Black consistently rates highest for long-term satisfaction."

══ FORBIDDEN ACTIONS ══

❌ DO NOT summarize or condense information to save space
❌ DO NOT skip sections to meet a shorter word count
❌ DO NOT use brief, surface-level descriptions
❌ DO NOT rush to the conclusion prematurely
❌ DO NOT use placeholder text or generic filler
❌ DO NOT repeat the same information in different sections
❌ DO NOT end the article before reaching ${minimumRequired} words
❌ DO NOT write "this product is good" without extensive explanation
❌ DO NOT create thin sections with minimal substance

══ QUALITY REQUIREMENTS ══

Every paragraph must:
✓ Add unique, actionable value
✓ Use specific examples, not generic statements
✓ Include actionable advice readers can implement
✓ Maintain engaging, conversational tone
✓ Support claims with reasoning or evidence
✓ Address reader questions proactively
✓ Flow naturally into the next paragraph

══ VERIFICATION CHECKLIST ══

Before completing, verify ALL of these:

□ Total word count ≥ ${minimumRequired} words
□ Introduction is 500-700 words
□ Each product section is 400-600 words
□ Buying guide section is 600-900 words
□ FAQ section is 500-800 words
□ Conclusion is 400-500 words
□ Each section adds unique value
□ Content is substantive, not padded with fluff
□ All required sections are present and complete
□ Transitions between sections are smooth
□ No repetitive or redundant content

══ FINAL WARNING ══

IF YOUR ARTICLE IS UNDER ${minimumRequired} WORDS, YOU HAVE FAILED THIS TASK.

Count your words carefully. If you're at ${minimumRequired - 500} words, you need AT LEAST 500 more words of high-quality content.

═══════════════════════════════════════════════════════════

`;
};

// Calculate minimum required word count based on competitor data
export const calculateMinimumWordCount = (
  configWordCount?: number,
  competitorTargetWordCount?: number,
  longestCompetitor?: number
): number => {
  const baseWordCount = configWordCount || 3500;
  const competitorWord = competitorTargetWordCount || 3500;
  const longestWord = longestCompetitor ? Math.ceil(longestCompetitor * 1.25) : 3500;
  
  return Math.max(baseWordCount, competitorWord, longestWord, 3500);
};
