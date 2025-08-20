import { useEffect, useState } from "react";
import "./EditProductPage.css";

export default function EditProductPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products (later filter by sellerId if needed)
  useEffect(() => {
    fetch("http://localhost:5000/api/all-products") 
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle field change for main product info
  const handleChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
  };

  // Handle variant change
  const handleVariantChange = (index, e) => {
    const updatedVariants = [...editingProduct.variants];
    updatedVariants[index][e.target.name] = e.target.value;
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
    const updatedVariants = editingProduct.variants.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, variants: updatedVariants });
  };

  // Save updated product
  const handleSave = () => {
    fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct),
    })
      .then((res) => res.json())
      .then((updated) => {
        alert("Product updated successfully!");
        setProducts(
          products.map((p) => (p._id === updated._id ? updated : p))
        );
        setEditingProduct(null);
      })
      .catch((err) => console.error(err));
  };

  // Delete product
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" })
      .then(() => {
        setProducts(products.filter((p) => p._id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="edit-page-container">
      <h2>Edit or Delete Products</h2>

      {!editingProduct ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.images[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <div className="actions">
                <button onClick={() => setEditingProduct(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="edit-form">
          <h3>Edit Product</h3>

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={handleChange}
          />

          <label>Description:</label>
          <textarea
            name="description"
            value={editingProduct.description}
            onChange={handleChange}
          />

          <label>Category:</label>
          <select
            name="type"
            value={editingProduct.type}
            onChange={handleChange}
          >
            <option value="carpets">Carpets</option>
            <option value="rugs">Rugs</option>
          </select>

          <label>Subcategory:</label>
          <select
            name="subcategory"
            value={editingProduct.subcategory}
            onChange={handleChange}
          >
            <option value="iranian">Iranian</option>
            <option value="turkish">Turkish</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
          </select>

          <h4>Variants:</h4>
          {editingProduct.variants.map((variant, index) => (
            <div key={index} className="variant-row">
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={variant.color}
                onChange={(e) => handleVariantChange(index, e)}
              />
              <input
                type="text"
                name="size"
                placeholder="Size"
                value={variant.size}
                onChange={(e) => handleVariantChange(index, e)}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={variant.price}
                onChange={(e) => handleVariantChange(index, e)}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={variant.quantity}
                onChange={(e) => handleVariantChange(index, e)}
              />
              <button className="remove-btn" onClick={() => handleRemoveVariant(index)}>
                Remove
              </button>
            </div>
          ))}

          <button className="add-btn" onClick={handleAddVariant}>
            + Add New Variant
          </button>

          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditingProduct(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
