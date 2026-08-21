import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProducts.css";

function AdminProducts() {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================
  // LOAD PRODUCTS
  // =====================================

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchProducts = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!response.ok) {

        throw new Error(
          `Failed to load products (${response.status})`
        );

      }

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.error(
        "Admin products error:",
        error
      );

      setError(
        error.message ||
        "Unable to load products."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDelete = async (productId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }


    const token =
      localStorage.getItem("token");


    try {

      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
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


      console.log(
        "Delete response:",
        text
      );


      if (!response.ok) {

        throw new Error(
          text ||
          `Failed to delete product (${response.status})`
        );

      }


      // Remove product from screen

      setProducts(
        (previousProducts) =>
          previousProducts.filter(
            (product) =>
              product.id !== productId
          )
      );


      alert(
        "Product deleted successfully!"
      );


    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.message ||
        "Unable to delete product."
      );

    }
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <div className="admin-product-message">
        Loading products...
      </div>
    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (
      <div className="admin-product-message">

        <h3>
          {error}
        </h3>

        <Link to="/admin">
          ← Back to Dashboard
        </Link>

      </div>
    );

  }


  // =====================================
  // PAGE
  // =====================================

  return (

    <section className="admin-products-page">

      <div className="admin-products-container">


        {/* =================================
            HEADER
        ================================= */}

        <div className="admin-products-header">

          <div>

            <p>
              ADMIN PANEL
            </p>

            <h1>
              Products
            </h1>

            <span>
              Manage your ShopSphere products
            </span>

          </div>


          <div className="admin-header-actions">

            <Link
              to="/admin"
              className="back-admin-button"
            >
              ← Dashboard
            </Link>


            <Link
              to="/admin/products/add"
              className="add-product-button"
            >
              + Add Product
            </Link>

          </div>

        </div>


        {/* =================================
            PRODUCT COUNT
        ================================= */}

        <div className="product-count-box">

          <strong>
            {products.length}
          </strong>

          <span>
            Total Products
          </span>

        </div>


        {/* =================================
            PRODUCTS
        ================================= */}

        {products.length === 0 ? (

          <div className="no-products">

            <h3>
              No products found
            </h3>

            <p>
              Add your first product to
              ShopSphere.
            </p>

          </div>

        ) : (

          <div className="admin-product-grid">

            {products.map((product) => (

              <div
                className="admin-product-card"
                key={product.id}
              >


                {/* PRODUCT IMAGE */}

                <div className="admin-product-image">

                  <img
                    src={`http://localhost:8080/images/${product.imageUrl}`}
                    alt={product.title}
                  />

                </div>


                {/* PRODUCT INFO */}

                <div className="admin-product-info">

                  <p className="admin-product-category">
                    {product.category}
                  </p>


                  <h2>
                    {product.title}
                  </h2>


                  <p className="admin-product-brand">
                    {product.brand}
                  </p>


                  {/* PRICE + STOCK */}

                  <div className="admin-product-details">

                    <strong>
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </strong>


                    <span>
                      Stock: {product.quantity}
                    </span>

                  </div>


                  {/* =================================
                      ACTION BUTTONS
                  ================================= */}

                  <div className="admin-product-actions">


                    {/* EDIT */}

                    <Link
                      to={`/admin/products/edit/${product.id}`}
                      className="edit-product-button"
                    >
                      Edit
                    </Link>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-product-button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>


                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>

  );
}

export default AdminProducts;