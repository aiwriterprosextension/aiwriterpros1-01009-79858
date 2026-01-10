import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, ArrowRight, Play, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const purchaseTier = localStorage.getItem("purchaseTier") || "starter";
  const oto1 = localStorage.getItem("oto1");
  const oto2 = localStorage.getItem("oto2");

  return (
    <>
      <Helmet>
        <title>Thank You! - AIWriterPros</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f23] text-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎉 Congratulations! You're In!
            </h1>
            <p className="text-xl text-gray-300">
              Your AIWriterPros account is ready to use
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Order Summary:</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>AIWriterPros {purchaseTier === "pro" ? "Pro" : "Starter"} Access</span>
                </div>
                <span className="text-green-400">✓ Included</span>
              </div>
              
              {oto1 && (
                <div className="flex items-center justify-between py-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{oto1 === "accepted" ? "Unlimited Access" : "Unlimited Lite"}</span>
                  </div>
                  <span className="text-green-400">✓ Added</span>
                </div>
              )}
              
              {oto2 && (
                <div className="flex items-center justify-between py-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>{oto2 === "accepted" ? "50+ Template Pack" : "25 Essential Templates"}</span>
                  </div>
                  <span className="text-green-400">✓ Added</span>
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-purple-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>All Bonuses</span>
                </div>
                <span className="text-green-400">✓ Included</span>
              </div>
            </div>
          </div>

          {/* Access Button */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Creating?</h3>
            <Link to="/auth">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-10 py-6 text-xl rounded-full shadow-lg shadow-green-500/30"
              >
                Access Your Dashboard Now
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Quick Start Video */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-2xl p-8 border border-purple-500/30 mb-8">
            <h3 className="text-xl font-bold mb-4 text-center">Quick Start Guide</h3>
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <Play className="h-8 w-8 text-white ml-1" fill="white" />
                </div>
                <p className="text-gray-400">Watch: Getting Started in 5 Minutes</p>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 text-center">
              <Mail className="h-8 w-8 text-pink-400 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Email Support</h4>
              <p className="text-gray-400 text-sm">support@aiwriterpros.com</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 border border-purple-500/30 text-center">
              <MessageCircle className="h-8 w-8 text-pink-400 mx-auto mb-4" />
              <h4 className="font-bold mb-2">Live Chat</h4>
              <p className="text-gray-400 text-sm">Available 9am-5pm EST</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;
