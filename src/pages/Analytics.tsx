import { Helmet } from "react-helmet-async";
import { TrendingUp, FileText, DollarSign, BarChart3, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalArticles: 0,
    totalWords: 0,
    averageLength: 0,
    estimatedValue: 0,
  });
  const [articlesByType, setArticlesByType] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      try {
        const { data: articles, error } = await (supabase as any)
          .from('articles')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const totalArticles = articles?.length || 0;
        const totalWords = articles?.reduce((sum: number, a: any) => sum + (a.word_count || 0), 0) || 0;
        const avgLength = totalArticles > 0 ? Math.round(totalWords / totalArticles) : 0;
        const estimatedValue = Math.round(totalWords * 0.10);

        setMetrics({
          totalArticles,
          totalWords,
          averageLength: avgLength,
          estimatedValue,
        });

        // Group by article type
        const typeGroups = articles?.reduce((acc: any, article: any) => {
          const type = article.article_type || 'amazon-review';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const pieData = Object.entries(typeGroups || {}).map(([name, value]) => ({
          name: name.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          value,
        }));

        setArticlesByType(pieData);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  const metricsCards = [
    { label: "Total Articles Created", value: metrics.totalArticles.toString(), icon: FileText, change: "+0%" },
    { label: "Total Words Generated", value: metrics.totalWords.toLocaleString(), icon: TrendingUp, change: "+0%" },
    { label: "Average Article Length", value: metrics.averageLength.toLocaleString(), icon: BarChart3, change: "N/A" },
    { label: "Estimated Value", value: `$${metrics.estimatedValue.toLocaleString()}`, icon: DollarSign, change: `+$${metrics.estimatedValue}` },
  ];

  const lineData = [
    { name: "Week 1", articles: 0 },
    { name: "Week 2", articles: 0 },
    { name: "Week 3", articles: 0 },
    { name: "Week 4", articles: 0 },
  ];

  const barData = [
    { range: "0-3,000", count: 0 },
    { range: "3,000-6,000", count: 0 },
    { range: "6,000-9,000", count: 0 },
    { range: "9,000+", count: 0 },
  ];

  const COLORS = ["#1e40af", "#14b8a6", "#f59e0b", "#8b5cf6", "#ef4444"];

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-muted-foreground">Track your content performance and insights</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {metricsCards.map((metric, i) => (
                  <div key={i} className="card-elevated p-3 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-4">
                      <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                        <metric.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-secondary hidden sm:block">{metric.change}</span>
                    </div>
                    <p className="text-lg md:text-2xl font-bold mb-1">{metric.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="card-elevated p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-bold mb-4">Articles Created Over Time</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="articles" stroke="#1e40af" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Articles by Type Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={articlesByType.length > 0 ? articlesByType : [{ name: 'No Data', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(articlesByType.length > 0 ? articlesByType : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {articlesByType.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground mt-2">No data available yet</p>
                  )}
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Word Count Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">SEO Score Distribution</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { score: "0-60", count: 0 },
                      { score: "60-80", count: 0 },
                      { score: "80-90", count: 0 },
                      { score: "90-100", count: 0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="score" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default Analytics;
