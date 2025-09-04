import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useOrderStore = create((set) => ({
    approvalURL: null,
    isCreatingOrder: false,
    orderId: null,
    isPaymentStart: false,
    orderList: [],
    orderDetails: null,

    createNewOrder: async (orderData) => {
        set({ isCreatingOrder: true });
        try {
            const res = await axiosInstance.post('/shop/order/create', orderData);
            console.log(res?.data?.url, res?.data?.orderId);
            set({ approvalURL: res?.data?.url, orderId: res?.data?.orderId, isPaymentStart: true });
            sessionStorage.setItem('currentOrderId', JSON.stringify(res?.data?.orderId));
            toast.success("Order created successfully");
            
        } catch (error) {
            console.log("Error in create new order", error);
            set({ isPaymentStart: false });
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isCreatingOrder: false });
        }
    },

    capturePayment: async ({paymentId, orderId}) => {
        try {
            const res = await axiosInstance.post('/shop/order/capture', {paymentId, orderId});

        } catch (error) {
            console.log("Error in capture payment", error);
            toast.error(error?.response?.data?.message);
        }
    },

    getAllOrdersByUserId: async (userId) => {
        try {
            const res = await axiosInstance.get(`/shop/order/list/${userId}`);
            set({ orderList: res?.data?.data });

        } catch (error) {
            console.log("Error in get all orders by user id", error);
            toast.error(error?.response?.data?.message);
        }
    },

    getOrderDetails: async (id) => {
        try {
            const res = await axiosInstance.get(`/shop/order/details/${id}`);
            set({ orderDetails: res?.data?.data });

        } catch (error) {
            console.log("Error in get order details", error);
            toast.error(error?.response?.data?.message);
        }
    },
}));