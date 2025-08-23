// // import express from 'express';
// // import mongoose from 'mongoose';
// // import cors from 'cors';
// // import dotenv from 'dotenv';
// // import Carpet from './models/Carpet.js';
// // import User from './models/User.js'; 
// // import Order from './models/Order.js';
// // // import bcrypt from 'bcrypt';

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // app.use(cors());
// // app.use(express.json());

// // // Homepage subcategories to preview
// // const homepageSubcategories = [
// //   { type: 'carpets', subcategory: 'turkish' },
// //   { type: 'carpets', subcategory: 'iranian' },
// //   { type: 'rugs', subcategory: 'handmade' },
// //   { type: 'rugs', subcategory: 'machine' },
// //   { type: 'mats', subcategory: 'bathroom' },
// // ];
// // app.post('/api/login', async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     const user = await User.findOne({ email });

// //     if (!user || user.password !== password) {
// //       return res.status(401).json({ message: 'Invalid credentials' });
// //     }

// //     // Optional: hash comparison if you stored hashed passwords
// //     // const match = await bcrypt.compare(password, user.password);
// //     // if (!match) return res.status(401).json({ message: 'Invalid credentials' });

// //     res.json({ user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
// //   } catch (err) {
// //     console.error('Login error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });


// // // Endpoint: Homepage previews
// // app.get('/api/products/preview', async (req, res) => {
// //   try {
// //     const previews = {};

// //     for (const { type, subcategory } of homepageSubcategories) {
// //       const key = `${type}-${subcategory}`;
// //       const products = await Carpet.find({ type, subcategory }).limit(3);
// //       previews[key] = products;
// //     }

// //     res.json(previews);
// //   } catch (err) {
// //     console.error('Error fetching previews:', err);
// //     res.status(500).json({ error: 'Failed to fetch previews' });
// //   }
// // });

// // // Endpoint: All products by type/subcategory (and optional seller)
// // app.get('/api/products', async (req, res) => {
// //   const { type, subcategory, sellerId } = req.query;

// //   const filter = {};
// //   if (type) filter.type = type;
// //   if (subcategory) filter.subcategory = subcategory;
// //   if (sellerId) filter.sellerId = sellerId;

// //   try {
// //     const results = await Carpet.find(filter);
// //     res.json(results);
// //   } catch (err) {
// //     console.error('Error fetching category products:', err);
// //     res.status(500).json({ error: 'Failed to fetch category products' });
// //   }
// // });

// // // GET a single product by ID
// // app.get('/api/products/:id', async (req, res) => {
// //   const { id } = req.params;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     return res.status(400).json({ error: 'Invalid product ID' });
// //   }

// //   try {
// //     const product = await Carpet.findById(id);
// //     if (!product) {
// //       return res.status(404).json({ error: 'Carpet not found' });
// //     }
// //     res.json(product);
// //   } catch (err) {
// //     console.error('Failed to fetch carpet:', err);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // // POST create a new order
// // app.post("/api/orders", async (req, res) => {
// //   try {
// //     const {
// //       buyer,
// //       products,
// //       totalAmount,
// //       deliveryCharges,
// //       paymentMethod
// //     } = req.body;

// //     // Add default fallback
// //     const paid = paymentMethod === 'online';

// //     // Optional: validate each product entry
// //     if (!Array.isArray(products) || products.length === 0) {
// //       return res.status(400).json({ error: "Products are required" });
// //     }

// //     const order = new Order({
// //       buyer,
// //       products, // includes productId, name, sellerId, price, quantity, variant
// //       totalAmount,
// //       deliveryCharges,
// //       paymentMethod,
// //       paid,
// //       status: "pending"
// //     });

// //     await order.save();

// //     res.status(201).json({ message: "Order saved successfully", order });
// //   } catch (err) {
// //     console.error("Order creation error:", err);
// //     res.status(500).json({ message: "Failed to save order" });
// //   }
// // });

