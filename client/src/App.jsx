import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductSlider from './components/ProductSlider';
import Cart from './components/Cart';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const [previews, setPreviews] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetch('/api/products/preview')
      .then((res) => res.json())
      .then((data) => setPreviews(data))
      .catch((err) => console.error('Error fetching preview data:', err));
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`app-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="top-buttons">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>

        {user?.role === 'seller' && (
          <button className="manage-btn" onClick={() => navigate("/manage-products")}>
            🛠️ Manage Products
          </button>
        )}
      </div>

      {/* ✅ Only user sees cart */}
      {/* {user?.role === 'user' && <Cart />} */}

      <header className="hero-banner">
        <div className="overlay">
          <h1>Welcome to Our Carpet & Rug Store</h1>
        </div>
      </header>

      <div className="product-section">
        {Object.entries(previews).map(([key, products]) => {
          const [type, subcategory] = key.split('-');
          return (
            <div key={key} className="category-section">
              <h2>{subcategory} {type}</h2>
              <ProductSlider products={products} />
              <button
                className="see-more"
                onClick={() => navigate(`/category/${type}/${subcategory}`)}
              >
                See More
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
