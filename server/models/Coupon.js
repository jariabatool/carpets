import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0
    },
    applicableTo: {
      type: String,
      enum: ['all_products', 'specific_products', 'seller_products'],
      default: 'all_products'
    },
    productIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carpet"
    }],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    maxUses: {
      type: Number,
      default: null
    },
    usedCount: {
      type: Number,
      default: 0
    },
    usageLimitPerUser: {
      type: Number,
      default: 1
    },
    minOrderValue: {
      type: Number,
      default: 0
    },
    userEligibility: {
      type: String,
      enum: ['all_users', 'new_users', 'existing_users', 'min_orders'],
      default: 'all_users'
    },
    minOrdersRequired: {
      type: Number,
      default: 0
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    usedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Make userId required
      },
      usedAt: {
        type: Date,
        default: Date.now
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true // Make orderId required
      }
    }]
  },
  { timestamps: true }
);

// Pre-save middleware to clean up usedBy array
couponSchema.pre('save', function(next) {
  // Remove any entries with null userId or orderId
  this.usedBy = this.usedBy.filter(usage => 
    usage.userId && usage.orderId
  );
  // Update usedCount to match cleaned array
  this.usedCount = this.usedBy.length;
  next();
});

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ sellerId: 1 });
couponSchema.index({ validUntil: 1 });
couponSchema.index({ isActive: 1 });

export default mongoose.model("Coupon", couponSchema);