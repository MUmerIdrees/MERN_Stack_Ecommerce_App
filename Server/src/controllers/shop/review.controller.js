import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import ProductReview from "../../models/review.model.js";

export const addProductReview = async (req, res) => {
    try {
        const {productId, userId, userName, reviewMessage, reviewValue} = req.body;

        const order = await Order.findOne({
            userId,
            "cartItems.productId": productId,
            orderStatus: "delivered"
        });

        if(!order){
            return res.status(400).json({ message: "You need to purchase product to review it" });
        }

        const checkExistingReview = await ProductReview.findOne({productId, userId});

        if(checkExistingReview) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const newReview = new ProductReview({
            productId, userId, userName, reviewMessage, reviewValue
        });

        await newReview.save();

        const reviews = await ProductReview.find({productId});
        const totalReviewsLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;

        await Product.findByIdAndUpdate(productId, {averageReview});

        res.status(200).json({ data: newReview });
        
    } catch (error) {
        console.log("Error in add review controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const {productId} = req.params;

        const reviews = await ProductReview.find({ productId });

        console.log(reviews, 'reviews');

        res.status(200).json({ data: reviews });
        
    } catch (error) {
        console.log("Error in add review controller", error);
        res.status(500).json({ message: "Internal server error" });
    }
};