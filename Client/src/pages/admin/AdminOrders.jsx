import { useEffect, useState } from "react";
import AdminOrderDetails from "../../components/admin/AdminOrderDetails";
import { useAdminStore } from "../../store/useAdminStore";

const AdminOrders = () => {
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const { orderList, orderDetails, getAllOrdersForAdmin, getOrderDetailsForAdmin } = useAdminStore();

    const handleFetchOrderDetails = async (getId) => {
        await getOrderDetailsForAdmin(getId);
        setOpenDetailsModal(true);
    }

    useEffect(() => {
        getAllOrdersForAdmin();
    }, [getAllOrdersForAdmin])

    return (
        <div className="card shadow-sm p-5 bg-white">
            <div className="card-title text-black">All Orders</div>
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
                                <tr key={orderItem?._id} className="text-black">
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
                                    <td>Rs. {orderItem?.totalAmount}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleFetchOrderDetails(orderItem?._id)} 
                                            className="btn btn-neutral"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>)
                            ) : null
                        }
                    </tbody>
                </table>
            </div>
            {
                openDetailsModal && <AdminOrderDetails setOpenDetailsModal={setOpenDetailsModal} orderDetails={orderDetails} />
            }
        </div>
    );
};

export default AdminOrders;
