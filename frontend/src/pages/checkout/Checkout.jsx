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


  // =========================================
  // LOAD ADDRESSES
  // =========================================

  useEffect(() => {

    fetchAddresses();

  }, []);


  const fetchAddresses = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId || !token) {

      setError(
        "Please login first."
      );

      setLoading(false);

      return;

    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/address/user/${userId}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },
        }
      );


      const responseText =
        await response.text();


      if (!response.ok) {

        throw new Error(
          responseText ||
          `Failed to load addresses (${response.status})`
        );

      }


      let data = [];


      if (
        responseText &&
        responseText.trim()
      ) {

        try {

          data =
            JSON.parse(responseText);

        } catch (parseError) {

          console.error(
            "Address JSON parse error:",
            parseError
          );

          data = [];

        }

      }


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


  // =========================================
  // CREATE ORDER + PAYMENT
  // =========================================

  const placeOrder = async () => {

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


    if (!selectedAddress) {

      alert(
        "Please select a delivery address."
      );

      return;

    }


    if (!window.Razorpay) {

      alert(
        "Razorpay is not loaded. Please refresh the page."
      );

      return;

    }


    if (placingOrder) {
      return;
    }


    try {

      setPlacingOrder(true);


      // =====================================
      // STEP 1
      // CREATE PENDING ORDER
      // =====================================

      console.log(
        "Creating pending ShopSphere order..."
      );


      const checkoutResponse =
        await fetch(
          "http://localhost:8080/api/checkout",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              userId:
                Number(userId),

              addressId:
                Number(selectedAddress),

            }),

          }
        );


      const checkoutText =
        await checkoutResponse.text();


      console.log(
        "Checkout response:",
        checkoutText
      );


      if (!checkoutResponse.ok) {

        throw new Error(
          checkoutText ||
          `Checkout failed (${checkoutResponse.status})`
        );

      }


      if (
        !checkoutText ||
        !checkoutText.trim()
      ) {

        throw new Error(
          "Checkout returned an empty response."
        );

      }


      let order;


      try {

        order =
          JSON.parse(
            checkoutText
          );

      } catch (parseError) {

        console.error(
          "Checkout JSON error:",
          parseError
        );

        throw new Error(
          "Invalid order response from server."
        );

      }


      console.log(
        "Pending ShopSphere Order:",
        order
      );


      if (
        !order ||
        !order.id
      ) {

        throw new Error(
          "Order ID was not received."
        );

      }


      // =====================================
      // STEP 2
      // CREATE RAZORPAY ORDER
      // =====================================

      console.log(
        "Creating Razorpay order..."
      );


      const paymentResponse =
        await fetch(
          "http://localhost:8080/api/payment/create",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              orderId:
                Number(order.id),

            }),

          }
        );


      const paymentText =
        await paymentResponse.text();


      console.log(
        "Payment create response:",
        paymentText
      );


      if (!paymentResponse.ok) {

        throw new Error(
          paymentText ||
          `Payment creation failed (${paymentResponse.status})`
        );

      }


      if (
        !paymentText ||
        !paymentText.trim()
      ) {

        throw new Error(
          "Payment server returned an empty response."
        );

      }


      let paymentData;


      try {

        paymentData =
          JSON.parse(
            paymentText
          );

      } catch (parseError) {

        console.error(
          "Payment JSON error:",
          parseError
        );

        throw new Error(
          "Invalid payment response from server."
        );

      }


      console.log(
        "Razorpay Data:",
        paymentData
      );


      if (
        !paymentData.razorpayOrderId ||
        !paymentData.key
      ) {

        throw new Error(
          "Invalid Razorpay response."
        );

      }


      // =====================================
      // STEP 3
      // RAZORPAY OPTIONS
      // =====================================

      const razorpayOptions = {

        key:
          paymentData.key,

        amount:
          Math.round(
            Number(
              paymentData.amount
            ) * 100
          ),

        currency:
          "INR",

        name:
          "ShopSphere",

        description:
          `Payment for Order #${order.id}`,

        order_id:
          paymentData.razorpayOrderId,


        // ===================================
        // CUSTOMER
        // ===================================

        prefill: {

          name:
            localStorage.getItem(
              "userName"
            ) || "",

          email:
            localStorage.getItem(
              "userEmail"
            ) || "",

        },


        notes: {

          orderId:
            String(order.id),

        },


        theme: {

          color:
            "#214d43",

        },


        // ===================================
        // PAYMENT SUCCESS
        // ===================================

        handler:
          async function (
            razorpayResponse
          ) {

            console.log(
              "Razorpay success:",
              razorpayResponse
            );


            try {

              // =================================
              // STEP 4
              // VERIFY PAYMENT
              // =================================

              const verifyResponse =
                await fetch(
                  "http://localhost:8080/api/payment/verify",
                  {
                    method: "POST",

                    headers: {
                      Authorization:
                        `Bearer ${token}`,

                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({

                      orderId:
                        Number(order.id),

                      razorpayPaymentId:
                        razorpayResponse.razorpay_payment_id,

                      razorpayOrderId:
                        razorpayResponse.razorpay_order_id,

                      razorpaySignature:
                        razorpayResponse.razorpay_signature,

                    }),

                  }
                );


              const verifyText =
                await verifyResponse.text();


              console.log(
                "Payment verification:",
                verifyText
              );


              if (!verifyResponse.ok) {

                throw new Error(
                  verifyText ||
                  "Payment verification failed."
                );

              }


              // =================================
              // SUCCESS
              // =================================

              alert(
                `Payment successful! Order #${order.id}`
              );


              navigate(
                `/orders/${order.id}`
              );


            } catch (error) {

              console.error(
                "Payment verification error:",
                error
              );


              alert(
                error.message ||
                "Payment verification failed."
              );


            } finally {

              setPlacingOrder(false);

            }

          },


        // =====================================
        // MODAL CLOSED
        // =====================================

        modal: {

          ondismiss:
            function () {

              console.log(
                "Razorpay payment window closed."
              );

              setPlacingOrder(false);

            },

        },

      };


      // =====================================
      // STEP 5
      // OPEN RAZORPAY
      // =====================================

      console.log(
        "Opening Razorpay..."
      );


      const razorpay =
        new window.Razorpay(
          razorpayOptions
        );


      // =====================================
      // PAYMENT FAILED
      // =====================================

      razorpay.on(
        "payment.failed",
        function (
          response
        ) {

          console.error(
            "Razorpay payment failed:",
            response
          );


          alert(
            response?.error?.description ||
            "Payment failed."
          );


          setPlacingOrder(false);

        }
      );


      razorpay.open();


    } catch (error) {

      console.error(
        "Checkout / Payment error:",
        error
      );


      alert(
        error.message ||
        "Unable to start payment."
      );


      setPlacingOrder(false);

    }

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="checkout-message">

        Loading checkout...

      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div className="checkout-message">

        <h3>
          {error}
        </h3>


        <button
          onClick={() =>
            navigate("/")
          }
        >
          Go Home
        </button>

      </div>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <section className="checkout-page">

      <div className="checkout-container">


        {/* =================================
            HEADING
        ================================= */}

        <div className="checkout-heading">

          <p>
            SECURE CHECKOUT
          </p>

          <h1>
            Checkout
          </h1>

        </div>


        {/* =================================
            LAYOUT
        ================================= */}

        <div className="checkout-layout">


          {/* =================================
              ADDRESS
          ================================= */}

          <div className="address-section">

            <div className="section-title">

              <h2>
                Delivery Address
              </h2>

              <span>
                {addresses.length} saved
              </span>

            </div>


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

                {addresses.map(
                  (address) => (

                    <div
                      key={address.id}

                      className={
                        `address-card ${
                          selectedAddress ===
                          address.id
                            ? "selected"
                            : ""
                        }`
                      }

                      onClick={() =>
                        setSelectedAddress(
                          address.id
                        )
                      }
                    >

                      <div className="address-radio">

                        <div>

                          {selectedAddress ===
                          address.id
                            ? "✓"
                            : ""}

                        </div>

                      </div>


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

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================
              SUMMARY
          ================================= */}

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
                Payment
              </span>

              <span>
                Razorpay
              </span>

            </div>


            <button
              className="place-order-button"

              onClick={
                placeOrder
              }

              disabled={
                !selectedAddress ||
                placingOrder ||
                addresses.length === 0
              }
            >

              {placingOrder
                ? "Opening Payment..."
                : "Proceed to Payment"}

            </button>

          </div>


        </div>

      </div>

    </section>

  );

}

export default Checkout;