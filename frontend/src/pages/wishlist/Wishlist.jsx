import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {

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


    if (!userId || !token) {

      setError("Please login to view your wishlist.");

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


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to load wishlist (${response.status})`
        );

      }


      const data = text
        ? JSON.parse(text)
        : [];


      console.log(
        "Wishlist:",
        data
      );


      setWishlist(data);


    } catch (error) {

      console.error(
        "Wishlist error:",
        error
      );

      setError(
        error.message ||
        "Unable to load wishlist."
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


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to remove wishlist item"
        );

      }


      // Remove from UI

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

      alert("Please login first.");

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
            userId: Number(userId),
            productId: product.id,
            quantity: 1,
          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to add product to cart"
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

    }
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="wishlist-message">
        Loading wishlist...
      </div>
    );

  }


  // =====================================
  // LOGIN / ERROR
  // =====================================

  if (error) {

    return (
      <section className="wishlist-page">

        <div className="wishlist-message">

          <h2>
            {error}
          </h2>

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
  // PAGE
  // =====================================

  return (

    <section className="wishlist-page">

      <div className="wishlist-container">


        {/* HEADER */}

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
            {wishlist.length} Items
          </span>

        </div>


        {/* EMPTY */}

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


          /* PRODUCTS */

          <div className="wishlist-grid">

            {wishlist.map((item) => {

              const product =
                item.product;


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

                    <img
                      src={`http://localhost:8080/images/${product.imageUrl}`}
                      alt={product.title}
                    />

                  </div>


                  {/* INFO */}

                  <div className="wishlist-info">

                    <p className="wishlist-category">
                      {product.category}
                    </p>


                    <h2>
                      {product.title}
                    </h2>


                    <p className="wishlist-brand">
                      {product.brand}
                    </p>


                    <strong className="wishlist-price">
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </strong>


                    {/* ACTIONS */}

                    <div className="wishlist-actions">

                      <button
                        className="wishlist-cart-button"
                        onClick={() =>
                          handleAddToCart(product)
                        }
                      >
                        Add to Cart
                      </button>


                      <button
                        className="wishlist-remove-button"
                        onClick={() =>
                          handleRemove(product.id)
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