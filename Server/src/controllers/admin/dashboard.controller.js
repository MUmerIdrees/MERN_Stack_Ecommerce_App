import User from "../../models/user.model.js";
import Product from "../../models/product.model.js";
import Order from "../../models/order.model.js";

export const fetchDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        console.log("Error in fetch dashboard data controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};