// // // Add Product Endpoint
// // app.post("/api/products", async (req, res) => {
// //   try {
// //     const {
// //       name,
// //       description,
// //       type,
// //       subcategory,
// //       images,
// //       sellerId,
// //       variants
// //     } = req.body;

// //     // calculate totalQuantity and availableQuantity from variants
// //     const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
// //     const availableQuantity = totalQuantity;

// //     const newCarpet = new Carpet({
// //       name,
// //       description,
// //       type,
// //       subcategory,
// //       images,
// //       sellerId,
// //       variants,
// //       totalQuantity,
// //       availableQuantity
// //     });

// //     await newCarpet.save();

// //     res.status(201).json({
// //       message: "Product added successfully",
// //       product: newCarpet
// //     });
// //   } catch (err) {
// //     console.error("Error adding product:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });
// // // Update product by ID 
// // app.put("/api/products/:id", async (req, res) => {
// //   const { id } = req.params;
// //   const updates = req.body;

// //   if (!mongoose.Types.ObjectId.isValid(id)) {
// //     return res.status(400).json({ error: "Invalid product ID" });
// //   }

// //   try {
// //     const updatedProduct = await Carpet.findByIdAndUpdate(
// //       id,
// //       { $set: updates },
// //       { new: true, runValidators: true }
// //     );

// //     if (!updatedProduct) {
// //       return res.status(404).json({ error: "Carpet not found" });
// //     }

// //     res.json(updatedProduct);
// //   } catch (err) {
// //     console.error("Failed to update carpet:", err);
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // app.get("/products", async (req, res) => {
// //   try {
// //     // const sellerId = req.user._id; // for now skip auth
// //     const products = await Carpet.find(); // later use { sellerId }
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching products", error });
// //   }
// // });

// // // Get all products (for edit page)
// // app.get("/api/all-products", async (req, res) => {
// //   try {
// //     const products = await Carpet.find();
// //     res.json(products);
// //   } catch (err) {
// //     console.error("Error fetching all products:", err);
// //     res.status(500).json({ error: "Failed to fetch products" })
// //   }
// // });

// // // Update product for seller page
// // // Update product by ID
// // app.put("/products/:id", async (req, res) => {
// //   try {
// //     const updatedProduct = await Carpet.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
// //     if (!updatedProduct) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }
// //     res.json(updatedProduct);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error updating product", error });
// //   }
// // });


// // // Delete product for seller page
// // app.delete("/products/:id", async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     await Carpet.findByIdAndDelete(id);
// //     res.json({ message: "Product deleted" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error deleting product", error });
// //   }
// // });

// // // category and sub category list for add and edit product
// // // Get metadata for add product form
// // app.get('/api/carpet-meta', async (req, res) => {
// //   try {
// //     const subcategories = await Subcategory.find({ isActive: true })
// //       .select('name -_id')
// //       .sort({ name: 1 });
    
// //     const subcategoryNames = subcategories.map(sc => sc.name);
    
// //     const types = await Carpet.distinct('type');
    
// //     res.json({
// //       types: types.filter(t => t),
// //       subcategories: subcategoryNames
// //     });
// //   } catch (err) {
// //     console.error('Error fetching carpet meta:', err);
// //     res.status(500).json({ error: 'Failed to fetch metadata' });
// //   }
// // });

// // // Get filter metadata for a subcategory
// // app.get('/api/filter-meta', async (req, res) => {
// //   const { subcategory } = req.query;

// //   try {
// //     const match = { subcategory };
    
// //     // Get unique colors and sizes from variants
// //     const colors = await Carpet.aggregate([
// //       { $match: match },
// //       { $unwind: "$variants" },
// //       { $group: { _id: "$variants.color" } },
// //       { $sort: { _id: 1 } }
// //     ]);
    
// //     const sizes = await Carpet.aggregate([
// //       { $match: match },
// //       { $unwind: "$variants" },
// //       { $group: { _id: "$variants.size" } },
// //       { $sort: { _id: 1 } }
// //     ]);

