import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [isWishlist, setIsWishlist] = useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [cartLoading, setCartLoading] =
    useState(false);


  // =========================================
  // FETCH PRODUCT
  // =========================================

  useEffect(() => {

    const fetchProduct = async () => {

      setLoading(true);
      setError("");

      try {

        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );

        const text = await response.text();

        if (!response.ok) {

          throw new Error(
            text ||
            `Product not found (${response.status})`
          );

        }

        if (!text.trim()) {

          throw new Error(
            "Product details are empty."
          );

        }

        const data = JSON.parse(text);

        setProduct(data);

        // Reset quantity whenever product changes
        setQuantity(1);

      } catch (error) {

        console.error(
          "Product details error:",
          error
        );

        setError(
          error.message ||
          "Unable to load product."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);


  // =========================================
  // CHECK WISHLIST
  // =========================================

  useEffect(() => {

    if (!product) {
      return;
    }

    checkWishlist();

  }, [product]);


  const checkWishlist = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


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
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        console.error(
          "Wishlist check failed:",
          response.status
        );

        return;

      }


      if (!text.trim()) {

        setIsWishlist(false);

        return;

      }


      const data =
        JSON.parse(text);


      setIsWishlist(
        Boolean(data)
      );


    } catch (error) {

      console.error(
        "Wishlist check error:",
        error
      );

    }

  };


  // =========================================
  // WISHLIST
  // =========================================

  const handleWishlist = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId || !token) {

      alert(
        "Please login first."
      );

      navigate("/login");

      return;

    }


    if (wishlistLoading) {
      return;
    }


    setWishlistLoading(true);


    try {

      let response;


      if (isWishlist) {

        response = await fetch(
          `http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${product.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } else {

        response = await fetch(
          `http://localhost:8080/api/wishlist/add?userId=${userId}&productId=${product.id}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      }


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          `Wishlist request failed (${response.status})`
        );

      }


      setIsWishlist(
        !isWishlist
      );


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


  // =========================================
  // QUANTITY
  // =========================================

  const increaseQuantity = () => {

    if (!product) {
      return;
    }


    if (
      quantity <
      Number(product.quantity || 0)
    ) {

      setQuantity(
        (previous) =>
          previous + 1
      );

    }

  };


  const decreaseQuantity = () => {

    if (quantity > 1) {

      setQuantity(
        (previous) =>
          previous - 1
      );

    }

  };


  // =========================================
  // ADD TO CART
  // =========================================

  const handleAddToCart = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId || !token) {

      alert(
        "Please login first."
      );

      navigate("/login");

      return;

    }


    if (!product) {
      return;
    }


    if (
      !product.quantity ||
      product.quantity <= 0
    ) {

      alert(
        "This product is out of stock."
      );

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
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            userId:
              Number(userId),

            productId:
              Number(product.id),

            quantity:
              Number(quantity),

          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to add product (${response.status})`
        );

      }


      alert(
        `${product.title} added to cart!`
      );


    } catch (error) {

      console.error(
        "Cart error:",
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


  // =========================================
  // BUY NOW
  // =========================================

  const handleBuyNow = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId || !token) {

      alert(
        "Please login first."
      );

      navigate("/login");

      return;

    }


    if (!product) {
      return;
    }


    if (
      !product.quantity ||
      product.quantity <= 0
    ) {

      alert(
        "This product is out of stock."
      );

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
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            userId:
              Number(userId),

            productId:
              Number(product.id),

            quantity:
              Number(quantity),

          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to add product (${response.status})`
        );

      }


      // Go directly to cart
      navigate("/cart");


    } catch (error) {

      console.error(
        "Buy now error:",
        error
      );

      alert(
        error.message ||
        "Unable to proceed with purchase."
      );

    } finally {

      setCartLoading(false);

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="product-details-message">

        <p>
          Loading product...
        </p>

      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error || !product) {

    return (

      <div className="product-details-message">

        <h2>
          {error ||
            "Product not found"}
        </h2>


        <Link
          to="/products"
          className="back-products-button"
        >
          ← Back to Products
        </Link>

      </div>

    );

  }


  // =========================================
  // STOCK
  // =========================================

  const stock =
    Number(
      product.quantity || 0
    );


  const outOfStock =
    stock <= 0;


  // =========================================
  // TOTAL
  // =========================================

  const totalPrice =
    Number(product.price || 0) *
    quantity;


  // =========================================
  // UI
  // =========================================

  return (

    <section className="product-details-page">

      <div className="product-details-container">


        {/* =================================
            BACK
        ================================= */}

        <Link
          to="/products"
          className="back-products-link"
        >
          ← Back to Products
        </Link>


        {/* =================================
            PRODUCT
        ================================= */}

        <div className="product-details-wrapper">


          {/* =================================
              IMAGE
          ================================= */}

          <div className="product-details-image-section">

            <div className="product-details-image-box">

              <img
                src={
                  `http://localhost:8080/images/${product.imageUrl}`
                }

                alt={
                  product.title ||
                  "Product"
                }
              />

            </div>

          </div>


          {/* =================================
              INFORMATION
          ================================= */}

          <div className="product-details-info">


            {/* CATEGORY */}

            <p className="details-category">
              {product.category ||
                "Category"}
            </p>


            {/* TITLE */}

            <h1 className="details-title">
              {product.title}
            </h1>


            {/* BRAND */}

            <p className="details-brand">
              By{" "}
              {product.brand ||
                "ShopSphere"}
            </p>


            {/* PRICE */}

            <div className="details-price">

              ₹
              {Number(
                product.price || 0
              ).toLocaleString(
                "en-IN"
              )}

            </div>


            {/* DESCRIPTION */}

            <div className="details-description">

              <h3>
                Description
              </h3>

              <p>
                {product.description ||
                  "No description available."}
              </p>

            </div>


            {/* STOCK */}

            <div className="details-stock">

              {outOfStock ? (

                <span className="out-of-stock">
                  ✕ Out of Stock
                </span>

              ) : (

                <span className="in-stock">
                  ✓ In Stock
                  {" "}
                  ({stock} available)
                </span>

              )}

            </div>


            {/* =================================
                QUANTITY
            ================================= */}

            {!outOfStock && (

              <div className="quantity-section">

                <span>
                  Quantity
                </span>


                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }

                    disabled={
                      quantity <= 1
                    }
                  >
                    −
                  </button>


                  <span>
                    {quantity}
                  </span>


                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }

                    disabled={
                      quantity >= stock
                    }
                  >
                    +
                  </button>

                </div>

              </div>

            )}


            {/* TOTAL */}

            {!outOfStock && (

              <div className="details-total">

                <span>
                  Total
                </span>

                <strong>

                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}

                </strong>

              </div>

            )}


            {/* =================================
                ACTIONS
            ================================= */}

            <div className="details-actions">


              {/* ADD TO CART */}

              <button
                type="button"

                className="details-cart-button"

                onClick={
                  handleAddToCart
                }

                disabled={
                  outOfStock ||
                  cartLoading
                }
              >

                {cartLoading
                  ? "Adding..."
                  : "Add to Cart"}

              </button>


              {/* BUY NOW */}

              <button
                type="button"

                className="details-buy-button"

                onClick={
                  handleBuyNow
                }

                disabled={
                  outOfStock ||
                  cartLoading
                }
              >

                Buy Now

              </button>


              {/* WISHLIST */}

              <button
                type="button"

                className={
                  `details-wishlist-button ${
                    isWishlist
                      ? "details-wishlist-active"
                      : ""
                  }`
                }

                onClick={
                  handleWishlist
                }

                disabled={
                  wishlistLoading
                }
              >

                {wishlistLoading
                  ? "Please wait..."
                  : isWishlist
                    ? "♥ Saved"
                    : "♡ Wishlist"}

              </button>


            </div>


          </div>

        </div>

      </div>

    </section>

  );

}

export default ProductDetails;