// // client/src/main.jsx
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { CartProvider } from "./context/CartContext";
// import { ThemeProvider } from "./context/ThemeContext";
// import App from "./App.jsx";
// import CategoryPage from "./pages/CategoryPage.jsx";
// import ProductDetailPage from "./pages/ProductDetailPage.jsx";
// import Layout from "./components/Layout";
// import CheckoutPage from "./pages/CheckoutPage.jsx";
// import "./index.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <ThemeProvider>
//       <CartProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Layout />}>
//               <Route index element={<App />} />
//               <Route path="category/:type/:subcategory" element={<CategoryPage />} />
//               <Route path="product/:id" element={<ProductDetailPage />} />
//               <Route path="checkout" element={<CheckoutPage />} />
//             </Route>
//           </Routes>
//         </BrowserRouter>
//       </CartProvider>
//     </ThemeProvider>
//   </StrictMode>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductManagementPage from "./pages/ProductManagementPage.jsx"; // ✅ New Import
import Layout from "./components/Layout";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<App />} />
              <Route path="category/:type/:subcategory" element={<CategoryPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="manage-products" element={<ProductManagementPage />} /> {/* ✅ New Route */}
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>
);
