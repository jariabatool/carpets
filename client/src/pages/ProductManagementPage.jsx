import { useNavigate } from "react-router-dom";
import "./ProductManagementPage.css";

export default function ProductManagementPage() {
  const navigate = useNavigate();

  return (
    <div className="management-page">
      <h2>🛠️ Product Management</h2>
      <div className="management-buttons">
        <button onClick={() => navigate("/add-product")}>➕ Add Product</button>
        <button onClick={() => navigate("/edit-product")}>✏️ Edit/Delete Product</button>
        <button onClick={() => navigate("/seller-orders")} >📋 Orders</button>
        <button onClick={() => navigate("/my-products")}>📦 My Products</button>
      </div>
    </div>
  );
}
