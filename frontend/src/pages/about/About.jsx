import { useNavigate } from "react-router-dom";
import "./About.css";
import AboutStoreImage from "../../assets/images/about-store-image.png";

function About() {

  const navigate = useNavigate();

  return (
    <main className="about-page">

      {/* =================================
          HERO
      ================================= */}

      <section className="about-hero">

        <div className="about-container">

          <p className="about-eyebrow">
            ABOUT SHOPSPHERE
          </p>

          <h1>
            Style.
            <br />
            Quality.
            <br />
            Simplicity.
          </h1>

          <p className="about-hero-description">
            A thoughtfully curated shopping experience
            designed to make discovering products
            simple, enjoyable and effortless.
          </p>

        </div>

       

      </section>
      


      {/* =================================
          OUR STORY
      ================================= */}
<section className="about-story">

  <div className="about-container about-two-column">

    <div className="about-section-label">

      <p>OUR STORY</p>

      <h2>
        Shopping should
        <br />
        feel simple.
      </h2>

    </div>


    <div className="about-story-content">

      {/* ABOUT IMAGE */}

      <div className="about-story-image">

        <img
          src={AboutStoreImage}
          alt="ShopSphere collection"
        />

      </div>


      {/* STORY TEXT */}

      <div className="about-story-text">

        <p>
          ShopSphere was created with one simple idea —
          bringing great products together in one
          convenient place.
        </p>

        <p>
          From everyday essentials to fashion and
          accessories, we carefully organize our
          collections so you can discover what you
          need without unnecessary complexity.
        </p>

        <p>
          We believe online shopping should be
          comfortable, reliable and enjoyable from
          the first click to the final delivery.
        </p>

      </div>

    </div>

  </div>

</section>


      {/* =================================
          WHY SHOPSPHERE
      ================================= */}

      <section className="about-values">

        <div className="about-container">

          <div className="about-heading">

            <p>
              WHY SHOPSPHERE
            </p>

            <h2>
              Made for better shopping.
            </h2>

            <span>
              Everything you need for a smooth
              shopping experience.
            </span>

          </div>


          <div className="about-values-grid">

            <div className="about-value-card">

              <span className="about-value-icon">
                ✦
              </span>

              <h3>
                Curated Collections
              </h3>

              <p>
                Discover thoughtfully selected products
                across fashion, footwear and accessories.
              </p>

            </div>


            <div className="about-value-card">

              <span className="about-value-icon">
                ♡
              </span>

              <h3>
                Quality First
              </h3>

              <p>
                We focus on products that combine
                style, practicality and everyday value.
              </p>

            </div>


            <div className="about-value-card">

              <span className="about-value-icon">
                🔒
              </span>

              <h3>
                Secure Shopping
              </h3>

              <p>
                Your shopping experience is designed
                with secure authentication and checkout.
              </p>

            </div>


            <div className="about-value-card">

              <span className="about-value-icon">
                🚚
              </span>

              <h3>
                Easy Experience
              </h3>

              <p>
                From browsing to delivery, we keep
                everything simple and convenient.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =================================
          WHAT WE OFFER
      ================================= */}

      <section className="about-offer">

        <div className="about-container">

          <div className="about-heading">

            <p>
              EXPLORE SHOPSPHERE
            </p>

            <h2>
              Something for every style.
            </h2>

          </div>


          <div className="about-offer-grid">

            <div
              className="about-offer-item"
              onClick={() =>
                navigate("/products?category=Men")
              }
            >
              <span>
                01
              </span>

              <h3>
                Men
              </h3>

              <p>
                Everyday fashion and modern essentials.
              </p>

              <strong>
                Explore →
              </strong>
            </div>


            <div
              className="about-offer-item"
              onClick={() =>
                navigate("/products?category=Women")
              }
            >
              <span>
                02
              </span>

              <h3>
                Women
              </h3>

              <p>
                Stylish collections for every occasion.
              </p>

              <strong>
                Explore →
              </strong>
            </div>


            <div
              className="about-offer-item"
              onClick={() =>
                navigate("/products?category=Shoes")
              }
            >
              <span>
                03
              </span>

              <h3>
                Shoes
              </h3>

              <p>
                Comfortable and stylish footwear.
              </p>

              <strong>
                Explore →
              </strong>
            </div>


            <div
              className="about-offer-item"
              onClick={() =>
                navigate("/products?category=Accessories")
              }
            >
              <span>
                04
              </span>

              <h3>
                Accessories
              </h3>

              <p>
                Complete your look with the right details.
              </p>

              <strong>
                Explore →
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* =================================
          CTA
      ================================= */}

      <section className="about-cta">

        <div className="about-container">

          <p>
            READY TO EXPLORE?
          </p>

          <h2>
            Find something you'll love.
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Shop All Products →
          </button>

        </div>

      </section>

    </main>
  );
}

export default About;