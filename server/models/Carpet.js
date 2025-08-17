import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const carpetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  type: { type: String, required: true }, // e.g., "carpets"
  subcategory: { type: String, required: true }, // e.g., "iranian"
  images: { type: [String], required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  variants: { type: [variantSchema], required: true },
  totalQuantity: { type: Number, default: 0 },
  availableQuantity: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Carpet", carpetSchema);

