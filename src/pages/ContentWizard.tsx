import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Target, 
  Search, 
  TrendingUp, 
  Settings2, 
  Image, 
  Link2, 
  Sparkles,
  Wand2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CompetitorInsights, CompetitorData } from "@/components/CompetitorInsights";
import { toast } from "sonner";

const STEPS = [
  { id: 1, name: "Niche Selection", icon: Target },
  { id: 2, name: "Product Research", icon: Search },
  { id: 3, name: "Competitor Analysis", icon: TrendingUp },
  { id: 4, name: "SEO Strategy", icon: Settings2 },
  { id: 5, name: "Image Setup", icon: Image },
  { id: 6, name: "Affiliate Config", icon: Link2 },
  { id: 7, name: "Generate", icon: Sparkles },
];

const NICHES = [
  "Electronics & Gadgets",
  "Home & Kitchen",
  "Health & Fitness",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Baby & Kids",
  "Pet Supplies",
  "Automotive",
  "Fashion & Accessories",
  "Books & Education",
  "Software & Apps",
  "Other",
];

const ARTICLE_TYPES = [
  { value: "amazon-review", label: "Amazon Product Review", description: "Comprehensive single product review" },
  { value: "product-comparison", label: "Product Comparison", description: "Compare 2-4 products head-to-head" },
  { value: "buying-guide", label: "Buying Guide", description: "Complete category buying guide" },
  { value: "how-to-article", label: "How-To Article", description: "Step-by-step tutorial with products" },
  { value: "product-roundup", label: "Product Roundup", description: "Best-of list with 5-10 products" },
];

const ContentWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  
  // Step 1: Niche Selection
  const [selectedNiche, setSelectedNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [articleType, setArticleType] = useState("amazon-review");
  
  // Step 2: Product Research
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  
  // Step 3: Competitor Analysis
  const [targetKeyword, setTargetKeyword] = useState("");
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);

  // Step 4: SEO Strategy
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState("");
  
  // Step 5: Image Setup
  const [includeFeaturedImage, setIncludeFeaturedImage] = useState(true);
  const [bodyImageCount, setBodyImageCount] = useState([3]);
  const [imageSource, setImageSource] = useState<"amazon" | "ai">("amazon");
  
  // Step 6: Affiliate Config
  const [affiliateId, setAffiliateId] = useState("");
  const [ctaStyle, setCtaStyle] = useState("button");
  const [ctaPlacement, setCtaPlacement] = useState("after-sections");

  const handleAutoFillSEO = async () => {
    if (!productName && !targetKeyword) {
      toast.error("Please enter a product name or target keyword first");
      return;
    }
    
    setIsAutoFilling(true);
    
    // Simulate AI auto-fill (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const keyword = targetKeyword || productName;
    setSeoTitle(`Best ${keyword} Review 2024: Complete Buyer's Guide`);
    setMetaDescription(`Looking for the best ${keyword}? Our comprehensive review covers features, pros & cons, and helps you decide if it's right for you.`);
    setPrimaryKeyword(keyword.toLowerCase());
    setSecondaryKeywords(`${keyword} review, best ${keyword}, ${keyword} guide, ${keyword} comparison`);
    
    setIsAutoFilling(false);
    toast.success("SEO fields auto-filled with AI suggestions!");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success("Article generated successfully!");
    navigate("/dashboard/articles");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedNiche && articleType;
      case 2:
        return productUrl || productName;
      case 3:
        return true; // Optional step
      case 4:
        return seoTitle && metaDescription;
      case 5:
        return true; // Optional step
      case 6:
        return true; // Optional step
      case 7:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Select Your Niche</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {NICHES.map((niche) => (
                  <button
                    key={niche}
                    onClick={() => setSelectedNiche(niche)}
                    className={`p-3 rounded-lg border text-sm text-left transition-all ${
                      selectedNiche === niche
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
              {selectedNiche === "Other" && (
                <Input
                  className="mt-3"
                  placeholder="Enter your niche..."
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                />
              )}
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Article Type</Label>
              <RadioGroup value={articleType} onValueChange={setArticleType} className="space-y-3">
                {ARTICLE_TYPES.map((type) => (
                  <div
                    key={type.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      articleType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setArticleType(type.value)}
                  >
                    <RadioGroupItem value={type.value} id={type.value} />
                    <div>
                      <Label htmlFor={type.value} className="font-medium cursor-pointer">{type.label}</Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="productUrl" className="text-base font-semibold">Amazon Product URL</Label>
              <p className="text-sm text-muted-foreground mb-2">Paste an Amazon product link to auto-extract details</p>
              <Input
                id="productUrl"
                placeholder="https://www.amazon.com/dp/..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Sony WH-1000XM5 Headphones"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="productBrand">Brand</Label>
                <Input
                  id="productBrand"
                  placeholder="e.g., Sony"
                  value={productBrand}
                  onChange={(e) => setProductBrand(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetKeyword" className="text-base font-semibold">Target Keyword</Label>
              <p className="text-sm text-muted-foreground mb-2">Enter the main keyword you want to rank for (or use the product name)</p>
              <Input
                id="targetKeyword"
                placeholder="e.g., best noise cancelling headphones"
                value={targetKeyword || productName}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
            </div>

            <CompetitorInsights 
              keyword={targetKeyword || productName}
              articleType={articleType}
              onInsightsReceived={(data) => {
                setCompetitorData(data);
                // Auto-fill SEO fields if we got good data
                if (data.targetWordCount) {
                  toast.info(`Target word count: ${data.targetWordCount}+ words`);
                }
              }}
            />

            {competitorData && (
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <p className="text-sm text-secondary font-medium">
                  ✓ Competitor analysis complete! Insights will be used to optimize your article.
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleAutoFillSEO}
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

            <div>
              <Label htmlFor="seoTitle">SEO Title</Label>
              <p className="text-sm text-muted-foreground mb-2">50-60 characters recommended</p>
              <Input
                id="seoTitle"
                placeholder="Enter your SEO title..."
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
              />
              <p className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60 characters</p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <p className="text-sm text-muted-foreground mb-2">150-160 characters recommended</p>
              <Textarea
                id="metaDescription"
                placeholder="Enter your meta description..."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={170}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160 characters</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                <Input
                  id="primaryKeyword"
                  placeholder="e.g., best headphones review"
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondaryKeywords">Secondary Keywords</Label>
                <Input
                  id="secondaryKeywords"
                  placeholder="Comma-separated keywords"
                  value={secondaryKeywords}
                  onChange={(e) => setSecondaryKeywords(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeFeaturedImage"
                checked={includeFeaturedImage}
                onCheckedChange={(checked) => setIncludeFeaturedImage(checked as boolean)}
              />
              <Label htmlFor="includeFeaturedImage" className="cursor-pointer">
                Include featured image at top of article
              </Label>
            </div>

            <div>
              <Label className="text-base font-semibold">Number of Body Images: {bodyImageCount[0]}</Label>
              <p className="text-sm text-muted-foreground mb-4">Images will be placed at natural breakpoints</p>
              <Slider
                value={bodyImageCount}
                onValueChange={setBodyImageCount}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Image Source</Label>
              <RadioGroup value={imageSource} onValueChange={(v) => setImageSource(v as "amazon" | "ai")} className="space-y-3">
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    imageSource === "amazon" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setImageSource("amazon")}
                >
                  <RadioGroupItem value="amazon" id="amazon" />
                  <div>
                    <Label htmlFor="amazon" className="font-medium cursor-pointer">Amazon Product Images</Label>
                    <p className="text-sm text-muted-foreground">Extract images directly from the product page</p>
                  </div>
                </div>
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    imageSource === "ai" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setImageSource("ai")}
                >
                  <RadioGroupItem value="ai" id="ai" />
                  <div>
                    <Label htmlFor="ai" className="font-medium cursor-pointer">AI Generated Images</Label>
                    <p className="text-sm text-muted-foreground">Generate unique images based on article content</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="affiliateId">Amazon Associates ID</Label>
              <p className="text-sm text-muted-foreground mb-2">Your affiliate tracking ID</p>
              <Input
                id="affiliateId"
                placeholder="e.g., yoursite-20"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">CTA Button Style</Label>
              <Select value={ctaStyle} onValueChange={setCtaStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="button">Button Style</SelectItem>
                  <SelectItem value="text">Text Link</SelectItem>
                  <SelectItem value="image">Image with Link</SelectItem>
                  <SelectItem value="card">Product Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">CTA Placement</Label>
              <Select value={ctaPlacement} onValueChange={setCtaPlacement}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="after-sections">After Each Section</SelectItem>
                  <SelectItem value="intro-conclusion">Intro & Conclusion Only</SelectItem>
                  <SelectItem value="conclusion-only">Conclusion Only</SelectItem>
                  <SelectItem value="custom">Custom Positions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Ready to Generate!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We'll create a comprehensive, SEO-optimized article based on your configuration.
              </p>
            </div>

            <div className="card-elevated p-4 space-y-3">
              <h4 className="font-semibold">Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Niche:</span>
                  <p className="font-medium">{selectedNiche}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Article Type:</span>
                  <p className="font-medium">{ARTICLE_TYPES.find(t => t.value === articleType)?.label}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Product:</span>
                  <p className="font-medium">{productName || "From URL"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Images:</span>
                  <p className="font-medium">{includeFeaturedImage ? "Featured + " : ""}{bodyImageCount[0]} body images</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Helmet>
        <title>Content Creation Wizard | AIWriterPros</title>
        <meta name="description" content="Create SEO-optimized content with our step-by-step wizard." />
      </Helmet>

      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Content Creation Wizard</h1>
            <p className="text-muted-foreground">Follow the steps to generate your perfect article</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 overflow-x-auto pb-2">
            <div className="flex items-center min-w-max">
              {STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => isCompleted && setCurrentStep(step.id)}
                      disabled={!isCompleted}
                      className={`flex flex-col items-center ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all ${
                          isCompleted
                            ? "bg-secondary text-secondary-foreground"
                            : isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                      </div>
                      <span className={`text-xs whitespace-nowrap ${isActive ? "font-semibold" : "text-muted-foreground"}`}>
                        {step.name}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <div className={`w-8 md:w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-secondary" : "bg-muted"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="card-elevated p-6 max-w-3xl">
            <h2 className="text-xl font-bold mb-6">{STEPS[currentStep - 1].name}</h2>
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 max-w-3xl">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === STEPS.length ? (
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Article
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default ContentWizard;
