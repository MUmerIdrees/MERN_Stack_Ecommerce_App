import { X } from "lucide-react";
import UserCartItemsContent from "./CartItemsContent";
import { useNavigate } from "react-router-dom";

const UserCartWrapper = ({ setOpenCartBox, cartItems }) => {
    const totalCartAmount = cartItems && cartItems.length > 0 ?
    cartItems.reduce((sum, currentItem) => sum + (
        currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price
    ) * currentItem?.quantity, 0)
    : 0

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-40">
            {/*overlay*/}
            <div 
                className="absolute inset-0 bg-gray-700/60" 
                onClick={
                    () => {
                        setOpenCartBox(false);
                    }
                }
            >
            </div>
            <div className="fixed top-0 right-0 z-50 w-80 h-screen bg-white border-l border-l-gray-200 p-5 transform transition-transform duration-300 translate-x-0">
                {/* Close button */}
                <div className="flex justify-end">
                    <button 
                        onClick={
                            () => {
                                setOpenCartBox(false);
                            }
                        }
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="flex gap-2 mt-0.5">
                    <h1 className="text-xl font-medium text-black">
                        Your Cart
                    </h1>
                </div>
                <div className="mt-8 space-y-4">
                    {
                        cartItems && cartItems.length > 0  ?
                        cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />) :
                        null
                    }
                </div>
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">Rs. {totalCartAmount}</span>
                    </div>
                </div>
                <button 
                    onClick={
                        () => {
                            navigate("/shop/checkout");
                            setOpenCartBox(false);
                        }
                    } 
                    className="btn btn-neutral mt-6 w-full"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default UserCartWrapper;