// //     // Get price range
// //     const priceRange = await Carpet.aggregate([
// //       { $match: match },
// //       { $unwind: "$variants" },
// //       {
// //         $group: {
// //           _id: null,
// //           minPrice: { $min: "$variants.price" },
// //           maxPrice: { $max: "$variants.price" }
// //         }
// //       }
// //     ]);

// //     res.json({
// //       colors: colors.map(c => c._id).filter(c => c),
// //       sizes: sizes.map(s => s._id).filter(s => s),
// //       priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
// //     });
// //   } catch (err) {
// //     console.error('Error fetching filter meta:', err);
// //     res.status(500).json({ error: 'Failed to fetch filter metadata' });
// //   }
// // });

// // import Subcategory from './models/Subcategory.js';

// // // Get all subcategories for homepage
// // app.get('/api/subcategories', async (req, res) => {
// //   try {
// //     const subcategories = await Subcategory.find({ isActive: true });
// //     res.json(subcategories);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch subcategories' });
// //   }
// // });

// // // Get specific subcategory details
// // app.get('/api/subcategory/:name', async (req, res) => {
// //   try {
// //     const subcategory = await Subcategory.findOne({ 
// //       name: req.params.name,
// //       isActive: true 
// //     });
    
// //     if (!subcategory) {
// //       return res.status(404).json({ error: 'Subcategory not found' });
// //     }
    
// //     res.json(subcategory);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch subcategory' });
// //   }
// // });

// // // Get products by subcategory only (ignore type)
// // app.get('/api/products/subcategory/:name', async (req, res) => {
// //   try {
// //     const products = await Carpet.find({ 
// //       subcategory: req.params.name 
// //     });
// //     res.json(products);
// //   } catch (err) {
// //     res.status(500).json({ error: 'Failed to fetch products' });
// //   }
// // });


// // // Get orders by buyer email
// // app.get('/api/orders', async (req, res) => {
// //   try {
// //     const { buyerEmail } = req.query;
    
// //     if (!buyerEmail) {
// //       return res.status(400).json({ error: 'Buyer email is required' });
// //     }

// //     const orders = await Order.find({ 'buyer.email': buyerEmail })
// //       .populate('products.productId')
// //       .sort({ createdAt: -1 });

// //     res.json(orders);
// //   } catch (err) {
// //     console.error('Error fetching orders:', err);
// //     res.status(500).json({ error: 'Failed to fetch orders' });
// //   }
// // });

// // export default app;

