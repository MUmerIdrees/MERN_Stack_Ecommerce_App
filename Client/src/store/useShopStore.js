import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useShopStore = create((set) => ({
    productsList: [],
    productDetails: null,
    searchResults: [],
    isSearching: false,

    fetchFilteredProducts: async ({filterParams, sortParams}) => {
        const queryObj = {};
        if(sortParams) {
            queryObj.sortBy = sortParams;
        }
        for(const [key, value] of Object.entries(filterParams || {})){
            if(Array.isArray(value) && value.length > 0){
                queryObj[key] = value.join(',');
            }
        }
        const query = new URLSearchParams(queryObj);
        try {
            const res = await axiosInstance.get(`/shop/products/get?${query}`);
            set({ productsList: res?.data?.data || [] });
        } catch (error) {
            console.log("Error fetching products", error);
        }
    },

    fetchProductDetails: async (id) => {
        try {
            const res = await axiosInstance.get(`/shop/products/get/${id}`);
            set({ productDetails: res?.data?.data });
        } catch (error) {
            console.log("Error fetching product", error);
        }
    },

    getSearchResults: async (keyword) => {
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/shop/search/${keyword}`);
            set({ searchResults: res?.data?.data });
            
        } catch (error) {
            console.log("Error searching product", error);
        } finally {
            set({ isSearching: false });
        }
    },

    resetSearchResults: () => {
        set({ searchResults: []});
    }
}));