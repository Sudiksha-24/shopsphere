import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./OrderDetails.css";

function OrderDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // FETCH ORDER
  // =========================

  useEffect(() => {
    fetchOrder();
  }, [id]);


  const fetchOrder = async () => {

    const token = localStorage.getItem("token");

    if (!token) {

      setError(
        "Please login to view this order."
      );

      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/orders/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      console.log(
        "Order Details Status:",
        response.status
      );


      const responseText =
        await response.text();


      console.log(
        "Order Details Response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          `Failed to load order (${response.status})`
        );

      }


      const data = responseText
        ? JSON.parse(responseText)
        : null;


      console.log(
        "ORDER DETAILS:",
        data
      );


      setOrder(data);


    } catch (error) {

      console.error(
        "Order details error:",
        error
      );


      setError(
        error.message ||
        "Unable to load order."
      );


    } finally {

      setLoading(false);

    }
  };


  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async () => {

    const token =
      localStorage.getItem("token");


    if (!token) {

      alert(
        "Please login first."
      );

      return;
    }


    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmCancel) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/orders/cancel/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      const responseText =
        await response.text();


      if (!response.ok) {

        throw new Error(
          responseText ||
          "Failed to cancel order"
        );

      }


      const updatedOrder =
        responseText
          ? JSON.parse(responseText)
          : null;


      setOrder(updatedOrder);


      alert(
        "Order cancelled successfully."
      );


    } catch (error) {

      console.error(
        "Cancel order error:",
        error
      );


      alert(
        error.message ||
        "Unable to cancel order."
      );

    }
  };


  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {

    return Number(
      price || 0
    ).toLocaleString("en-IN");

  };


  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) {
      return "Unavailable";
    }


    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );

  };


  // =========================
  // PAYMENT STATUS
  // =========================

  const getPaymentStatus = () => {

    if (
      order?.paymentStatus ===
      "SUCCESS"
    ) {

      return "✓ PAID";

    }


    if (
      order?.paymentStatus ===
      "FAILED"
    ) {

      return "✕ FAILED";

    }


    return (
      order?.paymentStatus ||
      "PENDING"
    );

  };


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="order-details-message">

        Loading order details...

      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

  if (error || !order) {

    return (
      <div className="order-details-message">

        <h3>
          {error || "Order not found"}
        </h3>


        <button
          onClick={() =>
            navigate("/orders")
          }
        >
          Back to Orders
        </button>

      </div>
    );

  }


  // =========================
  // ORDER DETAILS
  // =========================

  return (

    <section className="order-details-page">

      <div className="order-details-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="order-details-heading">

          <button
            className="back-button"
            onClick={() =>
              navigate("/orders")
            }
          >
            ← Back to Orders
          </button>


          <p>
            ORDER DETAILS
          </p>


          <h1>
            Order #{order.id}
          </h1>


        </div>


        {/* =========================
            ORDER INFO
        ========================= */}

        <div className="order-info-card">


          {/* ORDER DATE */}

          <div>

            <span>
              Order Date
            </span>


            <strong>
              {formatDate(
                order.orderDate
              )}
            </strong>

          </div>


          {/* ORDER STATUS */}

          <div>

            <span>
              Status
            </span>


            <strong
              className={`details-status ${
                order.status
                  ?.toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  )
              }`}
            >
              {order.status}
            </strong>

          </div>


          {/* PAYMENT STATUS */}

          <div>

            <span>
              Payment
            </span>


            <strong
              className={`details-payment-status ${
                order.paymentStatus
                  ?.toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  )
              }`}
            >
              {getPaymentStatus()}
            </strong>

          </div>


          {/* TOTAL */}

          <div>

            <span>
              Total
            </span>


            <strong>
              ₹
              {formatPrice(
                order.totalPrice
              )}
            </strong>

          </div>


        </div>


        {/* =========================
            PRODUCTS
        ========================= */}

        <div className="details-card">


          <h2>
            Ordered Products
          </h2>


          <div className="details-items">

            {order.orderItems &&
            order.orderItems.length > 0 ? (

              order.orderItems.map(
                (item) => {

                  const product =
                    item.product || {};


                  return (

                    <div
                      className="details-item"
                      key={item.id}
                    >


                      {/* IMAGE */}

                      <div className="details-item-image">

                        {product.imageUrl ? (

                          <img
                            src={`http://localhost:8080/images/${product.imageUrl}`}
                            alt={
                              product.title ||
                              "Product"
                            }
                          />

                        ) : (

                          <div>
                            No Image
                          </div>

                        )}

                      </div>


                      {/* PRODUCT INFO */}

                      <div className="details-item-info">


                        <h3>
                          {product.title ||
                            "Product"}
                        </h3>


                        <p>
                          {product.brand ||
                            ""}
                        </p>


                        <p>
                          Category:{" "}
                          {product.category ||
                            "Product"}
                        </p>


                        <span>
                          Quantity:{" "}
                          {item.quantity}
                        </span>


                      </div>


                      {/* PRODUCT PRICE */}

                      <div className="details-item-price">

                        ₹
                        {formatPrice(
                          item.price
                        )}

                      </div>


                    </div>

                  );

                }

              )

            ) : (

              <div className="order-details-message">

                No products found
                in this order.

              </div>

            )}

          </div>


        </div>


        {/* =========================
            PAYMENT SUMMARY
        ========================= */}

        <div className="details-card">


          <h2>
            Payment Summary
          </h2>


          {/* ITEMS TOTAL */}

          <div className="details-summary-row">

            <span>
              Items Total
            </span>


            <span>
              ₹
              {formatPrice(
                order.totalPrice
              )}
            </span>

          </div>


          {/* SHIPPING */}

          <div className="details-summary-row">

            <span>
              Shipping
            </span>


            <span>
              FREE
            </span>

          </div>


          <div className="details-divider" />


          {/* TOTAL */}

          <div className="details-total">

            <span>
              Total
            </span>


            <strong>
              ₹
              {formatPrice(
                order.totalPrice
              )}
            </strong>

          </div>


          {/* PAYMENT MESSAGE */}

          <div className="payment-status-message">

            {order.paymentStatus ===
              "SUCCESS" ? (

              <p>
                ✓ Payment completed
                successfully.
              </p>

            ) : order.paymentStatus ===
              "FAILED" ? (

              <p>
                ✕ Payment failed.
              </p>

            ) : (

              <p>
                Payment status:{" "}
                {order.paymentStatus ||
                  "PENDING"}
              </p>

            )}

          </div>


        </div>


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="order-actions">


          {/* CONTINUE SHOPPING */}

          <button
            className="continue-shopping"
            onClick={() =>
              navigate("/")
            }
          >
            Continue Shopping
          </button>


          {/* CANCEL */}

          {order.status !==
            "CANCELLED" && (

            <button
              className="cancel-details-button"
              onClick={
                cancelOrder
              }
            >
              Cancel Order
            </button>

          )}


        </div>


      </div>

    </section>

  );

}

export default OrderDetails;