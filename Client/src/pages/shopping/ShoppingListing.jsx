import { ArrowUpDownIcon, Loader } from "lucide-react";
import ProductFilter  from "../../components/shopping/ProductFilter";
import { sortOptions } from "../../config/index";
import { useShopStore } from "../../store/useShopStore";
import { useEffect, useState } from "react";
import ShoppingProductTile from "../../components/shopping/ProductTile";
import { useSearchParams } from "react-router-dom";
import ProductDetails from "../../components/shopping/ProductDetails";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

const ShoppingListing = () => {
    const { fetchFilteredProducts, productsList, fetchProductDetails, productDetails } = useShopStore();
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const { addToCart, fetchCartItems, cartItems } = useCartStore();
    const { authUser } = useAuthStore();

    const categorySearchParams = searchParams.get('category');
 
    // Parse filters from URL on initial load
    useEffect(() => {
        const storedFilters = sessionStorage.getItem("filters");

        if(storedFilters){
            const parsedFilters = JSON.parse(storedFilters);
            setFilters(parsedFilters);
        }

        setSort("price-lowtohigh");
        setIsInitialLoad(false);
    }, [categorySearchParams]);

    // Save filters and sort to sessionStorage whenever they change
    useEffect(() => {
        if (!isInitialLoad) {
            sessionStorage.setItem("filters", JSON.stringify(filters));
        }
    }, [filters, isInitialLoad]);

    // Update URL when filters or sort changes
    useEffect(() => {
        const queryParams = new URLSearchParams();

        for(const [key, value] of Object.entries(filters || {})){
            if(Array.isArray(value) && value.length > 0) {
                queryParams.set(key, value.join(","));
            }
        }

        if(sort){
            queryParams.set("sortBy", sort);
        }

        setSearchParams(queryParams);
    }, [filters, sort, setSearchParams]);

    console.log(searchParams, filters);

    const handleFilters = (filterKey, optionId) => {
        //Make a copy existing filters
        const updatedFilters = { ...filters };

        const existing = updatedFilters[filterKey] || [];

        const isActive = existing.includes(optionId);
        const newValues = isActive ? existing.filter(id => id !== optionId) : [...existing, optionId];

        if(newValues.length > 0){
            updatedFilters[filterKey] = newValues;
        } else {
            delete updatedFilters[filterKey];
        }

        // update the filter state
        setFilters(updatedFilters);
    };

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

     // Fetch products when the component mounts
    useEffect(() => {
        if(!isInitialLoad){
            fetchFilteredProducts({ filterParams : filters, sortParams : sort });
        }
    }, [filters, sort, fetchFilteredProducts, isInitialLoad]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilters={handleFilters} />
            <div className="bg-white w-full rounded-lg shadow-sm">
                <div className="p-4 border-b border-b-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-black">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-300">{productsList?.length} Products</span>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-sm btn-outline btn-neutral text-black hover:text-white p-2 flex items-center gap-1">
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span>Sort by</span>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-3 shadow-sm">
                                {
                                    sortOptions.map((option) => (
                                        <li key={option.id} className="text-black mb-1 cursor-pointer">
                                            <button onClick={() => setSort(option.id)}>{option.label}</button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div> 
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {productsList && productsList?.length > 0 ? productsList.map((product) => (
                        <ShoppingProductTile 
                            key={product?.title} 
                            product={product} 
                            handleGetProductDetails={handleGetProductDetails} 
                            handleAddToCart={handleAddToCart}
                        />
                    )) : null}
                </div>
            </div>
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

export default ShoppingListing;
