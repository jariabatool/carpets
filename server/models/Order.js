import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      name: String,
      email: String,
      mobile: String,
      address: String,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Carpet" },
        name: String,
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        price: Number,
        quantity: Number,
        variant: {
          color: String,
          size: String
        }
      }
    ],
    totalAmount: Number,
    deliveryCharges: Number,
    // Enhanced coupon fields
    couponApplied: {
      code: String,
      discountAmount: Number,
      couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
      },
      originalTotal: Number, // Store original total before discount
      discountType: String, // 'percentage' or 'fixed'
      discountValue: Number // The actual discount value (percentage or amount)
    },
    finalAmount: Number,
    paymentMethod: String,
    paid: Boolean,
    status: { type: String, default: "pending" },
    paymentIntentId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);