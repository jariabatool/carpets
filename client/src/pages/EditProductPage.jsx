// import { useEffect, useState } from "react";
// import "./EditProductPage.css";

// export default function EditProductPage() {
//   const [products, setProducts] = useState([]);
//   const [editingProduct, setEditingProduct] = useState(null);

//   // Fetch all products (later filter by sellerId if needed)
//   useEffect(() => {
//     fetch("http://localhost:5000/api/all-products") 
//       .then((res) => res.json())
//       .then((data) => setProducts(data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Handle field change for main product info
//   const handleChange = (e) => {
//     setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
//   };

//   // Handle variant change
//   const handleVariantChange = (index, e) => {
//     const updatedVariants = [...editingProduct.variants];
//     updatedVariants[index][e.target.name] = e.target.value;
//     setEditingProduct({ ...editingProduct, variants: updatedVariants });
//   };

//   // Add new variant
//   const handleAddVariant = () => {
//     setEditingProduct({
//       ...editingProduct,
//       variants: [...editingProduct.variants, { color: "", size: "", price: 0, quantity: 0 }],
//     });
//   };

//   // Remove a variant
//   const handleRemoveVariant = (index) => {
//     const updatedVariants = editingProduct.variants.filter((_, i) => i !== index);
//     setEditingProduct({ ...editingProduct, variants: updatedVariants });
//   };

//   // Save updated product
//   const handleSave = () => {
//     fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(editingProduct),
//     })
//       .then((res) => res.json())
//       .then((updated) => {
//         alert("Product updated successfully!");
//         setProducts(
//           products.map((p) => (p._id === updated._id ? updated : p))
//         );
//         setEditingProduct(null);
//       })
//       .catch((err) => console.error(err));
//   };

//   // Delete product
//   const handleDelete = (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;

//     fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" })
//       .then(() => {
//         setProducts(products.filter((p) => p._id !== id));
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="edit-page-container">
//       <h2>Edit or Delete Products</h2>

//       {!editingProduct ? (
//         <div className="product-list">
//           {products.map((product) => (
//             <div key={product._id} className="product-card">
//               <img src={product.images[0]} alt={product.name} />
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <div className="actions">
//                 <button onClick={() => setEditingProduct(product)}>Edit</button>
//                 <button onClick={() => handleDelete(product._id)}>Delete</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="edit-form">
//           <h3>Edit Product</h3>

//           <label>Name:</label>
//           <input
//             type="text"
//             name="name"
//             value={editingProduct.name}
//             onChange={handleChange}
//           />

//           <label>Description:</label>
//           <textarea
//             name="description"
//             value={editingProduct.description}
//             onChange={handleChange}
//           />

//           <label>Category:</label>
//           <select
//             name="type"
//             value={editingProduct.type}
//             onChange={handleChange}
//           >
//             <option value="carpets">Carpets</option>
//             <option value="rugs">Rugs</option>
//           </select>

//           <label>Subcategory:</label>
//           <select
//             name="subcategory"
//             value={editingProduct.subcategory}
//             onChange={handleChange}
//           >
//             <option value="iranian">Iranian</option>
//             <option value="turkish">Turkish</option>
//             <option value="modern">Modern</option>
//             <option value="classic">Classic</option>
//           </select>

//           <h4>Variants:</h4>
//           {editingProduct.variants.map((variant, index) => (
//             <div key={index} className="variant-row">
//               <input
//                 type="text"
//                 name="color"
//                 placeholder="Color"
//                 value={variant.color}
//                 onChange={(e) => handleVariantChange(index, e)}
//               />
//               <input
//                 type="text"
//                 name="size"
//                 placeholder="Size"
//                 value={variant.size}
//                 onChange={(e) => handleVariantChange(index, e)}
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={variant.price}
//                 onChange={(e) => handleVariantChange(index, e)}
//               />
//               <input
//                 type="number"
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={variant.quantity}
//                 onChange={(e) => handleVariantChange(index, e)}
//               />
//               <button className="remove-btn" onClick={() => handleRemoveVariant(index)}>
//                 Remove
//               </button>
//             </div>
//           ))}

//           <button className="add-btn" onClick={handleAddVariant}>
//             + Add New Variant
//           </button>

