import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import SubcategoryPage from "./pages/SubcategoryPage.jsx"; 
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductManagementPage from "./pages/ProductManagementPage.jsx";
import LoginPage from "./pages/LoginPage.jsx"; // ✅ Add this
import Layout from "./components/Layout";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; 
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage.jsx';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Login route OUTSIDE layout */}
            <Route path="/login" element={<LoginPage />} />

            {/* All other routes inside layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="category/:type/:subcategory" element={<CategoryPage />} />
              <Route path="subcategory/:name" element={<SubcategoryPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="manage-products" element={<ProductManagementPage />} />
              <Route path="add-product" element={<AddProductPage />} />
              <Route path="edit-product" element={<EditProductPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
