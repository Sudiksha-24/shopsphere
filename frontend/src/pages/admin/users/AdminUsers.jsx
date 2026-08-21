import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminUsers.css";

function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/users",
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
          `Failed to load users (${response.status})`
        );
      }

      const data = text ? JSON.parse(text) : [];

      setUsers(data);

    } catch (error) {

      console.error(
        "Admin users error:",
        error
      );

      setError(
        error.message ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }
  };


  const handleDelete = async (userId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "DELETE",

          headers: {
            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text ||
          `Failed to delete user (${response.status})`
        );
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      alert("User deleted successfully!");

    } catch (error) {

      console.error(
        "Delete user error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete user."
      );
    }
  };


  if (loading) {

    return (
      <div className="admin-users-message">
        Loading users...
      </div>
    );

  }


  if (error) {

    return (
      <div className="admin-users-message">

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
    <section className="admin-users-page">

      <div className="admin-users-container">

        {/* HEADER */}

        <div className="admin-users-header">

          <div>

            <p>
              ADMIN PANEL
            </p>

            <h1>
              Users
            </h1>

            <span>
              Manage ShopSphere users
            </span>

          </div>

          <Link
            to="/admin"
            className="back-admin-button"
          >
            ← Dashboard
          </Link>

        </div>


        {/* COUNT */}

        <div className="user-count-box">

          <strong>
            {users.length}
          </strong>

          <span>
            Total Users
          </span>

        </div>


        {/* USERS */}

        {users.length === 0 ? (

          <div className="no-users">

            <h3>
              No users found
            </h3>

            <p>
              Registered users will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-users-list">

            {users.map((user) => (

              <div
                className="admin-user-card"
                key={user.id}
              >

                <div className="user-avatar">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>


                <div className="user-info">

                  <h2>
                    {user.name || "User"}
                  </h2>

                  <p>
                    {user.email || "-"}
                  </p>

                </div>


                <div className="user-id">

                  <span>
                    User ID
                  </span>

                  <strong>
                    #{user.id}
                  </strong>

                </div>


                <div className="user-role">

                  <span>
                    {user.role || "USER"}
                  </span>

                </div>


                <button
                  className="delete-user-button"
                  onClick={() =>
                    handleDelete(user.id)
                  }
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}


// IMPORTANT
// This fixes the "does not provide an export named default" error.

export default AdminUsers;