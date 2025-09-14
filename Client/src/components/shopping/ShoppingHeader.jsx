import { LogIn, LogOut, Menu, ShoppingBag, ShoppingCart, UserCog, X } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { shoppingHeaderMenuItems } from '../../config/index';
import { useEffect, useState } from 'react';
import UserCartWrapper from './CartWrapper';
import { useCartStore } from "../../store/useCartStore";

const MenuItems = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleNavigate = (getCurrentMenuItem) => {
        sessionStorage.removeItem('filters');
        const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' 
        && getCurrentMenuItem.id !== 'search' ?
        {
            category : [getCurrentMenuItem.id]
        } : null;
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        location.pathname.includes('listing') && currentFilter !== null ?
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) :
        navigate(getCurrentMenuItem.path);
    }

    return (
        <nav className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            {
                shoppingHeaderMenuItems.map((item) => (
                    <label
                        key={item.id}
                        onClick={() => handleNavigate(item)}
                        className="text-sm font-medium text-black cursor-pointer"
                    >
                        {item.label}
                    </label>
                ))
            }
        </nav>
    );
};

const HeaderRightSection = () => {
    const { authUser, logOut } = useAuthStore();
    const [openDropdown, setOpenDropdown] = useState(false);
    const [openCartBox, setOpenCartBox] = useState(false);
    const navigate = useNavigate();
    const { cartItems, fetchCartItems } = useCartStore();

    useEffect(() => {
        if(authUser){
            fetchCartItems(authUser?._id, false);
        }
    }, [authUser, fetchCartItems]);

    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 relative pt-4 lg:pt-0">
            <div className="indicator">
                {cartItems?.length > 0 &&
                    <span className="indicator-item w-4 h-4 rounded-full bg-black font-bold text-xs 
                    text-white flex items-center justify-center">
                        {cartItems?.length}
                    </span>
                }
                <button 
                    onClick={() => setOpenCartBox(true)}
                    className="btn btn-outline btn-ghost cursor-pointer text-black p-2 md:w-10 relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="sr-only">User cart</span>
                </button>
            </div>
            {openCartBox && 
                <UserCartWrapper 
                    setOpenCartBox={setOpenCartBox} 
                    cartItems={cartItems && cartItems.length > 0 ? cartItems : []} 
                />
            }
            {authUser ? (
                <div className="relative">
                    <div role="button" onClick={() => setOpenDropdown(!openDropdown)} className="avatar avatar-placeholder cursor-pointer">
                        <div className="bg-black text-white w-12 rounded-full">
                            <span className="text-xl font-extrabold">{authUser?.fullName[0]}</span>
                        </div>
                    </div>
                    {openDropdown && (
                        <div className="fixed top-[320px] right-[365px] mt-2 mr-0 w-64 bg-white border border-gray-200 rounded shadow-lg z-50
                        transform translate-x-[20%] text-black lg:top-0 lg:right-[135px]">
                            <div className="w-full border-b border-b-gray-200">
                                <div className="px-3 py-2 font-bold">Logged in as {authUser?.fullName}</div>
                            </div>
                            <div className="px-3 py-2 flex items-center font-semibold cursor-pointer" onClick={() => navigate("/shop/account")}>
                                <UserCog color="black" className="mr-2 w-4 h-4" />
                                Account
                            </div>
                            <div className="px-3 py-2 flex items-center cursor-pointer font-semibold" onClick={() => logOut(navigate)}>
                                <LogOut color="black" className="mr-2 w-4 h-4" />
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button 
                    className="btn btn-neutral cursor-pointer text-white" 
                    onClick={() => navigate('/login')}
                >
                    <LogIn color="white" className="mr-2 w-4 h-4" />
                    Login
                </button>
            )}
        </div>
    );
}

const ShoppingHeader = () => {
    const [openMenu, setOpenMenu] = useState(false);    

    return (
        <header className="sticky top-0 z-40 w-full border-b border-b-gray-200 bg-white">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
                <Link className="flex items-center gap-2" to="/shop/home">
                    <ShoppingBag color="black" className="h-6 w-6" />
                    <span className="font-bold text-black">Ecommerce</span>
                </Link>
                <button 
                    className="lg:hidden sm:block btn btn-outline btn-neutral cursor-pointer text-black hover:text-white" 
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    <Menu />
                    <span className="sr-only">Toggle Header Menu</span>
                </button>
                {/* For small screens */}
                {openMenu && ( 
                    <div className="lg:hidden fixed inset-0 z-40">
                        {/*overlay*/}
                        <div className="absolute inset-0 bg-gray-700/60" onClick={() => setOpenMenu(false)}></div>
                        <div className="fixed top-0 right-0 z-50 w-full max-w-xs h-screen bg-white border-l border-l-gray-200 transform transition-transform duration-300 translate-x-0 p-4">
                            {/* Close button */}
                            <div className="flex justify-end">
                                <button 
                                    className="btn btn-ghost btn-sm p-1 cursor-pointer"
                                    aria-label="Close menu"
                                    onClick={() => setOpenMenu(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <MenuItems />
                            <HeaderRightSection />
                        </div>
                    </div>
                )}
                {/* For large screens */}
                <div className="hidden lg:block relative">
                    <MenuItems />
                </div>
                <div className="hidden lg:block">
                    <HeaderRightSection />
                </div>
            </div>
        </header>
    );
};

export default ShoppingHeader;
