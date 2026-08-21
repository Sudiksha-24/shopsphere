import "./Home.css";

import Hero from "../../components/hero/Hero";
import Category from "../../components/category/Category";
import FeaturedProducts from "../../components/product/FeaturedProducts";
import OfferBanner from "../../components/banner/OfferBanner";
import Newsletter from "../../components/newsletter/Newsletter";
import Footer from "../../components/footer/Footer";

function Home() {
  return (
    <main className="home">

      <Hero />

      <Category />

      <FeaturedProducts />

      <OfferBanner />

      <Newsletter />

      <Footer />

    </main>
  );
}

export default Home;