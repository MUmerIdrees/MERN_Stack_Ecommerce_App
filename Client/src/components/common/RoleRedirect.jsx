import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const RoleRedirect = ({ only = null }) => {
    const { authUser, isCheckingAuth } = useAuthStore();
    const location = useLocation();

    if(isCheckingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className='size-10 animate-spin' />
            </div>
        );
    }

    // Admin only guard
    if(only === "admin"){
        if(!authUser) {
            return <Navigate to="/shop/home" replace state={{ from: location.pathname }} />;
        }
        if(authUser.role !== "admin") {
            return <Navigate to="/shop/home" replace />;
        }
        return <Outlet />;
    }

    // User only guard
    if(only === "user"){
        if(!authUser) {
            // Guest can still see /shop pages (except checkout)
            if(location.pathname.includes("/checkout")){
                return <Navigate to="/login" replace state={{ from: location.pathname }} />;
            }
            return <Outlet />;
        }
        if(authUser.role === "admin") {
            return <Navigate to="/admin" replace />;
        }
        return <Outlet />;
    }
    
    // If no specific role is required, allow access

    return <Outlet />;
};

export default RoleRedirect;
