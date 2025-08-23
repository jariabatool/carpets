// client/src/pages/SellersPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SellersPage.css';

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch('/api/sellers');
      const data = await response.json();
      if (response.ok) {
        setSellers(data);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="sellers-container">
        <div className="loading">Loading sellers...</div>
      </div>
    );
  }

  return (
    <div className="sellers-container">
      <div className="sellers-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Our Sellers</h1>
        <p>Discover products from our trusted sellers</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search sellers by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="sellers-grid">
        {filteredSellers.map((seller) => (
          <div key={seller._id} className="seller-card">
            <div className="seller-avatar">
              {seller.name.charAt(0).toUpperCase()}
            </div>
            <div className="seller-info">
              <h3>{seller.name}</h3>
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
            <button
              className="view-products-btn"
              onClick={() => navigate(`/seller/${seller._id}/products`)}
            >
              View Products
            </button>
          </div>
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <div className="no-sellers">
          <div className="no-sellers-icon">🏪</div>
          <h3>No sellers found</h3>
          <p>{searchTerm ? 'Try a different search term' : 'No sellers available at the moment'}</p>
        </div>
      )}
    </div>
  );
}