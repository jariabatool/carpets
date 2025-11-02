// controllers/reviewController.js
import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { carpetId, userId, rating, comment } = req.body;

    if (!carpetId || !userId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = new Review({ carpetId, userId, rating, comment });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReviewsByCarpet = async (req, res) => {
  try {
    const reviews = await Review.find({ carpetId: req.params.carpetId })
      .populate("userId", "name email");

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};