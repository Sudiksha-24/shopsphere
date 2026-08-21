import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {

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

  const [loading, setLoading] = useState(false);


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
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8080/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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


      const text = await response.text();


      if (!response.ok) {

        console.error(
          "Add product error:",
          text
        );

        throw new Error(
          text ||
          `Failed to add product (${response.status})`
        );
      }


      const data = text
        ? JSON.parse(text)
        : null;


      console.log(
        "Product added:",
        data
      );


      alert(
        "Product added successfully!"
      );


      // Reset form

      setForm({
        title: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: "",
        brand: "",
        category: "",
      });


      // Go back to products

      navigate("/admin/products");


    } catch (error) {

      console.error(
        "Add product error:",
        error
      );

      alert(
        error.message ||
        "Unable to add product."
      );

    } finally {

      setLoading(false);
    }
  };


  return (

    <section className="add-product-page">

      <div className="add-product-container">


        {/* HEADER */}

        <div className="add-product-header">

          <div>

            <p>
              ADMIN PANEL
            </p>

            <h1>
              Add Product
            </h1>

            <span>
              Add a new product to ShopSphere
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
          className="add-product-form"
          onSubmit={handleSubmit}
        >


          {/* TITLE */}

          <div className="form-group">

            <label>
              Product Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              required
            />

          </div>


          {/* BRAND */}

          <div className="form-group">

            <label>
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Enter brand"
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Mobiles"
              required
            />

          </div>


          {/* PRICE */}

          <div className="form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="1"
              step="0.01"
              required
            />

          </div>


          {/* QUANTITY */}

          <div className="form-group">

            <label>
              Stock Quantity
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter stock"
              min="1"
              required
            />

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="e.g. iphone16pro.jpg"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group full-width">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
              required
            />

          </div>


          {/* BUTTONS */}

          <div className="add-product-actions">

            <button
              type="submit"
              className="add-product-submit"
              disabled={loading}
            >
              {loading
                ? "Adding..."
                : "Add Product"}
            </button>


            <Link
              to="/admin/products"
              className="add-product-cancel"
            >
              Cancel
            </Link>

          </div>

        </form>

      </div>

    </section>
  );
}

export default AddProduct;