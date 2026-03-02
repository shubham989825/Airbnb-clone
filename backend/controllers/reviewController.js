import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment, listingId } = req.body;
    const review = new Review({
      user: req.user._id,
      listing: listingId,
      rating,
      comment,
    });
    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
