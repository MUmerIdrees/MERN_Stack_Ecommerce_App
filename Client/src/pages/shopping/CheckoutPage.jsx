import img from "../../assets/account.jpg";
import Address from "./Address";
import { useCartStore } from "../../store/useCartStore";
import UserCartItemsContent from "../../components/shopping/CartItemsContent";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const CheckoutPage = () => {
    const { cartItems, cart } = useCartStore();
    const { authUser } = useAuthStore();
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const { createNewOrder, approvalURL, isCreatingOrder } = useOrderStore();

    const handleInitiateStripePayment = async () => {
        if(cartItems.length === 0) {
            toast.error("Your cart is empty. Please add some products to proceed");
            return;
        }

        if(currentSelectedAddress === null) {
            toast.error("Please select one address to proceed");
            return;
        }
        
        const orderData = {
            userId: authUser?._id,
            cartId: cart?._id,
            cartItems: cartItems.map(cartItem => ({
                productId: cartItem?.productId,
                title: cartItem?.title,
                image: cartItem?.image,
                price: cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price,
                quantity: cartItem?.quantity
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: 'pending',
            paymentMethod: 'stripe',
            paymentStatus: 'pending',
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: '',
        };

        await createNewOrder(orderData);
    };

    const totalCartAmount = cartItems && cartItems.length > 0 ?
    cartItems.reduce((sum, currentItem) => sum + (
        currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
    ) * currentItem?.quantity, 0)
    : 0

    if(approvalURL) {
        window.location.href = approvalURL;
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img
                    src={img}
                    className="h-full w-full object-cover object-center"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <div className="shadow-sm shadow-gray-300 rounded-lg">
                    <Address 
                        setCurrentSelectedAddress={setCurrentSelectedAddress} 
                        selectedId={currentSelectedAddress?._id}
                    />
                </div>
                <div className="flex flex-col gap-4 p-5 shadow-sm shadow-gray-300 rounded-lg">
                    {
                        cartItems && cartItems.length > 0 ?
                        cartItems.map(cartItem => <UserCartItemsContent cartItem={cartItem} />) : 
                        null
                    }
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">${totalCartAmount}</span>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <button 
                            onClick={() => handleInitiateStripePayment()} 
                            className="btn btn-neutral w-full"
                            disabled={isCreatingOrder}
                        >
                            {
                                isCreatingOrder ? (
                                    <>
                                        <Loader2 className="size-5 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Checkout with Stripe'
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
