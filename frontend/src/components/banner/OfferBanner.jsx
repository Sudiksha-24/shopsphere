import "./OfferBanner.css";

function OfferBanner() {
  return (
    <section className="offer-section">

      <div className="offer-container">

        <div className="offer-content">

          <p className="offer-small-text">
            LIMITED TIME OFFER
          </p>

          <h2>
            Get Up to <span>30% Off</span>
          </h2>

          <p className="offer-description">
            Discover selected styles at special prices.
            Don't miss out on your favorites.
          </p>

          <button className="offer-button">
            Shop Sale →
          </button>

        </div>

        <div className="offer-decoration">
          <span>30%</span>
          <small>OFF</small>
        </div>

      </div>

    </section>
  );
}

export default OfferBanner;