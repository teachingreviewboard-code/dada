import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SportoKart</h3>
            <p>Your ultimate destination for premium skates</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <Link to="/products?category=inline-skates">Inline Skates</Link>
            <Link to="/products?category=roller-skates">Roller Skates</Link>
            <Link to="/products?category=ice-skates">Ice Skates</Link>
            <Link to="/products?category=accessories">Accessories</Link>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@sportokart.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 SportoKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
