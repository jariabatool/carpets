// controllers/orderController.js
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Carpet from '../models/Carpet.js';
import { sendOrderEmails, sendOrderStatusUpdateEmail } from '../utils/mailjet.js';

// Helper functions for inventory management
async function deductInventory(products) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    for (const item of products) {
      const product = await Carpet.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const variant = product.variants.find(v => 
        v.color === item.variant?.color && v.size === item.variant?.size
      );
      
      if (!variant) {
        throw new Error(`Variant not found for product ${product.name}`);
      }

      if (variant.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for ${product.name}, variant ${item.variant?.color}/${item.variant?.size}`);
      }

      variant.quantity -= item.quantity;
      product.availableQuantity -= item.quantity;
      
      await product.save({ session });
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Inventory deduction failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

async function restoreInventory(products) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    for (const item of products) {
      const product = await Carpet.findById(item.productId).session(session);
      if (product) {
        const variant = product.variants.find(v => 
          v.color === item.variant?.color && v.size === item.variant?.size
        );
        
        if (variant) {
          variant.quantity += item.quantity;
          product.availableQuantity += item.quantity;
          await product.save({ session });
        }
      }
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    console.error('Inventory restoration failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Create the order
    const order = new Order(orderData);
    await order.save();
    
    // Populate the order for email sending
    const populatedOrder = await Order.findById(order._id)
      .populate('products.productId')
      .populate('couponApplied.couponId');

    console.log('📦 Order created successfully:', order._id);
    
    // Send emails to customer and sellers
    try {
      const emailResult = await sendOrderEmails(populatedOrder);
      console.log('✅ Email sending result:', emailResult);
    } catch (emailError) {
      console.error('❌ Email sending failed, but order was created:', emailError);
      // Don't fail the order creation if emails fail
    }

    // Emit socket event for real-time notifications
    if (req.io) {
      req.io.emit('new-order', populatedOrder);
      
      // Also emit to specific seller rooms
      const uniqueSellerIds = [...new Set(populatedOrder.products.map(p => p.sellerId))];
      uniqueSellerIds.forEach(sellerId => {
        req.io.to(sellerId.toString()).emit('new-order', populatedOrder);
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { buyerEmail } = req.query;
    
    if (!buyerEmail) {
      return res.status(400).json({ error: 'Buyer email is required' });
    }

    const orders = await Order.find({ 'buyer.email': buyerEmail })
      .populate('products.productId')
      .populate('couponApplied.couponId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    const orders = await Order.find({ 'products.sellerId': sellerId })
      .populate('products.productId')
      .populate('couponApplied.couponId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid status' });
    }

    const currentOrder = await Order.findById(id).session(session).populate('products.productId');
    if (!currentOrder) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Order not found' });
    }

    const previousStatus = currentOrder.status;

    // Don't send email if status hasn't changed
    if (previousStatus === status) {
      await session.abortTransaction();
      return res.json(currentOrder);
    }

    // Handle inventory changes
    if (previousStatus !== status) {
      if (status === 'cancelled') {
        if (currentOrder.paid || previousStatus !== 'pending') {
          await restoreInventory(currentOrder.products);
        }
      } else if (previousStatus === 'cancelled' && status !== 'cancelled') {
        await deductInventory(currentOrder.products);
      } else if (previousStatus === 'pending' && status !== 'pending' && status !== 'cancelled') {
        await deductInventory(currentOrder.products);
      } else if (previousStatus !== 'pending' && previousStatus !== 'cancelled' && status === 'pending') {
        await restoreInventory(currentOrder.products);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true, session }
    ).populate('products.productId');

    // ✅ SEND STATUS UPDATE EMAIL TO BUYER
    console.log('📧 Sending status update email for order:', id);
    console.log('📧 Status change:', previousStatus, '→', status);
    
    try {
      await sendOrderStatusUpdateEmail(
        updatedOrder,
        updatedOrder.buyer.email,
        updatedOrder.buyer.name,
        previousStatus,
        status
      );
      console.log('✅ Status update email sent successfully to buyer');
    } catch (emailError) {
      console.error('❌ Failed to send status update email:', emailError);
      // Don't fail the entire request if email fails
    }

    await session.commitTransaction();
    res.json(updatedOrder);
  } catch (err) {
    await session.abortTransaction();
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  } finally {
    session.endSession();
  }
};

export const confirmPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(id).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'pending' && !order.paid) {
      await deductInventory(order.products);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paid: true },
      { new: true, runValidators: true, session }
    ).populate('products.productId');

    await session.commitTransaction();
    res.json(updatedOrder);
  } catch (err) {
    await session.abortTransaction();
    console.error('Error confirming payment:', err);
    res.status(500).json({ error: 'Failed to confirm payment' });
  } finally {
    session.endSession();
  }
};