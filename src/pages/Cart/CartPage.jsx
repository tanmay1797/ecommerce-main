import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import CheckoutModal from "../../components/CheckoutModal";

export default function CartPage() {
  const { cartProducts, setCartProducts, fetchCart, cartCount, clearCart } =
    useCart();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await axiosInstance.delete(`/user/cart/product/${productId}`);
      await fetchCart(); // update context
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Error removing item.");
    }
  };

  const handleChangeQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      await handleRemoveItem(item.productId._id);
      return;
    }

    try {
      await axiosInstance.delete(`/user/cart/product/${item.productId._id}`);
      await axiosInstance.post(`/user/cart/add`, {
        productId: item.productId._id,
        quantity: newQty,
      });
      await fetchCart(); // update context
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleCheckout = () => {
    setShowModal(true); // ✅ Show modal instead of navigating
  };

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className=" container-fluid text-center mt-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          width="100"
          height="100"
          className="mb-4"
        />
        <h3 className="mb-2">Your cart is empty</h3>
        <p className="text-muted mb-3">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/" className="btn btn-outline-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Shopping Cart</h2>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...cartProducts]
              .sort((a, b) => a.productId.name.localeCompare(b.productId.name))
              .map((item) => (
                <tr key={item.productId._id}>
                  <td>
                    <Link to={`/product/${item.productId._id}`}>
                      <img
                        src={item.productId.imageUrl.replace(
                          "localhost",
                          "192.168.1.182"
                        )}
                        alt={item.productId.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          cursor: "pointer",
                        }}
                      />
                    </Link>
                  </td>

                  <td>{item.productId.name}</td>
                  <td>{item.productId.price.toFixed(2)}</td>
                  <td className="d-flex gap-2 align-items-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleChangeQuantity(item, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleChangeQuantity(item, 1)}
                    >
                      +
                    </button>
                  </td>
                  <td>{item.totalPrice.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      <i
                        className="bi bi-trash-fill text-white"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h5>
          <strong>
            Total: ₹
            {cartProducts
              .reduce((acc, item) => acc + item.totalPrice, 0)
              .toFixed(2)}
          </strong>
        </h5>
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
      <CheckoutModal
        show={showModal}
        cartItems={cartProducts}
        handleClose={() => setShowModal(false)}
        clearCart={clearCart}
      />
    </div>
  );
}
