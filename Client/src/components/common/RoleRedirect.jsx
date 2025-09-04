import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

const RoleRedirect = ({ allowedRoles }) => {
    const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if(isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className='size-10 animate-spin' />
            </div>
        );
    }

    if(!authUser) {
        return <Navigate to='/login' replace />;
    }
    if(allowedRoles && !allowedRoles.includes(authUser.role)) {
        const redirectTo = authUser.role === 'admin' ? '/admin' : '/shop/home';
        return <Navigate to={redirectTo} replace />;
    }

    return <Outlet />;
};

export default RoleRedirect;
