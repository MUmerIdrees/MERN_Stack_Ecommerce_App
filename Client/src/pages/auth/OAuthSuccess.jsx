import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth, authUser } = useAuthStore();
    const { mergeGuestCart, fetchCartItems } = useCartStore();

    const hasMerged = useRef(false);

    useEffect(() => {
        if(!authUser) {
            checkAuth().catch(err => {
                console.error("OAuthSuccess checkAuth error:", err);
                navigate("/shop/home", { replace: true });
            });
        }
    }, [authUser, checkAuth, navigate]);

    useEffect(() => {
        const handleMergeAndRedirect = async () => {
            if(!authUser || hasMerged.current){
                return;
            }

            hasMerged.current = true;

            try {
                await mergeGuestCart();
                await fetchCartItems();

                const redirectTo = searchParams.get("from") || "/shop/home";
                navigate(redirectTo, { replace: true });

            } catch (err) {
                console.error("OAuthSuccess error:", err);
                navigate("/shop/home", { replace: true });
            }
        };

        handleMergeAndRedirect();
    }, [authUser, mergeGuestCart, fetchCartItems, navigate, searchParams]);


    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="w-10 h-10 animate-spin" />
        </div>
    );
};

export default OAuthSuccess;

