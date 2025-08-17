// import { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './AddProductPage.css';

// export default function AddProductPage() {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     type: '',
//     subcategory: '',
//     images: [],
//     totalQuantity: 0,
//     availableQuantity: 0,
//     variants: [{ color: '', size: '', price: '', quantity: '' }]
//   });
//   const [meta, setMeta] = useState({ types: [], subcategories: [] });

//   useEffect(() => {
//     fetch('/api/carpet-meta')
//       .then(res => res.json())
//       .then(data => setMeta(data));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleVariantChange = (index, field, value) => {
//     const newVariants = [...formData.variants];
//     newVariants[index][field] = value;
//     setFormData({ ...formData, variants: newVariants });
//   };

//   const handleImageAdd = () => {
//     setFormData({ ...formData, images: [...formData.images, ''] });
//   };

//   const handleImageChange = (index, value) => {
//     const newImages = [...formData.images];
//     newImages[index] = value;
//     setFormData({ ...formData, images: newImages });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const productData = { ...formData, sellerId: user._id };
//     try {
//       const res = await fetch('/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(productData)
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || 'Failed to add product');
//       alert('Product added!');
//     } catch (err) {
//       console.error(err);
//       alert('Error adding product');
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>Add New Product</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Name:</label>
//         <input name="name" value={formData.name} onChange={handleChange} required />

//         <label>Description:</label>
//         <textarea name="description" value={formData.description} onChange={handleChange} required />

//         <label>Type:</label>
//         <select name="type" value={formData.type} onChange={handleChange} required>
//           <option value="">Select Type</option>
//           {meta.types.map((t, i) => <option key={i} value={t}>{t}</option>)}
//         </select>

//         <label>Subcategory:</label>
//         <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
//           <option value="">Select Subcategory</option>
//           {meta.subcategories.map((s, i) => <option key={i} value={s}>{s}</option>)}
//         </select>

//         <label>Total Quantity:</label>
//         <input name="totalQuantity" type="number" value={formData.totalQuantity} onChange={handleChange} />

//         <label>Available Quantity:</label>
//         <input name="availableQuantity" type="number" value={formData.availableQuantity} onChange={handleChange} />

//         <label>Images:</label>
//         {formData.images.map((img, i) => (
//           <input key={i} value={img} onChange={e => handleImageChange(i, e.target.value)} />
//         ))}
//         <button type="button" onClick={handleImageAdd}>Add Image URL</button>

//         <label>Variants:</label>
//         {formData.variants.map((v, i) => (
//           <div key={i} className="variant-block">
//             <input
//               placeholder="Color"
//               value={v.color}
//               onChange={e => handleVariantChange(i, 'color', e.target.value)}
//               required
//             />
//             <input
//               placeholder="Size"
//               value={v.size}
//               onChange={e => handleVariantChange(i, 'size', e.target.value)}
//               required
//             />
//             <input
//               placeholder="Price"
//               type="number"
//               value={v.price}
//               onChange={e => handleVariantChange(i, 'price', e.target.value)}
//               required
//             />
//             <input
//               placeholder="Quantity"
//               type="number"
//               value={v.quantity}
//               onChange={e => handleVariantChange(i, 'quantity', e.target.value)}
//               required
//             />
//             {formData.variants.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   const updated = [...formData.variants];
//                   updated.splice(i, 1);
//                   setFormData({ ...formData, variants: updated });
//                 }}
//                 className="remove-variant-btn"
//               >
//                 ❌
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() =>
//             setFormData({
//               ...formData,
//               variants: [...formData.variants, { color: '', size: '', price: '', quantity: '' }]
//             })
//           }
//           className="add-variant-btn"
//         >
//           ➕ Add Another Variant
//         </button>


//         <button type="submit">Add Product</button>
//       </form>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AddProductPage.css";

export default function AddProductPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    subcategory: "",
    images: [""],
    variants: [{ color: "", size: "", price: "", quantity: "" }],
  });

  const [meta, setMeta] = useState({ types: [], subcategories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/carpet-meta")
      .then((res) => res.json())
      .then((data) => setMeta(data))
      .catch((err) => console.error("Failed to load meta:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { color: "", size: "", price: "", quantity: "" }],
    });
  };

  const removeVariant = (index) => {
    const updated = [...formData.variants];
    updated.splice(index, 1);
    setFormData({ ...formData, variants: updated });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.type) return "Type is required";
    if (!formData.subcategory) return "Subcategory is required";
    if (!formData.images.length || formData.images.some((img) => !img.trim()))
      return "At least one image URL is required";
    if (!formData.variants.length) return "At least one variant is required";

    for (const v of formData.variants) {
      if (!v.color || !v.size) return "Color and Size are required for each variant";
      if (!v.price || v.price <= 0) return "Each variant must have a valid price";
      if (!v.quantity || v.quantity <= 0) return "Each variant must have a valid quantity";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const productData = { ...formData, sellerId: user._id };
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");

      alert("✅ Product added successfully!");
      setFormData({
        name: "",
        description: "",
        type: "",
        subcategory: "",
        images: [""],
        variants: [{ color: "", size: "", price: "", quantity: "" }],
      });
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="page-title">➕ Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Name */}
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        {/* Description */}
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          required
        />

        {/* Type */}
        <label>Type:</label>
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          {meta.types.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Subcategory */}
        <label>Subcategory:</label>
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          required
        >
          <option value="">Select Subcategory</option>
          {meta.subcategories.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Images */}
        <label>Images:</label>
        {formData.images.map((img, i) => (
          <input
            key={i}
            value={img}
            placeholder="Enter image URL"
            onChange={(e) => handleImageChange(i, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addImage} className="secondary-btn">
          ➕ Add Image URL
        </button>

        {/* Variants */}
        <label>Variants:</label>
        {formData.variants.map((v, i) => (
          <div key={i} className="variant-block">
            <input
              placeholder="Color"
              value={v.color}
              onChange={(e) => handleVariantChange(i, "color", e.target.value)}
              required
            />
            <input
              placeholder="Size"
              value={v.size}
              onChange={(e) => handleVariantChange(i, "size", e.target.value)}
              required
            />
            <input
              placeholder="Price"
              type="number"
              value={v.price}
              onChange={(e) => handleVariantChange(i, "price", e.target.value)}
              required
            />
            <input
              placeholder="Quantity"
              type="number"
              value={v.quantity}
              onChange={(e) => handleVariantChange(i, "quantity", e.target.value)}
              required
            />
            {formData.variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="remove-variant-btn"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addVariant} className="secondary-btn">
          ➕ Add Another Variant
        </button>

        {/* Submit */}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "⏳ Adding..." : "✅ Add Product"}
        </button>
      </form>
    </div>
  );
}
