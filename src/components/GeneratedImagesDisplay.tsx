import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export interface GeneratedImage {
  url: string;
  filename: string;
  altText: string;
  placement: string;
  type: "featured" | "body";
}

interface GeneratedImagesDisplayProps {
  images: GeneratedImage[];
}

export function GeneratedImagesDisplay({ images }: GeneratedImagesDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const handleCopyAlt = (altText: string, index: number) => {
    navigator.clipboard.writeText(altText);
    setCopiedIndex(index);
    toast({ title: "Copied", description: "ALT text copied to clipboard" });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const featuredImage = images.find(img => img.type === "featured");
  const bodyImages = images.filter(img => img.type === "body");

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Image className="h-5 w-5" />
          Generated Images ({images.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Image */}
        {featuredImage && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">Featured Image</Badge>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {featuredImage.url ? (
                  <img 
                    src={featuredImage.url} 
                    alt={featuredImage.altText}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Image will be generated</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-muted/30 space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Filename:</p>
                  <p className="text-sm font-mono break-all">{featuredImage.filename}</p>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">ALT Text:</p>
                    <p className="text-sm">{featuredImage.altText}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyAlt(featuredImage.altText, -1)}
                  >
                    {copiedIndex === -1 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Body Images */}
        {bodyImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Body Images ({bodyImages.length})</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bodyImages.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {image.url ? (
                      <img 
                        src={image.url} 
                        alt={image.altText}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Image className="h-8 w-8 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">#{index + 1}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-muted/30 space-y-1.5 text-xs">
                    <div>
                      <p className="font-medium text-muted-foreground">File:</p>
                      <p className="font-mono break-all">{image.filename}</p>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex-1">
                        <p className="font-medium text-muted-foreground">ALT:</p>
                        <p className="line-clamp-2">{image.altText}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyAlt(image.altText, index)}
                      >
                        {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Placement:</p>
                      <p>{image.placement}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default GeneratedImagesDisplay;
