import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================
  // LOAD WISHLIST
  // =====================================

  useEffect(() => {

    fetchWishlist();

  }, []);


  const fetchWishlist = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    // =====================================
    // LOGIN CHECK
    // =====================================

    if (!userId || !token) {

      setError(
        "Please login to view your wishlist."
      );

      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/wishlist/${userId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const text = await response.text();


      // =====================================
      // TOKEN EXPIRED / UNAUTHORIZED
      // =====================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        setError(
          "Your session has expired. Please login again."
        );

        setLoading(false);

        return;
      }


      // =====================================
      // OTHER ERROR
      // =====================================

      if (!response.ok) {

        throw new Error(
          "Unable to load your wishlist."
        );

      }


      // =====================================
      // PARSE RESPONSE
      // =====================================

      const data = text
        ? JSON.parse(text)
        : [];


      console.log(
        "Wishlist response:",
        data
      );


      setWishlist(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Wishlist error:",
        error
      );


      setError(
        "Unable to load your wishlist. Please try again."
      );


    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // REMOVE FROM WISHLIST
  // =====================================

  const handleRemove = async (productId) => {

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


    try {

      const response = await fetch(
        `http://localhost:8080/api/wishlist/remove?userId=${userId}&productId=${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const text =
        await response.text();


      // =====================================
      // TOKEN EXPIRED
      // =====================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return;
      }


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to remove wishlist item."
        );

      }


      // =====================================
      // UPDATE UI
      // =====================================

      setWishlist(
        (previousWishlist) =>
          previousWishlist.filter(
            (item) =>
              item.product?.id !== productId
          )
      );


    } catch (error) {

      console.error(
        "Remove wishlist error:",
        error
      );


      alert(
        error.message ||
        "Unable to remove item."
      );

    }
  };


  // =====================================
  // ADD TO CART
  // =====================================

  const handleAddToCart = async (product) => {

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
              product.id,

            quantity: 1,

          }),
        }
      );


      const text =
        await response.text();


      // =====================================
      // TOKEN EXPIRED
      // =====================================

      if (
        response.status === 401 ||
        response.status === 403
      ) {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return;
      }


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to add product to cart."
        );

      }


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

    }
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <section className="wishlist-page">

        <div className="wishlist-message">

          <h2>
            Loading wishlist...
          </h2>

        </div>

      </section>

    );

  }


  // =====================================
  // ERROR / LOGIN
  // =====================================

  if (error) {

    return (

      <section className="wishlist-page">

        <div className="wishlist-message">

          <div className="empty-heart">
            ♡
          </div>


          <h2>
            {error}
          </h2>


          <p>
            Login to save your favorite
            products and access them anytime.
          </p>


          <Link
            to="/login"
            className="wishlist-login-button"
          >
            Login
          </Link>

        </div>

      </section>

    );

  }


  // =====================================
  // MAIN PAGE
  // =====================================

  return (

    <section className="wishlist-page">

      <div className="wishlist-container">


        {/* =================================
            HEADER
        ================================= */}

        <div className="wishlist-header">

          <div>

            <p>
              SHOPSPHERE
            </p>


            <h1>
              My Wishlist
            </h1>


            <span>
              Your favorite products
            </span>

          </div>


          <span className="wishlist-count">

            {wishlist.length}

            {" "}

            {wishlist.length === 1
              ? "Item"
              : "Items"}

          </span>

        </div>


        {/* =================================
            EMPTY WISHLIST
        ================================= */}

        {wishlist.length === 0 ? (

          <div className="empty-wishlist">

            <div className="empty-heart">
              ♡
            </div>


            <h2>
              Your wishlist is empty
            </h2>


            <p>
              Save products you love and
              find them here later.
            </p>


            <Link
              to="/products"
              className="browse-products-button"
            >
              Browse Products
            </Link>

          </div>

        ) : (


          /* =================================
             WISHLIST PRODUCTS
          ================================= */

          <div className="wishlist-grid">

            {wishlist.map((item) => {

              const product =
                item.product;


              // Skip invalid item

              if (!product) {
                return null;
              }


              return (

                <div
                  className="wishlist-card"
                  key={item.id}
                >


                  {/* IMAGE */}

                  <div className="wishlist-image">

                    <Link
                      to={`/product/${product.id}`}
                    >

                      <img
                        src={`http://localhost:8080/images/${product.imageUrl}`}
                        alt={product.title}
                      />

                    </Link>

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="wishlist-info">


                    {/* CATEGORY */}

                    <p className="wishlist-category">

                      {product.category}

                    </p>


                    {/* TITLE */}

                    <Link
                      to={`/product/${product.id}`}
                      className="wishlist-product-link"
                    >

                      <h2>
                        {product.title}
                      </h2>

                    </Link>


                    {/* BRAND */}

                    <p className="wishlist-brand">

                      {product.brand}

                    </p>


                    {/* PRICE */}

                    <strong className="wishlist-price">

                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}

                    </strong>


                    {/* ACTIONS */}

                    <div className="wishlist-actions">


                      {/* ADD TO CART */}

                      <button
                        type="button"
                        className="wishlist-cart-button"
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                      >
                        Add to Cart
                      </button>


                      {/* REMOVE */}

                      <button
                        type="button"
                        className="wishlist-remove-button"
                        onClick={() =>
                          handleRemove(
                            product.id
                          )
                        }
                      >
                        Remove
                      </button>


                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </section>

  );

}

export default Wishlist;