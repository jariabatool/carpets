import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Carpet from './models/Carpet.js';
import User from './models/User.js'; 
import Order from './models/Order.js';
import Subcategory from './models/Subcategory.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Review from "./models/Review.js";
import Coupon from './models/Coupon.js';
import crypto from 'crypto';
import { sendOrderEmails, 
  sendOrderStatusUpdateEmail, 
  sendSellerApprovalEmail, 
  sendSellerRejectionEmail,  
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail } from './utils/mailjet.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Create HTTP server and Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-seller-room', (sellerId) => {
    socket.join(`seller-${sellerId}`);
    console.log(`Seller ${sellerId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/reviews/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// POST: Add review
app.post("/api/reviews", async (req, res) => {
  try {
    const { carpetId, userId, rating, comment } = req.body;

    if (!carpetId || !userId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = new Review({ carpetId, userId, rating, comment });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Reviews for a carpet
app.get("/api/reviews/:carpetId", async (req, res) => {
  try {
    const reviews = await Review.find({ carpetId: req.params.carpetId })
      .populate("userId", "name email"); // optional populate

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Configure multer for product image uploads
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/products/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const productImageUpload = multer({
  storage: productImageStorage,
  fileFilter: fileFilter, // reuse same image filter
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

//upload

// Add a JWT secret key to your environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Homepage subcategories to preview
const homepageSubcategories = [
  { type: 'carpets', subcategory: 'turkish' },
  { type: 'carpets', subcategory: 'iranian' },
  { type: 'rugs', subcategory: 'handmade' },
  { type: 'rugs', subcategory: 'machine' },
  { type: 'mats', subcategory: 'bathroom' },
];

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Add a middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);
    console.log('Stored password:', user.password);

    // Check if password matches (with backward compatibility)
    let passwordValid = false;
    
    // First check if password is hashed (new users)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      console.log('Checking hashed password');
      passwordValid = await bcrypt.compare(password, user.password);
      console.log('Hashed password match:', passwordValid);
    } else {
      // For existing users with plain text passwords
      console.log('Checking plain text password');
      passwordValid = user.password === password;
      console.log('Plain text password match:', passwordValid);
      
      // If valid, hash their password for future logins
      if (passwordValid) {
        console.log('Hashing password for future logins');
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log('Password hashed and saved');
      }
    }

    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is approved (except for admin)
    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(401).json({ message: 'Your account is pending approval' });
    }

    // Generate JWT token
    const token = generateToken(user);
    
    res.json({ 
      user: { 
        _id: user._id, 
        name: user.name, 
        role: user.role, 
        email: user.email 
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Password reset storage (in production, use Redis or database)
const passwordResetCodes = new Map();

// Generate random 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot password endpoint
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ 
        message: 'If an account with that email exists, a reset code has been sent.' 
      });
    }

    // Generate reset code
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset code (in production, store in database)
    passwordResetCodes.set(email, {
      code: resetCode,
      expiresAt: expiresAt,
      userId: user._id
    });

    console.log(`Password reset code for ${email}: ${resetCode}`);

    // Send reset code via email
    try {
      await sendPasswordResetEmail(email, user.name, resetCode);
      console.log('Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Continue anyway for demo purposes
    }

    res.json({ 
      message: 'If an account with that email exists, a reset code has been sent.',
      // In development, you might want to return the code
      code: process.env.NODE_ENV === 'development' ? resetCode : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Reset password endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Get stored reset code
    const resetData = passwordResetCodes.get(email);
    
    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Check if code matches and is not expired
    if (resetData.code !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (new Date() > resetData.expiresAt) {
      passwordResetCodes.delete(email);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    // Find user
    const user = await User.findById(resetData.userId);
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Remove used reset code
    passwordResetCodes.delete(email);

    // Send confirmation email
    try {
      await sendPasswordResetConfirmationEmail(email, user.name);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Clean up expired reset codes periodically
setInterval(() => {
  const now = new Date();
  for (const [email, data] of passwordResetCodes.entries()) {
    if (now > data.expiresAt) {
      passwordResetCodes.delete(email);
    }
  }
}, 60 * 1000); // Run every minute
// Change password endpoint (requires authentication)
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedPassword;
    await user.save();

    // Send confirmation email
    try {
      await sendPasswordChangeConfirmationEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send password change confirmation:', emailError);
    }

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
// Add this temporary endpoint to reset admin password (remove after use)
app.post('/api/reset-admin-password', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@store.com' });
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin.password = hashedPassword;
    await admin.save();
    
    res.json({ message: 'Admin password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      ...userData,
      password: hashedPassword,
      isApproved: userData.role === 'buyer'
    });
    
    await user.save();
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Admin routes with authentication
app.get('/api/pending-approvals', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Pending approvals error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.patch('/api/approve-user/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
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

    // ✅ SEND APPROVAL EMAIL IF USER IS A SELLER
    if (user.role === 'seller') {
      console.log('📧 Sending seller approval email to:', user.email);
      try {
        await sendSellerApprovalEmail(user.email, user.name, user.companyName);
        console.log('✅ Seller approval email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send approval email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.delete('/api/reject-user/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ SEND REJECTION EMAIL IF USER IS A SELLER
    if (user.role === 'seller') {
      console.log('📧 Sending seller rejection email to:', user.email);
      try {
        await sendSellerRejectionEmail(user.email, user.name, user.companyName);
        console.log('✅ Seller rejection email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send rejection email:', emailError);
        // Don't fail the request if email fails
      }
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
// app.patch('/api/approve-user/:id', authenticateToken, async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
  
//   try {
//     const { id } = req.params;
//     await User.findByIdAndUpdate(id, { isApproved: true });
//     res.status(200).json({ message: 'User approved successfully' });
//   } catch (error) {
//     console.error('Approve user error:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// app.delete('/api/reject-user/:id', authenticateToken, async (req, res) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
  
//   try {
//     const { id } = req.params;
//     await User.findByIdAndDelete(id);
//     res.status(200).json({ message: 'User rejected successfully' });
//   } catch (error) {
//     console.error('Reject user error:', error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// });

// Helper function to deduct inventory
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

// Helper function to restore inventory
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
// Update user profile endpoint
app.put('/api/profile/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fields that can be updated
    const allowedFields = [
      'name', 'email', 'companyName', 'businessEmail', 
      'businessPhone', 'taxId', 'businessAddress'
    ];

    // Filter update data to only include allowed fields
    const filteredUpdate = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdate[field] = updateData[field];
      }
    });

    // Check if email is being changed and if it's already taken
    if (filteredUpdate.email && filteredUpdate.email !== user.email) {
      const existingUser = await User.findOne({ 
        email: filteredUpdate.email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: filteredUpdate },
      { new: true, runValidators: true }
    ).select('-password'); // Don't return password

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ message: 'Something went wrong' });
  }
});
// Product endpoints
app.get('/api/products/preview', async (req, res) => {
  try {
    const previews = {};

    for (const { type, subcategory } of homepageSubcategories) {
      const key = `${type}-${subcategory}`;
      const products = await Carpet.find({ type, subcategory }).limit(3);
      previews[key] = products;
    }

    res.json(previews);
  } catch (err) {
    console.error('Error fetching previews:', err);
    res.status(500).json({ error: 'Failed to fetch previews' });
  }
});

app.get('/api/products', async (req, res) => {
  const { type, subcategory, sellerId } = req.query;

  const filter = {};
  if (type) filter.type = type;
  if (subcategory) filter.subcategory = subcategory;
  if (sellerId) filter.sellerId = sellerId;

  try {
    const results = await Carpet.find(filter);
    res.json(results);
  } catch (err) {
    console.error('Error fetching category products:', err);
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const product = await Carpet.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Carpet not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Failed to fetch carpet:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure multer storage (separate folder so it won’t mix with your other usage)
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/"); // keep product uploads separate
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      subcategory,
      images,
      sellerId,
      variants
    } = req.body;

    const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
    const availableQuantity = totalQuantity;

    const newCarpet = new Carpet({
      name,
      description,
      type,
      subcategory,
      images,
      sellerId,
      variants,
      totalQuantity,
      availableQuantity
    });

    await newCarpet.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newCarpet
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const updatedProduct = await Carpet.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Carpet not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error('Failed to update carpet:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Debug endpoint to check seller's products
app.get('/api/debug/my-products', authenticateToken, async (req, res) => {
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

app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Carpet.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

app.get("/api/all-products", async (req, res) => {
  try {
    const products = await Carpet.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update buyer orders endpoint
app.get('/api/orders', async (req, res) => {
  try {
    const { buyerEmail } = req.query;
    
    if (!buyerEmail) {
      return res.status(400).json({ error: 'Buyer email is required' });
    }

    const orders = await Order.find({ 'buyer.email': buyerEmail })
      .populate('products.productId')
      .populate('couponApplied.couponId') // Add this line
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update seller orders endpoint
// In your backend routes
app.get('/api/seller/orders', async (req, res) => {
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
});

// app.get('/api/orders', async (req, res) => {
//   try {
//     const { buyerEmail } = req.query;
    
//     if (!buyerEmail) {
//       return res.status(400).json({ error: 'Buyer email is required' });
//     }

//     const orders = await Order.find({ 'buyer.email': buyerEmail })
//       .populate('products.productId')
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching orders:', err);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });
// app.get('/api/seller/orders', async (req, res) => {
//   try {
//     const { sellerId } = req.query;
    
//     if (!sellerId) {
//       return res.status(400).json({ error: 'Seller ID is required' });
//     }

//     // Check MongoDB connection first
//     if (mongoose.connection.readyState !== 1) {
//       return res.status(503).json({ 
//         error: 'Database connection unavailable',
//         message: 'Unable to fetch orders at this time. Please try again later.'
//       });
//     }

//     console.log('🔍 Fetching orders for seller:', sellerId);
    
//     const orders = await Order.find({ 'products.sellerId': sellerId })
//       .populate('products.productId')
//       .sort({ createdAt: -1 })
//       .maxTimeMS(30000); // 30 second timeout

//     console.log(`✅ Found ${orders.length} orders for seller ${sellerId}`);
//     res.json(orders);
//   } catch (err) {
//     console.error('❌ Error fetching seller orders:', err.message);
    
//     if (err.name === 'MongooseError' && err.message.includes('buffering timed out')) {
//       return res.status(503).json({ 
//         error: 'Database timeout',
//         message: 'Request took too long. Please try again.' 
//       });
//     }
    
//     res.status(500).json({ 
//       error: 'Failed to fetch orders',
//       message: 'Please check your connection and try again.' 
//     });
//   }
// });
// app.get('/api/seller/orders', async (req, res) => {
//   try {
//     const { sellerId } = req.query;
    
//     if (!sellerId) {
//       return res.status(400).json({ error: 'Seller ID is required' });
//     }

//     const orders = await Order.find({ 'products.sellerId': sellerId })
//       .populate('products.productId')
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (err) {
//     console.error('Error fetching seller orders:', err);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });
// Updated order status endpoint with email notifications
app.put('/api/orders/:id/status', async (req, res) => {
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
});
// Test endpoint for status update emails
app.post('/api/debug/test-status-email', async (req, res) => {
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
app.post('/api/debug/test-seller-approval-email', async (req, res) => {
  try {
    console.log('🧪 Testing seller approval email...');
    
    const testEmail = req.body.email || 'test-seller@example.com'; // Change to real email for testing
    
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
app.post('/api/debug/test-seller-rejection-email', async (req, res) => {
  try {
    console.log('🧪 Testing seller rejection email...');
    
    const testEmail = req.body.email || 'test-seller@example.com'; // Change to real email for testing
    
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
// app.put('/api/orders/:id/status', async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       await session.abortTransaction();
//       return res.status(400).json({ error: 'Invalid order ID' });
//     }

//     const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       await session.abortTransaction();
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     const currentOrder = await Order.findById(id).session(session).populate('products.productId');
//     if (!currentOrder) {
//       await session.abortTransaction();
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const previousStatus = currentOrder.status;

//     if (previousStatus !== status) {
//       if (status === 'cancelled') {
//         if (currentOrder.paid || previousStatus !== 'pending') {
//           await restoreInventory(currentOrder.products);
//         }
//       } else if (previousStatus === 'cancelled' && status !== 'cancelled') {
//         await deductInventory(currentOrder.products);
//       } else if (previousStatus === 'pending' && status !== 'pending' && status !== 'cancelled') {
//         await deductInventory(currentOrder.products);
//       } else if (previousStatus !== 'pending' && previousStatus !== 'cancelled' && status === 'pending') {
//         await restoreInventory(currentOrder.products);
//       }
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true, session }
//     ).populate('products.productId');

//     await session.commitTransaction();
//     res.json(updatedOrder);
//   } catch (err) {
//     await session.abortTransaction();
//     console.error('Error updating order status:', err);
//     res.status(500).json({ error: 'Failed to update order status' });
//   } finally {
//     session.endSession();
//   }
// });
// GET: Seller's own products (for logged-in seller)
app.get('/api/my-products', authenticateToken, async (req, res) => {
  try {
    // Only sellers can access their own products
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Access denied. Seller role required.' });
    }
    
    const sellerId = req.user.id;
    
    console.log('🛒 Fetching products for seller:', sellerId);
    
    // Try multiple query formats to handle different sellerId formats
    let products = await Carpet.find({ sellerId: sellerId });
    
    // If no products found, try with ObjectId conversion
    if (products.length === 0 && mongoose.Types.ObjectId.isValid(sellerId)) {
      products = await Carpet.find({ sellerId: new mongoose.Types.ObjectId(sellerId) });
      console.log('🔄 Tried ObjectId conversion, found:', products.length);
    }
    
    // If still no products, try string comparison
    if (products.length === 0) {
      const allProducts = await Carpet.find({});
      products = allProducts.filter(product => 
        product.sellerId && product.sellerId.toString() === sellerId
      );
      console.log('🔄 Tried string comparison, found:', products.length);
    }
    
    console.log('📦 Final products found:', products.length);
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.post('/api/orders/:id/confirm-payment', async (req, res) => {
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
});

// Get buyer details (admin only)
app.get('/api/admin/buyers/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const buyer = await User.findById(req.params.id);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    res.status(200).json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get buyer's orders (admin only)
app.get('/api/admin/buyers/:id/orders', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const orders = await Order.find({ 'buyer._id': req.params.id })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
// backend/routes/products.js or wherever you handle products
// backend route: get products by seller
app.get('/api/sellers/:id/products', async (req, res) => {
  try {
    // explicitly cast id to string
    const products = await Carpet.find({ sellerId: req.params.id });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// Seller endpoints
app.get('/api/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller', isApproved: true })
      .select('name email companyName businessAddress');
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
app.get('/api/sellers/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id)
      .select('name email companyName businessAddress role');
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // ✅ Don’t block if role !== 'seller'
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Create coupon
app.post('/api/coupons', authenticateToken, async (req, res) => {
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
});

// Validate coupon
// Validate coupon - FIXED VERSION
app.post('/api/coupons/validate', authenticateToken, async (req, res) => {
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

    // Check per-user usage limit - FIXED VERSION
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
});
// Cleanup function for corrupted coupon data
app.post('/api/coupons/cleanup', authenticateToken, async (req, res) => {
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
});
// Get seller coupons
app.get('/api/seller/coupons', authenticateToken, async (req, res) => {
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
});

// Delete coupon
app.delete('/api/coupons/:id', authenticateToken, async (req, res) => {
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
});
// Create new order
app.post('/api/orders', async (req, res) => {
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
    if (io) {
      io.emit('new-order', populatedOrder);
      
      // Also emit to specific seller rooms
      const uniqueSellerIds = [...new Set(populatedOrder.products.map(p => p.sellerId))];
      uniqueSellerIds.forEach(sellerId => {
        io.to(sellerId.toString()).emit('new-order', populatedOrder);
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
});

// Admin-specific endpoints
app.get('/api/admin/sellers', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const sellers = await User.find({ role: 'seller' });
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/api/admin/buyers', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const buyers = await User.find({ role: 'buyer' });
    res.status(200).json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/api/admin/sellers/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
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
});

app.get('/api/admin/sellers/:id/products', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const products = await Carpet.find({ sellerId: req.params.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/api/admin/sellers/:id/orders', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    const orders = await Order.find({ 'products.sellerId': req.params.id })
      .populate('products.productId');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.put('/api/admin/sellers/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
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
});

app.delete('/api/admin/sellers/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
  try {
    await User.findByIdAndDelete(req.params.id);
    await Carpet.deleteMany({ sellerId: req.params.id });
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.patch('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  
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
});

// Other endpoints
app.get('/api/carpet-meta', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true })
      .select('name -_id')
      .sort({ name: 1 });
    
    const subcategoryNames = subcategories.map(sc => sc.name);
    const types = await Carpet.distinct('type');
    
    res.json({
      types: types.filter(t => t),
      subcategories: subcategoryNames
    });
  } catch (err) {
    console.error('Error fetching carpet meta:', err);
    res.status(500).json({ error: 'Failed to fetch metadata' });
  }
});

app.get('/api/filter-meta', async (req, res) => {
  const { subcategory } = req.query;

  try {
    const match = { subcategory };
    
    const colors = await Carpet.aggregate([
      { $match: match },
      { $unwind: '$variants' },
      { $group: { _id: '$variants.color' } },
      { $sort: { _id: 1 } }
    ]);
    
    const sizes = await Carpet.aggregate([
      { $match: match },
      { $unwind: '$variants' },
      { $group: { _id: '$variants.size' } },
      { $sort: { _id: 1 } }
    ]);

    const priceRange = await Carpet.aggregate([
      { $match: match },
      { $unwind: '$variants' },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$variants.price' },
          maxPrice: { $max: '$variants.price' }
        }
      }
    ]);

    res.json({
      colors: colors.map(c => c._id).filter(c => c),
      sizes: sizes.map(s => s._id).filter(s => s),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
    });
  } catch (err) {
    console.error('Error fetching filter meta:', err);
    res.status(500).json({ error: 'Failed to fetch filter metadata' });
  }
});

app.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

app.get('/api/subcategory/:name', async (req, res) => {
  try {
    const subcategory = await Subcategory.findOne({ 
      name: req.params.name,
      isActive: true 
    });
    
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategory' });
  }
});

app.get('/api/products/subcategory/:name', async (req, res) => {
  try {
    const products = await Carpet.find({ 
      subcategory: req.params.name 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


// In your server code (e.g., /api/create-payment-intent)
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51RzdFt3B6rjlGaEZFAS8rTqeS6DkejQEYXLLF6tZZDdC0W2wQC2nxyJLIGt6scbS0NLPuzHc0HnLLFTBJrx0ZwdM006jWSgvFo');

// Your endpoint handler
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, buyer } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_name: buyer.name,
        customer_email: buyer.email
      }
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(400).send({
      error: error.message
    });
  }
});

// Start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    server.listen(PORT, () =>
      console.log(`🚀 Server running without DB on http://localhost:${PORT}`)
    );
  });

export default app;