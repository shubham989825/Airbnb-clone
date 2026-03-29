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

const ReviewList = ({ listingId }: { listingId: string }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosInstance.get(`/reviews/${listingId}`);
                setReviews(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [listingId]);

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="review-list">
            {reviews.length === 0 ? (
                <p>No reviews yet</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review-item">
                        <h4>{review.user.name}</h4>
                        <div className="rating">
                            {"⭐".repeat(review.rating)}
                        </div>
                        <p>{review.comment}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;
