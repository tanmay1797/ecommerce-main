import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

export default function Checkout() {
  const { cartProducts, fetchCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const totalAmount = cartProducts.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    const { street, city, state, postalCode, country } = address;
    if (!street || !city || !state || !postalCode || !country) {
      toast.error("Please fill in all address fields.");
      return;
    }

    try {
      await axiosInstance.post(
        "/order/create",
        {
          shippingAddress: address,
          paymentMethod: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      await fetchCart();
      navigate("/");
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      toast.error("Failed to place order");
    }
  };

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>Your cart is empty</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Checkout</h2>

      {/* Address Section */}
      <div className="card p-4 mb-4">
        <h5>Shipping Address</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Street"
              name="street"
              value={address.street}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="City"
              name="city"
              value={address.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="State"
              name="state"
              value={address.state}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Postal Code"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              name="country"
              value={address.country}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="card p-4 mb-4">
        <h5>Payment Method</h5>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="cod"
          />
          <label className="form-check-label" htmlFor="cod">
            Cash on Delivery (COD)
          </label>
        </div>
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="upi"
          />
          <label className="form-check-label" htmlFor="upi">
            UPI
          </label>
        </div>
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            value="NETBANKING"
            checked={paymentMethod === "NETBANKING"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="NETBANKING"
          />
          <label className="form-check-label" htmlFor="netbanking">
            Net Banking
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card p-4 mb-4">
        <h5>Order Summary</h5>
        <ul className="list-group mb-3">
          {cartProducts.map((item) => (
            <li
              key={item.productId._id}
              className="list-group-item d-flex justify-content-between"
            >
              <span>
                {item.productId.name} × {item.quantity}
              </span>
              <strong>₹{item.totalPrice.toFixed(2)}</strong>
            </li>
          ))}
        </ul>
        <h5 className="text-end">Total: ₹{totalAmount.toFixed(2)}</h5>
      </div>

      <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}
