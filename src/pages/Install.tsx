import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Smartphone, CheckCircle, Share, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      <Helmet>
        <title>Install AIWriterPros App | Access Anytime</title>
        <meta name="description" content="Install AIWriterPros on your device for quick access to AI content generation. Works offline and loads instantly." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Smartphone className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Install AIWriterPros
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Get instant access to AI-powered content generation right from your home screen.
            </p>

            {isInstalled ? (
              <div className="card-elevated p-8 text-center">
                <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Already Installed!</h2>
                <p className="text-muted-foreground">
                  AIWriterPros is installed on your device. Look for it on your home screen.
                </p>
              </div>
            ) : isIOS ? (
              <div className="card-elevated p-8">
                <h2 className="text-xl font-bold mb-6">Install on iPhone/iPad</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Share className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">1. Tap the Share button</p>
                      <p className="text-sm text-muted-foreground">Located at the bottom of Safari</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">2. Tap "Add to Home Screen"</p>
                      <p className="text-sm text-muted-foreground">Scroll down in the share menu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold">3. Tap "Add"</p>
                      <p className="text-sm text-muted-foreground">The app icon will appear on your home screen</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              <Button size="lg" onClick={handleInstall} className="btn-hero">
                <Download className="mr-2 h-5 w-5" />
                Install App
              </Button>
            ) : (
              <div className="card-elevated p-8">
                <h2 className="text-xl font-bold mb-4">Installation Available</h2>
                <p className="text-muted-foreground mb-6">
                  Your browser supports installing this app. Look for the install icon in your browser's address bar, or use your browser's menu to install.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Chrome:</strong> Click the install icon in the address bar</p>
                  <p><strong>Edge:</strong> Click the ⋯ menu → Apps → Install this site as an app</p>
                  <p><strong>Firefox:</strong> Not yet supported, use Chrome or Edge</p>
                </div>
              </div>
            )}

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Works Offline",
                  description: "Access your content even without internet"
                },
                {
                  title: "Instant Loading",
                  description: "Opens immediately, just like a native app"
                },
                {
                  title: "Always Updated",
                  description: "Automatically gets the latest features"
                }
              ].map((feature, i) => (
                <div key={i} className="card-elevated p-4 text-center">
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Install;