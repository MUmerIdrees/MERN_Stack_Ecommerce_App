import { useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";

const initialFormData = {
    status: ''
};

const AdminOrderDetails = ({ setOpenDetailsModal, orderDetails }) => {
    const [formData, setFormData] = useState(initialFormData);
    const { updateOrderStatus, getOrderDetailsForAdmin, getAllOrdersForAdmin } = useAdminStore();

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        const {status} = formData;
        await updateOrderStatus({ id: orderDetails?._id, orderStatus: status });
        await getOrderDetailsForAdmin(orderDetails?._id);
        await getAllOrdersForAdmin();
        setFormData(initialFormData);
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box sm:max-w-[600px]">
                <button 
                    onClick={() => setOpenDetailsModal(false)} 
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    ✕
                </button>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between mt-6">
                            <p className="font-medium text-black">Order ID</p>
                            <p className="text-black">{orderDetails?._id}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="font-medium text-black">Order Date</p>
                            <p className="text-black">{orderDetails?.orderDate.split("T")[0]}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="font-medium text-black">Order Price</p>
                            <p className="text-black">${orderDetails?.totalAmount}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <p className="font-medium text-black">Order Status</p>
                            <p className="text-black">
                                <span className={`badge px-3 py-1 text-white rounded-full 
                                    ${orderDetails?.orderStatus === 'confirmed' ? 'bg-green-500' : (orderDetails?.orderStatus === 'Rejected' ?
                                        'bg-red-600' : 'bg-black')}`}
                                >
                                    {orderDetails?.orderStatus}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="divider"></div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <p className="font-medium text-black">Order Details</p>
                            <ul className="grid gap-3">
                                {
                                    orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                                    (orderDetails?.cartItems.map(item =>
                                        <li className="flex items-center justify-between text-black">
                                            <span>Title: {item?.title}</span>
                                            <span>Quantity: {item?.quantity}</span>
                                            <span>Price: RS{item?.price}</span>
                                        </li>
                                    )) : null
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <p className="font-medium text-black">Shipping Info</p>
                            <div className="grid gap-0.5 text-gray-500">
                                <span>{orderDetails?.userId?.fullName}</span>
                                <span>{orderDetails?.addressInfo?.address}</span>
                                <span>{orderDetails?.addressInfo?.city}</span>
                                <span>{orderDetails?.addressInfo?.pincode}</span>
                                <span>{orderDetails?.addressInfo?.phone}</span>
                                <span>{orderDetails?.addressInfo?.notes}</span>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleUpdateStatus} className="space-y-4">
                        <div className="form-control text-black">
                            <label className="label mb-1">
                                <span className="label-text font-medium text-sm">Order Status</span>
                            </label>
                            <select 
                                className="select w-full text-sm focus:border-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value})}
                                required
                            >
                                <option value="" disabled>Status</option>
                                <option value="Pending">pending</option>
                                <option value="In Process">in process</option>
                                <option value="In Shipping">in shipping</option>
                                <option value="Delivered">delivered</option>
                                <option value="Rejected">rejected</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-neutral w-full">
                            Update Order Status
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
