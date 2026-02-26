import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle, Star, TrendingUp, Target, Zap, FileText, BarChart, Code, Users, Play, X, Clock, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SocialProofNotification } from "@/components/SocialProofNotification";
import { EmailCaptureCTA } from "@/components/EmailCaptureCTA";
import { useEffect, useState } from "react";
import logoWhite from "@/assets/logo-white.png";

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const Landing = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  // Animated stats
  const articlesGenerated = useAnimatedCounter(15847);
  const usersCount = useAnimatedCounter(2341);
  const avgRankingDays = useAnimatedCounter(28);

  return (
    <>
      <Helmet>
        <title>AIWriterPros | AI-Powered SEO Content Generator - Rank #1 on Google</title>
        <meta
          name="description"
          content="Create comprehensive, SEO-optimized Amazon reviews, buying guides, and comparison articles that rank on Google. AI-powered content generation built by SEO experts. Start free." />

        <link rel="canonical" href="https://aiwriterpros.com/" />
        <meta property="og:title" content="AIWriterPros | AI-Powered SEO Content Generator" />
        <meta property="og:description" content="Create comprehensive, SEO-optimized Amazon reviews, buying guides, and comparison articles that rank on Google." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aiwriterpros.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AIWriterPros | AI-Powered SEO Content Generator" />
        <meta name="twitter:description" content="Create comprehensive, SEO-optimized Amazon reviews, buying guides, and comparison articles that rank on Google." />
      </Helmet>

      <div className="min-h-screen">
        <ExitIntentPopup />
        <SocialProofNotification />
        <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo in Hero */}
            






            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Rated #1 AI Content Tool for Affiliates</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Create SEO-Dominating Content That Ranks #1 on Google
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              AI-powered content generation built by SEO experts. Generate comprehensive Amazon reviews, 
              comparison articles, buying guides, and more—all optimized to outrank competitors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/sales">
                <Button size="lg" className="btn-hero w-full sm:w-auto">
                  Get Instant Access <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={scrollToFeatures}>

                See How It Works
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>30-Day Money Back</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Articles in Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">{articlesGenerated.toLocaleString()}+</p>
              <p className="text-sm text-muted-foreground">Articles Generated</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-secondary">{usersCount.toLocaleString()}+</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-accent">{avgRankingDays}</p>
              <p className="text-sm text-muted-foreground">Avg Days to Rank</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See AIWriterPros in Action</h2>
            <p className="text-muted-foreground text-lg">Watch how easy it is to generate ranking content in minutes</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden border border-border">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform group">
                  <Play className="h-8 w-8 text-primary ml-1 group-hover:text-secondary transition-colors" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold">Product Demo: Create a Complete Amazon Review in 2 Minutes</p>
                  <p className="text-sm text-muted-foreground">Duration: 3:42</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Old Way vs New Way Comparison */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The Old Way vs. The AIWriterPros Way</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Old Way */}
            <div className="card-elevated p-6 border-destructive/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-destructive/10 px-4 py-2 rounded-bl-lg">
                <span className="text-destructive font-semibold text-sm">OLD WAY</span>
              </div>
              <h3 className="text-xl font-bold mb-4 mt-4 text-destructive">Manual Content Creation</h3>
              <ul className="space-y-3">
                {[
                  "Hours of research per article",
                  "Inconsistent SEO optimization",
                  "Manual keyword research",
                  "Guessing what competitors rank for",
                  "No schema markup expertise",
                  "Limited output capacity"].
                  map((item, i) =>
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <X className="h-5 w-5 text-destructive flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                  )}
              </ul>
            </div>
            
            {/* New Way */}
            <div className="card-elevated p-6 border-secondary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-secondary/10 px-4 py-2 rounded-bl-lg">
                <span className="text-secondary font-semibold text-sm">NEW WAY</span>
              </div>
              <h3 className="text-xl font-bold mb-4 mt-4 text-secondary">AIWriterPros Automation</h3>
              <ul className="space-y-3">
                {[
                  "Complete articles in minutes",
                  "Built-in SEO best practices",
                  "AI-powered keyword research",
                  "Automatic competitor analysis",
                  "Schema markup included",
                  "Unlimited scaling potential"].
                  map((item, i) =>
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                  )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Content Creators and Marketers</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Generated 47 product reviews in one week. 12 are already ranking on page 1.",
                author: "Sarah Chen",
                role: "Affiliate Marketer",
                rating: 5
              },
              {
                quote: "The SEO optimization is phenomenal. My content is outranking sites with way more authority.",
                author: "Michael Rodriguez",
                role: "Content Director",
                rating: 5
              },
              {
                quote: "Saved hundreds of hours. The comprehensive research and structure are better than what I could do manually.",
                author: "Jennifer Park",
                role: "E-commerce Manager",
                rating: 5
              }].
              map((testimonial, i) =>
              <div key={i} className="card-elevated p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) =>
                  <Star key={j} className="h-5 w-5 fill-accent text-accent" />
                  )}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose AIWriterPros</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "SEO-First Architecture",
                description: "Built-in keyword research and optimization that actually ranks"
              },
              {
                icon: FileText,
                title: "Comprehensive Content",
                description: "6,000-10,000 word articles that cover every angle"
              },
              {
                icon: Zap,
                title: "Multiple Article Types",
                description: "Reviews, comparisons, guides, how-tos, and roundups"
              },
              {
                icon: BarChart,
                title: "Real Data Integration",
                description: "Auto-extract from Amazon listings for accuracy"
              },
              {
                icon: Code,
                title: "Schema Markup Included",
                description: "JSON-LD for rich snippets and better rankings"
              },
              {
                icon: TrendingUp,
                title: "Competitor Analysis",
                description: "Identify content gaps automatically"
              }].
              map((feature, i) =>
              <div key={i} className="card-elevated p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
              )}
          </div>
        </div>
      </section>

      {/* Article Types Preview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Powerful Article Types</h2>
          <p className="text-center text-muted-foreground mb-12">Generate any type of SEO content you need</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Amazon Product Reviews",
                description: "Comprehensive reviews with testing, comparisons, and FAQs",
                features: ["6,000+ words", "Competitor analysis", "Schema markup", "Customer insights"],
                path: "/amazon-reviews",
                available: true
              },
              {
                name: "Product Comparisons",
                description: "Side-by-side analysis of competing products",
                features: ["Detailed tables", "Winner selection", "Use case matching", "Price tracking"],
                path: "/product-comparisons",
                available: false
              },
              {
                name: "Buying Guides",
                description: "Complete guides to help readers make informed decisions",
                features: ["Expert advice", "Budget tiers", "Feature explanations", "Top picks"],
                path: "/buying-guides",
                available: false
              },
              {
                name: "How-To Articles",
                description: "Step-by-step tutorials and instructional content",
                features: ["Clear steps", "Visual guides", "Troubleshooting", "Expert tips"],
                path: "/how-to-articles",
                available: false
              },
              {
                name: "Product Roundups",
                description: "Best-of lists with multiple product recommendations",
                features: ["Top 10+ items", "Category winners", "Detailed reviews", "Quick comparisons"],
                path: "/product-roundups",
                available: false
              }].
              map((type, i) =>
              <div key={i} className="card-interactive p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{type.name}</h3>
                  {type.available ?
                  <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-semibold">
                      Available Now
                    </span> :

                  <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-3 py-1 rounded-full font-semibold">
                      Coming Soon
                    </span>
                  }
                </div>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <ul className="space-y-2 mb-4">
                  {type.features.map((feature, j) =>
                  <li key={j} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-secondary mr-2" />
                      <span>{feature}</span>
                    </li>
                  )}
                </ul>
                <Link to={type.path}>
                  <Button variant="outline" className="w-full">
                    Learn More →
                  </Button>
                </Link>
              </div>
              )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                step: 1,
                title: "Input Product URL",
                description: "Paste an Amazon URL and our AI automatically extracts all product data, reviews, and specifications."
              },
              {
                step: 2,
                title: "AI Generates Content",
                description: "Our system analyzes competitors, identifies gaps, and generates a comprehensive, SEO-optimized article."
              },
              {
                step: 3,
                title: "Review and Publish",
                description: "Review your article, make any tweaks, and export with schema markup ready to publish."
              }].
              map((item) =>
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
              )}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "/month",
                features: ["5 articles per month", "All article types", "Basic support", "Export options"],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Pro",
                price: "$49",
                period: "/month",
                features: ["50 articles per month", "Priority support", "Advanced SEO", "API access"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Business",
                price: "$149",
                period: "/month",
                features: ["Unlimited articles", "Dedicated support", "Team collaboration", "Custom integrations"],
                cta: "Contact Sales",
                popular: false
              }].
              map((tier, i) =>
              <div key={i} className={`card-elevated p-8 ${tier.popular ? "ring-2 ring-primary" : ""} relative`}>
                {tier.popular &&
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                }
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) =>
                  <li key={j} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-secondary mr-2" />
                      <span>{feature}</span>
                    </li>
                  )}
                </ul>
                <Link to="/pricing">
                  <Button className={`w-full ${tier.popular ? "bg-primary text-primary-foreground" : ""}`}>
                    {tier.cta}
                  </Button>
                </Link>
              </div>
              )}
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing" className="text-primary hover:underline font-semibold">
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-hero text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Content That Ranks?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of content creators using AI to dominate search results
          </p>
          <Link to="/sales">
            <Button size="lg" className="btn-hero">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

        <EmailCaptureCTA />
        <Footer />
      </div>
    </>);

};

export default Landing;