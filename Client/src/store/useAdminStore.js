import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useAdminStore = create((set) => ({
    isImageLoading: false,
    isAddingProduct: false,
    isEditingProduct: false,
    productsList: [],
    orderList: [],
    orderDetails: null,
    dashboardData: null,

    uploadImage: async (data) => {
        set({ isImageLoading: true });
        try {
            const res = await axiosInstance.post('/admin/products/upload-image', data);
            let imageUrl = null;
            if(res?.data) {
                imageUrl = res?.data?.result?.url;
            }
            return imageUrl;

        } catch (error) {
            console.log("Error uploading image", error);
            set({ uploadedImageUrl: null });
        } finally {
            set({ isImageLoading: false });
        }
    },

    addProduct: async (data) => {
        set({ isAddingProduct: true });
        try {
            const res = await axiosInstance.post("/admin/products/add", data);
            toast.success("Product add successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isAddingProduct: false });
        }
    },

    fetchProducts: async() => {
        try {
            const res = await axiosInstance.get("/admin/products/get");
            set({ productsList: res?.data?.data || [] });
        } catch (error) {
            console.log("Error fetching products", error);
        }
    },

    editProduct: async (id, data) => {
        set({ isEditingProduct: true });
        try {
            const res = await axiosInstance.put(`/admin/products/edit/${id}`, data);
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isEditingProduct: false });
        }
    },

    deleteProduct: async (id) => {
        try {
            const res = await axiosInstance.delete(`/admin/products/delete/${id}`);
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },
    
    getAllOrdersForAdmin: async () => {
        try {
            const res = await axiosInstance.get('/admin/orders/get');
            set({ orderList: res?.data?.data });

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },

    getOrderDetailsForAdmin: async (id) => {
        try {
            const res = await axiosInstance.get(`/admin/orders/details/${id}`);
            set({ orderDetails: res?.data?.data });

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },

    updateOrderStatus: async ({id, orderStatus}) => {
        try {
            const res = await axiosInstance.put(`/admin/orders/update/${id}`, {orderStatus});
            toast.success("Order status updated successfully");

        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },

    fetchDashboardData: async () => {
        try {
            const res = await axiosInstance.get('/admin/dashboard/get');
            set({ dashboardData: res?.data });
            
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
}));