import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Sparkles } from "lucide-react";

export interface ImageConfig {
  includeFeaturedImage: boolean;
  additionalImageCount: number;
  imageSource: "amazon" | "ai-generated";
}

interface ImageSettingsProps {
  config: ImageConfig;
  onChange: (config: ImageConfig) => void;
  showAmazonOption?: boolean;
}

export function ImageSettings({ config, onChange, showAmazonOption = true }: ImageSettingsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Image className="h-5 w-5" />
          Image Settings
        </CardTitle>
        <CardDescription>Configure featured and article images</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Image Toggle */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="includeFeaturedImage"
            checked={config.includeFeaturedImage}
            onCheckedChange={(checked) => 
              onChange({ ...config, includeFeaturedImage: checked as boolean })
            }
          />
          <div>
            <Label htmlFor="includeFeaturedImage" className="font-medium cursor-pointer">
              Include Featured Image
            </Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Display a main image at the top of the article
            </p>
          </div>
        </div>

        {/* Additional Images Count */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Additional Body Images</Label>
            <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
              {config.additionalImageCount}
            </span>
          </div>
          <Slider
            value={[config.additionalImageCount]}
            onValueChange={([value]) => 
              onChange({ ...config, additionalImageCount: value })
            }
            min={0}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        {/* Image Source Selection */}
        <div className="space-y-2">
          <Label>Image Source</Label>
          <Select
            value={config.imageSource}
            onValueChange={(value: "amazon" | "ai-generated") => 
              onChange({ ...config, imageSource: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {showAmazonOption && (
                <SelectItem value="amazon">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Amazon Product Images</span>
                  </div>
                </SelectItem>
              )}
              <SelectItem value="ai-generated">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Generated Images</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {config.imageSource === "amazon" 
              ? "Extract and use images from the Amazon product page"
              : "Generate unique images using AI based on article content"
            }
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Image Optimization</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• SEO-optimized filenames using keywords</li>
            <li>• Descriptive ALT text for accessibility</li>
            <li>• Strategic placement at section breaks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ImageSettings;
