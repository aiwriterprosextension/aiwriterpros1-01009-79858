import { Helmet } from "react-helmet-async";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tone, setTone] = useState("balanced");
  const [wordCount, setWordCount] = useState(6000);
  const [exportFormat, setExportFormat] = useState("html");
  const [layout, setLayout] = useState("comfortable");
  
  // Exit Intent Configuration
  const [exitIntentEnabled, setExitIntentEnabled] = useState(true);
  const [exitIntentTitle, setExitIntentTitle] = useState("Wait! Before You Go...");
  const [exitIntentDescription, setExitIntentDescription] = useState("Get 20% off your first month when you upgrade to Pro today!");
  const [exitIntentCtaText, setExitIntentCtaText] = useState("Claim Your Discount");
  const [exitIntentCtaUrl, setExitIntentCtaUrl] = useState("/pricing");
  const [exitIntentDelay, setExitIntentDelay] = useState([3000]);
  const [exitIntentDisplayOnce, setExitIntentDisplayOnce] = useState(true);
  
  // Social Proof Configuration
  const [socialProofEnabled, setSocialProofEnabled] = useState(true);
  const [socialProofInterval, setSocialProofInterval] = useState([8]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      // Save popup config
      const { error: popupError } = await (supabase as any)
        .from('popup_config')
        .upsert({
          user_id: user.id,
          enabled: exitIntentEnabled,
          title: exitIntentTitle,
          description: exitIntentDescription,
          cta_text: exitIntentCtaText,
          cta_url: exitIntentCtaUrl,
          trigger_delay: exitIntentDelay[0],
          display_once: exitIntentDisplayOnce,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });
      
      if (popupError) throw popupError;
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-4xl">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Settings</h1>
            <p className="text-sm md:text-base text-muted-foreground">Customize your content preferences and export options</p>
          </div>

          {/* Content Preferences */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Content Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="tone" className="text-base font-semibold mb-2 block">Default Tone</Label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="professional">Professional</option>
                  <option value="balanced">Balanced</option>
                  <option value="conversational">Conversational</option>
                  <option value="technical">Technical</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div>
                <Label htmlFor="wordCount" className="text-base font-semibold mb-2 block">
                  Default Word Count: {wordCount.toLocaleString()}
                </Label>
                <input
                  id="wordCount"
                  type="range"
                  min="3000"
                  max="10000"
                  step="500"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>3,000</span>
                  <span>10,000</span>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Auto-Include Sections</Label>
                <div className="space-y-3">
                  {[
                    { id: "schema", label: "Schema Markup" },
                    { id: "faq", label: "FAQ Section" },
                    { id: "comparison", label: "Comparison Tables" },
                    { id: "reviews", label: "Customer Review Analysis" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked
                        className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <label htmlFor={item.id} className="ml-2 text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export Preferences */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Export Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Format</Label>
                <div className="space-y-2">
                  {[
                    { value: "html", label: "HTML" },
                    { value: "markdown", label: "Markdown" },
                    { value: "text", label: "Plain Text" },
                  ].map((format) => (
                    <div key={format.value} className="flex items-center">
                      <input
                        type="radio"
                        id={format.value}
                        name="exportFormat"
                        value={format.value}
                        checked={exportFormat === format.value}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor={format.value} className="ml-2 text-sm">
                        {format.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Include in Export</Label>
                <div className="space-y-3">
                  {[
                    { id: "meta", label: "Meta Tags" },
                    { id: "schemaSeparate", label: "Schema Markup (Separate File)" },
                    { id: "images", label: "Image Placeholders" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked
                        className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <label htmlFor={item.id} className="ml-2 text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interface Preferences */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Interface Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Dashboard Layout</Label>
                <div className="space-y-2">
                  {[
                    { value: "compact", label: "Compact" },
                    { value: "comfortable", label: "Comfortable (Default)" },
                    { value: "spacious", label: "Spacious" },
                  ].map((layoutOption) => (
                    <div key={layoutOption.value} className="flex items-center">
                      <input
                        type="radio"
                        id={layoutOption.value}
                        name="layout"
                        value={layoutOption.value}
                        checked={layout === layoutOption.value}
                        onChange={(e) => setLayout(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor={layoutOption.value} className="ml-2 text-sm">
                        {layoutOption.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">Theme</Label>
                <p className="text-sm text-muted-foreground">Light (Only option currently)</p>
              </div>
            </div>
          </div>

          {/* Exit Intent Configuration */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Exit Intent Popup</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="exitIntentEnabled" className="text-base font-semibold">Enable Exit Intent Popup</Label>
                  <p className="text-sm text-muted-foreground mt-1">Show popup when visitors attempt to leave</p>
                </div>
                <Switch
                  id="exitIntentEnabled"
                  checked={exitIntentEnabled}
                  onCheckedChange={setExitIntentEnabled}
                />
              </div>

              {exitIntentEnabled && (
                <>
                  <div>
                    <Label htmlFor="exitIntentTitle">Popup Title</Label>
                    <Input
                      id="exitIntentTitle"
                      value={exitIntentTitle}
                      onChange={(e) => setExitIntentTitle(e.target.value)}
                      placeholder="Wait! Before You Go..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="exitIntentDescription">Description</Label>
                    <Textarea
                      id="exitIntentDescription"
                      value={exitIntentDescription}
                      onChange={(e) => setExitIntentDescription(e.target.value)}
                      placeholder="Describe your offer..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exitIntentCtaText">Button Text</Label>
                      <Input
                        id="exitIntentCtaText"
                        value={exitIntentCtaText}
                        onChange={(e) => setExitIntentCtaText(e.target.value)}
                        placeholder="Claim Your Discount"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exitIntentCtaUrl">Button URL</Label>
                      <Input
                        id="exitIntentCtaUrl"
                        value={exitIntentCtaUrl}
                        onChange={(e) => setExitIntentCtaUrl(e.target.value)}
                        placeholder="/pricing"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="exitIntentDelay">Trigger Delay: {exitIntentDelay[0]}ms</Label>
                    <Slider
                      id="exitIntentDelay"
                      min={1000}
                      max={5000}
                      step={500}
                      value={exitIntentDelay}
                      onValueChange={setExitIntentDelay}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1s</span>
                      <span>5s</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="exitIntentDisplayOnce"
                      checked={exitIntentDisplayOnce}
                      onCheckedChange={setExitIntentDisplayOnce}
                    />
                    <Label htmlFor="exitIntentDisplayOnce">Display once per session</Label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Social Proof Configuration */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Social Proof Notifications</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="socialProofEnabled" className="text-base font-semibold">Enable Social Proof</Label>
                  <p className="text-sm text-muted-foreground mt-1">Show recent activity notifications</p>
                </div>
                <Switch
                  id="socialProofEnabled"
                  checked={socialProofEnabled}
                  onCheckedChange={setSocialProofEnabled}
                />
              </div>

              {socialProofEnabled && (
                <>
                  <div>
                    <Label htmlFor="socialProofInterval">Display Interval: {socialProofInterval[0]} seconds</Label>
                    <Slider
                      id="socialProofInterval"
                      min={5}
                      max={15}
                      step={1}
                      value={socialProofInterval}
                      onValueChange={setSocialProofInterval}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5s</span>
                      <span>15s</span>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Preview</p>
                    <div className="bg-background p-3 rounded border">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">⭐</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            <span className="font-semibold">Sarah M.</span> from New York, USA
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            just created a buying guide
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="card-elevated p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Account Information</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user?.email || ''} disabled className="mt-1" />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">Current Plan: {profile?.subscription_tier || 'Free'}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.articles_created_this_month || 0} articles created this month
                      </p>
                    </div>
                    {profile?.subscription_tier === 'free' && (
                      <Link to="/pricing">
                        <Button className="bg-primary text-primary-foreground">
                          Upgrade to Pro
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Usage resets on: {profile?.usage_reset_date ? new Date(profile.usage_reset_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="btn-hero gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
      
      <MobileBottomNav />
    </div>
  );
};

export default SettingsPage;
