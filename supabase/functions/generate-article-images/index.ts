import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ImageRequest {
  articleTitle: string;
  productName: string;
  keyword: string;
  imageCount: number;
  imageType: "featured" | "body";
  productData?: {
    aboutThisItem?: string[];
    attributes?: Record<string, string>;
    price?: string;
    colors?: string[];
    styles?: string[];
    averageRating?: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { articleTitle, productName, keyword, imageCount = 1, imageType = "body", productData }: ImageRequest = await req.json();

    console.log(`Generating ${imageCount} ${imageType} images for: ${productName || articleTitle}`);

    const images: Array<{ imageUrl: string; altText: string; seoFilename: string; caption: string }> = [];
    const prompts = buildPrompts(articleTitle, productName, keyword, imageCount, imageType, productData);

    for (let i = 0; i < prompts.length; i++) {
      console.log(`Generating image ${i + 1}/${prompts.length}: ${prompts[i].substring(0, 100)}...`);
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [{ role: "user", content: prompts[i] }],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Image gen failed ${i + 1}:`, response.status, errorText);
          if (response.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          images.push({
            imageUrl,
            altText: buildAltText(productName || articleTitle, keyword, i, imageType),
            seoFilename: buildSEOFilename(productName || keyword, i, imageType),
            caption: buildCaption(productName || articleTitle, i, imageType),
          });
          console.log(`Generated image ${i + 1} successfully`);
        }
      } catch (imgError) {
        console.error(`Error generating image ${i + 1}:`, imgError);
      }
    }

    console.log(`Generated ${images.length}/${imageCount} images`);

    return new Response(
      JSON.stringify({ success: true, images, totalRequested: imageCount, totalGenerated: images.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-article-images:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// --- Prompt Building (uses real product data when available) ---

function buildPrompts(
  articleTitle: string, productName: string, keyword: string,
  count: number, imageType: "featured" | "body",
  productData?: ImageRequest["productData"]
): string[] {
  const subject = productName || keyword || articleTitle;
  const prompts: string[] = [];

  // Build context from real product data
  let productContext = '';
  if (productData) {
    const parts: string[] = [];
    if (productData.aboutThisItem?.length) {
      parts.push(`Key features: ${productData.aboutThisItem.slice(0, 3).join('; ')}`);
    }
    if (productData.colors?.length) {
      parts.push(`Available colors: ${productData.colors.join(', ')}`);
    }
    if (productData.price && productData.price !== '$0.00') {
      parts.push(`Price: ${productData.price}`);
    }
    if (productData.averageRating && productData.averageRating > 0) {
      parts.push(`Rating: ${productData.averageRating}/5`);
    }
    if (parts.length) {
      productContext = ` Product details: ${parts.join('. ')}.`;
    }
  }

  if (imageType === "featured") {
    prompts.push(
      `Create a professional, high-quality product photography image of ${subject}.${productContext} ` +
      `Clean, well-lit hero image for a product review. Neutral/gradient background. ` +
      `Modern e-commerce photography style. Aspect ratio: 16:9.`
    );
  } else {
    const variations = [
      `Professional product photo of ${subject} from a unique angle, highlighting design and build quality.${productContext} Studio lighting, white background.`,
      `${subject} in a realistic lifestyle setting showing practical usage.${productContext} Natural lighting, authentic environment.`,
      `Close-up detail shot of ${subject} focusing on key features.${productContext} Macro photography, shallow depth of field.`,
      `${subject} comparison view showing size and scale.${productContext} Clean presentation for a buying guide.`,
      `Infographic-style image of ${subject} main features with visual annotations.${productContext} Modern, clean design.`,
      `${subject} in action, demonstrating primary use case.${productContext} Dynamic, engaging composition.`,
      `Unboxing view of ${subject} showing package contents.${productContext} Product photography style.`,
      `${subject} showing multiple variants or color options.${productContext} Side-by-side clean layout.`,
      `${subject} styled with complementary accessories.${productContext} Aspirational lifestyle scene.`,
      `Clean product shot of ${subject} for comparison article.${productContext} Neutral background.`,
    ];

    for (let i = 0; i < count; i++) {
      prompts.push(variations[i % variations.length]);
    }
  }

  return prompts;
}

function buildSEOFilename(subject: string, index: number, imageType: "featured" | "body"): string {
  const clean = subject.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").substring(0, 50);
  const suffix = imageType === "featured" ? "featured" : `detail-${index + 1}`;
  return `${clean}-${suffix}-${Date.now()}.webp`;
}

function buildAltText(subject: string, keyword: string, index: number, imageType: "featured" | "body"): string {
  if (imageType === "featured") return `${subject} - comprehensive product review and buying guide`;
  const alts = [
    `${subject} product design and build quality`,
    `${subject} in use - practical demonstration`,
    `Close-up of ${subject} key features`,
    `${subject} size comparison for reference`,
    `${subject} feature highlights and specifications`,
    `${subject} real-world usage scenario`,
    `${subject} unboxing and package contents`,
    `${subject} available options and variants`,
    `${subject} with matching accessories`,
    `${subject} product overview for buyers`,
  ];
  return alts[index % alts.length];
}

function buildCaption(subject: string, index: number, imageType: "featured" | "body"): string {
  if (imageType === "featured") return `${subject} - Our comprehensive review covers everything you need to know.`;
  const captions = [
    `The ${subject} features premium build quality and thoughtful design.`,
    `See the ${subject} in action during hands-on testing.`,
    `A closer look at what makes the ${subject} stand out.`,
    `The ${subject} compared to everyday objects for scale.`,
    `Key features of the ${subject} that impressed us.`,
    `Real-world performance of the ${subject}.`,
    `What's included with the ${subject}.`,
    `Available options and variants of the ${subject}.`,
    `The ${subject} pairs well with complementary accessories.`,
    `Our overall assessment of the ${subject}.`,
  ];
  return captions[index % captions.length];
}
