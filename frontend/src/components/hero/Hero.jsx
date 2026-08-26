import { useNavigate } from "react-router-dom";
import "./Hero.css";
import HeroImage from "../../assets/images/model.jpg";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* =========================
          MAIN HERO
      ========================= */}

      <div className="hero-container">

        {/* Left Content */}

        <div className="hero-content">

          <p className="hero-small-text">
            NEW SEASON COLLECTION
          </p>

          <h1>
            Live Beautifully.
            <br />
            Shop Effortlessly.
          </h1>

          <p className="hero-description">
            Curated styles, quality you love,
            delivered to your door.
          </p>

          <button
            className="hero-button"
            onClick={() => navigate("/products")}
          >
            Shop Now →
          </button>

        </div>


        {/* Right Image */}

        <div className="hero-image">

          <img
            src={HeroImage}
            alt="ShopSphere fashion collection"
          />

        </div>

      </div>


      {/* =========================
          BENEFITS
      ========================= */}

      <div className="hero-benefits">

        <div className="benefit">

          <span className="benefit-icon">
            🚚
          </span>

          <div>

            <strong>
              Free Shipping
            </strong>

            <p>
              On orders above ₹999
            </p>

          </div>

        </div>


        <div className="benefit">

          <span className="benefit-icon">
            🔒
          </span>

          <div>

            <strong>
              Secure Payment
            </strong>

            <p>
              100% secure checkout
            </p>

          </div>

        </div>


        <div className="benefit">

          <span className="benefit-icon">
            ↩
          </span>

          <div>

            <strong>
              Easy Returns
            </strong>

            <p>
              Hassle-free returns
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;