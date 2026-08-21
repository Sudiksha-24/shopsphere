import { useEffect, useState } from "react";
import "./FeaturedProducts.css";

import ProductCard from "./ProductCard";

function FeaturedProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Remove incomplete products
        const validProducts = data.filter(
          (product) =>
            product.title &&
            product.price >= 0 &&
            product.imageUrl
        );

        setProducts(validProducts);

      } catch (error) {

        console.error("Product fetch error:", error);

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, []);


  return (

    <section className="featured-section">

      <div className="featured-container">

        {/* Heading */}

        <div className="featured-heading">

          <p>OUR COLLECTION</p>

          <h2>Featured Products</h2>

          <span>
            Discover our handpicked styles made for you.
          </span>

        </div>


        {/* Loading */}

        {loading && (

          <div className="products-message">
            Loading products...
          </div>

        )}


        {/* Products */}

        {!loading && products.length > 0 && (

          <div className="products-grid">

            {products.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
              />

            ))}

          </div>

        )}


        {/* No Products */}

        {!loading && products.length === 0 && (

          <div className="products-message">
            No products available.
          </div>

        )}

      </div>

    </section>

  );
}

export default FeaturedProducts;