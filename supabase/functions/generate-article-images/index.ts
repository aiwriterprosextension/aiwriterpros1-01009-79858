import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageRequest {
  articleTitle: string;
  productName: string;
  keyword: string;
  imageCount: number;
  imageType: "featured" | "body";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { articleTitle, productName, keyword, imageCount = 1, imageType = "body" }: ImageRequest = await req.json();

    console.log(`Generating ${imageCount} ${imageType} images for: ${productName || articleTitle}`);

    const images: Array<{
      imageUrl: string;
      altText: string;
      seoFilename: string;
      caption: string;
    }> = [];

    // Generate prompts for each image
    const prompts = generateImagePrompts(articleTitle, productName, keyword, imageCount, imageType);

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      console.log(`Generating image ${i + 1}/${prompts.length}: ${prompt.substring(0, 100)}...`);

      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Image generation failed for image ${i + 1}:`, response.status, errorText);
          
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          if (response.status === 402) {
            return new Response(
              JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
              { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          continue; // Skip this image and try the next
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (imageUrl) {
          const seoFilename = generateSEOFilename(productName || keyword, i, imageType);
          const altText = generateAltText(productName || articleTitle, keyword, i, imageType);
          const caption = generateCaption(productName || articleTitle, i, imageType);

          images.push({
            imageUrl,
            altText,
            seoFilename,
            caption,
          });

          console.log(`Successfully generated image ${i + 1}: ${seoFilename}`);
        }
      } catch (imgError) {
        console.error(`Error generating image ${i + 1}:`, imgError);
        continue;
      }
    }

    console.log(`Generated ${images.length}/${imageCount} images successfully`);

    return new Response(
      JSON.stringify({
        success: true,
        images,
        totalRequested: imageCount,
        totalGenerated: images.length,
      }),
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

function generateImagePrompts(
  articleTitle: string,
  productName: string,
  keyword: string,
  count: number,
  imageType: "featured" | "body"
): string[] {
  const subject = productName || keyword || articleTitle;
  const prompts: string[] = [];

  if (imageType === "featured") {
    prompts.push(
      `Create a professional, high-quality product photography image of ${subject}. ` +
      `The image should be clean, well-lit, and suitable as a featured hero image for a product review article. ` +
      `Use a neutral or gradient background. The product should be the clear focal point. ` +
      `Style: modern, professional e-commerce photography. Aspect ratio: 16:9.`
    );
  } else {
    const bodyPromptVariations = [
      `Professional product photo of ${subject} shown from a unique angle, highlighting its design and build quality. Clean white background, studio lighting.`,
      `${subject} in a realistic lifestyle setting showing practical usage. Natural lighting, authentic environment.`,
      `Close-up detail shot of ${subject} focusing on key features and craftsmanship. Macro photography style with shallow depth of field.`,
      `${subject} comparison view showing size and scale with common objects. Clean presentation suitable for a buying guide.`,
      `Infographic-style image showcasing the main features of ${subject} with visual annotations. Modern, clean design.`,
      `${subject} in action, demonstrating its primary use case. Dynamic, engaging composition.`,
      `Unboxing or packaging view of ${subject} showing what comes in the box. Product photography style.`,
      `Side-by-side view of ${subject} showing multiple color options or variants if applicable.`,
      `${subject} styled with complementary accessories in an aspirational lifestyle scene.`,
      `Clean product shot of ${subject} suitable for a product roundup or comparison article.`,
    ];

    for (let i = 0; i < count; i++) {
      prompts.push(bodyPromptVariations[i % bodyPromptVariations.length]);
    }
  }

  return prompts;
}

function generateSEOFilename(subject: string, index: number, imageType: "featured" | "body"): string {
  // Clean the subject for filename
  const cleanSubject = subject
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);

  const timestamp = Date.now();
  const suffix = imageType === "featured" ? "featured" : `detail-${index + 1}`;

  return `${cleanSubject}-${suffix}-${timestamp}.webp`;
}

function generateAltText(subject: string, keyword: string, index: number, imageType: "featured" | "body"): string {
  if (imageType === "featured") {
    return `${subject} - comprehensive product review and buying guide`;
  }

  const altVariations = [
    `${subject} product design and build quality`,
    `${subject} in use - practical demonstration`,
    `Close-up of ${subject} key features`,
    `${subject} size comparison for reference`,
    `${subject} feature highlights and specifications`,
    `${subject} being used in real-world scenario`,
    `${subject} unboxing and package contents`,
    `${subject} available color and style options`,
    `${subject} styled with matching accessories`,
    `${subject} product overview for buyers`,
  ];

  return altVariations[index % altVariations.length];
}

function generateCaption(subject: string, index: number, imageType: "featured" | "body"): string {
  if (imageType === "featured") {
    return `${subject} - Our comprehensive review covers everything you need to know before buying.`;
  }

  const captionVariations = [
    `The ${subject} features premium build quality and thoughtful design.`,
    `See the ${subject} in action during our hands-on testing.`,
    `A closer look at what makes the ${subject} stand out from competitors.`,
    `The ${subject} compared to everyday objects for size reference.`,
    `Key features of the ${subject} that impressed us during testing.`,
    `Real-world performance of the ${subject} in typical usage scenarios.`,
    `What's included when you purchase the ${subject}.`,
    `Available options and variants of the ${subject}.`,
    `The ${subject} pairs well with these complementary accessories.`,
    `Our overall assessment of the ${subject} design and functionality.`,
  ];

  return captionVariations[index % captionVariations.length];
}
