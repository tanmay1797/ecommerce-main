import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginPromptModal from "./LoginPromptModal";

const ProductCard = ({
  product,
  loggedInUser,
  setLoggedInUser,
  setShowLoginModal,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loggedInUser || !token) return;

    axios
      .get("http://192.168.1.182:8000/api/user/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const item = res.data.products.find(
          (p) => p.productId._id === product._id
        );
        if (item) setQuantity(Number(item.quantity));
      })
      .catch((err) => console.error("Fetch quantity error", err));
  }, [product._id, loggedInUser, token]);

  const handleAddToCart = async () => {
    if (!loggedInUser) {
      setShowLoginModal(true); // ✅ trigger global modal
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://192.168.1.182:8000/api/user/cart/add",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuantity(1);
      const toastEl = document.getElementById("cartToast");
      const toast = new window.bootstrap.Toast(toastEl);
      toast.show();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
        <div
          className={`card card-body h-100 shadow ${
            loading ? "opacity-50" : ""
          }`}
        >
          <img
            src={product?.imageUrl}
            className="card-img-top"
            alt={product?.name}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${product._id}`)}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">{product?.name}</h5>
            <p className="card-text">₹{product?.price}</p>

            {quantity === 0 ? (
              <button
                className="btn btn-primary mt-auto"
                onClick={handleAddToCart}
                disabled={loading}
              >
                Add to Cart
              </button>
            ) : (
              <button
                className="btn btn-success mt-auto"
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
