import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import ProductCard from "../../components/product/ProductCard";
import "./Products.css";


function Products() {

  // =========================================
  // URL SEARCH PARAMS
  // =========================================

  const [searchParams, setSearchParams] =
    useSearchParams();


  const categoryFromUrl =
    searchParams.get("category");


  // =========================================
  // STATE
  // =========================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState(
      categoryFromUrl || "ALL"
    );

  const [brand, setBrand] =
    useState("ALL");

  const [sort, setSort] =
    useState("DEFAULT");


  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);
        setError("");


        const response = await fetch(
          "http://localhost:8080/api/products"
        );


        if (!response.ok) {

          throw new Error(
            `Failed to fetch products (${response.status})`
          );

        }


        const responseText =
          await response.text();


        if (
          !responseText ||
          !responseText.trim()
        ) {

          setProducts([]);

          return;

        }


        const data =
          JSON.parse(responseText);


        const validProducts =
          Array.isArray(data)
            ? data.filter(
                (product) =>
                  product.title &&
                  Number(product.price) >= 0 &&
                  product.imageUrl
              )
            : [];


        setProducts(
          validProducts
        );


      } catch (error) {

        console.error(
          "Products fetch error:",
          error
        );


        setError(
          error.message ||
          "Unable to load products."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchProducts();

  }, []);


  // =========================================
  // UPDATE CATEGORY FROM URL
  // =========================================

  useEffect(() => {

    if (categoryFromUrl) {

      setCategory(
        categoryFromUrl
      );

    } else {

      setCategory("ALL");

    }

  }, [categoryFromUrl]);


  // =========================================
  // CATEGORIES
  // =========================================

  const categories = useMemo(() => {

    const uniqueCategories =
      products
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean);


    return [
      "ALL",
      ...new Set(
        uniqueCategories
      ),
    ];

  }, [products]);


  // =========================================
  // BRANDS
  // =========================================

  const brands = useMemo(() => {

    const uniqueBrands =
      products
        .map(
          (product) =>
            product.brand
        )
        .filter(Boolean);


    return [
      "ALL",
      ...new Set(
        uniqueBrands
      ),
    ];

  }, [products]);


  // =========================================
  // CATEGORY CHANGE
  // =========================================

  const handleCategoryChange = (
    value
  ) => {

    setCategory(value);


    if (value === "ALL") {

      searchParams.delete(
        "category"
      );

    } else {

      searchParams.set(
        "category",
        value
      );

    }


    setSearchParams(
      searchParams
    );

  };


  // =========================================
  // FILTER + SEARCH + SORT
  // =========================================

  const filteredProducts =
    useMemo(() => {

      let result =
        [...products];


      // -------------------------------
      // SEARCH
      // -------------------------------

      if (search.trim()) {

        const searchText =
          search
            .toLowerCase()
            .trim();


        result =
          result.filter(
            (product) => {

              const title =
                product.title
                  ?.toLowerCase() ||
                "";

              const productBrand =
                product.brand
                  ?.toLowerCase() ||
                "";

              const productCategory =
                product.category
                  ?.toLowerCase() ||
                "";

              const description =
                product.description
                  ?.toLowerCase() ||
                "";


              return (
                title.includes(
                  searchText
                ) ||

                productBrand.includes(
                  searchText
                ) ||

                productCategory.includes(
                  searchText
                ) ||

                description.includes(
                  searchText
                )
              );

            }
          );

      }


      // -------------------------------
      // CATEGORY
      // -------------------------------

      if (
        category !== "ALL"
      ) {

        result =
          result.filter(
            (product) =>
              product.category
                ?.toLowerCase() ===
              category
                ?.toLowerCase()
          );

      }


      // -------------------------------
      // BRAND
      // -------------------------------

      if (
        brand !== "ALL"
      ) {

        result =
          result.filter(
            (product) =>
              product.brand ===
              brand
          );

      }


      // -------------------------------
      // SORT
      // -------------------------------

      if (
        sort === "PRICE_LOW"
      ) {

        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );

      }


      if (
        sort === "PRICE_HIGH"
      ) {

        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );

      }


      if (
        sort === "NAME_ASC"
      ) {

        result.sort(
          (a, b) =>
            (a.title || "")
              .localeCompare(
                b.title || ""
              )
        );

      }


      if (
        sort === "NAME_DESC"
      ) {

        result.sort(
          (a, b) =>
            (b.title || "")
              .localeCompare(
                a.title || ""
              )
        );

      }


      return result;

    }, [
      products,
      search,
      category,
      brand,
      sort,
    ]);


  // =========================================
  // CLEAR FILTERS
  // =========================================

  const clearFilters = () => {

    setSearch("");

    setBrand("ALL");

    setSort("DEFAULT");

    setCategory("ALL");


    searchParams.delete(
      "category"
    );


    setSearchParams(
      searchParams
    );

  };


  // =========================================
  // ERROR
  // =========================================

  if (
    !loading &&
    error
  ) {

    return (

      <section className="products-page">

        <div className="products-page-container">

          <div className="products-page-message">

            <h3>
              Unable to load products
            </h3>

            <p>
              {error}
            </p>

          </div>

        </div>

      </section>

    );

  }


  // =========================================
  // UI
  // =========================================

  return (

    <section className="products-page">

      <div className="products-page-container">


        {/* =================================
            HEADER
        ================================= */}

        <div className="products-page-header">

          <p>
            SHOPSPHERE
          </p>


          <h1>
            {category !== "ALL"
              ? category
              : "All Products"}
          </h1>


          <span>
            {category !== "ALL"
              ? `Explore our ${category.toLowerCase()} collection.`
              : "Discover products made for you."}
          </span>

        </div>


        {/* =================================
            FILTER BAR
        ================================= */}

        {!loading &&
          products.length > 0 && (

          <div className="products-filter-bar">


            {/* SEARCH */}

            <div className="products-search">

              <input
                type="text"

                placeholder="Search products, brands..."

                value={search}

                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            {/* CATEGORY */}

            <select
              value={category}

              onChange={(e) =>
                handleCategoryChange(
                  e.target.value
                )
              }
            >

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {item === "ALL"
                      ? "All Categories"
                      : item}

                  </option>

                )
              )}

            </select>


            {/* BRAND */}

            <select
              value={brand}

              onChange={(e) =>
                setBrand(
                  e.target.value
                )
              }
            >

              {brands.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >

                    {item === "ALL"
                      ? "All Brands"
                      : item}

                  </option>

                )
              )}

            </select>


            {/* SORT */}

            <select
              value={sort}

              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
            >

              <option value="DEFAULT">
                Sort By
              </option>

              <option value="PRICE_LOW">
                Price: Low to High
              </option>

              <option value="PRICE_HIGH">
                Price: High to Low
              </option>

              <option value="NAME_ASC">
                Name: A to Z
              </option>

              <option value="NAME_DESC">
                Name: Z to A
              </option>

            </select>


            {/* CLEAR */}

            {(
              search ||
              category !== "ALL" ||
              brand !== "ALL" ||
              sort !== "DEFAULT"
            ) && (

              <button
                className="clear-products-button"

                onClick={
                  clearFilters
                }
              >
                Clear
              </button>

            )}

          </div>

        )}


        {/* =================================
            RESULT COUNT
        ================================= */}

        {!loading &&
          products.length > 0 && (

          <div className="products-result">

            Showing{" "}

            <strong>
              {filteredProducts.length}
            </strong>{" "}

            of{" "}

            <strong>
              {products.length}
            </strong>{" "}

            products

          </div>

        )}


        {/* =================================
            LOADING
        ================================= */}

        {loading && (

          <div className="products-page-message">

            Loading products...

          </div>

        )}


        {/* =================================
            PRODUCT GRID
        ================================= */}

        {!loading &&
          filteredProducts.length > 0 && (

          <div className="products-page-grid">

            {filteredProducts.map(
              (product) => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              )
            )}

          </div>

        )}


        {/* =================================
            NO RESULTS
        ================================= */}

        {!loading &&
          products.length > 0 &&
          filteredProducts.length === 0 && (

          <div className="products-page-message">

            <h3>
              No products found
            </h3>


            <p>
              Try another search or filter.
            </p>


            <button
              className="clear-products-button"

              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>

        )}


        {/* =================================
            NO PRODUCTS
        ================================= */}

        {!loading &&
          products.length === 0 && (

          <div className="products-page-message">

            <h3>
              No products available.
            </h3>

            <p>
              Products will appear here
              once they are added.
            </p>

          </div>

        )}

      </div>

    </section>

  );

}

export default Products;