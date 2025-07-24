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

  const [newAddressForm, setNewAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [isAdding, setIsAdding] = useState(false);

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

  const handleNewAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        addresses: [newAddressForm],
      };
      await axiosInstance.post("/user/createAddress", payload);
      toast.success("New address added");
      setNewAddressForm({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });
      setIsAdding(false);
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manage Addresses</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
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
                      {["street", "city", "state", "postalCode", "country"].map(
                        (field) => (
                          <input
                            key={field}
                            type="text"
                            className="form-control mb-2"
                            placeholder={
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            value={formData[field]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field]: e.target.value,
                              })
                            }
                            required
                          />
                        )
                      )}
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

            <div className="text-center mb-3">
              <strong>Or</strong>
            </div>

            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-success"
                onClick={() => setIsAdding(!isAdding)}
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

            {isAdding && (
              <form className="mt-4" onSubmit={handleNewAddressSubmit}>
                {["street", "city", "state", "postalCode", "country"].map(
                  (field) => (
                    <div className="mb-2" key={field}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={newAddressForm[field]}
                        onChange={(e) =>
                          setNewAddressForm({
                            ...newAddressForm,
                            [field]: e.target.value,
                          })
                        }
                        name={field}
                        required
                      />
                    </div>
                  )
                )}
                <div className="d-flex justify-content-between mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
