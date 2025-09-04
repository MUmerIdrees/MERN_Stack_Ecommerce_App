import { useEffect, useState } from "react";
import ShoppingOrderDetails from "../../components/shopping/ShoppingOrderDetails";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrderStore } from "../../store/useOrderStore";

const ShoppingOrders = () => {
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const { authUser } = useAuthStore();
    const { getAllOrdersByUserId, orderList, getOrderDetails, orderDetails } = useOrderStore();

    const handleFetchOrderDetails = async (getId) => {
        await getOrderDetails(getId);
        setOpenDetailsModal(true);
    }

    useEffect(() => {
        getAllOrdersByUserId(authUser?._id);
    }, [getAllOrdersByUserId]);

    return (
        <div className="card shadow-sm p-5">
            <div className="card-title">Orders History</div>
            <div className="card-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Order Status</th>
                            <th>Order Price</th>
                            <th>
                                <span className="sr-only">Details</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderList && orderList.length > 0 ? 
                            orderList.map((orderItem) => (
                                <tr>
                                    <td>{orderItem?._id}</td>
                                    <td>{orderItem?.orderDate.split("T")[0]}</td>
                                    <td>
                                        <span className={`badge px-3 py-1 text-white rounded-full 
                                            ${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' : (orderItem?.orderStatus === 'Rejected' ?
                                                'bg-red-600' : 'bg-black')}`}
                                        >
                                            {orderItem?.orderStatus}
                                        </span>
                                    </td>
                                    <td>RS{orderItem?.totalAmount}</td>
                                    <td>
                                        <button onClick={() => handleFetchOrderDetails(orderItem?._id)} className="btn btn-neutral">View Details</button>
                                    </td>
                                </tr>)
                            ) : null
                        }
                    </tbody>
                </table>
            </div>
            {
                openDetailsModal && <ShoppingOrderDetails setOpenDetailsModal={setOpenDetailsModal} orderDetails={orderDetails} />
            }
        </div>
    );
};

export default ShoppingOrders;
