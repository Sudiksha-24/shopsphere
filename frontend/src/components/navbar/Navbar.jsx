import "./Navbar.css";
import { Link } from "react-router-dom";

import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <div className="navbar-left">

          <Link
            to="/"
            className="logo"
          >
            ShopSphere
          </Link>

        </div>


        {/* =========================
            MENU
        ========================= */}

        <div className="navbar-center">

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          <Link to="/about">
            About
          </Link>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="navbar-right">


          {/* SEARCH */}

          <div className="search-box">

            <FiSearch
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search products..."
            />

          </div>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="icon-btn wishlist-icon"
            title="Wishlist"
          >
            <FiHeart />
          </Link>


          {/* PROFILE */}

          <Link
            to="/login"
            className="icon-btn"
            title="Profile"
          >
            <FiUser />
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="icon-btn cart-icon"
            title="Cart"
          >

            <FiShoppingBag />

            <span className="cart-count">
              0
            </span>

          </Link>


        </div>

      </div>

    </nav>
  );
}

export default Navbar;