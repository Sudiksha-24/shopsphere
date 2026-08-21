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
import ProductDetails from "./pages/product/ProductDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminUsers from "./pages/admin/users/AdminUsers";
import Wishlist from "./pages/wishlist/Wishlist";


function App() {

  return (

    <BrowserRouter>

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />


      {/* =========================
          ROUTES
      ========================= */}

      <Routes>


        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* AUTH */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* CART */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* CHECKOUT */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ORDERS */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* ORDER DETAILS */}

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />


        {/* PROFILE */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ADDRESS */}

        <Route
          path="/address"
          element={<Address />}

        />

        <Route
        path="/admin"
        element={<AdminDashboard />}
/>


        {/* PRODUCT DETAILS */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
        path="/admin/products"
        element={<AdminProducts />}
        />

        <Route
        path="/admin/products/add"
        element={<AddProduct />}
        />

        <Route
        path="/admin/products/edit/:id"
        element={<EditProduct />}
        />

        <Route
           path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/users"
             element={<AdminUsers />}
            />

            <Route
             path="/wishlist"
            element={<Wishlist />}
            />

      </Routes>

    </BrowserRouter>
  );
}


export default App;