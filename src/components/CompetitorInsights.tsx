import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Loader2, CheckCircle, Target, FileText, Lightbulb, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompetitorInsightsProps {
  keyword: string;
  articleType: string;
  onInsightsReceived?: (insights: CompetitorData) => void;
}

export interface CompetitorData {
  recommendations: string[];
  contentGaps: string[];
  targetWordCount: number;
  suggestedHeadings: string[];
  longestCompetitor?: number;
  shortestCompetitor?: number;
  averageCompetitor?: number;
  recommendedArticleType?: string;
  articleTypeReason?: string;
  detailedCompetitors?: Array<{
    position: number;
    estimatedTitle: string;
    estimatedWordCount: number;
    articleType: string;
    headingCount: number;
    keyStrengths: string[];
    weaknesses: string[];
    topicsCovered: string[];
  }>;
}

export const CompetitorInsights = ({ keyword, articleType, onInsightsReceived }: CompetitorInsightsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<CompetitorData | null>(null);
  const [customKeyword, setCustomKeyword] = useState(keyword);

  const analyzeCompetitors = async () => {
    const searchKeyword = customKeyword || keyword;
    
    if (!searchKeyword) {
      toast.error("Please enter a keyword to analyze");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-competitors", {
        body: { keyword: searchKeyword, articleType },
      });

      if (error) throw error;

      const insightsData: CompetitorData = {
        recommendations: data.recommendations || [],
        contentGaps: data.contentGaps || [],
        targetWordCount: data.targetWordCount || 3500,
        suggestedHeadings: data.suggestedHeadings || [],
        longestCompetitor: data.longestCompetitor || 3500,
        shortestCompetitor: data.shortestCompetitor || 3500,
        averageCompetitor: data.averageCompetitor || 3500,
        recommendedArticleType: data.recommendedArticleType,
        articleTypeReason: data.articleTypeReason,
        detailedCompetitors: data.detailedCompetitors || [],
      };

      setInsights(insightsData);
      onInsightsReceived?.(insightsData);
      toast.success("Competitor analysis complete!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Competitor analysis error:", errorMessage);
      toast.error("Failed to analyze competitors. Using default recommendations.");
      
      const fallbackData: CompetitorData = {
        recommendations: [
          "Focus on comprehensive, in-depth content",
          "Include original insights and analysis",
          "Optimize for user intent and search queries",
          "Add visual elements like images and tables",
          "Structure content with clear headings",
        ],
        contentGaps: [],
        targetWordCount: 3500,
        suggestedHeadings: [],
        longestCompetitor: 3500,
        shortestCompetitor: 3500,
        averageCompetitor: 3500,
      };
      setInsights(fallbackData);
      onInsightsReceived?.(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const longestCompetitor = insights?.longestCompetitor || 3500;
  const shortestCompetitor = insights?.shortestCompetitor || 3500;
  const targetWordCount = insights?.targetWordCount || 3500;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Competitor Analysis
        </CardTitle>
        <CardDescription>
          Analyze top-ranking content to identify opportunities and set word count targets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="analysis-keyword" className="sr-only">Target Keyword</Label>
            <Input
              id="analysis-keyword"
              placeholder="Enter target keyword..."
              value={customKeyword}
              onChange={(e) => setCustomKeyword(e.target.value)}
            />
          </div>
          <Button onClick={analyzeCompetitors} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
            )}
          </Button>
        </div>

        {insights && (
          <div className="space-y-4 pt-4 border-t">
            {/* Word Count Strategy Card */}
            <Alert className="bg-primary/5 border-primary/20">
              <BarChart3 className="h-4 w-4 text-primary" />
              <AlertDescription>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Shortest</p>
                    <p className="text-lg font-bold text-orange-600">{shortestCompetitor.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Longest</p>
                    <p className="text-lg font-bold text-orange-600">{longestCompetitor.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-primary">Your Target</p>
                    <p className="text-xl font-bold text-primary">{targetWordCount.toLocaleString()}+</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Recommended Article Type */}
            {insights.recommendedArticleType && (
              <div className="p-3 bg-secondary/10 rounded-lg">
                <p className="text-sm font-semibold mb-1">Recommended Article Type:</p>
                <Badge variant="default" className="mb-2">
                  {insights.recommendedArticleType.replace(/-/g, ' ').toUpperCase()}
                </Badge>
                {insights.articleTypeReason && (
                  <p className="text-xs text-muted-foreground">{insights.articleTypeReason}</p>
                )}
              </div>
            )}

            {/* Detailed Competitors */}
            {insights.detailedCompetitors && insights.detailedCompetitors.length > 0 && (
              <div className="grid gap-2">
                {insights.detailedCompetitors.slice(0, 3).map((comp, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant={i === 0 ? "default" : "secondary"} className="mb-1">
                          Position {comp.position}
                        </Badge>
                        <p className="text-sm font-medium line-clamp-1">{comp.estimatedTitle}</p>
                      </div>
                      <span className="text-sm font-bold">{comp.estimatedWordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {insights.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {insights.recommendations.slice(0, 5).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Content Gaps */}
            {insights.contentGaps.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  Content Gaps to Exploit
                </h4>
                <ul className="space-y-2">
                  {insights.contentGaps.slice(0, 4).map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Headings */}
            {insights.suggestedHeadings.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-secondary" />
                  Suggested Structure
                </h4>
                <div className="bg-muted rounded-lg p-3 space-y-1">
                  {insights.suggestedHeadings.slice(0, 6).map((heading, i) => (
                    <p key={i} className="text-sm font-mono">{heading}</p>
                  ))}
                  {insights.suggestedHeadings.length > 6 && (
                    <p className="text-xs text-muted-foreground">
                      +{insights.suggestedHeadings.length - 6} more headings
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
