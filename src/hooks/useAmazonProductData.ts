import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isValidAmazonURL, type AmazonProductData } from '@/utils/amazonScraper';

interface UseAmazonProductDataReturn {
  productData: AmazonProductData | null;
  isLoading: boolean;
  error: string | null;
  scraped: boolean;
  fetchProductData: (productUrl: string, productName?: string) => Promise<AmazonProductData | null>;
  clearProductData: () => void;
}

export function useAmazonProductData(): UseAmazonProductDataReturn {
  const [productData, setProductData] = useState<AmazonProductData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scraped, setScraped] = useState(false);
  const cache = useRef<Map<string, AmazonProductData>>(new Map());

  const fetchProductData = useCallback(async (
    productUrl: string,
    productName?: string
  ): Promise<AmazonProductData | null> => {
    if (!productUrl) {
      setError('Product URL is required');
      return null;
    }

    if (!isValidAmazonURL(productUrl)) {
      setError('Invalid Amazon URL. Please provide a valid Amazon product page URL.');
      return null;
    }

    // Check cache
    const cached = cache.current.get(productUrl);
    if (cached) {
      setProductData(cached);
      setScraped(true);
      setError(null);
      return cached;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('scrape-amazon-product', {
        body: { productUrl, productName },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to scrape product');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const product = data as AmazonProductData & { _scraped?: boolean };
      setProductData(product);
      setScraped(product._scraped || false);
      cache.current.set(productUrl, product);

      return product;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch product data';
      setError(message);
      console.error('Error fetching Amazon product data:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearProductData = useCallback(() => {
    setProductData(null);
    setError(null);
    setScraped(false);
  }, []);

  return {
    productData,
    isLoading,
    error,
    scraped,
    fetchProductData,
    clearProductData,
  };
}
