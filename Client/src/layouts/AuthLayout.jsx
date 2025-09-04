import { ShoppingBag } from "lucide-react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col justify-center items-center p-6 sm:p-12 
            bg-gradient-to-br from-gray-400 to-black">
                <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
                    <div className="size-14 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/20 
                    transition-colors">
                        <ShoppingBag className="size-6 text-black" />
                    </div>
                    <h1 className="text-white font-bold text-3xl text-center">Welcome To Ecommerce Shopping Store</h1>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
