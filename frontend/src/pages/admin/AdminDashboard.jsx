import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  return (
    <section className="admin-page">

      <div className="admin-container">

        {/* Header */}

        <div className="admin-heading">

          <p>ADMIN PANEL</p>

          <h1>
            Dashboard
          </h1>

          <span>
            Welcome back,{" "}
            {user?.name || "Admin"}
          </span>

        </div>


        {/* Dashboard Cards */}

        <div className="admin-cards">


          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            className="admin-card"
          >

            <div className="admin-card-icon">
              📦
            </div>

            <div className="admin-card-content">

              <h2>
                Products
              </h2>

              <p>
                Add, edit and manage
                your products.
              </p>

            </div>

            <span className="admin-arrow">
              →
            </span>

          </Link>


          {/* ORDERS */}

          <Link
            to="/admin/orders"
            className="admin-card"
          >

            <div className="admin-card-icon">
              🛒
            </div>

            <div className="admin-card-content">

              <h2>
                Orders
              </h2>

              <p>
                View orders and update
                order status.
              </p>

            </div>

            <span className="admin-arrow">
              →
            </span>

          </Link>


          {/* USERS */}

          <Link
            to="/admin/users"
            className="admin-card"
          >

            <div className="admin-card-icon">
              👥
            </div>

            <div className="admin-card-content">

              <h2>
                Users
              </h2>

              <p>
                View and manage
                registered users.
              </p>

            </div>

            <span className="admin-arrow">
              →
            </span>

          </Link>


        </div>

      </div>

    </section>
  );
}

export default AdminDashboard;