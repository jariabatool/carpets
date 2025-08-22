import mongoose from 'mongoose';

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Create index for better performance
SubcategorySchema.index({ name: 1 });
SubcategorySchema.index({ isActive: 1 });

export default mongoose.model('Subcategory', SubcategorySchema);