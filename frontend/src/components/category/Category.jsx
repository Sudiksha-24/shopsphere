import "./Category.css";

import MenImage from "../../assets/images/men.jpg";
import WomenImage from "../../assets/images/women.jpg";
import ShoesImage from "../../assets/images/shoes.jpg";
import AccessoriesImage from "../../assets/images/accessories.jpg";

function Category() {
  return (
    <section className="category-section">

      <div className="category-container">

        {/* Heading */}
        <div className="section-heading">

          <p>EXPLORE COLLECTIONS</p>

          <h2>Shop by Category</h2>

          <span>
            Find your perfect style from our curated collections.
          </span>

        </div>


        {/* Category Cards */}
        <div className="category-grid">

          {/* Men */}
          <div className="category-card">

            <img
              src={MenImage}
              alt="Men Collection"
            />

            <div className="category-overlay">
              <h3>Men</h3>
              <span>Explore Collection →</span>
            </div>

          </div>


          {/* Women */}
          <div className="category-card">

            <img
              src={WomenImage}
              alt="Women Collection"
            />

            <div className="category-overlay">
              <h3>Women</h3>
              <span>Explore Collection →</span>
            </div>

          </div>


          {/* Shoes */}
          <div className="category-card">

            <img
              src={ShoesImage}
              alt="Shoes Collection"
            />

            <div className="category-overlay">
              <h3>Shoes</h3>
              <span>Explore Collection →</span>
            </div>

          </div>


          {/* Accessories */}
          <div className="category-card">

            <img
              src={AccessoriesImage}
              alt="Accessories Collection"
            />

            <div className="category-overlay">
              <h3>Accessories</h3>
              <span>Explore Collection →</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Category;