// // // Start the server
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => {
// //     console.log('✅ MongoDB connected');
// //     app.listen(PORT, () => {
// //       console.log(`🚀 Server running on http://localhost:${PORT}`);
// //     });
// //   })
// //   .catch((err) => {
// //     console.error('❌ MongoDB connection error:', err);
// //     app.listen(PORT, () =>
// //       console.log(`🚀 Server running without DB on http://localhost:${PORT}`)
// //     );
// //   });
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import Carpet from './models/Carpet.js';
// import User from './models/User.js'; 
// import Order from './models/Order.js';
// import Subcategory from './models/Subcategory.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Create HTTP server and Socket.io
// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join-seller-room', (sellerId) => {
//     socket.join(`seller-${sellerId}`);
//     console.log(`Seller ${sellerId} joined room`);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// app.use(cors());
// app.use(express.json());

// // Homepage subcategories to preview
// const homepageSubcategories = [
//   { type: 'carpets', subcategory: 'turkish' },
//   { type: 'carpets', subcategory: 'iranian' },
//   { type: 'rugs', subcategory: 'handmade' },
//   { type: 'rugs', subcategory: 'machine' },
//   { type: 'mats', subcategory: 'bathroom' },
// ];

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({ user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint: Homepage previews
// app.get('/api/products/preview', async (req, res) => {
//   try {
//     const previews = {};

//     for (const { type, subcategory } of homepageSubcategories) {
//       const key = `${type}-${subcategory}`;
//       const products = await Carpet.find({ type, subcategory }).limit(3);
//       previews[key] = products;
//     }

//     res.json(previews);
//   } catch (err) {
//     console.error('Error fetching previews:', err);
//     res.status(500).json({ error: 'Failed to fetch previews' });
//   }
// });

// // Endpoint: All products by type/subcategory (and optional seller)
// app.get('/api/products', async (req, res) => {
//   const { type, subcategory, sellerId } = req.query;

//   const filter = {};
//   if (type) filter.type = type;
//   if (subcategory) filter.subcategory = subcategory;
//   if (sellerId) filter.sellerId = sellerId;

//   try {
//     const results = await Carpet.find(filter);
//     res.json(results);
//   } catch (err) {
//     console.error('Error fetching category products:', err);
//     res.status(500).json({ error: 'Failed to fetch category products' });
//   }
// });

// // GET a single product by ID
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

// // POST create a new order (UPDATED WITH SOCKET.IO)
// app.post("/api/orders", async (req, res) => {
//   try {
//     const {
//       buyer,
//       products,
//       totalAmount,
//       deliveryCharges,
//       paymentMethod
//     } = req.body;

//     // Add default fallback
//     const paid = paymentMethod === 'online';

//     // Optional: validate each product entry
//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ error: "Products are required" });
//     }

//     const order = new Order({
//       buyer,
//       products, // includes productId, name, sellerId, price, quantity, variant
//       totalAmount,
//       deliveryCharges,
//       paymentMethod,
//       paid,
//       status: "pending"
//     });

//     await order.save();

//     // Populate the order for notification
//     const populatedOrder = await Order.findById(order._id).populate('products.productId');

//     // Emit real-time notification to all sellers involved in this order
//     const uniqueSellerIds = [...new Set(products.map(p => p.sellerId))];
//     uniqueSellerIds.forEach(sellerId => {
//       io.to(`seller-${sellerId}`).emit('new-order', populatedOrder);
//     });

//     res.status(201).json({ message: "Order saved successfully", order: populatedOrder });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     res.status(500).json({ message: "Failed to save order" });
//   }
// });

// // Add Product Endpoint
// app.post("/api/products", async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       type,
//       subcategory,
//       images,
//       sellerId,
//       variants
//     } = req.body;

//     // calculate totalQuantity and availableQuantity from variants
//     const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
//     const availableQuantity = totalQuantity;

//     const newCarpet = new Carpet({
//       name,
//       description,
//       type,
//       subcategory,
//       images,
//       sellerId,
//       variants,
//       totalQuantity,
//       availableQuantity
//     });

//     await newCarpet.save();

//     res.status(201).json({
//       message: "Product added successfully",
//       product: newCarpet
//     });
//   } catch (err) {
//     console.error("Error adding product:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Update product by ID 
// app.put("/api/products/:id", async (req, res) => {
//   const { id } = req.params;
//   const updates = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ error: "Invalid product ID" });
//   }

//   try {
//     const updatedProduct = await Carpet.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ error: "Carpet not found" });
//     }

//     res.json(updatedProduct);
//   } catch (err) {
//     console.error("Failed to update carpet:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/products", async (req, res) => {
//   try {
//     const products = await Carpet.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products", error });
//   }
// });

// // Get all products (for edit page)
// app.get("/api/all-products", async (req, res) => {
//   try {
//     const products = await Carpet.find();
//     res.json(products);
//   } catch (err) {
//     console.error("Error fetching all products:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// // Update product for seller page
// app.put("/products/:id", async (req, res) => {
//   try {
//     const updatedProduct = await Carpet.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating product", error });
//   }
// });

// // Delete product for seller page
// app.delete("/products/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Carpet.findByIdAndDelete(id);
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product", error });
//   }
// });

// // Get metadata for add product form
// app.get('/api/carpet-meta', async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find({ isActive: true })
//       .select('name -_id')
//       .sort({ name: 1 });
    
//     const subcategoryNames = subcategories.map(sc => sc.name);
    
//     const types = await Carpet.distinct('type');
    
//     res.json({
//       types: types.filter(t => t),
//       subcategories: subcategoryNames
//     });
//   } catch (err) {
//     console.error('Error fetching carpet meta:', err);
//     res.status(500).json({ error: 'Failed to fetch metadata' });
//   }
// });

// // Get filter metadata for a subcategory
// app.get('/api/filter-meta', async (req, res) => {
//   const { subcategory } = req.query;

//   try {
//     const match = { subcategory };
    
//     // Get unique colors and sizes from variants
//     const colors = await Carpet.aggregate([
//       { $match: match },
//       { $unwind: "$variants" },
//       { $group: { _id: "$variants.color" } },
//       { $sort: { _id: 1 } }
//     ]);
    
//     const sizes = await Carpet.aggregate([
//       { $match: match },
//       { $unwind: "$variants" },
//       { $group: { _id: "$variants.size" } },
//       { $sort: { _id: 1 } }
//     ]);

//     // Get price range
//     const priceRange = await Carpet.aggregate([
//       { $match: match },
//       { $unwind: "$variants" },
//       {
//         $group: {
//           _id: null,
//           minPrice: { $min: "$variants.price" },
//           maxPrice: { $max: "$variants.price" }
//         }
//       }
//     ]);

//     res.json({
//       colors: colors.map(c => c._id).filter(c => c),
//       sizes: sizes.map(s => s._id).filter(s => s),
//       priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
//     });
//   } catch (err) {
//     console.error('Error fetching filter meta:', err);
//     res.status(500).json({ error: 'Failed to fetch filter metadata' });
//   }
// });

// // Get all subcategories for homepage
// app.get('/api/subcategories', async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find({ isActive: true });
//     res.json(subcategories);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch subcategories' });
//   }
// });

// // Get specific subcategory details
// app.get('/api/subcategory/:name', async (req, res) => {
//   try {
//     const subcategory = await Subcategory.findOne({ 
//       name: req.params.name,
//       isActive: true 
//     });
    
//     if (!subcategory) {
//       return res.status(404).json({ error: 'Subcategory not found' });
//     }
    
//     res.json(subcategory);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch subcategory' });
//   }
// });

// // Get products by subcategory only (ignore type)
// app.get('/api/products/subcategory/:name', async (req, res) => {
//   try {
//     const products = await Carpet.find({ 
//       subcategory: req.params.name 
//     });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// // Get orders by buyer email
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

// // Get orders for a specific seller
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

// // Update order status
// app.put('/api/orders/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid order ID' });
//     }

//     const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ error: 'Invalid status' });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate('products.productId');

//     if (!updatedOrder) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     res.json(updatedOrder);
//   } catch (err) {
//     console.error('Error updating order status:', err);
//     res.status(500).json({ error: 'Failed to update order status' });
//   }
// });

// // Start the server with server.listen instead of app.listen
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     server.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     server.listen(PORT, () =>
//       console.log(`🚀 Server running without DB on http://localhost:${PORT}`)
//     );
//   });

// export default app;
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

// Homepage subcategories to preview
const homepageSubcategories = [
  { type: 'carpets', subcategory: 'turkish' },
  { type: 'carpets', subcategory: 'iranian' },
  { type: 'rugs', subcategory: 'handmade' },
  { type: 'rugs', subcategory: 'machine' },
  { type: 'mats', subcategory: 'bathroom' },
];

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

// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     res.json({ user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
//  });
// server/index.js (or your main server file)
// Add these endpoints to your existing server file

// Registration endpoint
// Add this to your server/index.js or routes file
// Add this to your server/index.js or routes file
app.post('/api/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { name, email, password, role, companyName, businessAddress, taxId, businessPhone, businessEmail } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user (no password hashing)
    const newUser = new User({
      name,
      email,
      password, // Store plain text password
      role: role || 'buyer',
      isApproved: role === 'buyer', // Auto-approve buyers, require approval for sellers
      companyName,
      businessAddress,
      taxId,
      businessPhone,
      businessEmail
    });

    await newUser.save();
    console.log('New user saved:', newUser);

    res.status(201).json({ 
      message: role === 'buyer' 
        ? 'Registration successful! You can now login.' 
        : 'Registration submitted! Please wait for admin approval.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// Update your existing login endpoint to check for approval
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is approved (except for admin)
    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(401).json({ message: 'Your account is pending approval' });
    }

    res.json({ 
      user: { 
        _id: user._id, 
        name: user.name, 
        role: user.role, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending approvals (admin only)
app.get('/api/pending-approvals', async (req, res) => {
  try {
    console.log('Fetching pending approvals');
    const pendingUsers = await User.find({ isApproved: false });
    console.log('Found pending users:', pendingUsers.length);
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error('Pending approvals error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Approve user (admin only)
app.patch('/api/approve-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await User.findByIdAndUpdate(id, { isApproved: true });
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Reject user (admin only)
app.delete('/api/reject-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Something went wrong' });
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

// POST create a new order (UPDATED WITH INVENTORY MANAGEMENT)
app.post("/api/orders", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      buyer,
      products,
      totalAmount,
      deliveryCharges,
      paymentMethod
    } = req.body;

    const paid = paymentMethod === 'online';

    if (!Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Products are required" });
    }

    const order = new Order({
      buyer,
      products,
      totalAmount,
      deliveryCharges,
      paymentMethod,
      paid,
      status: "pending"
    });

    await order.save({ session });

    // If order is paid online, deduct inventory immediately
    if (paid) {
      await deductInventory(products);
    }

    // Populate the order for notification
    const populatedOrder = await Order.findById(order._id).populate('products.productId').session(session);

    // Emit real-time notification to all sellers involved in this order
    const uniqueSellerIds = [...new Set(products.map(p => p.sellerId))];
    uniqueSellerIds.forEach(sellerId => {
      io.to(`seller-${sellerId}`).emit('new-order', populatedOrder);
    });

    await session.commitTransaction();
    res.status(201).json({ message: "Order saved successfully", order: populatedOrder });
  } catch (err) {
    await session.abortTransaction();
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Failed to save order" });
  } finally {
    session.endSession();
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
// Get all sellers
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

// Get seller by ID
app.get('/api/sellers/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id)
      .select('name email companyName businessAddress');
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }
    
    res.status(200).json(seller);
  } catch (error) {
    console.error('Error fetching seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get products by seller
app.get('/api/sellers/:id/products', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Something went wrong' });
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

app.get("/products", async (req, res) => {
  try {
    const products = await Carpet.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get all products (for edit page)
app.get("/api/all-products", async (req, res) => {
  try {
    const products = await Carpet.find();
    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Update product for seller page
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
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Carpet.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

// Get metadata for add product form
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

// Get filter metadata for a subcategory
app.get('/api/filter-meta', async (req, res) => {
  const { subcategory } = req.query;

  try {
    const match = { subcategory };
    
    // Get unique colors and sizes from variants
    const colors = await Carpet.aggregate([
      { $match: match },
      { $unwind: "$variants" },
      { $group: { _id: "$variants.color" } },
      { $sort: { _id: 1 } }
    ]);
    
    const sizes = await Carpet.aggregate([
      { $match: match },
      { $unwind: "$variants" },
      { $group: { _id: "$variants.size" } },
      { $sort: { _id: 1 } }
    ]);

    // Get price range
    const priceRange = await Carpet.aggregate([
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
      colors: colors.map(c => c._id).filter(c => c),
      sizes: sizes.map(s => s._id).filter(s => s),
      priceRange: priceRange[0] || { minPrice: 0, maxPrice: 10000 }
    });
  } catch (err) {
    console.error('Error fetching filter meta:', err);
    res.status(500).json({ error: 'Failed to fetch filter metadata' });
  }
});

// Get all subcategories for homepage
app.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ isActive: true });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// Get specific subcategory details
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

// Get products by subcategory only (ignore type)
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

// Get orders by buyer email
app.get('/api/orders', async (req, res) => {
  try {
    const { buyerEmail } = req.query;
    
    if (!buyerEmail) {
      return res.status(400).json({ error: 'Buyer email is required' });
    }

    const orders = await Order.find({ 'buyer.email': buyerEmail })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get orders for a specific seller
app.get('/api/seller/orders', async (req, res) => {
  try {
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    const orders = await Order.find({ 'products.sellerId': sellerId })
      .populate('products.productId')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status with inventory management
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

    // Get the current order within the transaction
    const currentOrder = await Order.findById(id).session(session).populate('products.productId');
    if (!currentOrder) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Order not found' });
    }

    const previousStatus = currentOrder.status;

    // Handle inventory changes based on status transition
    if (previousStatus !== status) {
      if (status === 'cancelled') {
        // Restore inventory when cancelling (only if order was paid or inventory was deducted)
        if (currentOrder.paid || previousStatus !== 'pending') {
          await restoreInventory(currentOrder.products);
        }
      } else if (previousStatus === 'cancelled' && status !== 'cancelled') {
        // Deduct inventory when uncancelling
        await deductInventory(currentOrder.products);
      } else if (previousStatus === 'pending' && status !== 'pending' && status !== 'cancelled') {
        // Deduct inventory when moving from pending to active status
        await deductInventory(currentOrder.products);
      } else if (previousStatus !== 'pending' && previousStatus !== 'cancelled' && status === 'pending') {
        // Restore inventory when moving back to pending
        await restoreInventory(currentOrder.products);
      }
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true, session }
    ).populate('products.productId');

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

// Get all sellers
app.get('/api/admin/sellers', async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' });
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all buyers
app.get('/api/admin/buyers', async (req, res) => {
  try {
    const buyers = await User.find({ role: 'buyer' });
    res.status(200).json(buyers);
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get seller details
app.get('/api/admin/sellers/:id', async (req, res) => {
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

// Get buyer details
app.get('/api/admin/buyers/:id', async (req, res) => {
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
});

// Get seller's products
app.get('/api/admin/sellers/:id/products', async (req, res) => {
  try {
    // Assuming you have a Product model with a seller field
    const products = await Product.find({ seller: req.params.id });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get seller's orders
app.get('/api/admin/sellers/:id/orders', async (req, res) => {
  try {
    // Assuming you have an Order model and Product model
    // This might need to be adjusted based on your schema
    const orders = await Order.find({ 
      'items.product': { $in: await Product.find({ seller: req.params.id }).distinct('_id') }
    }).populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get buyer's orders
app.get('/api/admin/buyers/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


// Update seller
app.put('/api/admin/sellers/:id', async (req, res) => {
  try {
    const { name, email, companyName, businessAddress, taxId, businessPhone, businessEmail, isApproved } = req.body;
    
    // Check if email already exists for another user
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
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update buyer
app.put('/api/admin/buyers/:id', async (req, res) => {
  try {
    const { name, email, isApproved } = req.body;
    
    // Check if email already exists for another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const updatedBuyer = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, isApproved },
      { new: true, runValidators: true }
    );
    
    if (!updatedBuyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }
    
    res.status(200).json(updatedBuyer);
  } catch (error) {
    console.error('Error updating buyer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete seller
app.delete('/api/admin/sellers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // You might also want to delete associated products
    await Product.deleteMany({ seller: req.params.id });
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete buyer
app.delete('/api/admin/buyers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    console.error('Error deleting buyer:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update order status
app.patch('/api/admin/orders/:id', async (req, res) => {
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


// Add endpoint to handle payment confirmation (for cash on delivery orders)
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

    // If order was pending and paid is being confirmed, deduct inventory
    if (order.status === 'pending' && !order.paid) {
      await deductInventory(order.products);
    }

    // Update order payment status
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

// Start the server with server.listen instead of app.listen
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