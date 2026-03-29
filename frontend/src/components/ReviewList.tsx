import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface Review {
    _id: string;
    rating: number;
    comment: string;
    user: {
        name: string;
    };
}

const ReviewList = ({listingId}: {listingId: string}) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosInstance.get(`/reviews/${listingId}`);
                setReviews(res.data);
            } catch(error) {
                console.error(error);
            }
        };
        fetchReviews();
    }, [listingId]);

    return (
    <div>
      <h3>Reviews</h3>

      {reviews.length === 0 && <p>No reviews yet</p>}

      {reviews.map((review) => (
        <div key={review._id} className="review-card">
          <h4>{review.user.name}</h4>
          <p>⭐ {review.rating} / 5</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;export default ReviewList;
