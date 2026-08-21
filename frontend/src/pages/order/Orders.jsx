import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

function Orders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // FETCH ORDERS
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");


    if (!userId || !token) {

      setError("Please login to view your orders.");

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


      console.log(
        "Orders API Status:",
        response.status
      );


      const responseText =
        await response.text();


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


      const data = responseText
        ? JSON.parse(responseText)
        : [];


      console.log(
        "ORDERS DATA:",
        data
      );


      setOrders(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Orders error:",
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


  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderId) => {

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
        `http://localhost:8080/api/orders/cancel/${orderId}`,
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


      // Update order in UI

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order
        )
      );


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
      <div className="orders-message">
        Loading your orders...
      </div>
    );

  }


  // =========================
  // ERROR
  // =========================

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


  // =========================
  // EMPTY ORDERS
  // =========================

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

            <div className="empty-orders-icon">
              📦
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              You haven't placed any orders yet.
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


  // =========================
  // ORDERS PAGE
  // =========================

  return (

    <section className="orders-page">

      <div className="orders-container">


        {/* Heading */}

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


        {/* Orders */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >


              {/* Order Header */}

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


              {/* Order Date */}

              <div className="order-date">

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
                  : "Date unavailable"}

              </div>


              {/* Order Items */}

              <div className="order-items">

                {order.orderItems?.map(
                  (item) => {

                    const product =
                      item.product || {};


                    return (

                      <div
                        className="order-item"
                        key={item.id}
                      >

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


                        <div className="order-item-price">

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


              {/* Footer */}

              <div className="order-footer">

                <div>

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>


                {order.status !==
                  "CANCELLED" && (

                  <button
                    className="cancel-order-button"
                    onClick={() =>
                      cancelOrder(
                        order.id
                      )
                    }
                  >
                    Cancel Order
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );
}

export default Orders;