import { Minus, Plus, Trash } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";
import { useShopStore } from "../../store/useShopStore";
import { toast } from "react-toastify";

const UserCartItemsContent = ({ cartItem }) => {
    const { authUser } = useAuthStore();
    const { deleteCartItem, updateCartItemQuantity, cartItems } = useCartStore();
    const { productsList } = useShopStore();

    const handleCartItemDelete = async (getCartItem) => {
        await deleteCartItem({ userId: authUser?._id, productId: getCartItem?.productId });
    };

    const handleCartItemQuantity = async (getCartItem, typeOfAction) => {
        if(typeOfAction === "plus"){
            let getCartItems = cartItems || [];
            if(getCartItems.length){
                const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCartItem?.productId);
                const getCurrentProductIndex = productsList.findIndex(product => product?._id === getCartItem?.productId);
                const getTotalStock = productsList[getCurrentProductIndex].totalStock;
                if(indexOfCurrentCartItem > -1){
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if(getQuantity + 1 > getTotalStock){
                        toast.error(`Only ${getQuantity} quantity can be added for this item`);
                        return;
                    }
                }
            }
        }
        await updateCartItemQuantity({ 
            userId: authUser?._id, 
            productId: getCartItem?.productId, 
            quantity: typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem.quantity - 1
        });
    }

    return (
        <div className="flex items-center gap-2">
            <img 
                src={cartItem?.image} 
                alt={cartItem?.title} 
                className="w-20 h-20 rounded object-cover bg-gray-200" 
            />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3>
                <div className="flex items-center mt-1 gap-1">
                    <button 
                        onClick={() => handleCartItemQuantity(cartItem, 'minus')} 
                        className="btn btn-sm btn-circle" 
                        disabled={cartItem?.quantity === 1}
                    >
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Decrease</span>
                    </button>
                    <span className="font-semibold">{cartItem?.quantity}</span>
                    <button onClick={() => handleCartItemQuantity(cartItem, 'plus')} className="btn btn-sm btn-circle">
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    RS{(
                        (cartItem?.salePrice > 0 ? cartItem?.salePrice: cartItem?.price) * cartItem?.quantity
                    ).toFixed(2)}
                </p>
                <Trash onClick={() => handleCartItemDelete(cartItem)} className="cursor-pointer mt-1" size={20} />
            </div>
        </div>
    );
};

export default UserCartItemsContent;
