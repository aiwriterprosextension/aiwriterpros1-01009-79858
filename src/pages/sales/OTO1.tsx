import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, X, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/logo-white.png";

const OTO1 = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("oto1", "accepted");
    navigate("/oto2");
  };

  const handleDecline = () => {
    navigate("/oto1-downsell");
  };

  return (
    <>
      <Helmet>
        <title>Wait! Upgrade to Unlimited - AIWriterPros</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        {/* Warning Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 py-3 text-center">
          <p className="text-lg font-bold">⚠️ WAIT! Your Order Is Not Complete Yet...</p>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img src={logoWhite} alt="AIWriterPros" className="h-10 mx-auto" />
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Unlock <span className="text-pink-400">UNLIMITED</span> Article Generation
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Remove all limits and create as many articles as you want - forever!
            </p>
            <div className="inline-flex items-center gap-2 bg-pink-500/20 px-4 py-2 rounded-full border border-pink-500/30">
              <Zap className="h-5 w-5 text-pink-400" />
              <span className="text-pink-300">One-Time Upgrade - 77% OFF</span>
            </div>
          </div>

          {/* Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-red-900/20 to-red-900/10 rounded-xl p-6 border border-red-500/30">
              <h3 className="text-xl font-bold mb-4 text-red-400">Without Unlimited:</h3>
              <ul className="space-y-3">
                {[
                  "Limited to 25-100 articles/month",
                  "May run out during peak campaigns",
                  "Have to wait for monthly reset",
                  "Miss opportunities due to limits",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-900/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-xl font-bold mb-4 text-green-400">With Unlimited Upgrade:</h3>
              <ul className="space-y-3">
                {[
                  "Create UNLIMITED articles forever",
                  "Scale your content production",
                  "Never worry about limits again",
                  "Dominate any niche you enter",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-pink-500/30 text-center mb-8">
            <p className="text-gray-400 mb-2">Regular Price: <span className="line-through">$297/month</span></p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-6xl font-bold text-pink-400">$67</span>
              <span className="text-gray-400">one-time payment</span>
            </div>
            <p className="text-green-400 mb-6">Save $3,267/year with this upgrade!</p>

            <ul className="space-y-2 mb-8 max-w-md mx-auto">
              {[
                "Unlimited article generation",
                "Priority processing queue",
                "Advanced AI models access",
                "Lifetime updates included",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={handleAccept}
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-xl rounded-full shadow-lg shadow-green-500/30"
            >
              Yes! Upgrade Me To Unlimited
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>

          <div className="text-center">
            <button 
              onClick={handleDecline}
              className="text-gray-500 hover:text-gray-400 text-sm underline"
            >
              No thanks, I'll stick with limited articles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTO1;
