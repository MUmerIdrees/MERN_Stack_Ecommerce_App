import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useFeatureStore = create((set) => ({
    isAddingFeatureImage: false,
    featureImagesList: [],

    addFeatureImage: async (image) => {
        set({ isAddingFeatureImage: true });
        try {
            const res = await axiosInstance.post("/common/feature/add", {image});
            toast.success("Feature image added successfully");

        } catch (error) {
            console.log("Error adding feature image", error);
        } finally {
            set({ isAddingFeatureImage: false });
        }
    },

    getFeatureImages: async () => {
        try {
            const res = await axiosInstance.get("/common/feature/get");
            set({ featureImagesList: res?.data?.data });

        } catch (error) {
            console.log("Error fetching feature images", error);
        }
    }
}));