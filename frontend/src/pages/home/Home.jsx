import "./Home.css";

import Hero from "../../components/hero/Hero";
import OfferBanner from "../../components/banner/OfferBanner";
import Newsletter from "../../components/newsletter/Newsletter";
import Footer from "../../components/footer/Footer";
import FeaturedProducts from "../../components/product/FeaturedProducts";

function Home() {
  return (
    <main className="home">

      <Hero />

      <FeaturedProducts />

      <OfferBanner />

      <Newsletter />

      <Footer />

    </main>
  );
}

export default Home;