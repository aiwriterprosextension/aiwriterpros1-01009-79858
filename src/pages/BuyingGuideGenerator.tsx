import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Loader2, Download, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { convertMarkdownToHtml, downloadHtml } from "@/lib/markdown-to-html";

const BuyingGuideGenerator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [article, setArticle] = useState("");
  const [configuration, setConfiguration] = useState({
    wordCount: 3000,
    tone: "Balanced",
    readingLevel: "8th Grade",
    primaryKeyword: "",
    secondaryKeywords: "",
    metaDescription: "",
    budgetTiers: 3,
    productCount: 10,
    includeComparison: true,
    includeFaq: true,
    faqCount: 20,
    includeSchema: true,
    schemaType: "Article + Product",
    imageCount: 8,
    imageFormat: "WebP",
    ctaCount: 3,
  });
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

  const handleNext = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your buying guide",
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
      "Researching product category...",
      "Analyzing market trends...",
      "Comparing budget options...",
      "Evaluating premium products...",
      "Creating comparison tables...",
      "Generating buying advice...",
      "Building FAQ section...",
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
      const { data, error } = await supabase.functions.invoke("generate-buying-guide", {
        body: { topic, configuration },
      });

      clearInterval(progressInterval);

      if (error) throw error;

      setArticle(data.content);
      setArticleTitle(topic);
      setStep(4);

      const titleMatch = data.content.match(/^#\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1] : topic;

      await (supabase as any).from("articles").insert({
        user_id: userId,
        title: extractedTitle,
        content: data.content,
        article_type: "buying-guide",
        configuration: configuration,
        word_count: data.content.split(/\s+/).length,
      });

      toast({
        title: "Success!",
        description: "Your buying guide has been generated and saved.",
      });
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
      setStep(2);
      setGenerating(false);
    }
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([article], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `buying-guide-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Markdown Exported",
      description: "Your buying guide has been downloaded.",
    });
  };

  const handleExportHTML = async () => {
    try {
      const html = await convertMarkdownToHtml(article);
      downloadHtml(html, `buying-guide-${Date.now()}`);
      
      toast({
        title: "HTML Exported",
        description: "Your buying guide has been downloaded as HTML.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to convert to HTML",
        variant: "destructive",
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
              <span>Topic</span>
              <span>Config</span>
              <span>Generate</span>
              <span>Export</span>
            </div>
          </div>

          {/* Step 1: Topic Input */}
          {step === 1 && (
            <div className="card-elevated p-8">
              <h1 className="text-3xl font-bold mb-2">Create Buying Guide</h1>
              <p className="text-muted-foreground mb-8">
                Enter a product category or topic for your comprehensive buying guide
              </p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="topic" className="text-base font-semibold mb-2 block">
                    Buying Guide Topic
                  </Label>
                  <Input
                    id="topic"
                    type="text"
                    placeholder="e.g., Best Laptops for Gaming, Kitchen Blenders, Running Shoes"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Be specific about the product category you want to cover
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleNext} className="flex-1" size="lg">
                    Continue to Configuration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Configuration */}
          {step === 2 && (
            <div className="card-elevated p-8">
              <h2 className="text-2xl font-bold mb-6">Configure Your Buying Guide</h2>
              
              <div className="space-y-6">
                <div>
                  <Label>Target Word Count: {configuration.wordCount}</Label>
                  <Slider
                    value={[configuration.wordCount]}
                    onValueChange={([value]) => setConfiguration({ ...configuration, wordCount: value })}
                    min={1000}
                    max={5000}
                    step={500}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tone</Label>
                    <Select
                      value={configuration.tone}
                      onValueChange={(value) => setConfiguration({ ...configuration, tone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Balanced">Balanced</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Reading Level</Label>
                    <Select
                      value={configuration.readingLevel}
                      onValueChange={(value) => setConfiguration({ ...configuration, readingLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6th Grade">6th Grade</SelectItem>
                        <SelectItem value="8th Grade">8th Grade</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Budget Tiers: {configuration.budgetTiers}</Label>
                  <Slider
                    value={[configuration.budgetTiers]}
                    onValueChange={([value]) => setConfiguration({ ...configuration, budgetTiers: value })}
                    min={2}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Product Recommendations: {configuration.productCount}</Label>
                  <Slider
                    value={[configuration.productCount]}
                    onValueChange={([value]) => setConfiguration({ ...configuration, productCount: value })}
                    min={5}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>FAQ Count: {configuration.faqCount}</Label>
                  <Slider
                    value={[configuration.faqCount]}
                    onValueChange={([value]) => setConfiguration({ ...configuration, faqCount: value })}
                    min={10}
                    max={30}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" size="lg">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleGenerate} className="flex-1" size="lg">
                    Generate Buying Guide
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generation */}
          {step === 3 && (
            <div className="card-elevated p-12 text-center">
              <div className="flex justify-center mb-6">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Generating Your Buying Guide</h2>
              <p className="text-muted-foreground mb-6">
                This may take 30-60 seconds. We're creating comprehensive, SEO-optimized content.
              </p>
              <div className="max-w-md mx-auto">
                <p className="text-sm text-primary font-medium">{generationProgress}</p>
              </div>
            </div>
          )}

          {/* Step 4: Review & Export */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="card-elevated p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Generation Complete!</h3>
                    <p className="text-sm text-muted-foreground">
                      {article.split(/\s+/).length} words • {articleTitle}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={handleExportMarkdown} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    MD
                  </Button>
                  <Button onClick={handleExportHTML} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    HTML
                  </Button>
                </div>
              </div>

              <div className="card-elevated p-8">
                <div className="prose prose-slate max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {article}
                  </pre>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => {
                  setStep(1);
                  setArticle("");
                  setTopic("");
                  setGenerating(false);
                }} variant="outline" size="lg">
                  Create Another
                </Button>
                <Button onClick={() => navigate("/dashboard/articles")} size="lg">
                  View All Articles
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default BuyingGuideGenerator;
