// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail } from '../utils/mailjet.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const passwordResetCodes = new Map();

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

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user.email);

    // Check if password matches (with backward compatibility)
    let passwordValid = false;
    
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      console.log('Checking hashed password');
      passwordValid = await bcrypt.compare(password, user.password);
      console.log('Hashed password match:', passwordValid);
    } else {
      console.log('Checking plain text password');
      passwordValid = user.password === password;
      console.log('Plain text password match:', passwordValid);
      
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

    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(401).json({ message: 'Your account is pending approval' });
    }

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
};

export const register = async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
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
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ 
        message: 'If an account with that email exists, a reset code has been sent.' 
      });
    }

    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    passwordResetCodes.set(email, {
      code: resetCode,
      expiresAt: expiresAt,
      userId: user._id
    });

    console.log(`Password reset code for ${email}: ${resetCode}`);

    try {
      await sendPasswordResetEmail(email, user.name, resetCode);
      console.log('Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({ 
      message: 'If an account with that email exists, a reset code has been sent.',
      code: process.env.NODE_ENV === 'development' ? resetCode : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const resetData = passwordResetCodes.get(email);
    
    if (!resetData) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    if (resetData.code !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (new Date() > resetData.expiresAt) {
      passwordResetCodes.delete(email);
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    const user = await User.findById(resetData.userId);
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    passwordResetCodes.delete(email);

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
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Clean up expired reset codes periodically
setInterval(() => {
  const now = new Date();
  for (const [email, data] of passwordResetCodes.entries()) {
    if (now > data.expiresAt) {
      passwordResetCodes.delete(email);
    }
  }
}, 60 * 1000);