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

const ReviewList = ({ listingId, refresh }: { listingId: string; refresh?: number }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get(`/reviews/${listingId}`);
                setReviews(res.data);
            } catch (error: any) {
                console.error("Error fetching reviews", error);
                setError(error?.response?.data?.message || error?.message || "Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [listingId, refresh]);

    if (loading) return <div>Loading reviews...</div>;

    if (error) return <div className="review-error">{error}</div>;

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
