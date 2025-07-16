import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import LoginPromptModal from "./components/LoginPromptModal"; // ✅ Import modal

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProductsPage from "./pages/products/ProductsPage";
import CartPage from "./pages/Cart/CartPage";
import ProfilePage from "./pages/profile/ProfilePage";
import ProductDetail from "./pages/products/ProductDetail";

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
    <Router>
      <Navbar
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        setSearchTerm={setSearchTerm}
        showLoginModal={showLoginModal}
      />
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
          path="/product/:productId"
          element={<ProductDetail loggedInUser={loggedInUser} />}
        />
      </Routes>
      {/* ✅ RENDER THE MODAL HERE */}
      <LoginPromptModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={(user) => {
          setLoggedInUser(user);
          setShowLoginModal(false);
        }}
      />
    </Router>
  );
}

export default App;
