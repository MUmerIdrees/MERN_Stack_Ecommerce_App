import stripe from "../../utils/stripe.js";
import Order from "../../models/order.model.js";
import Cart from "../../models/cart.model.js";
import Product from "../../models/product.model.js";

export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartId, 
            cartItems, 
            addressInfo, 
            orderStatus, 
            paymentMethod, 
            paymentStatus, 
            totalAmount, 
            orderDate, 
            orderUpdateDate,
            paymentId,
            payerId
        } = req.body;

        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: "pkr",
                product_data: {
                    name: item.title,
                    metadata: {
                        sku: item.productId
                    }
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/shop/stripe_return?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/shop/stripe_cancel`
        });

        const newlyCreatedOrder = new Order({
            userId, 
            cartId,
            cartItems, 
            addressInfo, 
            orderStatus, 
            paymentMethod, 
            paymentStatus, 
            totalAmount, 
            orderDate, 
            orderUpdateDate,
            paymentId,
            payerId,
        });

        await newlyCreatedOrder.save();

        res.status(200).json({
            url: session.url,
            orderId: newlyCreatedOrder._id,
        });

    } catch (error) {
        console.log("Error in create order controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const capturePayment = async (req, res) => {
    try {
        const {paymentId, orderId} = req.body;

        let order = await Order.findById(orderId);

        if(!order) {
            return res.status(400).json({ message: "Order not found" });
        }

        order.paymentId = paymentId;
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId);

            if(!product){
                return res.status(400).json({ message: `Not enough stock for this product ${product.title}` });
            }

            product.totalStock -= item.quantity;

            await product.save();
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({ message: "Order confirmed", data: order });

    } catch (error) {
        console.log("Error in capture payment controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllOrdersByUser = async (req, res) => {
    try {
        const {userId} = req.params;

        const orders = await Order.find({userId});

        if(!orders.length){
            return res.status(400).json({ message: "No order found" });
        }

        res.status(200).json({ data: orders });
        
    } catch (error) {
        console.log("Error in get all orders by user controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(400).json({ message: "Order not found" });
        }

        res.status(200).json({ data: order });
        
    } catch (error) {
        console.log("Error in get order details controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};