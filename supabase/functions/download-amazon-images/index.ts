import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function upgradeToHighResImage(thumbnailUrl: string): string {
  return thumbnailUrl.replace(/._[^.]+_\.(jpeg|jpg|gif|png|webp|bmp|svg)/, '._SL1500_.$1');
}

function generateSEOFilename(productName: string, index: number): string {
  const clean = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return `${clean}-image-${index + 1}-${Date.now()}.jpg`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, productName, userId } = await req.json();

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'imageUrls array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'userId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: Array<{
      originalUrl: string;
      highResUrl: string;
      storagePath: string;
      publicUrl: string;
      seoFilename: string;
      altText: string;
    }> = [];

    for (let i = 0; i < Math.min(imageUrls.length, 6); i++) {
      const originalUrl = imageUrls[i];
      const highResUrl = upgradeToHighResImage(originalUrl);

      try {
        console.log(`Downloading image ${i + 1}: ${highResUrl.substring(0, 100)}...`);

        const imgResponse = await fetch(highResUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          },
        });

        if (!imgResponse.ok) {
          console.error(`Failed to download image ${i + 1}: ${imgResponse.status}`);
          continue;
        }

        const imageData = await imgResponse.arrayBuffer();
        const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
        const seoFilename = generateSEOFilename(productName || 'product', i);
        const storagePath = `${userId}/${seoFilename}`;

        const { error: uploadError } = await supabase.storage
          .from('article-images')
          .upload(storagePath, imageData, {
            contentType,
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for image ${i + 1}:`, uploadError);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('article-images')
          .getPublicUrl(storagePath);

        const altText = `${productName || 'Product'} - Image ${i + 1}`;

        results.push({
          originalUrl,
          highResUrl,
          storagePath,
          publicUrl: publicUrlData.publicUrl,
          seoFilename,
          altText,
        });

        console.log(`Successfully stored image ${i + 1}: ${seoFilename}`);
      } catch (imgError) {
        console.error(`Error processing image ${i + 1}:`, imgError);
        continue;
      }
    }

    console.log(`Downloaded and stored ${results.length}/${imageUrls.length} images`);

    return new Response(
      JSON.stringify({
        success: true,
        images: results,
        totalRequested: imageUrls.length,
        totalDownloaded: results.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in download-amazon-images:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
