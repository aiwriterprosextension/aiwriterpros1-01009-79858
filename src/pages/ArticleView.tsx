import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Edit2, Download, Copy, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { ArticleEditor } from "@/components/ArticleEditor";
import { ContentViewer } from "@/components/ContentViewer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { marked } from "marked";

interface Article {
  id: string;
  title: string;
  content: string;
  markdown_content: string | null;
  html_content: string | null;
  article_type: string;
  created_at: string;
  updated_at: string;
  word_count: number | null;
  seo_score: { score?: number } | null;
  configuration: Record<string, unknown> | null;
}

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error("Article not found");
        navigate("/dashboard/articles");
        return;
      }

      setArticle({
        ...data,
        seo_score: data.seo_score as { score?: number } | null,
        configuration: data.configuration as Record<string, unknown> | null,
      });
      setEditedContent(data.markdown_content || data.content);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article) return;
    
    setIsSaving(true);
    try {
      const htmlContent = await marked(editedContent);
      
      const { error } = await supabase
        .from("articles")
        .update({
          content: editedContent,
          markdown_content: editedContent,
          html_content: htmlContent,
          word_count: editedContent.split(/\s+/).length,
          last_edited: new Date().toISOString(),
        })
        .eq("id", article.id);

      if (error) throw error;

      setArticle({
        ...article,
        content: editedContent,
        markdown_content: editedContent,
        html_content: htmlContent,
      });
      setIsEditing(false);
      toast.success("Article saved successfully");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (format: "markdown" | "html") => {
    if (!article) return;
    
    const content = format === "markdown" 
      ? (article.markdown_content || article.content)
      : (article.html_content || article.content);
    
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(`${format.toUpperCase()} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: "markdown" | "html") => {
    if (!article) return;
    
    const content = format === "markdown" 
      ? (article.markdown_content || article.content)
      : (article.html_content || article.content);
    
    const extension = format === "markdown" ? "md" : "html";
    const mimeType = format === "markdown" ? "text/markdown" : "text/html";
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.toLowerCase().replace(/\s+/g, "-")}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Article downloaded as ${extension.toUpperCase()}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Helmet>
        <title>{article.title} | AIWriterPros</title>
      </Helmet>

      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/articles")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold line-clamp-1">{article.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={(article.word_count || 0) >= 3000 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {(article.word_count || 0).toLocaleString()} words
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleCopy("markdown")}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                  <Button variant="outline" onClick={() => handleDownload("markdown")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="card-elevated p-4">
              <ArticleEditor
                content={editedContent}
                onChange={setEditedContent}
              />
            </div>
          ) : (
          <div className="card-elevated p-4">
              <ContentViewer
                content={article.markdown_content || article.content}
                format="markdown"
                onContentChange={() => {}}
                articleTitle={article.title}
                affiliateConfig={{
                  affiliateId: (article.configuration as Record<string, unknown>)?.affiliateId as string,
                  ctaStyle: (article.configuration as Record<string, unknown>)?.ctaStyle as string,
                  ctaPlacement: (article.configuration as Record<string, unknown>)?.ctaPlacement as string,
                }}
              />
            </div>
          )}

          {/* Article Info */}
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="card-elevated p-4">
              <h3 className="font-semibold mb-2">Article Type</h3>
              <p className="text-muted-foreground capitalize">
                {article.article_type.replace(/-/g, " ")}
              </p>
            </div>
            <div className="card-elevated p-4">
              <h3 className="font-semibold mb-2">SEO Score</h3>
              <p className="text-muted-foreground">
                {article.seo_score?.score || "N/A"}/100
              </p>
            </div>
            <div className="card-elevated p-4">
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-muted-foreground">
                {new Date(article.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default ArticleView;
