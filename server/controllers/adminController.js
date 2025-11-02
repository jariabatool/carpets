// controllers/adminController.js
import User from '../models/User.js';
import Carpet from '../models/Carpet.js';
import Order from '../models/Order.js';
import { sendSellerApprovalEmail, sendSellerRejectionEmail } from '../utils/mailjet.js';

export const getPendingApprovals = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Pending approvals error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id, 
      { isApproved: true },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'seller') {
      console.log('📧 Sending seller approval email to:', user.email);
      try {
        await sendSellerApprovalEmail(user.email, user.name, user.companyName);
        console.log('✅ Seller approval email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send approval email:', emailError);
      }
    }

    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'seller') {
      console.log('📧 Sending seller rejection email to:', user.email);
      try {
        await sendSellerRejectionEmail(user.email, user.name, user.companyName);
        console.log('✅ Seller rejection email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send rejection email:', emailError);
      }
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' });
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ role: 'buyer' });
    res.status(200).json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSellerById = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Carpet.find({ sellerId: req.params.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'products.sellerId': req.params.id })
      .populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateSeller = async (req, res) => {
  try {
    const { name, email, companyName, businessAddress, taxId, businessPhone, businessEmail, isApproved } = req.body;
    
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const updatedSeller = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        companyName,
        businessAddress,
        taxId,
        businessPhone,
        businessEmail,
        isApproved
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedSeller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    res.status(200).json(updatedSeller);
  } catch (error) {
    console.error('Error updating seller:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Carpet.deleteMany({ sellerId: req.params.id });
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getBuyerById = async (req, res) => {
  try {
    const buyer = await User.findById(req.params.id);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.status(200).json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'buyer._id': req.params.id })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};