// controllers/productController.js
import mongoose from 'mongoose';
import Carpet from '../models/Carpet.js';
import Subcategory from '../models/Subcategory.js';

const homepageSubcategories = [
  { type: 'carpets', subcategory: 'turkish' },
  { type: 'carpets', subcategory: 'iranian' },
  { type: 'rugs', subcategory: 'handmade' },
  { type: 'rugs', subcategory: 'machine' },
  { type: 'mats', subcategory: 'bathroom' },
];

export const getProductPreviews = async (req, res) => {
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
};

export const getProducts = async (req, res) => {
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
};

export const getProductById = async (req, res) => {
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
};

export const createProduct = async (req, res) => {
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
};

export const updateProduct = async (req, res) => {
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
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Carpet.findByIdAndDelete(id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Carpet.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    
    console.log('🛒 Fetching products for seller:', sellerId);
    
    let products = await Carpet.find({ sellerId: sellerId });
    
    if (products.length === 0 && mongoose.Types.ObjectId.isValid(sellerId)) {
      products = await Carpet.find({ sellerId: new mongoose.Types.ObjectId(sellerId) });
      console.log('🔄 Tried ObjectId conversion, found:', products.length);
    }
    
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
};

export const getCarpetMeta = async (req, res) => {
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
};

export const getFilterMeta = async (req, res) => {
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
};

export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

export const getSubcategoryByName = async (req, res) => {
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
};

export const getProductsBySubcategory = async (req, res) => {
  try {
    const products = await Carpet.find({ 
      subcategory: req.params.name 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};