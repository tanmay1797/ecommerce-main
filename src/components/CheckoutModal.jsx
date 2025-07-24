import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../context/AddressContext";

const CheckoutModal = ({ show, cartItems, handleClose, clearCart }) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const { addresses, fetchAddresses, defaultAddress } = useAddress();

  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const grandTotalPrice = cartItems.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );

  useEffect(() => {
    if (show && step === 1 && defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [show, step, defaultAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        addresses: [
          {
            street: newAddress.address,
            city: newAddress.city,
            state: newAddress.state,
            postalCode: newAddress.postalCode,
            country: newAddress.country,
          },
        ],
      };

      await axiosInstance.post("/user/createAddress", payload);
      await fetchAddresses();

      toast.success("Address added successfully!");

      setNewAddress({
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });

      setStep(1);
      setSelectedAddress(null);
    } catch (error) {
      console.error("Failed to add new address", error);

      // Check if backend returned a custom message
      const backendMessage = error?.response?.data?.message;

      toast.error(
        backendMessage || "Failed to save address. Please try again."
      );
    }
  };

  const handleOrderPlace = async () => {
    if (!selectedAddress?.addressId) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      await axiosInstance.post("/order/create", {
        addressId: selectedAddress.addressId,
        paymentMethod,
      });

      toast.success("Order placed successfully!");

      if (typeof clearCart === "function") {
        clearCart();
      }

      handleClose();
      setStep(1);
      navigate("/my-orders");
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {step === 1
                ? "Select Address"
                : step === 2
                ? "Add New Address"
                : "Order Summary"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                handleClose();
                setStep(1);
                setNewAddress({
                  address: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "India",
                });
                setSelectedAddress(null);
              }}
            ></button>
          </div>

          <div className="modal-body">
            {/* Step 1: Select Address */}
            {step === 1 && (
              <>
                <label htmlFor="addressSelect" className="form-label">
                  Choose a saved address:
                </label>
                <select
                  className="form-select"
                  value={selectedAddress?.addressId || ""}
                  onChange={(e) =>
                    setSelectedAddress(
                      addresses.find((a) => a.addressId == e.target.value)
                    )
                  }
                >
                  <option value="" disabled>
                    Select an address
                  </option>
                  {addresses.map((address) => (
                    <option key={address.addressId} value={address.addressId}>
                      {address.fullAddress}
                    </option>
                  ))}
                </select>

                <div className="text-center mt-2">Or</div>

                <div className="mt-3 d-flex justify-content-center">
                  <button
                    className="btn btn-info"
                    onClick={() => {
                      setStep(2);
                      setSelectedAddress(null);
                    }}
                    disabled={addresses.length >= 10}
                  >
                    Add New Address
                  </button>
                </div>

                {addresses.length >= 10 && (
                  <div className="text-danger text-center mt-2">
                    You’ve reached the maximum of 10 saved addresses.
                  </div>
                )}

                <div className="mt-4 d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      if (!selectedAddress) {
                        toast.error("Please select an address");
                        return;
                      }
                      setStep(3);
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Add New Address */}
            {step === 2 && (
              <form onSubmit={handleAddNewAddress}>
                <div className="mb-3">
                  <label className="form-label">Street and Locality</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="address"
                    value={newAddress.address}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={newAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={newAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={newAddress.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setStep(1);
                      setNewAddress({
                        address: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        country: "India",
                      });
                    }}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Product Summary */}
            {step === 3 && (
              <>
                {/* Order Summary */}
                <div className="mt-4">
                  <h5>Items in Cart</h5>
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <div>
                        {item.productId.name} <strong>X {item.quantity}</strong>
                      </div>
                      <div>
                        <h6>₹{item.totalPrice}</h6>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  <h5>Total Price:</h5> <h5>{grandTotalPrice}</h5>
                </div>
                {/* Selected Address Summary */}
                <div className="mt-4">
                  <h5>Delivery Address</h5>
                  <p>{selectedAddress?.fullAddress || "No address selected"}</p>
                </div>

                {/* Payment Method */}
                <div className="mt-4">
                  <h5>Payment Method</h5>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="payment-upi"
                    />
                    <label className="form-check-label" htmlFor="payment-upi">
                      UPI
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="payment-card"
                    />
                    <label className="form-check-label" htmlFor="payment-card">
                      Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="payment-cod"
                    />
                    <label className="form-check-label" htmlFor="payment-cod">
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      value="NETBANKING"
                      checked={paymentMethod === "NETBANKING"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      id="payment-netbanking"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="payment-netbanking"
                    >
                      Net Banking
                    </label>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 d-flex justify-content-between">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleOrderPlace}
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
