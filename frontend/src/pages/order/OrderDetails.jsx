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
      setError("Please login to view this order.");
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

    const token = localStorage.getItem("token");


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

          <div>

            <span>
              Order Date
            </span>

            <strong>
              {order.orderDate
                ? new Date(
                    order.orderDate
                  ).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )
                : "Unavailable"}
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <strong
              className={`details-status ${
                order.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")
              }`}
            >
              {order.status}
            </strong>

          </div>


          <div>

            <span>
              Total
            </span>

            <strong>
              ₹
              {Number(
                order.totalPrice || 0
              ).toLocaleString("en-IN")}
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

            {order.orderItems?.map(
              (item) => {

                const product =
                  item.product || {};


                return (

                  <div
                    className="details-item"
                    key={item.id}
                  >

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


                    <div className="details-item-price">

                      ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* =========================
            TOTAL
        ========================= */}

        <div className="details-card">

          <h2>
            Payment Summary
          </h2>


          <div className="details-summary-row">

            <span>
              Items Total
            </span>

            <span>
              ₹
              {Number(
                order.totalPrice || 0
              ).toLocaleString("en-IN")}
            </span>

          </div>


          <div className="details-summary-row">

            <span>
              Shipping
            </span>

            <span>
              FREE
            </span>

          </div>


          <div className="details-divider" />


          <div className="details-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {Number(
                order.totalPrice || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>


        {/* =========================
            ACTIONS
        ========================= */}

        <div className="order-actions">

          <button
            className="continue-shopping"
            onClick={() =>
              navigate("/")
            }
          >
            Continue Shopping
          </button>


          {order.status !==
            "CANCELLED" && (

            <button
              className="cancel-details-button"
              onClick={cancelOrder}
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