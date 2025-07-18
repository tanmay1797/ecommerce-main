import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import FullPageSpinner from "../../components/FullPageSpinner";

const ProductDetail = ({ loggedInUser }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/product/get/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found.");
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      try {
        const res = await axiosInstance.get(`/user/cart`);
        const cartItem = res.data.products.find(
          (item) => item.productId._id === productId
        );
        if (cartItem) {
          setQuantity(Number(cartItem.quantity));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartQuantity();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/user/cart/add", {
        productId,
        quantity: 1,
      });
      setQuantity(1);
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <div className="container py-5">
        <h3 className="text-danger">{error}</h3>
      </div>
    );

  if (!product) return <FullPageSpinner />;

  const originalPrice = product.price + 3000;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-5">
          <div className="border p-3 bg-white shadow-sm rounded">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid w-100"
              style={{ height: "450px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-7 mt-md-5">
          <div className="bg-light p-4 rounded shadow-sm">
            <h1 className="fw-bold text-center border-bottom pb-2">
              {product.name}
            </h1>

            <p className="text-center mb-2">
              <strong className="text-muted">Category:</strong>{" "}
              {product.category?.name || "Uncategorized"}
            </p>

            <p className="text-center mb-2">
              <strong className="text-muted">Price:</strong> ₹{product.price}
            </p>

            <p className="text-center mb-2">
              <del className="text-muted">₹{originalPrice}</del>{" "}
              <span className="text-danger fw-bold">50% off</span>
            </p>

            <p className="text-center mb-4">
              <strong className="text-muted">Description:</strong>{" "}
              {product.description || "No description available."}
            </p>

            {loggedInUser ? (
              <div className="text-center">
                {quantity === 0 ? (
                  <button
                    className="btn btn-warning fw-bold w-100 py-3 fs-5"
                    style={{ maxWidth: "400px" }}
                    onClick={handleAddToCart}
                    disabled={loading}
                  >
                    🛒 ADD TO CART
                  </button>
                ) : (
                  <button
                    className="btn btn-success fw-bold w-100 py-3 fs-5"
                    style={{ maxWidth: "400px" }}
                    onClick={() => navigate("/cart")}
                  >
                    ✅ GO TO CART
                  </button>
                )}
              </div>
            ) : (
              <p className="text-muted text-center mt-3">
                <i>Please login to add this product to your cart.</i>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
