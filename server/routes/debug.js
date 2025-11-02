// routes/debug.js
import express from 'express';
import Carpet from '../models/Carpet.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  sendOrderStatusUpdateEmail, 
  sendSellerApprovalEmail, 
  sendSellerRejectionEmail 
} from '../utils/mailjet.js';
import Order from '../models/Order.js';

const router = express.Router();

// Debug endpoint to check seller's products
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Debug - User from token:', req.user);
    console.log('🔍 Debug - Seller ID:', req.user.id);
    
    const sellerId = req.user.id;
    
    // Try different query formats
    const products1 = await Carpet.find({ sellerId: sellerId });
    const products2 = await Carpet.find({ sellerId: new mongoose.Types.ObjectId(sellerId) });
    const products3 = await Carpet.find({}); // All products for debugging
    
    console.log('🔍 Products with string sellerId:', products1.length);
    console.log('🔍 Products with ObjectId sellerId:', products2.length);
    console.log('🔍 All products in database:', products3.length);
    
    // Log a few products to see their structure
    if (products3.length > 0) {
      console.log('🔍 Sample product structure:', {
        _id: products3[0]._id,
        name: products3[0].name,
        sellerId: products3[0].sellerId,
        sellerIdType: typeof products3[0].sellerId
      });
    }
    
    res.json({
      user: req.user,
      query1_count: products1.length,
      query2_count: products2.length,
      total_products: products3.length,
      sample_product: products3.length > 0 ? {
        _id: products3[0]._id,
        name: products3[0].name,
        sellerId: products3[0].sellerId,
        sellerIdType: typeof products3[0].sellerId
      } : null
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
});

// Debug endpoint for seller lookup
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log('🔍 Debug seller lookup for:', sellerId);
    
    const seller = await User.findById(sellerId);
    
    if (!seller) {
      return res.status(404).json({ 
        error: 'Seller not found',
        sellerId: sellerId
      });
    }
    
    res.json({
      success: true,
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        isApproved: seller.isApproved,
        businessEmail: seller.businessEmail,
        companyName: seller.companyName
      },
      sellerId: sellerId
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for status update emails
router.post('/test-status-email', async (req, res) => {
  try {
    console.log('🧪 Testing status update email functionality...');
    
    // Get a real order from database for testing
    const realOrder = await Order.findOne().populate('products.productId');
    
    if (!realOrder) {
      return res.status(404).json({ 
        success: false, 
        error: 'No orders found in database' 
      });
    }

    const testStatuses = ['processing', 'shipped', 'delivered'];
    
    const testResults = [];
    
    for (const newStatus of testStatuses) {
      try {
        console.log(`📧 Testing status update to: ${newStatus}`);
        
        await sendOrderStatusUpdateEmail(
          realOrder,
          realOrder.buyer.email,
          realOrder.buyer.name,
          realOrder.status,
          newStatus
        );
        
        testResults.push({
          from: realOrder.status,
          to: newStatus,
          status: '✅ SUCCESS',
          buyer: realOrder.buyer.email
        });
        
        console.log(`✅ Status update email sent for ${newStatus}`);
        
      } catch (error) {
        testResults.push({
          from: realOrder.status,
          to: newStatus,
          status: '❌ FAILED',
          error: error.message
        });
        
        console.log(`❌ Failed to send status email for ${newStatus}:`, error.message);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Status email test completed',
      results: testResults,
      order: {
        id: realOrder._id,
        buyer: realOrder.buyer.email,
        currentStatus: realOrder.status
      }
    });
    
  } catch (error) {
    console.error('❌ Status email test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test endpoint for seller approval emails
router.post('/test-seller-approval-email', async (req, res) => {
  try {
    console.log('🧪 Testing seller approval email...');
    
    const testEmail = req.body.email || 'test-seller@example.com';
    
    await sendSellerApprovalEmail(testEmail, 'Test Seller', 'Test Company');
    
    res.json({ 
      success: true, 
      message: 'Seller approval email sent successfully',
      recipient: testEmail
    });
  } catch (error) {
    console.error('❌ Seller approval email test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test endpoint for seller rejection emails
router.post('/test-seller-rejection-email', async (req, res) => {
  try {
    console.log('🧪 Testing seller rejection email...');
    
    const testEmail = req.body.email || 'test-seller@example.com';
    
    await sendSellerRejectionEmail(testEmail, 'Test Seller', 'Test Company');
    
    res.json({ 
      success: true, 
      message: 'Seller rejection email sent successfully',
      recipient: testEmail
    });
  } catch (error) {
    console.error('❌ Seller rejection email test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;