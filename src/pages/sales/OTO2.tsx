import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, FileText, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTO2 = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("oto2", "accepted");
    navigate("/thank-you");
  };

  const handleDecline = () => {
    navigate("/oto2-downsell");
  };

  const templates = [
    { name: "Product Review Templates", count: 15 },
    { name: "Buying Guide Templates", count: 10 },
    { name: "Comparison Templates", count: 10 },
    { name: "How-To Templates", count: 8 },
    { name: "Roundup Templates", count: 7 },
  ];

  return (
    <>
      <Helmet>
        <title>Done-For-You Templates - AIWriterPros</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-center">
          <p className="text-lg font-bold">🎯 ONE MORE THING... This Will 10X Your Results!</p>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get <span className="text-pink-400">50+ Done-For-You</span> Article Templates
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              Professionally crafted templates for every niche - just fill in and publish!
            </p>
          </div>

          {/* Template Preview */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {templates.map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">{t.name}</h3>
                  <p className="text-gray-400 text-sm">{t.count} templates included</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What You Get:</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                "50+ proven high-converting templates",
                "Pre-optimized for SEO rankings",
                "Fill-in-the-blank simplicity",
                "Works for any niche or product",
                "Regular updates with new templates",
                "Instant access after purchase",
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-400 mb-2">Regular Price: <span className="line-through">$197</span></p>
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="text-5xl font-bold text-pink-400">$47</span>
                <span className="text-gray-400">one-time</span>
              </div>

              <Button 
                onClick={handleAccept}
                size="lg"
                className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 text-xl rounded-full shadow-lg shadow-green-500/30"
              >
                Yes! Add Templates To My Order
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleDecline}
              className="text-gray-500 hover:text-gray-400 text-sm underline"
            >
              No thanks, I'll create my own templates
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTO2;
