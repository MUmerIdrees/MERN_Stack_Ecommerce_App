import { useEffect, useState } from "react";
import nike from "../../assets/nike.png";
import adidas from "../../assets/adidas.png";
import puma from "../../assets/puma.png";
import levis from "../../assets/levis.png";
import hopsotch from "../../assets/hopscotch.png";
import zara from "../../assets/zara.png";
import { BabyIcon, ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, UmbrellaIcon, WatchIcon } from "lucide-react";
import { useShopStore } from "../../store/useShopStore";
import ShoppingProductTile from "../../components/shopping/ProductTile";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import ProductDetails from "../../components/shopping/ProductDetails";
import { useFeatureStore } from "../../store/useFeatureStore";
import { toast } from "react-toastify";

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const { addToCart, fetchCartItems, addItem, cartItems } = useCartStore();
  const { authUser } = useAuthStore();
  const { fetchFilteredProducts, productsList, fetchProductDetails, productDetails } = useShopStore();
  const { getFeatureImages, featureImagesList } = useFeatureStore();

  const navigate = useNavigate();

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section] : [getCurrentItem.id]
    };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  const handleGetProductDetails = async (currentProductId) => {
    await fetchProductDetails(currentProductId);
    setOpenDetailsModal(true);
  };

  const handleAddToCart = async (currentProductId, getTotalStock, product) => {
    if(authUser){
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
    } else {
        addItem(product, getTotalStock);
    }
  }

  const categories =  [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];

  const brands = [
    { id: "nike", label: "Nike", image: nike },
    { id: "adidas", label: "Adidas", image: adidas },
    { id: "puma", label: "Puma", image: puma },
    { id: "levi's", label: "Levi's", image: levis },
    { id: "zara", label: "Zara", image: zara },
    { id: "hopscotch", label: "Hopscotch", image: hopsotch },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % featureImagesList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImagesList]);

  useEffect(() => {
    fetchFilteredProducts({ filterParams: {} , sortParams: 'price-lowtohigh' });
  }, [fetchFilteredProducts]);

  useEffect(() => {
    getFeatureImages();
  }, [getFeatureImages]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {
          featureImagesList && featureImagesList.length > 0 && featureImagesList.map((slide, index) => 
            <img
              src={slide?.image}
              key={index}
              className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          )
        }
        <button
          onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + featureImagesList.length) % featureImagesList.length)}
          className="btn absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1) % featureImagesList.length)}
          className="btn absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
              categories.map(cateogryItem => 
                <div 
                  key={cateogryItem.id}
                  onClick={() => handleNavigateToListingPage(cateogryItem, 'category')} 
                  className="card cursor-pointer bg-gray-100 shadow-xl hover:shadow-lg transition-shadow"
                >
                  <div className="card-body flex flex-col items-center justify-center p-6">
                    <cateogryItem.icon className="w-12 h-12 mb-4 text-black" />
                    <span className="font-bold text-black">{cateogryItem.label}</span>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {
              brands.map(brandItem => 
                <div 
                  key={brandItem.id}
                  onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                  className="card cursor-pointer bg-gray-100 shadow-xl hover:shadow-lg transition-shadow"
                >
                  <div className="card-body flex flex-col items-center justify-center p-6">
                    <img src={brandItem.image} className="w-12 h-12 mb-4" />
                    <span className="font-bold text-black">{brandItem.label}</span>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              productsList && productsList.length > 0 ?
              productsList.map(productItem => (
                <ShoppingProductTile 
                  key={productItem?._id}
                  product={productItem} 
                  handleGetProductDetails={handleGetProductDetails} 
                  handleAddToCart={handleAddToCart}
                />
              )) : null
            }
          </div>
        </div>
      </section>
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

export default HomePage;

