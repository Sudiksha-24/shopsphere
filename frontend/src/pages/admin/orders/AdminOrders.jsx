import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);


  // ================================
  // FETCH ALL ORDERS
  // ================================

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/orders",
        {
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );


      const text = await response.text();


      if (!response.ok) {
        throw new Error(
          text ||
          `Failed to load orders (${response.status})`
        );
      }


      const data = text
        ? JSON.parse(text)
        : [];


      setOrders(data);

    } catch (error) {

      console.error(
        "Admin orders error:",
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


  // ================================
  // UPDATE ORDER STATUS
  // ================================

  const handleStatusChange = async (
    orderId,
    status
  ) => {

    const token =
      localStorage.getItem("token");

    setUpdatingId(orderId);


    try {

      const response = await fetch(
        "http://localhost:8080/api/orders/status",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            orderId: orderId,
            status: status,
          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to update order (${response.status})`
        );

      }


      const updatedOrder =
        text
          ? JSON.parse(text)
          : null;


      // Update order in UI

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status:
                  updatedOrder?.status ||
                  status,
              }
            : order
        )
      );


      alert(
        "Order status updated successfully!"
      );


    } catch (error) {

      console.error(
        "Update order error:",
        error
      );

      alert(
        error.message ||
        "Unable to update order status."
      );

    } finally {

      setUpdatingId(null);

    }
  };


  // ================================
  // LOADING
  // ================================

  if (loading) {

    return (
      <div className="admin-orders-message">
        Loading orders...
      </div>
    );

  }


  // ================================
  // ERROR
  // ================================

  if (error) {

    return (
      <div className="admin-orders-message">

        <h3>
          {error}
        </h3>

        <Link to="/admin">
          ← Back to Dashboard
        </Link>

      </div>
    );

  }


  return (

    <section className="admin-orders-page">

      <div className="admin-orders-container">


        {/* ==========================
            HEADER
        ========================== */}

        <div className="admin-orders-header">

          <div>

            <p>
              ADMIN PANEL
            </p>

            <h1>
              Orders
            </h1>

            <span>
              Manage customer orders
            </span>

          </div>


          <Link
            to="/admin"
            className="back-admin-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ==========================
            ORDER COUNT
        ========================== */}

        <div className="order-count-box">

          <strong>
            {orders.length}
          </strong>

          <span>
            Total Orders
          </span>

        </div>


        {/* ==========================
            EMPTY ORDERS
        ========================== */}

        {orders.length === 0 ? (

          <div className="no-orders">

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here.
            </p>

          </div>

        ) : (


          /* ==========================
             ORDERS
          ========================== */

          <div className="admin-orders-list">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order.id}
              >


                {/* ORDER HEADER */}

                <div className="admin-order-top">

                  <div>

                    <p className="order-label">
                      ORDER
                    </p>

                    <h2>
                      #{order.id}
                    </h2>

                  </div>


                  <span
                    className={`order-status ${String(
                      order.status || ""
                    ).toLowerCase()}`}
                  >
                    {order.status || "PLACED"}
                  </span>

                </div>


                {/* ORDER INFO */}

                <div className="admin-order-info">


                  <div className="order-info-item">

                    <span>
                      Customer
                    </span>

                    <strong>
                      {order.user?.name ||
                        "Customer"}
                    </strong>

                  </div>


                  <div className="order-info-item">

                    <span>
                      Email
                    </span>

                    <strong>
                      {order.user?.email ||
                        "-"}
                    </strong>

                  </div>


                  <div className="order-info-item">

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleString(
                            "en-IN"
                          )
                        : "-"}
                    </strong>

                  </div>


                  <div className="order-info-item">

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

                </div>


                {/* ORDER ITEMS */}

                {order.orderItems &&
                  order.orderItems.length > 0 && (

                    <div className="admin-order-items">

                      <h3>
                        Order Items
                      </h3>


                      {order.orderItems.map(
                        (item) => (

                          <div
                            className="admin-order-item"
                            key={item.id}
                          >

                            <span>
                              {item.product?.title ||
                                "Product"}
                            </span>

                            <span>
                              Qty:{" "}
                              {item.quantity}
                            </span>

                            <strong>
                              ₹
                              {Number(
                                item.price || 0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                        )
                      )}

                    </div>

                  )}


                {/* STATUS UPDATE */}

                <div className="admin-order-actions">

                  <label>
                    Update Status
                  </label>


                  <select
                    value={
                      order.status ||
                      "PLACED"
                    }
                    disabled={
                      updatingId === order.id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="PLACED">
                      PLACED
                    </option>

                    <option value="CONFIRMED">
                      CONFIRMED
                    </option>

                    <option value="SHIPPED">
                      SHIPPED
                    </option>

                    <option value="DELIVERED">
                      DELIVERED
                    </option>

                    <option value="CANCELLED">
                      CANCELLED
                    </option>

                  </select>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default AdminOrders;