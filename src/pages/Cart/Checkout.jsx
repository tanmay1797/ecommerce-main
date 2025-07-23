// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { toast } from "react-toastify";

// export default function Checkout() {
//   const { cartProducts, fetchCart } = useCart();
//   const navigate = useNavigate();

//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [newAddress, setNewAddress] = useState("");
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("COD");

//   const totalAmount = cartProducts.reduce(
//     (acc, item) => acc + item.totalPrice,
//     0
//   );

//   useEffect(() => {
//     const fetchAddresses = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const res = await axiosInstance.get("/address/list", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSavedAddresses(res.data.addresses || []);
//       } catch (err) {
//         console.error("Error fetching addresses:", err);
//         toast.error("Failed to fetch addresses.");
//       }
//     };

//     fetchAddresses();
//   }, []);

//   const handlePlaceOrder = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("User not authenticated");
//       return;
//     }

//     let finalAddress = "";

//     if (useNewAddress) {
//       if (!newAddress.trim()) {
//         toast.error("Please enter a new address.");
//         return;
//       }
//       finalAddress = newAddress;
//     } else {
//       if (!selectedAddress) {
//         toast.error("Please select an existing address.");
//         return;
//       }
//       finalAddress = selectedAddress;
//     }

//     try {
//       await axiosInstance.post(
//         "/order/create",
//         {
//           shippingAddress: finalAddress,
//           paymentMethod,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       toast.success("Order placed successfully!");
//       await fetchCart();
//       navigate("/");
//     } catch (err) {
//       console.error("Checkout error:", err.response?.data || err.message);
//       toast.error("Failed to place order");
//     }
//   };

//   if (!cartProducts || cartProducts.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <h4>Your cart is empty</h4>
//       </div>
//     );
//   }

//   return (
//     <div className="container py-5">
//       <h2 className="mb-4">Checkout</h2>

//       {/* Address Selection */}
//       <div className="card p-4 mb-4">
//         <h5>Shipping Address</h5>
//         <div className="form-check mb-3">
//           <input
//             className="form-check-input"
//             type="radio"
//             name="addressOption"
//             id="existing"
//             checked={!useNewAddress}
//             onChange={() => setUseNewAddress(false)}
//           />
//           <label className="form-check-label" htmlFor="existing">
//             Choose from existing addresses
//           </label>
//         </div>

//         {!useNewAddress && savedAddresses.length > 0 && (
//           <div className="mb-3">
//             {savedAddresses.map((addr, idx) => (
//               <div className="form-check" key={idx}>
//                 <input
//                   className="form-check-input"
//                   type="radio"
//                   name="selectedAddress"
//                   value={addr}
//                   checked={selectedAddress === addr}
//                   onChange={(e) => setSelectedAddress(e.target.value)}
//                   id={`addr-${idx}`}
//                 />
//                 <label className="form-check-label" htmlFor={`addr-${idx}`}>
//                   {addr}
//                 </label>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="form-check mb-3">
//           <input
//             className="form-check-input"
//             type="radio"
//             name="addressOption"
//             id="new"
//             checked={useNewAddress}
//             onChange={() => setUseNewAddress(true)}
//           />
//           <label className="form-check-label" htmlFor="new">
//             Enter new address
//           </label>
//         </div>

//         {useNewAddress && (
//           <textarea
//             className="form-control"
//             placeholder="Enter new shipping address"
//             rows="4"
//             value={newAddress}
//             onChange={(e) => setNewAddress(e.target.value)}
//           />
//         )}
//       </div>

//       {/* Payment Method Section */}
//       <div className="card p-4 mb-4">
//         <h5>Payment Method</h5>
//         {["COD", "UPI", "NETBANKING"].map((method) => (
//           <div className="form-check mt-2" key={method}>
//             <input
//               className="form-check-input"
//               type="radio"
//               name="paymentMethod"
//               value={method}
//               checked={paymentMethod === method}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               id={method}
//             />
//             <label className="form-check-label" htmlFor={method}>
//               {method === "COD"
//                 ? "Cash on Delivery"
//                 : method === "UPI"
//                 ? "UPI"
//                 : "Net Banking"}
//             </label>
//           </div>
//         ))}
//       </div>

//       {/* Order Summary */}
//       <div className="card p-4 mb-4">
//         <h5>Order Summary</h5>
//         <ul className="list-group mb-3">
//           {cartProducts.map((item) => (
//             <li
//               key={item.productId._id}
//               className="list-group-item d-flex justify-content-between"
//             >
//               <span>
//                 {item.productId.name} × {item.quantity}
//               </span>
//               <strong>₹{item.totalPrice.toFixed(2)}</strong>
//             </li>
//           ))}
//         </ul>
//         <h5 className="text-end">Total: ₹{totalAmount.toFixed(2)}</h5>
//       </div>

//       <button className="btn btn-primary w-100" onClick={handlePlaceOrder}>
//         Place Order
//       </button>
//     </div>
//   );
// }
