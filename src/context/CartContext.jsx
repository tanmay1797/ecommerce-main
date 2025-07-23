import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/cart");
      setCartProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching cart in context:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Only clears cart from frontend (React state)
  const clearCart = () => {
    setCartProducts([]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        cartCount: cartProducts.reduce((acc, item) => acc + item.quantity, 0),
        fetchCart,
        loading,
        clearCart, // ✅ Exposed for use in logout or order confirmation
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
