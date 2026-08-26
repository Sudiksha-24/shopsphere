import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./FeaturedProducts.css";
import ProductCard from "./ProductCard";

function FeaturedProducts() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================
  // FETCH PRODUCTS
  // =====================================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch products"
          );
        }

        const data = await response.json();


        // Only valid products
        const validProducts = data.filter(
          (product) =>
            product.title &&
            Number(product.price) >= 0 &&
            product.imageUrl
        );


        /*
         * Home page वर फक्त 6 products
         * दाखवणार.
         */
        setProducts(
          validProducts.slice(0, 6)
        );


      } catch (error) {

        console.error(
          "Featured products error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProducts();

  }, []);


  // =====================================
  // UI
  // =====================================

  return (

    <section className="featured-section">

      <div className="featured-container">


        {/* =============================
            HEADING
        ============================== */}

        <div className="featured-heading">

          <p>
            SHOPSPHERE PICKS
          </p>

          <h2>
            New Arrivals
          </h2>

          <span>
            Discover styles we think you'll love.
          </span>

        </div>


        {/* =============================
            LOADING
        ============================== */}

        {loading && (

          <div className="products-message">

            <p>
              Loading products...
            </p>

          </div>

        )}


        {/* =============================
            PRODUCTS
        ============================== */}

        {!loading &&
          products.length > 0 && (

            <div className="products-grid">

              {products.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>

          )}


        {/* =============================
            NO PRODUCTS
        ============================== */}

        {!loading &&
          products.length === 0 && (

            <div className="products-message">

              <h3>
                Products coming soon
              </h3>

              <p>
                We're preparing something special for you.
              </p>

            </div>

          )}


        {/* =============================
            VIEW ALL
        ============================= */}

        {!loading &&
          products.length > 0 && (

            <div className="featured-view-all">

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
              >
                View All Products →
              </button>

            </div>

          )}

      </div>

    </section>

  );
}

export default FeaturedProducts;