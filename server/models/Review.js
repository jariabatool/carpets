import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  carpetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carpet",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
