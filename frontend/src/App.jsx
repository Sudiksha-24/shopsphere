import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";

import Home from "./pages/home/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";

import Orders from "./pages/order/Orders";
import OrderDetails from "./pages/order/OrderDetails";

import Profile from "./pages/profile/Profile";
import Address from "./pages/address/Address";

import Products from "./pages/product/Products";
import ProductDetails from "./pages/product/ProductDetails";

import Categories from "./pages/category/Categories";

import Wishlist from "./pages/wishlist/Wishlist";


/* =========================================
   ADMIN
========================================= */

import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminProducts from "./pages/admin/products/AdminProducts";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";

import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminUsers from "./pages/admin/users/AdminUsers";

import About from "./pages/about/About";


function App() {

  return (

    <BrowserRouter>

      {/* =================================
          NAVBAR
      ================================= */}

      <Navbar />


      {/* =================================
          ROUTES
      ================================= */}

      <Routes>


        {/* =================================
            HOME
        ================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================
            AUTH
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================
            PRODUCTS
        ================================= */}

        <Route
          path="/products"
          element={<Products />}
        />


        {/* PRODUCT DETAILS */}

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />


        {/* =================================
            CATEGORIES
        ================================= */}

        <Route
          path="/categories"
          element={<Categories />}
        />


        {/* =================================
            CART
        ================================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* =================================
            CHECKOUT
        ================================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* =================================
            ORDERS
        ================================= */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ORDER DETAILS */}

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />


        {/* =================================
            PROFILE
        ================================= */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* =================================
            ADDRESS
        ================================= */}

        <Route
          path="/address"
          element={<Address />}
        />


        {/* =================================
            WISHLIST
        ================================= */}

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />


        {/* =================================
            ADMIN DASHBOARD
        ================================= */}

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />


        {/* =================================
            ADMIN PRODUCTS
        ================================= */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />


        {/* ADD PRODUCT */}

        <Route
          path="/admin/products/add"
          element={<AddProduct />}
        />


        {/* EDIT PRODUCT */}

        <Route
          path="/admin/products/edit/:id"
          element={<EditProduct />}
        />


        {/* =================================
            ADMIN ORDERS
        ================================= */}

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />


        {/* =================================
            ADMIN USERS
        ================================= */}

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
  path="/about"
  element={<About />}
/>


      </Routes>

    </BrowserRouter>

  );

}


export default App;