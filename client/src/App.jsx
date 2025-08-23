import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSlider from './components/ProductSlider';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [subcategories, setSubcategories] = useState([]);
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch all subcategories
    fetch('/api/subcategories')
      .then((res) => res.json())
      .then((subcategoriesData) => {
        setSubcategories(subcategoriesData);
        
        // Fetch previews for each subcategory (3 products each - backend limit, but we'll still slice later)
        const previewPromises = subcategoriesData.map(subcategory => 
          fetch(`/api/products?subcategory=${subcategory.name}&limit=3`)
            .then(res => res.json())
        );
        
        Promise.all(previewPromises)
          .then(results => {
            const previewsObj = {};
            subcategoriesData.forEach((subcategory, index) => {
              previewsObj[subcategory.name] = results[index];
            });
            setPreviews(previewsObj);
            setLoading(false);
          });
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to Our Carpet & Rug Store</h1>
          <p>Discover beautiful handmade carpets and rugs for your home</p>
        </div>
      </div>

      {/* New Seller Products Button */}
      <div className="seller-products-cta">
        <div className="content-wrapper">
          <button 
            className="sellers-cta-btn"
            onClick={() => navigate('/sellers')}
          >
            🏪 See Products by Seller
          </button>
        </div>
      </div>

      {/* Product Sections */}
      <div className="product-section">
        <div className="content-wrapper">
          {subcategories.map((subcategory) => {
            const products = (previews[subcategory.name] || []).slice(0, 2); // **LIMIT PRODUCTS TO MAX 2**
            
            return (
              <div key={subcategory._id} className="category-section">
                <h2>{subcategory.name}</h2>
                {subcategory.description && (
                  <p className="subcategory-description">{subcategory.description}</p>
                )}
                <ProductSlider products={products} />
                <button
                  className="see-more"
                  onClick={() => navigate(`/subcategory/${subcategory.name}`)}
                >
                  See More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
