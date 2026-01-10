import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompetitorInsights, CompetitorData } from "@/components/CompetitorInsights";
import { useCompetitorAutoFill } from "@/hooks/useCompetitorAutoFill";
import { toast } from "sonner";

interface CompetitorResearchStepProps {
  targetKeyword: string;
  setTargetKeyword: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  selectedNiche: string;
  articleType: string;
  competitorData: CompetitorData | null;
  setCompetitorData: (data: CompetitorData | null) => void;
}

export const CompetitorResearchStep = ({
  targetKeyword,
  setTargetKeyword,
  productName,
  setProductName,
  selectedNiche,
  articleType,
  competitorData,
  setCompetitorData,
}: CompetitorResearchStepProps) => {
  const { isLoading: isAutoFilling, autoFillCompetitorFields } = useCompetitorAutoFill();

  const handleAutoFill = async () => {
    if (!productName && !selectedNiche) {
      toast.error("Please enter a product name or select a niche first (in previous steps)");
      return;
    }

    const result = await autoFillCompetitorFields(productName, selectedNiche, articleType);
    
    if (result) {
      setTargetKeyword(result.targetKeyword);
      if (result.productName && !productName) {
        setProductName(result.productName);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Auto-fill Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleAutoFill}
          disabled={isAutoFilling}
        >
          {isAutoFilling ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          Auto-fill with AI
        </Button>
      </div>

      {/* Target Keyword Input */}
      <div>
        <Label htmlFor="targetKeyword" className="text-base font-semibold">Target Keyword</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Enter the main keyword you want to rank for. Click "Auto-fill with AI" to generate suggestions.
        </p>
        <Input
          id="targetKeyword"
          placeholder="e.g., best noise cancelling headphones 2024"
          value={targetKeyword || productName}
          onChange={(e) => setTargetKeyword(e.target.value)}
        />
      </div>

      {/* Product/Topic Input */}
      <div>
        <Label htmlFor="productTopic" className="text-base font-semibold">Product or Topic Focus</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Specify the product or topic to focus your competitor analysis
        </p>
        <Input
          id="productTopic"
          placeholder="e.g., Sony WH-1000XM5, wireless earbuds, gaming headset"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>

      {/* Competitor Analysis */}
      <CompetitorInsights 
        keyword={targetKeyword || productName}
        articleType={articleType}
        onInsightsReceived={(data) => {
          setCompetitorData(data);
          if (data.targetWordCount) {
            toast.info(`Target word count: ${data.targetWordCount.toLocaleString()}+ words`);
          }
        }}
      />

      {/* Success Indicator */}
      {competitorData && (
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
          <p className="text-sm text-secondary font-medium">
            ✓ Competitor analysis complete! Insights will be used to optimize your article.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Target: {competitorData.targetWordCount?.toLocaleString()}+ words • 
            {competitorData.suggestedHeadings?.length || 0} suggested headings • 
            {competitorData.contentGaps?.length || 0} content gaps identified
          </p>
        </div>
      )}
    </div>
  );
};
