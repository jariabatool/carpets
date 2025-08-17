import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProductPage.css";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index][e.target.name] = e.target.value;
    setProduct({ ...product, variants: updatedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        setMessage("✅ Product updated successfully!");
        setTimeout(() => navigate("/manage-products"), 1500);
      } else {
        setMessage("❌ Failed to update product.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Error occurred.");
    }
  };

  if (loading) return <p className="loading">Loading product...</p>;

  return (
    <div className="edit-container">
      <h2>Edit Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="edit-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Type:
          <input
            type="text"
            name="type"
            value={product.type}
            onChange={handleChange}
          />
        </label>

        <label>
          Subcategory:
          <input
            type="text"
            name="subcategory"
            value={product.subcategory}
            onChange={handleChange}
          />
        </label>

        <h3>Variants</h3>
        {product.variants.map((variant, idx) => (
          <div key={idx} className="variant-box">
            <label>
              Color:
              <input
                type="text"
                name="color"
                value={variant.color}
                onChange={(e) => handleVariantChange(idx, e)}
              />
            </label>
            <label>
              Size:
              <input
                type="text"
                name="size"
                value={variant.size}
                onChange={(e) => handleVariantChange(idx, e)}
              />
            </label>
            <label>
              Price:
              <input
                type="number"
                name="price"
                value={variant.price}
                onChange={(e) => handleVariantChange(idx, e)}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={variant.quantity}
                onChange={(e) => handleVariantChange(idx, e)}
              />
            </label>
          </div>
        ))}

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}
