import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="card shadow-lg shadow-gray-300 m-5">
            <div className="card-body">
                <div className="card-title mb-3">
                    Payment is successfull!
                </div>
                <div className="card-actions">
                    <button className="btn btn-neutral w-1/12" onClick={() => navigate('/shop/account')}>View Orders</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
