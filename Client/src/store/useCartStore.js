import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useCartStore = create((set, get) => ({
    cartItems: JSON.parse(localStorage.getItem("guest_cart")) || [],
    cart: null,

    // For guest
    addItem: (product, getTotalStock) => {
        const current = get().cartItems;
        
        // check if already in cart 
        const exist = current.find(item => item.productId === product._id);
        let updated;
        if (exist) {
            if (exist.quantity + 1 > getTotalStock) {
                toast.error(`Only ${exist.quantity} quantity can be added for this item`);
                return;
            }
            updated = current.map(item => 
                item.productId === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            updated = [...current, 
                {
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                }
            ];
        }

        set({ cartItems: updated });
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        toast.success("Product added to cart successfully");
    },

    deleteItem: (productId) => {
        const current = get().cartItems;
        const updated = current.filter(i => i.productId !== productId);
        set({ cartItems: updated });
        localStorage.setItem("guest_cart", JSON.stringify(updated));
        toast.success("Product deleted from cart successfully");
    },

    clearCart: () => {
        set({ cartItems: [] });
        localStorage.removeItem("guest_cart");
    },

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