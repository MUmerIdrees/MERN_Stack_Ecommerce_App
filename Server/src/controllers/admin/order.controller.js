import Order from "../../models/order.model.js";

export const getAllOrdersOfAllUsers = async (req, res) => {
    try {
        const orders = await Order.find({});

        if(!orders.length){
            return res.status(400).json({ message: "No order found" });
        }

        res.status(200).json({ data: orders });
        
    } catch (error) {
        console.log("Error in get all orders of all users controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id).populate("userId", "fullName");

        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }

        res.status(200).json({ data: order });
        
    } catch (error) {
        console.log("Error in get order details controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {orderStatus} = req.body;

        const status = orderStatus.toLowerCase();
        console.log(status);

        const order = await Order.findById(id);

        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }

        await Order.findByIdAndUpdate(id, {orderStatus: status});

        res.status(200).json({ message: "Order status updated successfully" });
        
    } catch (error) {
        console.log("Error in get order details controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};