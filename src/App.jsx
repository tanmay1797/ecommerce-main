import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import LoginPromptModal from "./components/LoginPromptModal";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductsPage from "./pages/products/ProductsPage";
import CartPage from "./pages/Cart/CartPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProductDetail from "./pages/products/ProductDetail";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Checkout from "./pages/Cart/Checkout";
import MyOrders from "./pages/products/MyOrders";
import ForgotPassword from "./pages/Auth/ForgotPassword";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setLoggedInUser(decodedUser);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoadingUser(false);
  }, []);

  if (loadingUser) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <Router>
        {
          <Navbar
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
            setSearchTerm={setSearchTerm}
            showLoginModal={showLoginModal}
            cartProducts={cartProducts}
          />
        }

        <div className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={
                <ProductsPage
                  products={products}
                  setProducts={setProducts}
                  searchTerm={searchTerm}
                  loggedInUser={loggedInUser}
                  setLoggedInUser={setLoggedInUser}
                  setShowLoginModal={setShowLoginModal}
                />
              }
            />
            <Route
              path="/login"
              element={<Login setLoggedInUser={setLoggedInUser} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  loggedInUser={loggedInUser}
                  setLoggedInUser={setLoggedInUser}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <PrivateRoute loggedInUser={loggedInUser}>
                  <CartPage
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                    cartProducts={cartProducts}
                    setCartProducts={setCartProducts}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute loggedInUser={loggedInUser}>
                  <MyOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/product/:productId"
              element={<ProductDetail loggedInUser={loggedInUser} />}
            />
          </Routes>

          <LoginPromptModal
            show={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }}
          />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </div>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
