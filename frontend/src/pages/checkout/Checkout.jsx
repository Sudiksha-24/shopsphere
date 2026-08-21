import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD ADDRESSES
  // =========================

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    console.log("USER ID:", userId);
    console.log("TOKEN:", token);

    if (!userId || !token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/address/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "Address API Status:",
        response.status
      );

      // Read response as text first
      const responseText = await response.text();

      console.log(
        "Address API Response:",
        responseText
      );

      // Check HTTP status
      if (!response.ok) {
        throw new Error(
          responseText ||
            `Failed to load addresses (${response.status})`
        );
      }

      // Empty response = empty array
      let data = [];

      if (responseText.trim() !== "") {
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error(
            "Address JSON Parse Error:",
            jsonError
          );

          throw new Error(
            "Invalid response received from Address API."
          );
        }
      }

      console.log(
        "ADDRESS DATA:",
        data
      );

      // Make sure we have an array
      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        setAddresses([]);
      }

    } catch (error) {
      console.error(
        "Address fetch error:",
        error
      );

      setError(
        error.message ||
          "Unable to load addresses."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Please login first.");
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    try {
      setPlacingOrder(true);

      console.log(
        "Placing order..."
      );

      console.log(
        "User ID:",
        userId
      );

      console.log(
        "Address ID:",
        selectedAddress
      );

      const response = await fetch(
        "http://localhost:8080/api/checkout",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: Number(userId),
            addressId: Number(selectedAddress),
          }),
        }
      );

      console.log(
        "Checkout API Status:",
        response.status
      );

      // Read as text first
      const responseText = await response.text();

      console.log(
        "Checkout API Response:",
        responseText
      );

      // Check status
      if (!response.ok) {
        throw new Error(
          responseText ||
            `Checkout failed (${response.status})`
        );
      }

      // Parse only if response has content
      let data = null;

      if (responseText.trim() !== "") {
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error(
            "Checkout JSON Parse Error:",
            jsonError
          );

          throw new Error(
            "Invalid response received from Checkout API."
          );
        }
      }

      console.log(
        "ORDER RESPONSE:",
        data
      );


      // Success
      if (data && data.id) {

        alert(
          `Order placed successfully! Order #${data.id}`
        );

      } else {

        alert(
          "Order placed successfully!"
        );

      }


      // Go to Orders page
      navigate("/orders");

    } catch (error) {

      console.error(
        "Checkout error:",
        error
      );

      alert(
        error.message ||
          "Unable to place order."
      );

    } finally {
      setPlacingOrder(false);
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="checkout-message">
        Loading checkout...
      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="checkout-message">

        <h3>
          {error}
        </h3>

        <button
          onClick={() => navigate("/")}
        >
          Go Home
        </button>

      </div>
    );
  }


  // =========================
  // CHECKOUT PAGE
  // =========================

  return (
    <section className="checkout-page">

      <div className="checkout-container">


        {/* =========================
            HEADING
        ========================= */}

        <div className="checkout-heading">

          <p>
            SECURE CHECKOUT
          </p>

          <h1>
            Checkout
          </h1>

        </div>


        <div className="checkout-layout">


          {/* =========================
              ADDRESS SECTION
          ========================= */}

          <div className="address-section">

            <div className="section-title">

              <h2>
                Delivery Address
              </h2>

              <span>
                {addresses.length} saved
              </span>

            </div>


            {/* NO ADDRESS */}

            {addresses.length === 0 ? (

              <div className="no-address">

                <h3>
                  No saved address
                </h3>

                <p>
                  Please add a delivery
                  address before placing
                  your order.
                </p>

                <button
                  onClick={() =>
                    navigate("/address")
                  }
                >
                  Add Address
                </button>

              </div>

            ) : (

              <div className="address-list">

                {addresses.map((address) => (

                  <div
                    key={address.id}
                    className={`address-card ${
                      selectedAddress === address.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedAddress(
                        address.id
                      )
                    }
                  >

                    {/* Radio */}

                    <div className="address-radio">

                      <div>
                        {selectedAddress ===
                        address.id
                          ? "✓"
                          : ""}
                      </div>

                    </div>


                    {/* Address Details */}

                    <div className="address-details">

                      <h3>
                        {address.name ||
                          "Delivery Address"}
                      </h3>


                      {address.address && (
                        <p>
                          {address.address}
                        </p>
                      )}


                      {address.street && (
                        <p>
                          {address.street}
                        </p>
                      )}


                      <p>

                        {address.city || ""}

                        {address.city &&
                        address.state
                          ? ", "
                          : ""}

                        {address.state || ""}

                      </p>


                      <p>

                        {address.pincode ||
                          address.zipCode ||
                          ""}

                      </p>


                      {address.phone && (
                        <p>
                          Phone:{" "}
                          {address.phone}
                        </p>
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>


          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            <p className="summary-info">

              Your order will be created
              using the products currently
              in your cart.

            </p>


            <div className="summary-divider" />


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                FREE
              </span>

            </div>


            <div className="summary-divider" />


            <div className="summary-total">

              <span>
                Order
              </span>

              <span>
                From Cart
              </span>

            </div>


            {/* PLACE ORDER */}

            <button
              className="place-order-button"
              onClick={placeOrder}
              disabled={
                !selectedAddress ||
                placingOrder ||
                addresses.length === 0
              }
            >

              {placingOrder
                ? "Placing Order..."
                : "Place Order"}

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;