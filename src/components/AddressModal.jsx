import React, { useState } from "react";
import { useAddress } from "../context/AddressContext";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const AddressModal = ({ show, handleClose }) => {
  const { addresses, fetchAddresses } = useAddress();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const startEditing = (address) => {
    setEditingId(address.addressId);
    setFormData({
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put("/user/updateAddress", {
        ...formData,
        addressId: editingId,
      });
      toast.success("Address updated");
      cancelEditing();
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/user/deleteAddress/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await axiosInstance.patch(`/user/setDefaultAddress/${id}`);
      toast.success("Default address set");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to set default");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manage Addresses</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div className="modal-body">
            {addresses.length === 0 ? (
              <p>No addresses found.</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.addressId}
                  className={`border rounded p-3 mb-3 ${
                    addr.isDefault ? "border-primary" : ""
                  }`}
                >
                  {editingId === addr.addressId ? (
                    <form onSubmit={handleEditSubmit}>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Street"
                        value={formData.street}
                        onChange={(e) =>
                          setFormData({ ...formData, street: e.target.value })
                        }
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Postal Code"
                        value={formData.postalCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Country"
                        value={formData.country}
                        onChange={(e) =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                        required
                      />

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>
                        <strong>{addr.fullAddress}</strong>{" "}
                        {addr.isDefault && (
                          <span className="badge bg-primary ms-2">Default</span>
                        )}
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(addr.addressId)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => startEditing(addr)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleSetDefault(addr.addressId)}
                          disabled={addr.isDefault}
                        >
                          Set Default
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
