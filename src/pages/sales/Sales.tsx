import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  CheckCircle, Star, ArrowRight, Shield, Clock, Zap, FileText, 
  TrendingUp, Target, BarChart, Code, Users, Gift, Play, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Sales = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) return { hours: 2, minutes: 0, seconds: 0 };
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePurchase = (tier: string) => {
    // Store the tier for testing purposes
    localStorage.setItem("purchaseTier", tier);
    navigate("/oto1");
  };

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Affiliate Marketer",
      quote: "Generated 47 product reviews in one week. 12 are already ranking on page 1.",
      result: "$4,200/month in affiliate income",
      avatar: "SM"
    },
    {
      name: "Mike R.",
      role: "Content Creator",
      quote: "The SEO optimization is phenomenal. My content is outranking sites with way more authority.",
      result: "300% traffic increase",
      avatar: "MR"
    },
    {
      name: "Jennifer P.",
      role: "E-commerce Manager",
      quote: "Saved hundreds of hours. The research and structure are better than manual work.",
      result: "50+ articles/month",
      avatar: "JP"
    }
  ];

  const features = [
    { icon: Target, title: "SEO-First Architecture", desc: "Built-in keyword research that actually ranks" },
    { icon: FileText, title: "Comprehensive Content", desc: "6,000-10,000 word articles that dominate SERPs" },
    { icon: Zap, title: "5 Article Types", desc: "Reviews, comparisons, guides, how-tos, roundups" },
    { icon: BarChart, title: "Real Data Integration", desc: "Auto-extract from Amazon for accuracy" },
    { icon: Code, title: "Schema Markup", desc: "JSON-LD for rich snippets included" },
    { icon: TrendingUp, title: "Competitor Analysis", desc: "Outrank your competition automatically" },
  ];

  const bonuses = [
    { title: "SEO Content Templates Pack", value: "$297", desc: "50+ proven templates for every niche" },
    { title: "Keyword Research Mastery Training", value: "$197", desc: "Find winning keywords in minutes" },
    { title: "Commercial License", value: "$497", desc: "Sell content to clients & keep 100%" },
    { title: "Priority Support Access", value: "$147", desc: "Get help when you need it most" },
  ];

  return (
    <>
      <Helmet>
        <title>AIWriterPros - Create SEO Content That Ranks #1 | Special Launch Offer</title>
        <meta name="description" content="Generate comprehensive, ranking-ready Amazon reviews, buying guides, and comparison articles in minutes. AI-powered SEO content generation at 81% off." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b border-purple-500/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-pink-400 font-medium text-sm">🎉 Founding Members Discount Active</span>
              <span className="text-gray-400 text-sm">Price Increases Soon.</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">HOURS</div>
                </div>
                <span className="text-2xl">:</span>
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">MINUTES</div>
                </div>
                <span className="text-2xl">:</span>
                <div className="text-center">
                  <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">SECONDS</div>
                </div>
              </div>
              <Button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-2 rounded-full shadow-lg shadow-green-500/30"
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-6 py-2 rounded-full border border-pink-500/30 mb-6">
                <span className="text-pink-400">💎</span>
                <span className="text-pink-300">Finally, AI Content That Actually Ranks on Google</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Create & Publish{" "}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  SEO-Dominating Content
                </span>{" "}
                With A Single Click — AI Creates Articles That Rank!
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Generate 6,000+ Word Comprehensive Amazon Reviews, Buying Guides, & Comparison Articles 
                That Outrank Your Competitors - All From Behind the Scenes
              </p>

              {/* Video Placeholder */}
              <div className="relative max-w-3xl mx-auto mb-10 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-purple-500/30">
                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                      <Play className="h-10 w-10 text-white ml-1" fill="white" />
                    </div>
                    <p className="text-gray-400">Click to Watch Demo</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-6 text-xl rounded-full shadow-lg shadow-green-500/30 transform hover:scale-105 transition-all"
                >
                  Get Started With AIWriterPros - Instant Access
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <img src="https://www.viralreel.io/sales/assets/images/money-back.png" alt="30 Day Money Back Guarantee" className="h-16 opacity-90" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Stats */}
        <section className="py-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-y border-purple-500/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10,000+", label: "Articles Generated" },
                { value: "2,500+", label: "Happy Users" },
                { value: "85%", label: "Page 1 Rankings" },
                { value: "$2.4M+", label: "Affiliate Revenue Generated" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Real Results From Real Users
            </h2>
            <p className="text-gray-400 text-center mb-12">Check out what our users are achieving</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">"{t.quote}"</p>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm inline-block mb-4">
                    {t.result}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-gray-400 text-sm">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Old Way vs New Way */}
        <section className="py-16 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              It Used To Take Hours Or Cost $$$ For Quality SEO Content
            </h2>
            <p className="text-gray-400 text-center mb-12">With AIWriterPros, No More!</p>
            
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl border border-purple-500/30 overflow-hidden">
              <div className="grid grid-cols-3 gap-0 text-center">
                <div className="p-4 border-b border-purple-500/30 font-bold text-gray-400">Features</div>
                <div className="p-4 border-b border-x border-purple-500/30 font-bold text-red-400">THE OLD WAY</div>
                <div className="p-4 border-b border-purple-500/30 font-bold text-green-400">The New Way…</div>
                
                {[
                  ["Content Creation", "⚠️ Hours of manual research and writing", "✅ AI generates 6,000+ word articles in minutes"],
                  ["SEO Optimization", "⚠️ Expensive tools and expertise needed", "✅ Built-in SEO analysis and optimization"],
                  ["Competitor Research", "⚠️ Manual analysis of top 10 results", "✅ Automatic competitor gap analysis"],
                  ["Schema Markup", "⚠️ Technical coding knowledge required", "✅ Auto-generated JSON-LD included"],
                  ["Content Variety", "⚠️ One article type at a time", "✅ 5 different article types available"],
                  ["Cost", "⚠️ $200-500 per article outsourced", "✅ Unlimited articles for one low price"],
                ].map((row, i) => (
                  <>
                    <div key={`f-${i}`} className="p-4 border-b border-purple-500/30 text-left font-medium">{row[0]}</div>
                    <div key={`o-${i}`} className="p-4 border-b border-x border-purple-500/30 text-sm text-gray-400">{row[1]}</div>
                    <div key={`n-${i}`} className="p-4 border-b border-purple-500/30 text-sm text-green-300">{row[2]}</div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              AIWriterPros Comes With Powerful Features!
            </h2>
            <p className="text-gray-400 text-center mb-12">Everything you need to dominate search results</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((f, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 hover:border-pink-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <f.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bonuses */}
        <section className="py-16 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              🎁 Plus These Exclusive Bonuses
            </h2>
            <p className="text-gray-400 text-center mb-12">Total Bonus Value: <span className="text-pink-400 font-bold">$1,138</span> - Yours FREE Today!</p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {bonuses.map((b, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-pink-500/30 text-pink-300 px-2 py-0.5 rounded-full">BONUS {i + 1}</span>
                      <span className="text-xs text-gray-400 line-through">{b.value} Value</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{b.title}</h3>
                    <p className="text-gray-400 text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-6 py-2 rounded-full border border-pink-500/30 mx-auto block w-fit mb-6">
              <span className="text-pink-400">💎</span>
              <span className="text-pink-300">Limited Time Offer: Only A One-Time Investment TODAY</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Choose Your AIWriterPros Package
            </h2>
            <p className="text-gray-400 text-center mb-12">Lock in your lifetime access before the price increases</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Starter Package */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 relative">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <p className="text-gray-400 mb-6">Perfect for getting started</p>
                
                <div className="mb-6">
                  <span className="text-gray-400 line-through text-lg">$197</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">$37</span>
                    <span className="text-gray-400">one-time</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "25 Articles per month",
                    "All 5 article types",
                    "Amazon product integration",
                    "Basic SEO optimization",
                    "Export to HTML/Markdown",
                    "Email support",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handlePurchase("starter")}
                  className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 rounded-full"
                >
                  Get Starter Access
                </Button>
              </div>

              {/* Pro Package */}
              <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/40 rounded-2xl p-8 border-2 border-pink-500/50 relative shadow-xl shadow-pink-500/20">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-gray-400 mb-6">Best value for serious marketers</p>
                
                <div className="mb-6">
                  <span className="text-gray-400 line-through text-lg">$297</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-pink-400">$47</span>
                    <span className="text-gray-400">one-time</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "100 Articles per month",
                    "All 5 article types",
                    "Amazon product integration",
                    "Advanced SEO optimization",
                    "Competitor analysis",
                    "Schema markup generation",
                    "AI image generation",
                    "Priority support",
                    "Commercial license",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handlePurchase("pro")}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-full shadow-lg shadow-green-500/30"
                >
                  Get Pro Access - Best Value
                </Button>
              </div>
            </div>

            {/* Guarantee */}
            <div className="max-w-2xl mx-auto mt-12 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Shield className="h-12 w-12 text-green-400" />
                <div className="text-left">
                  <h3 className="text-xl font-bold">30-Day Money-Back Guarantee</h3>
                  <p className="text-gray-400">Try AIWriterPros risk-free. If you're not satisfied, get a full refund.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "How many articles can I create?", a: "Starter plan includes 25 articles/month, Pro includes 100 articles/month. Each article is 6,000-10,000 words of comprehensive, SEO-optimized content." },
                { q: "Do I need any technical skills?", a: "Not at all! Just paste an Amazon URL or enter your topic, and AIWriterPros handles everything - research, writing, SEO optimization, and schema markup." },
                { q: "Can I use this for client work?", a: "Yes! The Pro plan includes a Commercial License, allowing you to create and sell content to clients with no restrictions." },
                { q: "How does the competitor analysis work?", a: "Our AI analyzes the top 10 ranking pages for your keyword, identifies content gaps, and ensures your article covers everything competitors miss - plus more." },
                { q: "Is there a monthly fee?", a: "No! This is a one-time payment for lifetime access. No recurring charges, no hidden fees." },
                { q: "What if I'm not satisfied?", a: "We offer a 30-day money-back guarantee. If AIWriterPros doesn't work for you, just reach out and we'll refund you in full." },
              ].map((faq, i) => (
                <div key={i} className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl border border-purple-500/30">
                  <button className="w-full p-6 text-left flex items-center justify-between">
                    <span className="font-bold">{faq.q}</span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Content That Ranks?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of content creators dominating search results with AI-powered content
            </p>
            <Button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-6 text-xl rounded-full shadow-lg shadow-green-500/30"
            >
              Get Instant Access Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Sales;
