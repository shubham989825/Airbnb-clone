import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment, listingId } = req.body;

    // 🔍 Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user._id,
      listing: listingId,
    });

    // ✏️ UPDATE if exists
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;

      const updatedReview = await existingReview.save();

      return res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    }

    // 🆕 CREATE if not exists
    const review = new Review({
      user: req.user._id,
      listing: listingId,
      rating,
      comment,
    });

    const createdReview = await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review: createdReview,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

export const getReviewsByListing = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId })
      .populate("user", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("listing", "title city")
      .populate("user", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
