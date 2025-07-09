import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Carpet from './models/Carpet.js';
import User from './models/User.js'; // Optional: future use
import Order from './models/Order.js';

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

// Endpoint: Product detail by ID
// app.get('/api/products/:id', async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: 'Invalid product ID' });
//   }

//   try {
//     const product = await Carpet.findById(id);
//     if (!product) {
//       return res.status(404).json({ error: 'Carpet not found' });
//     }
//     res.json(product);
//   } catch (err) {
//     console.error('Failed to fetch carpet:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.post('/api/orders', async (req, res) => {
//   try {
//     const { paymentMethod } = req.body;

//     const order = new Order({
//       ...req.body,
//       paid: paymentMethod === 'online' ? true : false
//     });

//     await order.save();
//     res.status(201).json({ success: true, order });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ error: "Failed to place order" });
//   }
// });


// app.post("/api/orders", async (req, res) => {
//   try {
//     const {
//       buyer,
//       products, // ✅ this must match what your frontend sends
//       totalAmount,
//       deliveryCharges,
//       paymentMethod,
//       paid
//     } = req.body;

//     // ✅ Debug: check what's coming in
//     console.log("REQ BODY PRODUCTS:", products);

//     const order = new Order({
//       buyer,
//       products,
//       totalAmount,
//       deliveryCharges,
//       paymentMethod,
//       paid,
//       status: "pending"
//     });

//     await order.save();
//     res.status(201).json({ message: "Order saved successfully" });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ message: "Failed to save order" });
//   }
// });

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
