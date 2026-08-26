import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================
  // FETCH ORDERS
  // =========================================

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    if (!userId || !token) {

      setError(
        "Please login to view your orders."
      );

      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/orders/user/${userId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      // IMPORTANT:
      // First read text instead of response.json()
      // This prevents Unexpected end of JSON input

      const responseText =
        await response.text();


      console.log(
        "Orders API Status:",
        response.status
      );

      console.log(
        "Orders API Response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          `Failed to load orders (${response.status})`
        );

      }


      // Empty response = empty array

      if (
        !responseText ||
        !responseText.trim()
      ) {

        setOrders([]);

        return;
      }


      let data;

      try {

        data = JSON.parse(
          responseText
        );

      } catch (jsonError) {

        console.error(
          "Orders JSON parse error:",
          jsonError
        );

        throw new Error(
          "Invalid response received from server."
        );

      }


      setOrders(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Orders fetch error:",
        error
      );


      setError(
        error.message ||
        "Unable to load orders."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // OPEN ORDER DETAILS
  // =========================================

  const openOrderDetails = (
    orderId
  ) => {

    if (!orderId) {
      return;
    }


    navigate(
      `/orders/${orderId}`
    );

  };


  // =========================================
  // CANCEL ORDER
  // =========================================

  const cancelOrder = async (
    orderId,
    event
  ) => {

    // Stop parent card click

    if (event) {
      event.stopPropagation();
    }


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
        `http://localhost:8080/api/orders/cancel/${orderId}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      // IMPORTANT:
      // Don't directly call response.json()
      // because backend may return empty response

      const responseText =
        await response.text();


      console.log(
        "Cancel Order Status:",
        response.status
      );

      console.log(
        "Cancel Order Response:",
        responseText
      );


      if (!response.ok) {

        throw new Error(
          responseText ||
          `Failed to cancel order (${response.status})`
        );

      }


      // =====================================
      // BACKEND RETURNED UPDATED ORDER
      // =====================================

      if (
        responseText &&
        responseText.trim()
      ) {

        try {

          const updatedOrder =
            JSON.parse(
              responseText
            );


          setOrders(
            previousOrders =>
              previousOrders.map(
                order =>
                  order.id === orderId
                    ? updatedOrder
                    : order
              )
          );


        } catch (jsonError) {

          console.error(
            "Cancel JSON parse error:",
            jsonError
          );

          // If response isn't valid JSON,
          // simply reload orders

          await fetchOrders();

        }

      }

      // =====================================
      // BACKEND RETURNED EMPTY RESPONSE
      // =====================================

      else {

        // Reload orders from backend

        await fetchOrders();

      }


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


  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (
    price
  ) => {

    return Number(
      price || 0
    ).toLocaleString(
      "en-IN"
    );

  };


  // =========================================
  // FORMAT PAYMENT STATUS
  // =========================================

  const getPaymentStatus = (
    paymentStatus
  ) => {

    if (
      paymentStatus ===
      "SUCCESS"
    ) {

      return "✓ PAID";

    }


    if (
      paymentStatus ===
      "FAILED"
    ) {

      return "✕ FAILED";

    }


    return (
      paymentStatus ||
      "PENDING"
    );

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="orders-message">

        Loading your orders...

      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (error) {

    return (

      <div className="orders-message">

        <h3>
          {error}
        </h3>


        <button
          onClick={() =>
            navigate("/login")
          }
        >
          Go to Login
        </button>

      </div>

    );

  }


  // =========================================
  // EMPTY ORDERS
  // =========================================

  if (orders.length === 0) {

    return (

      <section className="orders-page">

        <div className="orders-container">


          <div className="orders-heading">

            <p>
              YOUR ACCOUNT
            </p>


            <h1>
              My Orders
            </h1>


          </div>


          <div className="empty-orders">

            <h2>
              No orders yet
            </h2>


            <p>
              You haven't placed any
              orders yet.
            </p>


            <button
              onClick={() =>
                navigate("/")
              }
            >
              Start Shopping
            </button>


          </div>


        </div>

      </section>

    );

  }


  // =========================================
  // MAIN ORDERS PAGE
  // =========================================

  return (

    <section className="orders-page">

      <div className="orders-container">


        {/* =================================
            PAGE HEADING
        ================================= */}

        <div className="orders-heading">

          <p>
            YOUR ACCOUNT
          </p>


          <h1>
            My Orders
          </h1>


          <span>
            {orders.length}{" "}
            {orders.length === 1
              ? "order"
              : "orders"}
          </span>

        </div>


        {/* =================================
            ORDERS LIST
        ================================= */}

        <div className="orders-list">

          {orders.map(
            (order) => (

              <div
                className="order-card"
                key={order.id}

                onClick={() =>
                  openOrderDetails(
                    order.id
                  )
                }

                style={{
                  cursor: "pointer"
                }}
              >


                {/* =========================
                    ORDER HEADER
                ========================= */}

                <div className="order-header">

                  <div>

                    <p className="order-label">
                      ORDER
                    </p>


                    <h2>
                      #{order.id}
                    </h2>

                  </div>


                  <div
                    className={`order-status ${
                      order.status
                        ?.toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )
                    }`}
                  >
                    {order.status}
                  </div>


                </div>


                {/* =========================
                    ORDER DATE
                ========================= */}

                <div className="order-date">

                  {order.orderDate
                    ? new Date(
                        order.orderDate
                      ).toLocaleString(
                        "en-IN",
                        {
                          dateStyle:
                            "medium",

                          timeStyle:
                            "short",
                        }
                      )
                    : "Date unavailable"}

                </div>


                {/* =========================
                    PAYMENT STATUS
                ========================= */}

                <div
                  className="order-payment-status"
                  style={{
                    marginTop: "10px",
                    marginBottom: "15px"
                  }}
                >

                  <span>
                    Payment:
                  </span>


                  <strong
                    className={
                      order.paymentStatus ===
                      "SUCCESS"
                        ? "payment-success"
                        : order.paymentStatus ===
                          "FAILED"
                        ? "payment-failed"
                        : "payment-pending"
                    }
                  >

                    {getPaymentStatus(
                      order.paymentStatus
                    )}

                  </strong>


                </div>


                {/* =========================
                    ORDER ITEMS
                ========================= */}

                <div className="order-items">

                  {order.orderItems &&
                  order.orderItems.length > 0 ? (

                    order.orderItems.map(
                      (item) => {

                        const product =
                          item.product ||
                          {};


                        return (

                          <div
                            className="order-item"
                            key={item.id}
                          >


                            {/* PRODUCT IMAGE */}

                            <div className="order-item-image">

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

                            <div className="order-item-info">

                              <h3>
                                {product.title ||
                                  "Product"}
                              </h3>


                              <p>
                                {product.brand ||
                                  ""}
                              </p>


                              <span>
                                Qty:{" "}
                                {item.quantity}
                              </span>

                            </div>


                            {/* PRODUCT PRICE */}

                            <div className="order-item-price">

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

                    <div
                      style={{
                        padding:
                          "20px 0",
                        color: "#777"
                      }}
                    >
                      No products found
                    </div>

                  )}

                </div>


                {/* =========================
                    ORDER FOOTER
                ========================= */}

                <div className="order-footer">


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


                  {/* ACTIONS */}

                  <div>


                    {/* VIEW DETAILS */}

                    <button
                      className="view-order-button"

                      onClick={(event) => {

                        event.stopPropagation();

                        openOrderDetails(
                          order.id
                        );

                      }}

                      style={{
                        marginRight:
                          "10px"
                      }}
                    >
                      View Details →
                    </button>


                    {/* CANCEL */}

                    {order.status !==
                      "CANCELLED" && (

                      <button
                        className="cancel-order-button"

                        onClick={(event) =>
                          cancelOrder(
                            order.id,
                            event
                          )
                        }
                      >
                        Cancel Order
                      </button>

                    )}


                  </div>


                </div>


              </div>

            )
          )}

        </div>


      </div>

    </section>

  );

}

export default Orders;