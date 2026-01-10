import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Copy, Download, ExternalLink, Check, DollarSign, Users, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const AffiliateResources = () => {
  const [affiliateId, setAffiliateId] = useState("");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baseUrl = "https://aiwriterpros.com";
  
  const links = [
    { name: "Main Sales Page", path: "/sales" },
    { name: "Pricing Page", path: "/pricing" },
    { name: "Homepage", path: "/" },
  ];

  const generateLink = (path: string) => {
    const id = affiliateId || "YOUR_ID";
    return `${baseUrl}${path}?ref=${id}`;
  };

  const copyToClipboard = (text: string, linkName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(linkName);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const banners = [
    { size: "728x90", name: "Leaderboard", preview: "bg-gradient-to-r from-primary to-secondary" },
    { size: "300x250", name: "Medium Rectangle", preview: "bg-gradient-to-r from-purple-600 to-pink-500" },
    { size: "160x600", name: "Wide Skyscraper", preview: "bg-gradient-to-r from-secondary to-accent" },
    { size: "320x50", name: "Mobile Banner", preview: "bg-gradient-to-r from-primary to-purple-600" },
  ];

  const emailSwipes = [
    {
      subject: "Create 10x More Content with AI (Limited Offer)",
      preview: "Discover how affiliate marketers are generating SEO-optimized content in minutes...",
    },
    {
      subject: "[Case Study] How I Ranked 47 Articles in 30 Days",
      preview: "I couldn't believe it when I saw my analytics dashboard...",
    },
    {
      subject: "Stop Writing Content the Hard Way",
      preview: "There's a new AI tool that's changing the game for content creators...",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Affiliate Resources | AIWriterPros Partner Program</title>
        <meta name="description" content="Access promotional materials, tracking links, and resources for the AIWriterPros affiliate program. Earn commissions promoting our AI content tool." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="gradient-hero text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Affiliate Resources</h1>
              <p className="text-xl text-white/90 mb-8">
                Everything you need to promote AIWriterPros and earn commissions
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: DollarSign, label: "50% Commission", sublabel: "On all sales" },
                  { icon: Users, label: "60-Day Cookie", sublabel: "Long tracking window" },
                  { icon: TrendingUp, label: "Real-Time Stats", sublabel: "Track performance" },
                  { icon: Gift, label: "Recurring Revenue", sublabel: "Monthly payouts" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <stat.icon className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-bold">{stat.label}</p>
                    <p className="text-sm text-white/70">{stat.sublabel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="links" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="links">Tracking Links</TabsTrigger>
                <TabsTrigger value="banners">Banners</TabsTrigger>
                <TabsTrigger value="emails">Email Swipes</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              <TabsContent value="links" className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Generate Your Tracking Links</h2>
                  
                  <div className="mb-6">
                    <Label htmlFor="affiliateId">Your Affiliate ID</Label>
                    <Input
                      id="affiliateId"
                      placeholder="Enter your affiliate ID (e.g., john123)"
                      value={affiliateId}
                      onChange={(e) => setAffiliateId(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  <div className="space-y-4">
                    {links.map((link) => (
                      <div key={link.name} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-muted rounded-lg">
                        <div>
                          <p className="font-semibold">{link.name}</p>
                          <p className="text-sm text-muted-foreground break-all">{generateLink(link.path)}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generateLink(link.path), link.name)}
                        >
                          {copiedLink === link.name ? (
                            <Check className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          Copy
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="banners" className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Promotional Banners</h2>
                  <p className="text-muted-foreground mb-6">
                    Download high-quality banners for your website, blog, or social media.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {banners.map((banner) => (
                      <div key={banner.size} className="border rounded-lg p-4">
                        <div className={`${banner.preview} rounded-lg h-32 flex items-center justify-center text-white font-bold mb-4`}>
                          {banner.size}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{banner.name}</p>
                            <p className="text-sm text-muted-foreground">{banner.size}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="emails" className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Email Swipe Copy</h2>
                  <p className="text-muted-foreground mb-6">
                    Pre-written emails you can customize and send to your list.
                  </p>

                  <div className="space-y-4">
                    {emailSwipes.map((email, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold mb-1">Subject: {email.subject}</p>
                            <p className="text-sm text-muted-foreground">{email.preview}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="text-xl font-bold mb-4">Affiliate Program Terms</h2>
                  
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <h3>Commission Structure</h3>
                    <ul>
                      <li>50% commission on all front-end sales</li>
                      <li>40% commission on all upsell products</li>
                      <li>Recurring commissions on subscription plans</li>
                      <li>Payments processed monthly via PayPal</li>
                    </ul>

                    <h3>Cookie Duration</h3>
                    <p>We use a 60-day cookie, meaning you'll receive credit for any purchase made within 60 days of a visitor clicking your affiliate link.</p>

                    <h3>Prohibited Practices</h3>
                    <ul>
                      <li>No spam or unsolicited emails</li>
                      <li>No misleading claims or fake testimonials</li>
                      <li>No bidding on branded keywords in paid ads</li>
                      <li>No cookie stuffing or incentivized clicks</li>
                    </ul>

                    <h3>Support</h3>
                    <p>For affiliate support, please contact us at affiliates@aiwriterpros.com</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AffiliateResources;
