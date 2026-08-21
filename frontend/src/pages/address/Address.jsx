import { useEffect, useState } from "react";
import "./Address.css";

function Address() {

  const [addresses, setAddresses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const emptyForm = {
    fullName: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    defaultAddress: false,
  };

  const [form, setForm] = useState(emptyForm);


  // =====================================
  // LOAD ADDRESSES
  // =====================================

  useEffect(() => {

    fetchAddresses();

  }, []);


  const fetchAddresses = async () => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    console.log("USER ID:", userId);
    console.log("TOKEN:", token);


    if (!userId) {

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
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
        }
      );


      console.log(
        "ADDRESS STATUS:",
        response.status
      );


      const text =
        await response.text();


      console.log(
        "ADDRESS RESPONSE:",
        text
      );


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to load addresses (${response.status})`
        );

      }


      const data = text
        ? JSON.parse(text)
        : [];


      setAddresses(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (error) {

      console.error(
        "Address error:",
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


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setForm((previous) => ({

      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));
  };


  // =====================================
  // ADD / UPDATE
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const userId =
      localStorage.getItem("userId");

    const token =
      localStorage.getItem("token");


    if (!userId) {

      alert("Please login first.");

      return;
    }


    try {

      let url;

      let method;


      if (editingId) {

        url =
          `http://localhost:8080/api/address/update/${editingId}`;

        method = "PUT";

      } else {

        url =
          `http://localhost:8080/api/address/add?userId=${userId}`;

        method = "POST";
      }


      const response =
        await fetch(url, {

          method,

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

          body: JSON.stringify(form),

        });


      const text =
        await response.text();


      console.log(
        "SAVE ADDRESS RESPONSE:",
        text
      );


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to save address"
        );

      }


      alert(
        editingId
          ? "Address updated successfully!"
          : "Address added successfully!"
      );


      setForm(emptyForm);

      setEditingId(null);

      setShowForm(false);

      fetchAddresses();


    } catch (error) {

      console.error(
        "Save address error:",
        error
      );

      alert(
        error.message ||
        "Unable to save address."
      );
    }
  };


  // =====================================
  // EDIT
  // =====================================

  const handleEdit = (address) => {

    setEditingId(address.id);

    setForm({

      fullName:
        address.fullName || "",

      mobileNumber:
        address.mobileNumber || "",

      addressLine1:
        address.addressLine1 || "",

      addressLine2:
        address.addressLine2 || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",

      country:
        address.country || "India",

      defaultAddress:
        address.defaultAddress || false,

    });


    setShowForm(true);

  };


  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (addressId) => {

    const token =
      localStorage.getItem("token");


    if (
      !window.confirm(
        "Are you sure you want to delete this address?"
      )
    ) {

      return;
    }


    try {

      const response =
        await fetch(
          `http://localhost:8080/api/address/delete/${addressId}`,
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


      const text =
        await response.text();


      if (!response.ok) {

        throw new Error(
          text ||
          "Failed to delete address"
        );

      }


      alert(
        "Address deleted successfully!"
      );


      fetchAddresses();


    } catch (error) {

      console.error(
        "Delete address error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete address."
      );
    }
  };


  // =====================================
  // CANCEL FORM
  // =====================================

  const handleCancel = () => {

    setForm(emptyForm);

    setEditingId(null);

    setShowForm(false);

  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="address-message">
        Loading addresses...
      </div>
    );
  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (
      <div className="address-message">

        <h3>
          {error}
        </h3>

        <button
          onClick={fetchAddresses}
        >
          Try Again
        </button>

      </div>
    );
  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <section className="address-page">

      <div className="address-container">


        {/* HEADER */}

        <div className="address-heading">

          <p>
            YOUR ACCOUNT
          </p>

          <h1>
            My Addresses
          </h1>

        </div>


        {/* ADD BUTTON */}

        {!showForm && (

          <button
            className="add-address-button"
            onClick={() => {

              setForm(emptyForm);

              setEditingId(null);

              setShowForm(true);

            }}
          >
            + Add New Address
          </button>

        )}


        {/* FORM */}

        {showForm && (

          <div className="address-form-card">

            <h2>
              {editingId
                ? "Edit Address"
                : "Add New Address"}
            </h2>


            <form
              onSubmit={handleSubmit}
            >

              <div className="form-grid">


                {/* FULL NAME */}

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* MOBILE */}

                <div className="form-group">

                  <label>
                    Mobile Number
                  </label>

                  <input
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* ADDRESS 1 */}

                <div className="form-group full-width">

                  <label>
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    name="addressLine1"
                    value={form.addressLine1}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* ADDRESS 2 */}

                <div className="form-group full-width">

                  <label>
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    name="addressLine2"
                    value={form.addressLine2}
                    onChange={handleChange}
                  />

                </div>


                {/* CITY */}

                <div className="form-group">

                  <label>
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* STATE */}

                <div className="form-group">

                  <label>
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* PINCODE */}

                <div className="form-group">

                  <label>
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                  />

                </div>


                {/* COUNTRY */}

                <div className="form-group">

                  <label>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* DEFAULT */}

              <label className="default-checkbox">

                <input
                  type="checkbox"
                  name="defaultAddress"
                  checked={
                    form.defaultAddress
                  }
                  onChange={handleChange}
                />

                Set as default address

              </label>


              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-address-button"
                >
                  {editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>


                <button
                  type="button"
                  className="cancel-address-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* SAVED ADDRESSES */}

        <div className="saved-addresses">

          <div className="saved-heading">

            <h2>
              Saved Addresses
            </h2>

            <span>
              {addresses.length} saved
            </span>

          </div>


          {addresses.length === 0 ? (

            <div className="empty-addresses">

              <div className="empty-icon">
                📍
              </div>

              <h3>
                No addresses saved
              </h3>

              <p>
                Add an address for faster checkout.
              </p>

              <button
                onClick={() => {
                  setForm(emptyForm);
                  setShowForm(true);
                }}
              >
                Add Address
              </button>

            </div>

          ) : (

            <div className="address-list">

              {addresses.map(
                (address) => (

                  <div
                    className="address-card"
                    key={address.id}
                  >

                    {address.defaultAddress && (

                      <span className="default-badge">
                        DEFAULT
                      </span>

                    )}

                    <h3>
                      {address.fullName}
                    </h3>

                    <p>
                      📱 {address.mobileNumber}
                    </p>

                    <p>
                      {address.addressLine1}
                    </p>

                    {address.addressLine2 && (

                      <p>
                        {address.addressLine2}
                      </p>

                    )}

                    <p>
                      {address.city},{" "}
                      {address.state}
                    </p>

                    <p>
                      {address.pincode},{" "}
                      {address.country}
                    </p>


                    <div className="address-card-actions">

                      <button
                        onClick={() =>
                          handleEdit(address)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            address.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default Address;