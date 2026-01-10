import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTO1Downsell = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("oto1", "downsell");
    navigate("/oto2");
  };

  const handleDecline = () => {
    navigate("/oto2");
  };

  return (
    <>
      <Helmet>
        <title>Wait! Special Lite Offer - AIWriterPros</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        {/* Warning Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-center">
          <p className="text-lg font-bold">🎁 WAIT! We Have A Special Offer Just For You...</p>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We Understand Budget Concerns...
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            How about a lighter version at a fraction of the cost?
          </p>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-4">Unlimited Lite</h2>
            <p className="text-gray-400 mb-6">Get 500 articles per month - that's 5x more than Pro!</p>
            
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-gray-400 line-through">$67</span>
              <span className="text-5xl font-bold text-green-400">$37</span>
              <span className="text-gray-400">one-time</span>
            </div>

            <ul className="space-y-2 mb-8 max-w-md mx-auto text-left">
              {[
                "500 articles per month",
                "All 5 article types",
                "Full SEO optimization",
                "Competitor analysis",
                "Lifetime updates",
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
              Yes! Give Me The Lite Upgrade
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>

          <button 
            onClick={handleDecline}
            className="text-gray-500 hover:text-gray-400 text-sm underline"
          >
            No thanks, continue without upgrade
          </button>
        </div>
      </div>
    </>
  );
};

export default OTO1Downsell;
