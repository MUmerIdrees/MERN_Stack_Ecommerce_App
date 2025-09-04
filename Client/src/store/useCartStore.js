import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
    cartItems: [],
    cart: null,

    addToCart: async ({ userId, productId, quantity }) => {
        try {
            const res = await axiosInstance.post('/shop/cart/add', {userId, productId, quantity});
            toast.success("Product add in to cart successfully");

        } catch (error) {
            console.log("Error in add products to cart", error);
            toast.error(error?.response?.data?.message);
        }
    },

    fetchCartItems: async (userId) => {
        try {
            const res = await axiosInstance.get(`/shop/cart/get/${userId}`);
            set({ cartItems: res?.data?.items || [], cart: res?.data });

        } catch (error) {
            console.log("Error in fetching cart items", error);
        }
    },

    updateCartItemQuantity: async ({ userId, productId, quantity }) => {
        try {
            const res = await axiosInstance.put('/shop/cart/update-cart', {userId, productId, quantity});
            set({ cartItems: res?.data?.items });
            toast.success("Update cart item quantity successfully");

        } catch (error) {
            console.log("Error in updating cart item quantity", error);
            toast.error(error?.response?.data?.message);
        }
    },

    deleteCartItem: async ({ userId, productId }) => {
        try {
            const res = await axiosInstance.delete(`/shop/cart/${userId}/${productId}`);
            set({ cartItems: res?.data?.items });
            toast.success("Product deleted from cart successfully");

        } catch (error) {
            console.log("Erro in deleting item from cart", error);
            toast.error(error?.response?.data?.message);
        }
    }

}));