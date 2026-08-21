import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    brand: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // =====================================
  // LOAD PRODUCT
  // =====================================

  useEffect(() => {
    fetchProduct();
  }, [id]);


  const fetchProduct = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/api/products/${id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load product (${response.status})`
        );
      }

      const data = await response.json();

      setForm({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        quantity: data.quantity || "",
        imageUrl: data.imageUrl || "",
        brand: data.brand || "",
        category: data.category || "",
      });

    } catch (error) {

      console.error(
        "Load product error:",
        error
      );

      alert(
        error.message ||
        "Unable to load product."
      );

      navigate("/admin/products");

    } finally {

      setLoading(false);
    }
  };


  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================
  // UPDATE PRODUCT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token =
      localStorage.getItem("token");

    setSaving(true);

    try {

      const response = await fetch(
        `http://localhost:8080/api/products/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",

            ...(token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: Number(form.price),
            quantity: Number(form.quantity),
            imageUrl: form.imageUrl,
            brand: form.brand,
            category: form.category,
          }),
        }
      );


      const text =
        await response.text();


      if (!response.ok) {

        console.error(
          "Update product error:",
          text
        );

        throw new Error(
          text ||
          `Failed to update product (${response.status})`
        );
      }


      alert(
        "Product updated successfully!"
      );

      navigate("/admin/products");


    } catch (error) {

      console.error(
        "Update product error:",
        error
      );

      alert(
        error.message ||
        "Unable to update product."
      );

    } finally {

      setSaving(false);
    }
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="edit-product-message">
        Loading product...
      </div>
    );
  }


  return (

    <section className="edit-product-page">

      <div className="edit-product-container">


        {/* HEADER */}

        <div className="edit-product-header">

          <div>

            <p>
              ADMIN PANEL
            </p>

            <h1>
              Edit Product
            </h1>

            <span>
              Update product information
            </span>

          </div>


          <Link
            to="/admin/products"
            className="back-products-button"
          >
            ← Products
          </Link>

        </div>


        {/* FORM */}

        <form
          className="edit-product-form"
          onSubmit={handleSubmit}
        >


          {/* TITLE */}

          <div className="edit-form-group">

            <label>
              Product Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* BRAND */}

          <div className="edit-form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="edit-form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />

          </div>


          {/* PRICE */}

          <div className="edit-form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />

          </div>


          {/* QUANTITY */}

          <div className="edit-form-group">

            <label>
              Stock Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              required
            />

          </div>


          {/* IMAGE */}

          <div className="edit-form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="edit-form-group edit-full-width">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>


          {/* BUTTONS */}

          <div className="edit-product-actions">

            <button
              type="submit"
              className="save-product-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>


            <Link
              to="/admin/products"
              className="cancel-edit-button"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </section>
  );
}

export default EditProduct;