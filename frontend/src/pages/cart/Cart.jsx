import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingItem, setUpdatingItem] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);


  useEffect(() => {
    fetchCart();
  }, []);


  // =========================
  // GET CART
  // =========================

  const fetchCart = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("CART DATA:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load cart"
        );
      }

      setCart(data);

    } catch (error) {

      console.error("Cart error:", error);

      setError(
        error.message ||
        "Unable to load your cart."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = async (
    cartItemId,
    newQuantity
  ) => {

    if (newQuantity < 1) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {

      setUpdatingItem(cartItemId);

      const response = await fetch(
        "http://localhost:8080/api/cart/update",
        {
          method: "PUT",

          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            cartItemId: cartItemId,
            quantity: newQuantity,
          }),
        }
      );


      const data = await response.json();

      console.log(
        "UPDATED CART:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to update quantity"
        );

      }


      // Backend returns updated Cart
      setCart(data);

    } catch (error) {

      console.error(
        "Update quantity error:",
        error
      );

      alert(
        error.message ||
        "Unable to update quantity."
      );

    } finally {

      setUpdatingItem(null);

    }
  };


  // =========================
  // REMOVE ITEM
  // =========================

  const removeItem = async (cartItemId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }


    try {

      setRemovingItem(cartItemId);


      const response = await fetch(
        `http://localhost:8080/api/cart/${cartItemId}`,
        {
          method: "DELETE",

          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      const data = await response.json();

      console.log(
        "CART AFTER REMOVE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to remove item"
        );

      }


      // Backend returns updated Cart
      setCart(data);

    } catch (error) {

      console.error(
        "Remove item error:",
        error
      );

      alert(
        error.message ||
        "Unable to remove item."
      );

    } finally {

      setRemovingItem(null);

    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="cart-message">
        Loading your cart...
      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <div className="cart-message">

        <h3>{error}</h3>

        <Link to="/login">
          Go to Login
        </Link>

      </div>
    );

  }


  const cartItems = cart?.cartItems || [];


  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {

    return (
      <section className="cart-page">

        <div className="cart-container">

          <div className="cart-heading">

            <p>
              YOUR SHOPPING BAG
            </p>

            <h1>
              Shopping Cart
            </h1>

          </div>


          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <Link
              to="/"
              className="continue-shopping-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>
    );
  }


  // =========================
  // CART PAGE
  // =========================

  return (

    <section className="cart-page">

      <div className="cart-container">


        {/* Heading */}

        <div className="cart-heading">

          <p>
            YOUR SHOPPING BAG
          </p>

          <h1>
            Shopping Cart
          </h1>

        </div>


        <div className="cart-layout">


          {/* =========================
              ITEMS
          ========================= */}

          <div className="cart-items">

            <div className="cart-items-header">

              <h2>
                Your Items
              </h2>

              <span>
                {cartItems.length}{" "}
                {cartItems.length === 1
                  ? "Item"
                  : "Items"}
              </span>

            </div>


            {cartItems.map((item) => {

              const product = item.product || {};

              const isUpdating =
                updatingItem === item.id;

              const isRemoving =
                removingItem === item.id;


              return (

                <div
                  className="cart-item"
                  key={item.id}
                >


                  {/* Image */}

                  <div className="cart-item-image">

                    {product.imageUrl ? (

                      <img
                        src={`http://localhost:8080/images/${product.imageUrl}`}
                        alt={product.title}
                      />

                    ) : (

                      <div className="cart-no-image">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* Info */}

                  <div className="cart-item-info">

                    <p className="cart-item-category">
                      {product.category || "Product"}
                    </p>

                    <h3>
                      {product.title || "Product"}
                    </h3>

                    <p className="cart-item-brand">
                      {product.brand || ""}
                    </p>


                    {/* Quantity */}

                    <div className="quantity-section">

                      <span>
                        Quantity
                      </span>

                      <div className="quantity-control">

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>


                        <span>
                          {isUpdating
                            ? "..."
                            : item.quantity}
                        </span>


                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    {/* Remove */}

                    <button
                      type="button"
                      className="remove-button"
                      disabled={isRemoving}
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      {isRemoving
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>


                  {/* Price */}

                  <div className="cart-item-price">

                    ₹
                    {Number(
                      product.price || 0
                    ).toLocaleString("en-IN")}

                  </div>

                </div>

              );

            })}

          </div>


          {/* =========================
              SUMMARY
          ========================= */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {cartItems.length}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹
                {Number(
                  cart.totalPrice || 0
                ).toLocaleString("en-IN")}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span>
                FREE
              </span>

            </div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {Number(
                  cart.totalPrice || 0
                ).toLocaleString("en-IN")}
              </strong>

            </div>


            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Cart;