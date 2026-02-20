import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import ProductCard from './ProductCard';
import './ProductRecommendations.css';

interface ProductRecommendationsProps {
  currentProductId?: string;
  categoryId?: string;
  limit?: number;
  title?: string;
}

export default function ProductRecommendations({
  currentProductId,
  categoryId,
  limit = 4,
  title = "You might also like"
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, [currentProductId, categoryId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select('*, categories(*)')
      .eq('is_active', true)
      .neq('id', currentProductId || '')
      .limit(limit * 2); // Get more to have better selection

    // If categoryId is provided, prioritize products from same category
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data } = await query.order('created_at', { ascending: false });

    if (data) {
      // Simple recommendation algorithm:
      // 1. Mix of same category products
      // 2. Featured products
      // 3. Recently added products
      
      let recommendations = [...data];
      
      // Shuffle and take top products
      recommendations.sort(() => Math.random() - 0.5);
      
      // Prioritize featured products
      const featured = recommendations.filter(p => p.is_featured);
      const regular = recommendations.filter(p => !p.is_featured);
      
      const finalRecommendations = [
        ...featured.slice(0, Math.ceil(limit / 2)),
        ...regular.slice(0, Math.floor(limit / 2))
      ].slice(0, limit);

      setProducts(finalRecommendations);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="recommendations">
        <h2>{title}</h2>
        <div className="loading">Loading recommendations...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="recommendations">
      <h2>{title}</h2>
      <div className="recommendations-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
