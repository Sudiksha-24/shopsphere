import "./Footer.css";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-column footer-brand">

          <Link to="/" className="footer-logo">
            ShopSphere
          </Link>

          <p>
            Modern fashion and lifestyle
            for everyone.
          </p>

          <div className="social-links">
            <a href="#" aria-label="Instagram">
              Instagram
            </a>

            <a href="#" aria-label="Facebook">
              Facebook
            </a>
          </div>

        </div>


        {/* Shop */}
        <div className="footer-column">

          <h3>Shop</h3>

          <Link to="/products">All Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/products">Men</Link>
          <Link to="/products">Women</Link>
          <Link to="/products">Shoes</Link>
          <Link to="/products">Accessories</Link>

        </div>


        {/* Help */}
        <div className="footer-column">

          <h3>Help</h3>

          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/faq">FAQ</Link>

        </div>


        {/* Account */}
        <div className="footer-column">

          <h3>Account</h3>

          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/profile">My Profile</Link>

        </div>

      </div>


      {/* Bottom */}
      <div className="footer-bottom">

        <p>
          © 2026 ShopSphere. All rights reserved.
        </p>

        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

      </div>

    </footer>
  );
}

export default Footer;