import { useEffect, useState } from "react";
import "./ProductCard.css";

function ProductCard({ product }) {

  const [isWishlist, setIsWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);


  // =====================================
  // CHECK WISHLIST
  // =====================================

  useEffect(() => {

    checkWishlist();

  }, [product.id]);


  const checkWishlist = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setIsWishlist(false);
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/wishlist/check?userId=${userId}&productId=${product.id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        console.error(
          "Wishlist check failed:",
          response.status
        );

        return;
      }


      const data = await response.json();

      setIsWishlist(data);

    } catch (error) {

      console.error(
        "Wishlist check error:",
        error
      );

    }
  };


  // =====================================
  // ADD / REMOVE WISHLIST
  // =====================================

  const handleWishlist = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    // User login check

    if (!userId || !token) {

      alert("Please login first.");

      return;
    }


    if (wishlistLoading) {
      return;
    }


    setWishlistLoading(true);


    try {


      // =================================
      // REMOVE FROM WISHLIST
      // =================================

      if (isWishlist) {

        const response = await fetch(
          `http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${product.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const text =
          await response.text();


        if (!response.ok) {

          throw new Error(
            text ||
            `Failed to remove from wishlist (${response.status})`
          );

        }


        setIsWishlist(false);

        alert(
          `${product.title} removed from wishlist`
        );

      }


      // =================================
      // ADD TO WISHLIST
      // =================================

      else {

        const response = await fetch(
          `http://localhost:8080/api/wishlist/add?userId=${userId}&productId=${product.id}`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        const text =
          await response.text();


        if (!response.ok) {

          throw new Error(
            text ||
            `Failed to add to wishlist (${response.status})`
          );

        }


        console.log(
          "Wishlist response:",
          text
        );


        setIsWishlist(true);

        alert(
          `${product.title} added to wishlist ❤️`
        );

      }


    } catch (error) {

      console.error(
        "Wishlist error:",
        error
      );


      alert(
        error.message ||
        "Unable to update wishlist."
      );

    } finally {

      setWishlistLoading(false);

    }
  };


  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    // User login check

    if (!userId || !token) {

      alert("Please login first.");

      return;
    }


    if (cartLoading) {
      return;
    }


    setCartLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8080/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`,
          },

          body: JSON.stringify({
            userId: Number(userId),

            productId: product.id,

            quantity: 1,
          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        console.error(
          "Cart error:",
          text
        );


        throw new Error(
          text ||
          `Failed to add product to cart (${response.status})`
        );

      }


      console.log(
        "Cart response:",
        text
      );


      alert(
        `${product.title} added to cart!`
      );


    } catch (error) {

      console.error(
        "Add to cart error:",
        error
      );


      alert(
        error.message ||
        "Unable to add product to cart."
      );


    } finally {

      setCartLoading(false);

    }
  };


  // =====================================
  // UI
  // =====================================

  return (

    <div className="product-card">


      {/* ================================
          PRODUCT IMAGE
      ================================= */}

      <div className="product-image-wrapper">


        <img
          src={`http://localhost:8080/images/${product.imageUrl}`}
          alt={product.title}
          className="product-image"
        />


        {/* WISHLIST */}

        <button
          type="button"
          className={`wishlist-button ${
            isWishlist
              ? "wishlist-active"
              : ""
          }`}
          onClick={handleWishlist}
          disabled={wishlistLoading}
          title={
            isWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >

          {isWishlist ? "♥" : "♡"}

        </button>


      </div>


      {/* ================================
          PRODUCT INFORMATION
      ================================= */}

      <div className="product-info">


        {/* CATEGORY */}

        <p className="product-category">
          {product.category}
        </p>


        {/* TITLE */}

        <h3 className="product-title">
          {product.title}
        </h3>


        {/* BRAND */}

        <p className="product-brand">
          {product.brand}
        </p>


        {/* ================================
            PRICE + CART
        ================================= */}

        <div className="product-bottom">


          {/* PRICE */}

          <span className="product-price">

            ₹
            {Number(
              product.price
            ).toLocaleString("en-IN")}

          </span>


          {/* ADD TO CART */}

          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={cartLoading}
          >

            {cartLoading
              ? "Adding..."
              : "Add to Cart"}

          </button>


        </div>


      </div>

    </div>
  );
}

export default ProductCard;