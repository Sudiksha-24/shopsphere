import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter-section">

      <div className="newsletter-container">

        <div className="newsletter-content">

          <p className="newsletter-small-text">
            STAY IN THE LOOP
          </p>

          <h2>
            Get the latest from ShopSphere
          </h2>

          <p>
            Subscribe to receive new arrivals, special offers
            and exclusive updates.
          </p>

        </div>


        <form className="newsletter-form">

          <input
            type="email"
            placeholder="Enter your email address"
          />

          <button type="submit">
            Subscribe
          </button>

        </form>

      </div>

    </section>
  );
}

export default Newsletter;