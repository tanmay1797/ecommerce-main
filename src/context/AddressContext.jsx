// AddressContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get("/user/getAddress");
      const allAddresses = res.data?.addressList || [];
      setAddresses(res.data?.addressList || []);
      // Find and set default address
      const defaultAddr = allAddresses.find((addr) => addr.isDefault);
      setDefaultAddress(defaultAddr || null);
    } catch (error) {
      // console.error("Error fetching addresses:", error);
      // toast.error("Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (newAddress) => {
    try {
      await axiosInstance.post("/user/createAddress", {
        addresses: [newAddress],
      });
      toast.success("Address added!");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to add address.");
    }
  };

  const updateAddress = async (updatedAddress) => {
    try {
      await axiosInstance.put("/user/updateAddress", updatedAddress);
      toast.success("Address updated!");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to update address.");
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/user/deleteAddress/${addressId}`);
      toast.success("Address deleted!");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to delete address.");
    }
  };

  const setDefaultAddressHandler = async (addressId) => {
    try {
      await axiosInstance.patch(`/user/setDefaultAddress/${addressId}`);
      toast.success("Default address set");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to set default address.");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddress,
        loading,
        fetchAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress: setDefaultAddressHandler,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
