import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Filter, FileText, Eye, Edit, Trash2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MyArticles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadArticles = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view your articles.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      await loadArticles();
    };
    checkAuthAndLoadArticles();
  }, [navigate, toast]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      // Types will sync after database schema updates
      const { data, error } = await (supabase as any)
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setArticles(data || []);
    } catch (error) {
      console.error("Load articles error:", error);
      toast({
        title: "Failed to Load Articles",
        description: "There was an error loading your articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Types will sync after database schema updates
      const { error } = await (supabase as any).from("articles").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Article Deleted",
        description: "The article has been removed.",
      });

      await loadArticles();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete article.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (article: any) => {
    const blob = new Blob([article.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Article Downloaded",
      description: "Your article has been saved.",
    });
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || article.article_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Articles</h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage and organize all your generated content</p>
          </div>

          {/* Filters and Search */}
          <div className="card-elevated p-4 md:p-6 mb-4 md:mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="amazon-review">Amazon Reviews</option>
                <option value="comparison">Product Comparisons</option>
                <option value="buying-guide">Buying Guides</option>
                <option value="how-to">How-To Articles</option>
                <option value="roundup">Product Roundups</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Articles List */}
          {loading ? (
            <div className="card-elevated p-16 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="card-elevated p-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No articles yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first article to get started with AIWriterPros!
                </p>
                <Link to="/dashboard/create/amazon-review">
                  <Button className="btn-hero">
                    Create Your First Article
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div key={article.id} className="card-elevated p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                          {article.article_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{article.word_count?.toLocaleString() || 0} words</span>
                        <span>•</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(article)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => handleDelete(article.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default MyArticles;
