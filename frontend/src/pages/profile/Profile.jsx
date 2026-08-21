import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });


  // =====================================
  // LOAD USER
  // =====================================

  useEffect(() => {

    fetchUser();

  }, []);


  const fetchUser = async () => {

    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId) {

      setError("Please login first.");

      setLoading(false);

      return;
    }


    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to load profile (${response.status})`
        );

      }


      const data = text
        ? JSON.parse(text)
        : null;


      setUser(data);


      setForm({
        name: data?.name || "",
        email: data?.email || "",
        password: "",
      });


    } catch (error) {

      console.error(
        "Profile error:",
        error
      );

      setError(
        error.message ||
        "Unable to load profile."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));
  };


  // =====================================
  // UPDATE PROFILE
  // =====================================

  const handleUpdate = async (e) => {

    e.preventDefault();


    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId) {

      alert("Please login first.");

      return;
    }


    if (!form.name.trim()) {

      alert("Name is required.");

      return;
    }


    if (!form.email.trim()) {

      alert("Email is required.");

      return;
    }


    setSaving(true);


    try {

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
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
            name: form.name,

            email: form.email,

            password: form.password,
          }),
        }
      );


      const text =
        await response.text();


      console.log(
        "UPDATE PROFILE RESPONSE:",
        text
      );


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to update profile (${response.status})`
        );

      }


      const updatedUser =
        text
          ? JSON.parse(text)
          : null;


      setUser(updatedUser);


      setForm({
        name: updatedUser?.name || "",
        email: updatedUser?.email || "",
        password: "",
      });


      setEditing(false);


      alert(
        "Profile updated successfully!"
      );


    } catch (error) {

      console.error(
        "Update profile error:",
        error
      );

      alert(
        error.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================
  // CANCEL EDIT
  // =====================================

  const handleCancelEdit = () => {

    setForm({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    });

    setEditing(false);
  };


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.removeItem("userId");

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    alert("Logged out successfully.");

    navigate("/login");
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="profile-message">
        Loading profile...
      </div>
    );
  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (
      <div className="profile-message">

        <h3>
          {error}
        </h3>

        <Link to="/login">
          Go to Login
        </Link>

      </div>
    );
  }


  // =====================================
  // PROFILE PAGE
  // =====================================

  return (

    <section className="profile-page">

      <div className="profile-container">


        {/* =================================
            HEADER
        ================================= */}

        <div className="profile-heading">

          <p>
            YOUR ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

        </div>


        {/* =================================
            PROFILE CARD
        ================================= */}

        <div className="profile-card">


          <div className="profile-avatar">

            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>


          <div className="profile-info">

            <h2>
              {user?.name || "User"}
            </h2>

            <p className="profile-role">

              {user?.role || "USER"}

            </p>

          </div>


          {/* EDIT BUTTON */}

          {!editing && (

            <button
              className="edit-profile-button"
              onClick={() =>
                setEditing(true)
              }
            >
              Edit Profile
            </button>

          )}

        </div>


        {/* =================================
            EDIT PROFILE FORM
        ================================= */}

        {editing && (

          <div className="profile-section edit-profile-section">

            <div className="section-heading">

              <h2>
                Edit Profile
              </h2>

            </div>


            <form
              className="profile-form"
              onSubmit={handleUpdate}
            >


              {/* NAME */}

              <div className="profile-form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="profile-form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="profile-form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />

              </div>


              {/* BUTTONS */}

              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>


                <button
                  type="button"
                  className="cancel-profile-button"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* =================================
            PERSONAL INFORMATION
        ================================= */}

        {!editing && (

          <div className="profile-section">

            <div className="section-heading">

              <h2>
                Personal Information
              </h2>

            </div>


            <div className="profile-details">


              <div className="profile-detail">

                <span>
                  Full Name
                </span>

                <strong>
                  {user?.name || "-"}
                </strong>

              </div>


              <div className="profile-detail">

                <span>
                  Email Address
                </span>

                <strong>
                  {user?.email || "-"}
                </strong>

              </div>


              <div className="profile-detail">

                <span>
                  Account Type
                </span>

                <strong>
                  {user?.role || "USER"}
                </strong>

              </div>


              <div className="profile-detail">

                <span>
                  User ID
                </span>

                <strong>
                  #{user?.id}
                </strong>

              </div>

            </div>

          </div>

        )}


        {/* =================================
            QUICK ACCESS
        ================================= */}

        <div className="profile-section">

          <div className="section-heading">

            <h2>
              Quick Access
            </h2>

          </div>


          <div className="profile-links">


            {/* ORDERS */}

            <Link
              to="/orders"
              className="profile-link-card"
            >

              <div className="profile-link-icon">
                📦
              </div>

              <div>

                <h3>
                  My Orders
                </h3>

                <p>
                  View your orders and track
                  their status.
                </p>

              </div>

              <span>
                →
              </span>

            </Link>


            {/* ADDRESS */}

            <Link
              to="/address"
              className="profile-link-card"
            >

              <div className="profile-link-icon">
                📍
              </div>

              <div>

                <h3>
                  My Addresses
                </h3>

                <p>
                  Manage your saved delivery
                  addresses.
                </p>

              </div>

              <span>
                →
              </span>

            </Link>


            {/* CART */}

            <Link
              to="/cart"
              className="profile-link-card"
            >

              <div className="profile-link-icon">
                🛒
              </div>

              <div>

                <h3>
                  Shopping Cart
                </h3>

                <p>
                  View items currently in your
                  cart.
                </p>

              </div>

              <span>
                →
              </span>

            </Link>

          </div>

        </div>


        {/* =================================
            LOGOUT
        ================================= */}

        <div className="profile-logout">

          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </section>
  );
}

export default Profile;