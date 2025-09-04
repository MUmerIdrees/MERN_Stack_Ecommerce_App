import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShopStore } from "../../store/useShopStore";
import ShoppingProductTile from "../../components/shopping/ProductTile";
import { Loader } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import ProductDetails from "../../components/shopping/ProductDetails";
import { useAuthStore } from "../../store/useAuthStore";

const SearchProductPage = () => {
    const [keyword, setKeyword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchResults, getSearchResults, resetSearchResults, isSearching } = useShopStore();
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const { addToCart, fetchCartItems, cartItems } = useCartStore();
    const { fetchProductDetails, productDetails } = useShopStore();
    const { authUser } = useAuthStore();

    const handleGetProductDetails = async (currentProductId) => {
            await fetchProductDetails(currentProductId);
            setOpenDetailsModal(true);
        };
    
    const handleAddToCart = async (currentProductId, getTotalStock) => {
        let getCartItems = cartItems || [];
        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === currentProductId);
            if(indexOfCurrentItem > -1){
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if(getQuantity + 1 > getTotalStock){
                    toast.error(`Only ${getQuantity} quantity can be added for this item`);
                    return;
                }
            }
        }
        await addToCart({ userId: authUser?._id, productId: currentProductId, quantity: 1 });
        await fetchCartItems(authUser?._id);
    }

    useEffect(() => {
        if(keyword && keyword.trim() !== '' && keyword.trim().length >= 3){
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
                getSearchResults(keyword);
            }, 1000)
        } else {
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
            resetSearchResults();
        }
    }, [keyword]);

    console.log(searchResults)

    return (
        <div className="md:px-10 px-4 py-8">
            <div className="flex justify-center mb-8">
                <div className="w-full flex items-center">
                    <input 
                        type="text" 
                        value={keyword}
                        name="keyword"
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Search Products..." 
                        className="w-full py-6 input focus:border-none" 
                    />
                </div>
            </div>
            {
                isSearching ? 
                <div className="flex items-center justify-center">
                    <Loader className="size-10 animate-spin" />
                </div> :
                searchResults && searchResults.length > 0 ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {
                        searchResults.map(item => 
                            <ShoppingProductTile 
                                key={item?.title}
                                product={item} 
                                handleGetProductDetails={handleGetProductDetails} 
                                handleAddToCart={handleAddToCart}
                            />
                        ) 
                    }
                </div> : 
                <h1 className="text-5xl font-extrabold">No result found!</h1>
            }
            {
                openDetailsModal && 
                <ProductDetails 
                    setOpenDetailsModal={setOpenDetailsModal} 
                    productDetails={productDetails} 
                    handleAddToCart={handleAddToCart}
                />
            }
        </div>
    );
};

export default SearchProductPage;
