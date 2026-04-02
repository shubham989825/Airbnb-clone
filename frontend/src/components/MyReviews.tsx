import { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  listing: {
    title: string;
  };
}

const MyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          "http://localhost:5000/api/reviews/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReviews(data);
        console.log(reviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    fetchMyReviews();
  }, []);

  return (
   <div>
  <h2>My Reviews</h2>

  {reviews.length === 0 ? (
    <p>No reviews yet</p>
  ) : (
    reviews.map((review) => (
      <div key={review._id}>
        <h3>{review.listing?.title || "No Title"}</h3>
        <p>⭐ {review.rating ?? "No Rating"}</p>
        <p>{review.comment || "No Comment"}</p>
      </div>
    ))
  )}
</div>
  );
};

export default MyReviews;