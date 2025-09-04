import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOrderStore } from "../../store/useOrderStore";

const StripeReturnPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('session_id');
    const { capturePayment } = useOrderStore();

    useEffect(() => {
        if(paymentId) {
            const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
            capturePayment({paymentId, orderId});
            sessionStorage.removeItem('currentOrderId');
            window.location.href = '/shop/payment_success';
        }
    }, [paymentId, capturePayment])

    return (
        <div className="card shadow-sm shadow-gray-300 m-5">
            <div className="card-body">
                <div className="card-title">
                    Processing Payment...Please wait!
                </div>
            </div>
        </div>
    );
};

export default StripeReturnPage;
