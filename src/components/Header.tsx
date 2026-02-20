import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <h1>SportoKart</h1>
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          {profile?.is_admin && (
            <Link to="/admin">Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-link">
            Cart {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-email" title={profile?.full_name || user.email}>
                {profile?.full_name || user.email}
              </span>
              <button onClick={signOut} className="auth-button" title="Sign out from your account">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="auth-button" title="Sign in to your account">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
