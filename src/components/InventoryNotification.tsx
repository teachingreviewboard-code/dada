import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './InventoryNotification.css';

interface InventoryNotificationProps {
  productId: string;
  productName: string;
  currentStock: number;
}

export default function InventoryNotification({
  productId,
  productName,
  currentStock
}: InventoryNotificationProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('inventory_notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .maybeSingle();

    setIsSubscribed(!!data);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && !email) return;

    setLoading(true);
    const notificationData = {
      product_id: productId,
      user_id: user?.id || null,
      email: user?.email || email,
    };

    const { error } = await supabase
      .from('inventory_notifications')
      .insert([notificationData]);

    if (error) {
      console.error('Error subscribing to notifications:', error);
      alert('Failed to subscribe. Please try again.');
    } else {
      setIsSubscribed(true);
      setShowForm(false);
      alert('You\'ll be notified when this product is back in stock!');
    }
    setLoading(false);
  };

  const handleUnsubscribe = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('inventory_notifications')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error unsubscribing:', error);
    } else {
      setIsSubscribed(false);
    }
  };

  // Only show notification if product is out of stock
  if (currentStock > 0) {
    return null;
  }

  return (
    <div className="inventory-notification">
      <div className="out-of-stock">
        <span className="badge">Out of Stock</span>
        <p>This item is currently out of stock.</p>
        
        {isSubscribed ? (
          <div className="subscribed">
            <p>✅ You'll be notified when {productName} is back in stock!</p>
            {user && (
              <button onClick={handleUnsubscribe} className="unsubscribe-btn">
                Unsubscribe
              </button>
            )}
          </div>
        ) : (
          <div className="subscribe-section">
            <p>Get notified when this product is back in stock:</p>
            {!showForm ? (
              <button 
                onClick={() => setShowForm(true)}
                className="notify-btn"
              >
                Notify Me When Available
              </button>
            ) : (
              <form onSubmit={handleSubscribe} className="notification-form">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={!!user}
                  />
                  {user && <small>Using your account email</small>}
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
