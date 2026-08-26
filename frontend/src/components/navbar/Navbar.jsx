import { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
} from "react-icons/fi";

function Navbar() {

  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // =========================================
  // FETCH CART COUNT
  // =========================================

  const fetchCartCount = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    if (!userId || !token) {

      setCartCount(0);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        setCartCount(0);

        return;
      }


      const data = await response.json();


      const items =
        data?.cartItems || [];


      const totalQuantity =
        items.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 0),
          0
        );


      setCartCount(totalQuantity);


    } catch (error) {

      console.error(
        "Cart count error:",
        error
      );

      setCartCount(0);

    }
  };


  // =========================================
  // LOAD CART COUNT
  // =========================================

  useEffect(() => {

    fetchCartCount();

  }, [location.pathname]);


  // =========================================
  // REFRESH CART WHEN WINDOW GETS FOCUS
  // =========================================

  useEffect(() => {

    const handleFocus = () => {

      fetchCartCount();

    };


    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, []);


  // =========================================
  // CLOSE MOBILE MENU
  // =========================================

  useEffect(() => {

    setMobileMenuOpen(false);

  }, [location.pathname]);


  // =========================================
  // UI
  // =========================================

  return (

    <nav className="navbar">

      <div className="navbar-container">


        {/* =================================
            LOGO
        ================================= */}

        <div className="navbar-left">

          <Link
            to="/"
            className="logo"
          >
            ShopSphere
          </Link>

        </div>


        {/* =================================
            DESKTOP MENU
        ================================= */}

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


        {/* =================================
            DESKTOP RIGHT
        ================================= */}

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

            {cartCount > 0 && (

              <span className="cart-count">
                {cartCount}
              </span>

            )}

          </Link>

        </div>


        {/* =================================
            MOBILE RIGHT
        ================================= */}

        <div className="mobile-navbar-actions">


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="mobile-icon-btn"
            title="Wishlist"
          >
            <FiHeart />
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="mobile-icon-btn mobile-cart-icon"
            title="Cart"
          >

            <FiShoppingBag />

            {cartCount > 0 && (

              <span className="cart-count">
                {cartCount}
              </span>

            )}

          </Link>


          {/* MENU */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            aria-label="Toggle menu"
          >

            {mobileMenuOpen
              ? <FiX />
              : <FiMenu />
            }

          </button>

        </div>

      </div>


      {/* =================================
          MOBILE MENU
      ================================= */}

      {mobileMenuOpen && (

        <div className="mobile-menu">


          {/* SEARCH */}

          <div className="mobile-search-box">

            <FiSearch
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search products..."
            />

          </div>


          {/* LINKS */}

          <div className="mobile-menu-links">

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

            <Link to="/wishlist">
              <FiHeart />
              Wishlist
            </Link>

            <Link to="/login">
              <FiUser />
              Profile
            </Link>

          </div>

        </div>

      )}

    </nav>

  );
}

export default Navbar;