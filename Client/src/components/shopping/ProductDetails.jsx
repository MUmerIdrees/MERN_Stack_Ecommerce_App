import { Loader2, Send, StarIcon } from "lucide-react";
import StarRating from "../common/StarRating";
import { useEffect, useState } from "react";
import { useReviewStore } from "../../store/useReviewStore";
import { useAuthStore } from "../../store/useAuthStore";

const ProductDetails = ({ setOpenDetailsModal, productDetails, handleAddToCart }) => {
    const [reviewMsg, setReviewMsg] = useState('');
    const [rating, setRating] = useState(0);
    const { addProductReview, isAddingReview, reviews, getProductReviews, clearReviews } = useReviewStore();
    const { authUser } = useAuthStore();
    
    const handleRatingChange = (getRating) => {
        setRating(getRating);
    }

    const handleAddReview = async () => {
        await addProductReview({
            productId: productDetails?._id,
            userId: authUser?._id,
            userName: authUser?.fullName,
            reviewMessage: reviewMsg,
            reviewValue: rating
        });
        await getProductReviews(productDetails?._id);
        setRating(0);
        setReviewMsg('');
    }

    useEffect(() => {
        if(productDetails !== null){
            getProductReviews(productDetails?._id);
        }
    }, [productDetails]);

    const averageReview = reviews && reviews.length > 0
        ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length 
        : 0;

    return (
        <div className="modal modal-open">
            <div className="modal-box relative max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] overflow-hidden">
                <button 
                    onClick={
                        () => {
                            setOpenDetailsModal(false);
                            clearReviews();
                        }
                    } 
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    ✕
                </button>
                <div className="grid grid-cols-2 gap-8 sm:p-12">
                    <div className="relative overflow-hidden rounded-lg">
                        <img 
                            src={productDetails?.image}
                            alt={productDetails?.title}
                            width={600}
                            height={600}
                            className="aspect-square w-full object-cover rounded-lg bg-gray-200"
                        />
                    </div>
                    <div className="flex flex-col gap-0.5 w-full">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-3xl font-extrabold">{productDetails.title}</h1>
                            <p className="text-gray-300 text-2xl">{productDetails.description}</p>
                            <div className="flex items-center justify-between">
                                <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? 'line-through' : ''}`}>
                                    ${productDetails?.price}
                                </p>
                                {
                                    productDetails?.salePrice > 0 ? <p className="text-2xl text-blue-300">${productDetails?.salePrice}</p>
                                    : null
                                }
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    <StarRating rating={averageReview} />
                                </div>
                                <span className="text-gray-300">({averageReview.toFixed(1)})</span>
                            </div>
                            {
                                productDetails?.totalStock === 0 ? 
                                <button 
                                    className="btn btn-neutral opacity-60 cursor-not-allowed" 
                                >
                                    Out Of Stock
                                </button> : 
                                <button 
                                    className="btn btn-neutral" 
                                    onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                                >
                                    Add to Cart
                                </button>
                            }
                        </div>
                        <div className="divider"></div>
                        <div className="max-h-[300px] overflow-auto">
                            <h2 className="text-xl font-bold mb-4">Reviews</h2>
                            <div className="grid gap-6">
                                {
                                    reviews && reviews.length > 0 ?
                                    reviews.map(reviewItem => 
                                        <div key={reviewItem?._id} className="flex gap-4">
                                            <div className="avatar avatar-placeholder">
                                                <div className="w-10 h-10 rounded-full bg-gray-200">
                                                    <span>{reviewItem?.userName[0]}</span>
                                                </div>
                                            </div>
                                            <div className="grid gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">{reviewItem?.userName}</h3>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <StarRating rating={reviewItem?.reviewValue} />
                                                </div>
                                                <p className="text-gray-300 mt-1">{reviewItem?.reviewMessage}</p>
                                            </div>
                                        </div>
                                    ) 
                                    : <h1>No Reviews</h1>
                                }
                            </div>
                            <div className="mt-10 flex flex-col gap-2 w-full">
                                <label>Write a review</label>
                                <div className="flex gap-1">
                                    <StarRating rating={rating} handleRatingChange={handleRatingChange} />
                                </div>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        name="reviewMsg" 
                                        value={reviewMsg}
                                        onChange={(e) => setReviewMsg(e.target.value)}
                                        placeholder="Write a review..." 
                                        className="w-full input focus:border-none" 
                                    />
                                    <button 
                                        type="submit" 
                                        className="btn btn-neutral text-white"
                                        disabled={reviewMsg.trim() === '' || isAddingReview}
                                        onClick={() => handleAddReview()}
                                    >
                                        {isAddingReview ? <Loader2 className="size-5 animate-spin" /> : <Send />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductDetails;
