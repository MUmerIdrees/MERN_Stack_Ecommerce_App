import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useAddressStore = create((set) => ({
    isAddingAddress: false,
    isEditingAddress: false,
    addressList: [],

    addNewAddress: async ({formData, userId}) => {
        set({ isAddingAddress: true });
        try {
            const res = await axiosInstance.post('/shop/address/add', {formData, userId});
            toast.success("Address add successfully");

        } catch (error) {
            console.log("Error in add new address", error);
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isAddingAddress: false });
        }
    },

    fetchAllAddresses: async (userId) => {
        try {
            const res = await axiosInstance.get(`/shop/address/get/${userId}`);
            set({ addressList: res?.data?.data });

        } catch (error) {
            console.log("Error in add new address", error);
            toast.error(error?.response?.data?.message);
        }
    },

    editAddress: async ({userId, addressId, formData}) => {
        set({ iseEditingAddress: true });
        try {
            const res = await axiosInstance.put(`/shop/address/update/${userId}/${addressId}`, formData);
            toast.success("Address update successfully");

        } catch (error) {
            console.log("Error in add new address", error);
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isEditingAddress: false });
        }
    },

    deleteAddress: async ({ userId, addressId }) => {
        try {
            const res = await axiosInstance.delete(`/shop/address/delete/${userId}/${addressId}`);
            toast.success("Address deleted successfully");

        } catch (error) {
            console.log("Error in add new address", error);
            toast.error(error?.response?.data?.message);
        }
    },
}));