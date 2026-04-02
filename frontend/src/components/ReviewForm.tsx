import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ReviewForm = ({ listingId, onReviewAdded }: { listingId: string; onReviewAdded?: () => void }) => {

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`/reviews`, {
        listingId,
        rating,
        comment,
      });

      setComment("");

      if (onReviewAdded) {
        onReviewAdded();
      }

      alert("Review added!");

    } catch (error: any) {
      console.error("Error adding review", error?.response?.data || error);
      const errorMessage = error?.response?.data?.message || error?.message || "Error adding review";
      alert(`Error adding review: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">

      <h3>Add Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={5}>5 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={1}>1 ⭐</option>
      </select>

      <textarea className="review-box"
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit">Submit Review</button>

    </form>
  );
};

export default ReviewForm;