//           <div className="form-actions">
//             <button onClick={handleSave}>Save</button>
//             <button onClick={() => setEditingProduct(null)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/pages/EditProductPage.js
import { useEffect, useState } from "react";
import "./EditProductPage.css";

export default function EditProductPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch all products
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/all-products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle field change for main product info
  const handleChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  // Handle variant change
  const handleVariantChange = (index, e) => {
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[index][e.target.name] = e.target.type === 'number' 
      ? parseFloat(e.target.value) 
      : e.target.value;
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  // Add new variant
  const handleAddVariant = () => {
    setEditingProduct({
      ...editingProduct,
      variants: [...editingProduct.variants, { color: "", size: "", price: 0, quantity: 0 }],
    });
  };

  // Remove a variant
  const handleRemoveVariant = (index) => {
    if (editingProduct.variants.length <= 1) {
      alert("Product must have at least one variant");
      return;
    }
    
    const updatedVariants = editingProduct.variants.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  // Save updated product
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updated = await response.json();
      alert("Product updated successfully!");
      setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      setEditingProduct(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (loading) return <div className="edit-page-container loading">Loading products...</div>;
  if (error) return <div className="edit-page-container error">Error: {error}</div>;

  return (
    <div className="edit-page-container">
      <div className="page-header">
        <h2>📦 Edit or Delete Products</h2>
        <p>Manage your product inventory and details</p>
      </div>

      {!editingProduct ? (
        <div className="product-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>You haven't added any products yet.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.images && product.images[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">📦</div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-meta">
                    <span className="product-type">{product.type} • {product.subcategory}</span>
                    <span className="product-variants">{product.variants?.length || 0} variants</span>
                  </div>
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="edit-form-container">
          <div className="edit-form">
            <div className="form-header">
              <h3>✏️ Edit Product</h3>
              <button 
                onClick={() => setEditingProduct(null)}
                className="btn-cancel"
              >
                ← Back to List
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name || ''}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={editingProduct.description || ''}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="type"
                  value={editingProduct.type || ''}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="carpets">Carpets</option>
                  <option value="rugs">Rugs</option>
                  <option value="mats">Mats</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subcategory *</label>
                <select
                  name="subcategory"
                  value={editingProduct.subcategory || ''}
                  onChange={handleChange}
                >
                  <option value="">Select subcategory</option>
                  <option value="turkish">Turkish</option>
                  <option value="iranian">Iranian</option>
                  <option value="handmade">Handmade</option>
                  <option value="machine">Machine Made</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="bathroom">Bathroom</option>
                </select>
              </div>
            </div>

            <div className="variants-section">
              <div className="section-header">
                <h4>🔄 Product Variants</h4>
                <button 
                  onClick={handleAddVariant}
                  className="btn-add-variant"
                >
                  + Add Variant
                </button>
              </div>

              <div className="variants-grid">
                {editingProduct.variants?.map((variant, index) => (
                  <div key={index} className="variant-card">
                    <div className="variant-header">
                      <h5>Variant #{index + 1}</h5>
                      {editingProduct.variants.length > 1 && (
                        <button 
                          onClick={() => handleRemoveVariant(index)}
                          className="btn-remove-variant"
                        >
                          🗑️
                        </button>
                      )}
                    </div>

                    <div className="variant-fields">
                      <div className="form-group">
                        <label>Color *</label>
                        <input
                          type="text"
                          name="color"
                          placeholder="e.g., Red, Blue"
                          value={variant.color || ''}
                          onChange={(e) => handleVariantChange(index, e)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Size *</label>
                        <input
                          type="text"
                          name="size"
                          placeholder="e.g., 4x6, 6x9"
                          value={variant.size || ''}
                          onChange={(e) => handleVariantChange(index, e)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Price ($) *</label>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={variant.price || ''}
                          onChange={(e) => handleVariantChange(index, e)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          name="quantity"
                          placeholder="0"
                          min="0"
                          value={variant.quantity || ''}
                          onChange={(e) => handleVariantChange(index, e)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="btn-save"
              >
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
              <button 
                onClick={() => setEditingProduct(null)}
                className="btn-cancel"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}