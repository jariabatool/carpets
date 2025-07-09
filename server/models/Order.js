// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   buyer: {
//     name: String,
//     email: String,
//     mobile: String,
//     address: String,
//   },
//   products: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Carpet" },
//       name: String,
//       sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       price: Number,
//       quantity: Number,
//     }
//   ],
//   totalAmount: Number,
//   deliveryCharges: Number,
//   paymentMethod: String,
//   paid: Boolean,
//   status: { type: String, default: "pending" }
// }, { timestamps: true });

// export default mongoose.model("Order", orderSchema);
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
    paymentMethod: String,
    paid: Boolean,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
