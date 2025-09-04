import { StarIcon } from "lucide-react";

const StarRating = ({ rating, handleRatingChange }) => {
    return (
        [1,2,3,4,5].map(star => 
            <button 
                onClick={handleRatingChange ? () => handleRatingChange(star) : null}
                key={star}
                className="btn p-2 rounded-full transition-colors cursor-pointer"
            >
                <StarIcon className={`w-6 h-6 stroke-transparent ${star <= rating ? "fill-yellow-500" : "fill-black"}`} />
            </button>
        )
    );
};

export default StarRating;
