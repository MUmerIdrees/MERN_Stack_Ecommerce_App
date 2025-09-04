import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useReviewStore = create((set) => ({
    isAddingReview: false,
    reviews: [],

    addProductReview: async (formData) => {
        set({ isAddingReview: true });
        try {
            const res = await axiosInstance.post("/shop/review/add", formData);
            toast.success("Product review added successfully");
        } catch (error) {
            console.log("Error adding product review", error);
        } finally {
            set({ isAddingReview: false });
        }
    },

    getProductReviews: async(id) => {
        try {
            const res = await axiosInstance.get(`/shop/review/${id}`);
            console.log("Reviews: ", res?.data?.data);
            set({ reviews: res?.data?.data });
        } catch (error) {
            console.log("Error fetching product reviews", error);
        }
    },

    clearReviews: () => {
        set({ reviews: [] });
    }

}));