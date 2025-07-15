import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  quantity: Number
}, { _id: false });

const carpetSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  variants: [variantSchema], // ✅ Embedded variant array
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Carpet", carpetSchema);
