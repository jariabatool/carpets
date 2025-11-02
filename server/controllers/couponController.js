// controllers/couponController.js
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

export const createCoupon = async (req, res) => {
  try {
    const couponData = {
      ...req.body,
      createdBy: req.user.id,
      code: req.body.code.toUpperCase().trim()
    };

    const coupon = new Coupon(couponData);
    await coupon.save();

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Failed to create coupon' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, productIds, sellerIds } = req.body;
    const userId = req.user.id;

    console.log('🔍 Validating coupon:', { code, cartTotal, userId });

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      console.log('❌ Coupon not found or inactive');
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Check validity dates
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      console.log('❌ Coupon expired');
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check usage limits
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      console.log('❌ Coupon usage limit reached');
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check per-user usage limit
    const userUsage = coupon.usedBy.filter(usage => 
      usage.userId && usage.userId.toString() === userId
    ).length;
    
    if (userUsage >= coupon.usageLimitPerUser) {
      console.log('❌ User has already used this coupon');
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    // Check minimum order value
    if (cartTotal < coupon.minOrderValue) {
      console.log('❌ Minimum order value not met');
      return res.status(400).json({ 
        message: `Minimum order value of $${coupon.minOrderValue} required` 
      });
    }

    // Check user eligibility
    if (coupon.userEligibility === 'new_users') {
      const userOrders = await Order.countDocuments({ 'buyer.email': req.user.email });
      if (userOrders > 0) {
        console.log('❌ Coupon only for new users');
        return res.status(400).json({ message: 'Coupon only for new users' });
      }
    } else if (coupon.userEligibility === 'existing_users') {
      const userOrders = await Order.countDocuments({ 'buyer.email': req.user.email });
      if (userOrders === 0) {
        console.log('❌ Coupon only for existing users');
        return res.status(400).json({ message: 'Coupon only for existing users' });
      }
    } else if (coupon.userEligibility === 'min_orders') {
      const userOrders = await Order.countDocuments({ 'buyer.email': req.user.email });
      if (userOrders < coupon.minOrdersRequired) {
        console.log('❌ Minimum orders requirement not met');
        return res.status(400).json({ 
          message: `Minimum ${coupon.minOrdersRequired} orders required` 
        });
      }
    }

    // Check product applicability
    if (coupon.applicableTo === 'seller_products' && coupon.sellerId) {
      const hasSellerProducts = sellerIds.some(sellerId => 
        sellerId.toString() === coupon.sellerId.toString()
      );
      if (!hasSellerProducts) {
        console.log('❌ Coupon not applicable to seller products in cart');
        return res.status(400).json({ message: 'Coupon not applicable to products in cart' });
      }
    } else if (coupon.applicableTo === 'specific_products' && coupon.productIds.length > 0) {
      const hasApplicableProducts = productIds.some(productId =>
        coupon.productIds.some(couponProductId => 
          couponProductId.toString() === productId.toString()
        )
      );
      if (!hasApplicableProducts) {
        console.log('❌ Coupon not applicable to specific products in cart');
        return res.status(400).json({ message: 'Coupon not applicable to products in cart' });
      }
    }

    console.log('✅ Coupon validated successfully');
    res.json({ 
      message: 'Coupon applied successfully',
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderValue: coupon.minOrderValue
      }
    });

  } catch (error) {
    console.error('❌ Validate coupon error:', error);
    res.status(500).json({ message: 'Failed to validate coupon' });
  }
};

export const getSellerCoupons = async (req, res) => {
  try {
    const { sellerId } = req.query;
    
    const coupons = await Coupon.find({ 
      $or: [
        { sellerId: sellerId },
        { createdBy: sellerId }
      ]
    }).sort({ createdAt: -1 });

    res.json(coupons);
  } catch (error) {
    console.error('Get seller coupons error:', error);
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if user owns the coupon
    if (coupon.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this coupon' });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Failed to delete coupon' });
  }
};

export const cleanupCoupons = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const coupons = await Coupon.find({});
    let cleanedCount = 0;

    for (const coupon of coupons) {
      let needsUpdate = false;
      
      // Remove null entries from usedBy array
      const validUsedBy = coupon.usedBy.filter(usage => usage.userId !== null);
      
      if (validUsedBy.length !== coupon.usedBy.length) {
        coupon.usedBy = validUsedBy;
        coupon.usedCount = validUsedBy.length;
        needsUpdate = true;
        cleanedCount++;
      }

      if (needsUpdate) {
        await coupon.save();
      }
    }

    res.json({ 
      message: `Cleaned up ${cleanedCount} coupons`,
      cleanedCount 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Cleanup failed' });
  }
};