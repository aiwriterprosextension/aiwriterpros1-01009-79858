import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const OTO2Downsell = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("oto2", "downsell");
    navigate("/thank-you");
  };

  const handleDecline = () => {
    navigate("/thank-you");
  };

  return (
    <>
      <Helmet>
        <title>Lite Template Pack - AIWriterPros</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-center">
          <p className="text-lg font-bold">🎁 LAST CHANCE! Reduced Template Pack...</p>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get 25 Essential Templates
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            The most popular templates at a reduced price
          </p>

          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Essential Template Pack</h2>
            <p className="text-gray-400 mb-6">25 hand-picked best-performing templates</p>
            
            <div className="flex items-baseline justify-center gap-2 mb-6">
              <span className="text-gray-400 line-through">$47</span>
              <span className="text-5xl font-bold text-green-400">$27</span>
              <span className="text-gray-400">one-time</span>
            </div>

            <ul className="space-y-2 mb-8 max-w-md mx-auto text-left">
              {[
                "25 proven templates",
                "Covers all 5 article types",
                "SEO-optimized structures",
                "Easy fill-in-the-blank format",
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
              Yes! Add 25 Templates For $27
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>

          <button 
            onClick={handleDecline}
            className="text-gray-500 hover:text-gray-400 text-sm underline"
          >
            No thanks, complete my order
          </button>
        </div>
      </div>
    </>
  );
};

export default OTO2Downsell;
