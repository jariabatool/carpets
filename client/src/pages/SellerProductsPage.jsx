// client/src/pages/SellerProductsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';
import './SellerProductsPage.css';

export default function SellerProductsPage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerAndProducts();
  }, [sellerId]);

  const fetchSellerAndProducts = async () => {
    try {
      const [sellerRes, productsRes] = await Promise.all([
        fetch(`/api/sellers/${sellerId}`),
        fetch(`/api/sellers/${sellerId}/products`)
      ]);

      if (sellerRes.ok) setSeller(await sellerRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
    } catch (error) {
      console.error('Error fetching seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="seller-products-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="seller-products-container">
        <div className="error-message">Seller not found</div>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="seller-products-container">
      <div className="seller-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        
        <div className="seller-profile">
          <div className="seller-avatar large">
            {seller.name.charAt(0).toUpperCase()}
          </div>
          <div className="seller-details">
            <h1>{seller.name}</h1>
            {seller.companyName && (
              <p className="company-name">{seller.companyName}</p>
            )}
            <p className="seller-email">{seller.email}</p>
            {seller.businessAddress && (
              <p className="seller-location">
                📍 {seller.businessAddress.city}, {seller.businessAddress.country}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="products-section">
        <h2>Products by {seller.name}</h2>
        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No products available</h3>
            <p>This seller hasn't added any products yet</p>
          </div>
        ) : (
          <>
            <p className="products-count">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
            <ProductSlider products={products} />
          </>
        )}
      </div>
    </div>
  );
}