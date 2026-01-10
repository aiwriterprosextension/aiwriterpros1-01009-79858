import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompetitorAnalysis {
  url: string;
  title: string;
  wordCount: number;
  headings: string[];
  keyTopics: string[];
}

interface AnalysisResult {
  competitors: CompetitorAnalysis[];
  recommendations: string[];
  contentGaps: string[];
  targetWordCount: number;
  suggestedHeadings: string[];
  longestCompetitor: number;
  shortestCompetitor: number;
  averageCompetitor: number;
  recommendedArticleType: string;
  articleTypeReason: string;
  detailedCompetitors: DetailedCompetitor[];
}

interface DetailedCompetitor {
  position: number;
  estimatedTitle: string;
  estimatedWordCount: number;
  articleType: string;
  headingCount: number;
  keyStrengths: string[];
  weaknesses: string[];
  topicsCovered: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, articleType } = await req.json();

    if (!keyword) {
      throw new Error('Keyword is required');
    }

    console.log(`Analyzing competitors for keyword: ${keyword}, type: ${articleType}`);

    const analysisPrompt = `You are an elite SEO analyst. Analyze the competitive landscape for the keyword: "${keyword}"

Based on extensive SEO knowledge and typical ranking patterns for "${keyword}", provide comprehensive competitive intelligence.

## Task Requirements:

1. **Competitor Analysis (Top 3 Results)**
   For each of the likely top 3 ranking pages, provide realistic estimates:
   - Word count (realistic range: 2,500-5,500 words based on keyword competitiveness)
   - Article format type (amazon-review, buying-guide, product-comparison, product-roundup, how-to-article)
   - Number of H2 headings (8-15 typical for comprehensive content)
   - 3 key strengths they likely have
   - 2-3 weaknesses you could exploit
   - Main topics they cover

2. **Article Type Recommendation**
   - Which article type would BEST rank for this keyword and WHY
   - Explain the search intent (transactional/informational/commercial)

3. **Word Count Strategy** (CRITICAL)
   - Calculate realistic average word count of top 3
   - Identify the longest likely competitor
   - Recommend MINIMUM word count to rank: Math.max(longest_competitor * 1.25, 3500)
   - **ENFORCE ABSOLUTE FLOOR: 3,500 words minimum**

4. **Content Strategy**
   - 10-12 suggested H2 headings that EXCEED competitor coverage
   - 6-8 specific content gaps competitors likely miss
   - 8-10 actionable recommendations to outrank them

## Word Count Guidance by Keyword Type:
- Highly competitive product keywords (e.g., "best laptops"): 4,500-5,500 words
- Moderately competitive (e.g., "best gaming mouse under $50"): 3,500-4,500 words
- Long-tail/specific (e.g., "best wireless mouse for small hands"): 3,000-4,000 words
- Minimum for any keyword: 3,500 words

Respond in this exact JSON format (no markdown, just valid JSON):
{
  "competitors": [
    {
      "position": 1,
      "estimatedTitle": "Best [Product] 2024: Complete Guide",
      "estimatedWordCount": 4500,
      "articleType": "buying-guide",
      "headingCount": 14,
      "keyStrengths": ["Comprehensive product coverage", "Detailed comparisons", "Expert insights"],
      "weaknesses": ["Missing FAQ section", "No video content"],
      "topicsCovered": ["Product reviews", "Buying guide", "Comparisons"]
    },
    {
      "position": 2,
      "estimatedTitle": "Top 10 [Product] Reviews",
      "estimatedWordCount": 3800,
      "articleType": "product-roundup",
      "headingCount": 12,
      "keyStrengths": ["Clear categorization", "Price comparisons"],
      "weaknesses": ["Limited depth per product", "No methodology section"],
      "topicsCovered": ["Product listings", "Brief reviews"]
    },
    {
      "position": 3,
      "estimatedTitle": "[Product] Buying Guide and Reviews",
      "estimatedWordCount": 4200,
      "articleType": "buying-guide",
      "headingCount": 11,
      "keyStrengths": ["Good structure", "Helpful visuals"],
      "weaknesses": ["Missing troubleshooting tips", "No user testimonials"],
      "topicsCovered": ["Buying criteria", "Product recommendations"]
    }
  ],
  "analysis": {
    "averageWordCount": 4167,
    "longestCompetitorWordCount": 4500,
    "shortestCompetitorWordCount": 3800,
    "minimumWordCountToRank": 5625,
    "recommendedArticleType": "buying-guide",
    "articleTypeReason": "Buying guides rank best for commercial intent product keywords requiring detailed comparison and decision support",
    "serpIntent": "commercial"
  },
  "recommendations": [
    "Include comprehensive FAQ section (20+ questions)",
    "Add detailed comparison tables with specifications",
    "Include expert quotes and user testimonials",
    "Create step-by-step buying guide section",
    "Add pros/cons for every product mentioned",
    "Include high-quality images with descriptive alt text",
    "Add 'How we tested' methodology section",
    "Include price comparison and deal alerts",
    "Add troubleshooting and common problems section",
    "Include warranty and return policy guidance"
  ],
  "contentGaps": [
    "Missing long-term durability testing insights",
    "No coverage of common user mistakes to avoid",
    "Missing troubleshooting guide for common issues",
    "No video content or visual demonstrations mentioned",
    "Missing seasonal buying advice or timing tips",
    "No warranty comparison or return policy analysis",
    "Missing alternative use cases or creative applications",
    "No environmental impact or sustainability discussion"
  ],
  "suggestedHeadings": [
    "H2: What is [Product/Topic]? Complete Overview and Why It Matters",
    "H2: Top 10 Best [Products] for 2024: Expert Recommendations",
    "H2: How to Choose the Right [Product]: Complete Buying Guide",
    "H2: Key Features and Specifications to Consider",
    "H2: Detailed Product Reviews and In-Depth Analysis",
    "H2: Price Comparison Guide: Where to Find the Best Deals",
    "H2: Pros and Cons: Complete Breakdown of Each Option",
    "H2: Expert Tips for Getting the Most Value",
    "H2: Common Problems and How to Avoid Them",
    "H2: Frequently Asked Questions (20+ Answers)",
    "H2: Our Testing Methodology and Review Process",
    "H2: Final Verdict and Bottom-Line Recommendations"
  ],
  "keyTopics": ["Product features", "Buying criteria", "Comparisons", "User scenarios", "Expert tips"]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert specializing in competitive analysis. Always respond with valid JSON only, no markdown formatting.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No content received from AI');
    }

    console.log('AI Response received, length:', aiContent.length);

    let analysisData;
    try {
      const cleanContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Provide enhanced fallback data
      analysisData = {
        competitors: [
          {
            position: 1,
            estimatedTitle: `Best ${keyword} - Comprehensive Guide 2024`,
            estimatedWordCount: 4200,
            articleType: articleType || 'buying-guide',
            headingCount: 12,
            keyStrengths: ["Comprehensive coverage", "Detailed comparisons", "Expert insights"],
            weaknesses: ["Could include more testimonials", "Missing video content"],
            topicsCovered: [`${keyword} features`, "Buying guide", "Comparisons"]
          },
          {
            position: 2,
            estimatedTitle: `${keyword} Review and Buying Guide`,
            estimatedWordCount: 3800,
            articleType: 'product-roundup',
            headingCount: 10,
            keyStrengths: ["Clear categorization", "Good structure"],
            weaknesses: ["Limited depth", "No FAQ"],
            topicsCovered: ["Product reviews", "Price analysis"]
          },
          {
            position: 3,
            estimatedTitle: `Complete ${keyword} Guide`,
            estimatedWordCount: 3500,
            articleType: 'buying-guide',
            headingCount: 9,
            keyStrengths: ["Beginner-friendly", "Visual aids"],
            weaknesses: ["Missing advanced tips", "Brief sections"],
            topicsCovered: ["Basics", "Product selection"]
          }
        ],
        analysis: {
          averageWordCount: 3833,
          longestCompetitorWordCount: 4200,
          shortestCompetitorWordCount: 3500,
          minimumWordCountToRank: 5250,
          recommendedArticleType: articleType || 'buying-guide',
          articleTypeReason: "Buying guides perform well for commercial intent product keywords",
          serpIntent: 'commercial'
        },
        keyTopics: [
          `${keyword} features and specifications`,
          `Pros and cons analysis`,
          `Best use cases`,
          `Comparison with alternatives`,
          `Buyer considerations and FAQs`
        ],
        suggestedHeadings: [
          `H2: What is ${keyword}? Complete Overview`,
          `H2: Top ${keyword} Products for 2024`,
          `H2: How to Choose the Right ${keyword}: Buying Guide`,
          `H2: Key Features and Specifications to Consider`,
          `H2: Detailed Product Reviews and Comparisons`,
          `H2: ${keyword} Price Guide and Best Deals`,
          `H2: Pros and Cons: Complete Analysis`,
          `H2: Expert Tips and Recommendations`,
          `H2: Common Problems and Solutions`,
          `H2: Frequently Asked Questions`,
          `H2: Our Testing Methodology`,
          `H2: Final Verdict and Bottom Line`
        ],
        contentGaps: [
          "Long-term durability testing",
          "Real user testimonials",
          "Video demonstrations",
          "Price history tracking",
          "Complementary products",
          "Common mistakes to avoid"
        ],
        recommendations: [
          "Include original product photos",
          "Add structured data markup",
          "Cover specific use cases in depth",
          "Update regularly",
          "Add comparison tables",
          "Include affiliate disclosure",
          "Optimize for featured snippets",
          "Add expert quotes",
          "Include detailed pros/cons",
          "Add comprehensive FAQ (20+ questions)"
        ]
      };
    }

    // Calculate word count metrics
    const competitors = analysisData.competitors || [];
    const wordCounts = competitors.map((c: any) => c.estimatedWordCount || 3500);
    const longestCompetitor = Math.max(...wordCounts, 3500);
    const shortestCompetitor = Math.min(...wordCounts, 3500);
    const averageCompetitor = Math.round(wordCounts.reduce((a: number, b: number) => a + b, 0) / wordCounts.length) || 3500;
    const targetWordCount = Math.max(Math.ceil(longestCompetitor * 1.25), analysisData.analysis?.minimumWordCountToRank || 3500, 3500);

    // Build the response
    const result: AnalysisResult = {
      competitors: competitors.map((comp: any) => ({
        url: `https://competitor-${comp.position}.example.com`,
        title: comp.estimatedTitle || `Top Result ${comp.position}`,
        wordCount: comp.estimatedWordCount || 3500,
        headings: comp.topicsCovered || [],
        keyTopics: comp.topicsCovered || []
      })),
      recommendations: analysisData.recommendations || [],
      contentGaps: analysisData.contentGaps || [],
      targetWordCount: targetWordCount,
      suggestedHeadings: analysisData.suggestedHeadings || [],
      longestCompetitor: longestCompetitor,
      shortestCompetitor: shortestCompetitor,
      averageCompetitor: averageCompetitor,
      recommendedArticleType: analysisData.analysis?.recommendedArticleType || articleType || 'buying-guide',
      articleTypeReason: analysisData.analysis?.articleTypeReason || 'This article type typically performs well for this keyword type',
      detailedCompetitors: competitors.map((comp: any) => ({
        position: comp.position,
        estimatedTitle: comp.estimatedTitle || `Competitor ${comp.position}`,
        estimatedWordCount: comp.estimatedWordCount || 3500,
        articleType: comp.articleType || 'buying-guide',
        headingCount: comp.headingCount || 10,
        keyStrengths: comp.keyStrengths || [],
        weaknesses: comp.weaknesses || [],
        topicsCovered: comp.topicsCovered || []
      }))
    };

    console.log('Analysis complete. Target word count:', result.targetWordCount);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in analyze-competitors function:', errorMessage);
    
    // Return comprehensive fallback data
    return new Response(JSON.stringify({ 
      error: errorMessage,
      competitors: [
        {
          url: "https://competitor-1.example.com",
          title: "Top Competitor Analysis",
          wordCount: 4000,
          headings: ["Overview", "Features", "Reviews"],
          keyTopics: ["Product reviews", "Buying guide"]
        }
      ],
      recommendations: [
        "Focus on comprehensive, in-depth content",
        "Include original insights and analysis",
        "Optimize for user intent and search queries",
        "Add visual elements like images and tables",
        "Structure content with clear headings",
        "Include comprehensive FAQ section (20+ questions)",
        "Add comparison tables for quick reference",
        "Include expert tips and insider knowledge"
      ],
      contentGaps: [
        "Long-term durability testing",
        "Common user mistakes to avoid",
        "Troubleshooting guide"
      ],
      targetWordCount: 5000,
      suggestedHeadings: [
        "H2: Complete Overview",
        "H2: Key Features and Benefits",
        "H2: Detailed Reviews",
        "H2: Buying Guide",
        "H2: Pros and Cons",
        "H2: FAQ Section",
        "H2: Final Verdict"
      ],
      longestCompetitor: 4000,
      shortestCompetitor: 3500,
      averageCompetitor: 3750,
      recommendedArticleType: "buying-guide",
      articleTypeReason: "Buying guides typically rank well for product-related keywords",
      detailedCompetitors: []
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
