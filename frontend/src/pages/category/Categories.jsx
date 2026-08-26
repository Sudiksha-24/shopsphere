import { useNavigate } from "react-router-dom";
import "./Categories.css";

import MenImage from "../../assets/images/men.jpg";
import WomenImage from "../../assets/images/women.jpg";
import ShoesImage from "../../assets/images/shoes.jpg";
import AccessoriesImage from "../../assets/images/accessories.jpg";

function Categories() {

  const navigate = useNavigate();


  // =========================================
  // CATEGORY DATA
  // =========================================

  const categories = [
    {
      name: "Men",
      image: MenImage,
      description:
        "Explore men's fashion and essentials.",
    },

    {
      name: "Women",
      image: WomenImage,
      description:
        "Discover stylish collections for women.",
    },

    {
      name: "Shoes",
      image: ShoesImage,
      description:
        "Find the perfect pair for every occasion.",
    },

    {
      name: "Accessories",
      image: AccessoriesImage,
      description:
        "Complete your look with the right accessories.",
    },
  ];


  // =========================================
  // CATEGORY CLICK
  // =========================================

  const handleCategoryClick = (
    categoryName
  ) => {

    console.log(
      "CATEGORY CLICKED:",
      categoryName
    );


    navigate(
      `/products?category=${encodeURIComponent(
        categoryName
      )}`
    );

  };


  // =========================================
  // ALL PRODUCTS
  // =========================================

  const handleAllProducts = () => {

    console.log(
      "ALL PRODUCTS CLICKED"
    );


    navigate("/products");

  };


  // =========================================
  // UI
  // =========================================

  return (

    <main className="categories-page">

      <div className="categories-container">


        {/* =================================
            HEADING
        ================================= */}

        <div className="categories-heading">

          <p>
            EXPLORE COLLECTIONS
          </p>


          <h1>
            Shop by Category
          </h1>


          <span>
            Discover our collections and find
            something made for you.
          </span>

        </div>


        {/* =================================
            CATEGORY GRID
        ================================= */}

        <div className="categories-grid">

          {categories.map(
            (category) => (

              <div
                className="categories-card"

                key={category.name}

                onClick={() =>
                  handleCategoryClick(
                    category.name
                  )
                }

                role="button"

                tabIndex={0}

                onKeyDown={(event) => {

                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {

                    handleCategoryClick(
                      category.name
                    );

                  }

                }}
              >


                {/* =========================
                    IMAGE
                ========================= */}

                <div
                  className="categories-image"
                  style={{
                    pointerEvents:
                      "none",
                  }}
                >

                  <img
                    src={category.image}
                    alt={category.name}
                  />

                </div>


                {/* =========================
                    OVERLAY
                ========================= */}

                <div
                  className="categories-overlay"
                  style={{
                    pointerEvents:
                      "none",
                  }}
                >

                  <div className="categories-content">

                    <p>
                      COLLECTION
                    </p>


                    <h2>
                      {category.name}
                    </h2>


                    <span>
                      {category.description}
                    </span>


                    <strong>
                      Explore Collection →
                    </strong>

                  </div>

                </div>


              </div>

            )
          )}

        </div>


        {/* =================================
            ALL PRODUCTS
        ================================= */}

        <div className="categories-all-products">

          <p>
            Looking for something specific?
          </p>


          <button
            type="button"

            onClick={
              handleAllProducts
            }
          >
            View All Products →
          </button>

        </div>


      </div>

    </main>

  );

}

export default Categories;