import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Loader2, Download, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ImageSettings, ImageConfig } from "@/components/ImageSettings";
import { GeneratedImagesDisplay, GeneratedImage } from "@/components/GeneratedImagesDisplay";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { convertMarkdownToHtml, downloadHtml } from "@/lib/markdown-to-html";

const AmazonReviewGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [article, setArticle] = useState("");
  const [imageConfig, setImageConfig] = useState<ImageConfig>({
    includeFeaturedImage: true,
    additionalImageCount: 5,
    imageSource: "amazon",
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [configuration, setConfiguration] = useState({
    wordCount: 3000,
    tone: "Balanced",
    readingLevel: "8th Grade",
    primaryKeyword: "",
    secondaryKeywords: "",
    metaDescription: "",
    includeComparison: true,
    includeFaq: true,
    faqCount: 20,
    includeSchema: true,
    schemaType: "Product + Review",
    analyzeReviews: true,
    imageCount: 5,
    imageFormat: "WebP",
    imageOptimization: true,
    videoUrl: "",
    videoPlacement: "After introduction",
    enableAffiliate: false,
    amazonAffiliateId: "",
    ctaCount: 3,
    ctaStyle: "Button",
  });
  const [schema, setSchema] = useState<any>(null);
  const [wordCount, setWordCount] = useState(0);
  const [generationProgress, setGenerationProgress] = useState("");
  const [articleTitle, setArticleTitle] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to generate articles.",
          variant: "destructive",
        });
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const handleAnalyze = () => {
    if (!url.includes("amazon.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Amazon product URL",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleGenerate = async () => {
    setStep(3);
    setGenerating(true);
    
    const progressMessages = [
      "Extracting product data...",
      "Analyzing customer reviews...",
      "Researching competitors...",
      "Generating content structure...",
      "Writing introduction...",
      "Creating feature analysis...",
      "Building comparison tables...",
      "Generating FAQ section...",
      "Finalizing SEO optimization...",
    ];

    let messageIndex = 0;
    const progressInterval = setInterval(() => {
      if (messageIndex < progressMessages.length) {
        setGenerationProgress(progressMessages[messageIndex]);
        messageIndex++;
      }
    }, 3000);

    try {
      const { data, error } = await supabase.functions.invoke('generate-amazon-review', {
        body: {
          productUrl: url,
          configuration,
        }
      });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setArticle(data.content);
      setSchema(data.schema);
      setWordCount(data.wordCount);
      setGenerating(false);
      setStep(4);
      
      toast({
        title: "Article Generated!",
        description: `Successfully created ${data.wordCount.toLocaleString()} word review.`,
      });
    } catch (error) {
      clearInterval(progressInterval);
      setGenerating(false);
      console.error('Generation error:', error);
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate article. Please try again.",
        variant: "destructive",
      });
      
      setStep(2);
    }
  };

  const handleSaveArticle = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to save articles.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Extract title from article (first line or first # heading)
      const titleMatch = article.match(/^#\s+(.+)$/m) || article.match(/^(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : "Untitled Article";

      // Types will sync after database schema updates
      const { error } = await (supabase as any).from("articles").insert({
        user_id: userId,
        title: extractedTitle,
        content: article,
        article_type: "amazon-review",
        product_url: url,
        configuration: configuration,
        schema_markup: schema,
        word_count: wordCount,
      });

      if (error) throw error;

      toast({
        title: "Article Saved!",
        description: "Your article has been saved to My Articles.",
      });
      
      navigate("/dashboard/articles");
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'markdown' | 'html' = 'markdown') => {
    if (format === 'html') {
      const html = await convertMarkdownToHtml(article);
      downloadHtml(html, `article-${Date.now()}`);
      toast({
        title: "HTML Exported",
        description: "Your article has been downloaded as HTML.",
      });
    } else {
      const blob = new Blob([article], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `article-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Markdown Exported",
        description: "Your article has been downloaded as Markdown.",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(article);
    toast({
      title: "Copied to Clipboard",
      description: "Article content has been copied.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full font-bold text-sm md:text-base ${
                    step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i}
                  </div>
                  {i < 4 && (
                    <div className={`flex-1 h-1 mx-1 md:mx-2 ${step > i ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground">
              <span>Input</span>
              <span>Config</span>
              <span>Generate</span>
              <span>Export</span>
            </div>
          </div>

          {/* Step 1: Product Input */}
          {step === 1 && (
            <div className="card-elevated p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Create Amazon Product Review</h1>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                Enter an Amazon product URL to begin creating your comprehensive review article
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="url" className="text-base font-semibold mb-2 block">
                    Amazon Product URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://www.amazon.com/product/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Paste the complete Amazon product link including the ASIN
                  </p>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Quick Options</Label>
                  <div className="space-y-3">
                    {[
                      "Include competitor comparison",
                      "Generate FAQ section (30+ questions)",
                      "Include schema markup",
                      "Analyze customer reviews",
                    ].map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 rounded border-input text-primary"
                        />
                        <label className="ml-2 text-sm">{option}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleAnalyze} className="btn-hero">
                    Analyze Product <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === 2 && (
            <div className="card-elevated p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Content Configuration</h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="card-elevated p-4">
                    <img
                      src="https://placehold.co/400x400"
                      alt="Product"
                      className="w-full rounded-lg mb-3"
                    />
                    <h3 className="font-bold mb-1">Sample Product Name</h3>
                    <p className="text-sm text-muted-foreground mb-2">Brand Name</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-lg">$299.99</span>
                      <span className="text-accent">★★★★☆ 4.6</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1 lg:order-2">
                  <div>
                    <Label>Target Word Count: {configuration.wordCount.toLocaleString()}</Label>
                    <input 
                      type="range" 
                      min="1000" 
                      max="5000" 
                      step="500"
                      value={configuration.wordCount}
                      onChange={(e) => setConfiguration({...configuration, wordCount: parseInt(e.target.value)})}
                      className="w-full mt-1" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1,000</span>
                      <span>5,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tone</Label>
                      <select 
                        value={configuration.tone}
                        onChange={(e) => setConfiguration({...configuration, tone: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option>Professional</option>
                        <option>Balanced</option>
                        <option>Conversational</option>
                        <option>Technical</option>
                        <option>Enthusiastic</option>
                      </select>
                    </div>

                    <div>
                      <Label>Reading Level</Label>
                      <select 
                        value={configuration.readingLevel}
                        onChange={(e) => setConfiguration({...configuration, readingLevel: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option>8th Grade</option>
                        <option>10th Grade</option>
                        <option>12th Grade</option>
                        <option>College Level</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>Primary Keyword</Label>
                    <Input 
                      placeholder="best wireless headphones 2024" 
                      value={configuration.primaryKeyword}
                      onChange={(e) => setConfiguration({...configuration, primaryKeyword: e.target.value})}
                      className="mt-1" 
                    />
                  </div>

                  <div>
                    <Label>Secondary Keywords (comma separated)</Label>
                    <Input 
                      placeholder="noise cancelling, bluetooth headphones, over-ear" 
                      value={configuration.secondaryKeywords}
                      onChange={(e) => setConfiguration({...configuration, secondaryKeywords: e.target.value})}
                      className="mt-1" 
                    />
                  </div>

                  <div>
                    <Label>Meta Description (150-155 characters)</Label>
                    <textarea 
                      placeholder="Comprehensive review with real testing..."
                      value={configuration.metaDescription}
                      onChange={(e) => setConfiguration({...configuration, metaDescription: e.target.value})}
                      maxLength={155}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background min-h-[60px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {configuration.metaDescription.length}/155 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Schema Type</Label>
                      <select 
                        value={configuration.schemaType}
                        onChange={(e) => setConfiguration({...configuration, schemaType: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option>Product + Review</option>
                        <option>Article</option>
                        <option>HowTo</option>
                        <option>FAQPage</option>
                      </select>
                    </div>

                    <div>
                      <Label>FAQ Count: {configuration.faqCount}</Label>
                      <input 
                        type="range" 
                        min="10" 
                        max="30" 
                        value={configuration.faqCount}
                        onChange={(e) => setConfiguration({...configuration, faqCount: parseInt(e.target.value)})}
                        className="w-full mt-1" 
                      />
                    </div>
                  </div>

                  {/* Image Settings Component */}
                  <div className="border-t pt-4">
                    <ImageSettings
                      config={imageConfig}
                      onChange={setImageConfig}
                      showAmazonOption={true}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Video Integration</h3>
                    <div>
                      <Label>YouTube Video URL (optional)</Label>
                      <Input 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={configuration.videoUrl}
                        onChange={(e) => setConfiguration({...configuration, videoUrl: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                    {configuration.videoUrl && (
                      <div className="mt-3">
                        <Label>Video Placement</Label>
                        <select 
                          value={configuration.videoPlacement}
                          onChange={(e) => setConfiguration({...configuration, videoPlacement: e.target.value})}
                          className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option>After introduction</option>
                          <option>Middle of article</option>
                          <option>Before conclusion</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Affiliate Settings</h3>
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={configuration.enableAffiliate}
                        onChange={(e) => setConfiguration({...configuration, enableAffiliate: e.target.checked})}
                        className="w-4 h-4 rounded border-input text-primary"
                      />
                      <label className="ml-2 text-sm font-medium">Enable Affiliate Links</label>
                    </div>

                    {configuration.enableAffiliate && (
                      <div className="space-y-3">
                        <div>
                          <Label>Amazon Affiliate ID</Label>
                          <Input 
                            placeholder="yourtag-20" 
                            value={configuration.amazonAffiliateId}
                            onChange={(e) => setConfiguration({...configuration, amazonAffiliateId: e.target.value})}
                            className="mt-1" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Number of CTAs: {configuration.ctaCount}</Label>
                            <input 
                              type="range" 
                              min="1" 
                              max="5" 
                              value={configuration.ctaCount}
                              onChange={(e) => setConfiguration({...configuration, ctaCount: parseInt(e.target.value)})}
                              className="w-full mt-1" 
                            />
                          </div>

                          <div>
                            <Label>CTA Style</Label>
                            <select 
                              value={configuration.ctaStyle}
                              onChange={(e) => setConfiguration({...configuration, ctaStyle: e.target.value})}
                              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                            >
                              <option>Button</option>
                              <option>Text link</option>
                              <option>Mixed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Column: Generated Images Preview */}
              {generatedImages.length > 0 && (
                <div className="lg:col-span-3">
                  <GeneratedImagesDisplay images={generatedImages} />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 lg:col-span-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 sm:flex-none">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleGenerate} className="btn-hero flex-1 sm:flex-none">
                  Generate Article <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Generation Progress */}
          {step === 3 && (
            <div className="card-elevated p-8 md:p-16 text-center">
              <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin text-primary mx-auto mb-4 md:mb-6" />
              <h2 className="text-xl md:text-2xl font-bold mb-4">Generating Your Article...</h2>
              <div className="max-w-md mx-auto space-y-3 text-left">
                {generationProgress && (
                  <p className="text-base md:text-lg font-semibold text-primary flex items-center justify-center">
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-2" />
                    {generationProgress}
                  </p>
                )}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mt-4 md:mt-6">This may take 30-60 seconds...</p>
            </div>
          )}

          {/* Step 4: Review & Export */}
          {step === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="lg:col-span-2 order-2 lg:order-1">
                <div className="card-elevated p-4 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold mb-4">Article Preview</h2>
                  <div className="prose prose-slate max-w-none text-sm md:text-base">
                    <div className="whitespace-pre-wrap">{article}</div>
                  </div>
                  
                  {schema && (
                    <div className="mt-6 md:mt-8">
                      <h3 className="text-lg md:text-xl font-bold mb-2">Schema Markup</h3>
                      <div className="bg-muted p-3 md:p-4 rounded-md overflow-x-auto">
                        <pre className="text-xs md:text-sm">{JSON.stringify(schema, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="card-elevated p-4 md:p-6 lg:sticky lg:top-8">
                  <h3 className="text-lg md:text-xl font-bold mb-4">Article Metrics</h3>
                  <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Word Count</p>
                      <p className="text-xl md:text-2xl font-bold">{wordCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Configuration</p>
                      <p className="text-sm">Tone: {configuration.tone}</p>
                      <p className="text-sm">Target: {configuration.wordCount.toLocaleString()} words</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Generated</p>
                      <p className="text-sm">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 md:gap-3">
                    <Button onClick={() => handleExport('html')} className="w-full bg-primary text-primary-foreground text-sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export HTML
                    </Button>
                    <Button onClick={() => handleExport('markdown')} variant="outline" className="w-full text-sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export MD
                    </Button>
                    <Button onClick={handleCopy} variant="outline" className="w-full text-sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button onClick={handleSaveArticle} variant="outline" className="w-full text-sm">
                      Save Article
                    </Button>
                  </div>

                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t hidden lg:block">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                        <span>Schema markup included</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                        <span>{configuration.faqCount}+ FAQ questions</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                        <span>Competitor analysis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default AmazonReviewGenerator;
