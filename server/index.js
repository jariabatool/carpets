import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Carpet from './models/Carpet.js';
import User from './models/User.js'; 
import Order from './models/Order.js';
// import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Homepage subcategories to preview
const homepageSubcategories = [
  { type: 'carpets', subcategory: 'turkish' },
  { type: 'carpets', subcategory: 'iranian' },
  { type: 'rugs', subcategory: 'handmade' },
  { type: 'rugs', subcategory: 'machine' },
  { type: 'mats', subcategory: 'bathroom' },
];
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Optional: hash comparison if you stored hashed passwords
    // const match = await bcrypt.compare(password, user.password);
    // if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Endpoint: Homepage previews
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

// Endpoint: All products by type/subcategory (and optional seller)
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

// GET a single product by ID
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

// POST create a new order
app.post("/api/orders", async (req, res) => {
  try {
    const {
      buyer,
      products,
      totalAmount,
      deliveryCharges,
      paymentMethod
    } = req.body;

    // Add default fallback
    const paid = paymentMethod === 'online';

    // Optional: validate each product entry
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Products are required" });
    }

    const order = new Order({
      buyer,
      products, // includes productId, name, sellerId, price, quantity, variant
      totalAmount,
      deliveryCharges,
      paymentMethod,
      paid,
      status: "pending"
    });

    await order.save();

    res.status(201).json({ message: "Order saved successfully", order });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to save order" });
  }
});

// Add Product Endpoint
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

    // calculate totalQuantity and availableQuantity from variants
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
    res.status(500).json({ error: "Internal server error" });
  }
});
// Update product by ID 
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const updatedProduct = await Carpet.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Carpet not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Failed to update carpet:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/api/products", async (req, res) => {
//   try {
//     const { name, description, images, variants, sellerId } = req.body;

//     if (!sellerId) return res.status(400).json({ error: "Missing seller ID" });

//     const newProduct = new Carpet({
//       name,
//       description,
//       images,
//       variants,
//       sellerId
//     });

//     await newProduct.save();

//     res.status(201).json({ success: true, product: newProduct });
//   } catch (err) {
//     console.error("Add product error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });
// Available filter options for a given category/subcategory
app.get("/api/filter-meta", async (req, res) => {
  const { type, subcategory } = req.query;

  try {
    const match = {};
    if (type) match.type = type;
    if (subcategory) match.subcategory = subcategory;

    const colors = await Carpet.distinct("variants.color", match);
    const sizes = await Carpet.distinct("variants.size", match);

    // Price range (min & max across variants)
    const prices = await Carpet.aggregate([
      { $match: match },
      { $unwind: "$variants" },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$variants.price" },
          maxPrice: { $max: "$variants.price" }
        }
      }
    ]);

    res.json({
      colors,
      sizes,
      priceRange: prices[0] || { minPrice: 0, maxPrice: 0 }
    });
  } catch (err) {
    console.error("Error fetching filter meta:", err);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
});

// app.get('/api/carpet-meta', async (req, res) => {
//   try {
//     const types = await Carpet.distinct('type');
//     const subcategories = await Carpet.distinct('subcategory');
//     res.json({ types, subcategories });
//   } catch (err) {
//     console.error('Error fetching carpet metadata:', err);
//     res.status(500).json({ error: 'Failed to fetch metadata' });
//   }
// });

// Get all products (later filter by sellerId) for seller page
app.get("/products", async (req, res) => {
  try {
    // const sellerId = req.user._id; // for now skip auth
    const products = await Carpet.find(); // later use { sellerId }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Update product for seller page
// Update product by ID
app.put("/products/:id", async (req, res) => {
  try {
    const updatedProduct = await Carpet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});


// Delete product for seller page
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Carpet.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// filter product for category page
// Filter products for category/subcategory page
app.get("/api/filter-products", async (req, res) => {
  const { type, subcategory, priceMin, priceMax, color, size, sort } = req.query;

  try {
    let match = {};
    if (type) match.type = type;
    if (subcategory) match.subcategory = subcategory;

    let variantMatch = {};
    if (priceMin) variantMatch["variants.price"] = { ...variantMatch["variants.price"], $gte: Number(priceMin) };
    if (priceMax) variantMatch["variants.price"] = { ...variantMatch["variants.price"], $lte: Number(priceMax) };
    if (color) variantMatch["variants.color"] = color;
    if (size) variantMatch["variants.size"] = size;

    const pipeline = [
      { $match: match },
      { $unwind: "$variants" },
      { $match: variantMatch },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$doc" } }
    ];

    // Sorting
    if (sort === "price_asc") pipeline.push({ $sort: { "variants.price": 1 } });
    if (sort === "price_desc") pipeline.push({ $sort: { "variants.price": -1 } });
    if (sort === "newest") pipeline.push({ $sort: { createdAt: -1 } });
    if (sort === "oldest") pipeline.push({ $sort: { createdAt: 1 } });

    const products = await Carpet.aggregate(pipeline);
    res.json(products);
  } catch (err) {
    console.error("Error filtering products:", err);
    res.status(500).json({ error: "Failed to filter products" });
  }
});


export default app;

// Start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    app.listen(PORT, () =>
      console.log(`🚀 Server running without DB on http://localhost:${PORT}`)
    );
  });
