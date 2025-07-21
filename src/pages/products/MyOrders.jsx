import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/order/get");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.products.some((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="input-group mb-4 pt-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search your orders here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary">Search Order</button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="alert alert-warning text-center">No orders found.</div>
      ) : (
        filteredOrders.map((order) =>
          order.products.map((product, idx) => (
            <div
              key={`${order._id}-${idx}`}
              className="card mb-3 shadow-sm border-0"
            >
              <div className="card-body d-flex justify-content-between align-items-start">
                {/* Left: Image */}
                <img
                  src={product.image || "https://via.placeholder.com/80"}
                  alt={product.name}
                  className="me-3"
                  style={{
                    width: "80px",
                    height: "100px",
                    objectFit: "contain",
                    borderRadius: "4px",
                  }}
                />

                {/* Middle: Info */}
                <div className="flex-grow-1">
                  <h6
                    className="mb-1 text-truncate"
                    style={{ maxWidth: "300px" }}
                  >
                    {product.name}
                  </h6>
                  <div className="fw-bold mt-2">
                    <h5>₹{product.price}</h5>{" "}
                  </div>
                </div>

                {/* Right: Delivery status */}
                <div className="text-end" style={{ minWidth: "180px" }}>
                  <div className="text-success fw-semibold mb-1">
                    <span className="me-1 text-success">●</span> Ordered on{" "}
                    {new Date(order.orderedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <div className="text-muted small mb-2">
                    Payment Method:{" "}
                    <span className="text-info">
                      <strong>{order.paymentMethod}</strong>
                    </span>
                  </div>
                  <div className="small mb-2">
                    Status :{" "}
                    <strong
                      className={
                        order.status === "cancelled"
                          ? "text-danger"
                          : order.status === "delivered"
                          ? "text-success"
                          : "text-warning"
                      }
                      style={{ textTransform: "capitalize" }}
                    >
                      {order.status}
                    </strong>
                  </div>

                  <button className="btn btn-link p-0 text-primary small fw-bold">
                    ★ Rate & Review Product
                  </button>
                </div>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default MyOrders;
