import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// import FullPageSpinner from "../../components/FullPageSpinner";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    // setLoading(true);
    try {
      const res = await axiosInstance.get("/user/cart");
      setCart(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart.");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await axiosInstance.delete(`/user/cart/product/${productId}`);
      fetchCart();
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
      // setLoading(true);

      // Remove previous item entry
      await axiosInstance.delete(`/user/cart/product/${item.productId._id}`);

      // Re-add with new quantity
      await axiosInstance.post(`/user/cart/add`, {
        productId: item.productId._id,
        quantity: newQty,
      });

      fetchCart();
      // toast.info(`Quantity ${delta > 0 ? "increased" : "decreased"} by 1`);
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      // setLoading(false);
    }
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  // if (loading) {
  //   return <FullPageSpinner />;
  // }

  if (!cart || cart.products?.length === 0) {
    return (
      <div className="container text-center mt-5">
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
            {[...cart.products]
              .sort((a, b) => a.productId.name.localeCompare(b.productId.name))
              .map((item) => (
                <tr key={item.productId._id}>
                  <td>
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
                      }}
                    />
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
          <strong>Total: ₹{cart.grandTotalPrice.toFixed(2)}</strong>
        </h5>
        <button className="btn btn-success" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
