// import mongoose from 'mongoose';

// const carpetSchema = new mongoose.Schema({
//   name: String,
//   images: [String],              // multiple image URLs
//   type: String,                  // carpets, rugs, mats
//   subcategory: String,           // turkish, iranian, handmade, etc.
//   description: String,
//   price: Number,
//   sellerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   totalQuantity: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   availableQuantity: {
//     type: Number,
//     required: true,
//     default: 0
//   }
// });

// export default mongoose.model('Carpet', carpetSchema);
// server/models/Carpet.js
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
