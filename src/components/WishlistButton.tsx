import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './WishlistButton.css';

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlistStatus();
    }
  }, [user, productId]);

  const checkWishlistStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    setIsInWishlist(!!data);
  };

  const toggleWishlist = async () => {
    if (!user) return;

    setLoading(true);
    if (isInWishlist) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setIsInWishlist(false);
      }
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist')
        .insert([
          {
            user_id: user.id,
            product_id: productId,
          },
        ]);

      if (!error) {
        setIsInWishlist(true);
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={!user || loading}
      className={`wishlist-button ${isInWishlist ? 'in-wishlist' : ''}`}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          {isInWishlist ? '❤️' : '🤍'}
          {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </>
      )}
    </button>
  );
}
