import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MyProductsPage.css';

export default function MyProductsPage() {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    try {
        // console.log('🔄 Fetching products for user:', user);
        
        // First, let's debug what's happening
        const debugResponse = await authFetch('/api/debug/my-products');
        if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        // console.log('🔍 Debug data:', debugData);
        }

        // Try multiple approaches to get products
        let productsData = [];
        
        // Approach 1: Use the specific seller products endpoint
        const response1 = await authFetch('/api/my-products');
        if (response1.ok) {
        productsData = await response1.json();
        // console.log('✅ Approach 1 - Found products:', productsData.length);
        } else {
        // console.log('❌ Approach 1 failed');
        }
        
        // Approach 2: Use the general products endpoint with sellerId filter
        if (productsData.length === 0) {
        const response2 = await authFetch(`/api/products?sellerId=${user._id}`);
        if (response2.ok) {
            productsData = await response2.json();
            // console.log('✅ Approach 2 - Found products:', productsData.length);
        } else {
            // console.log('❌ Approach 2 failed');
        }
        }
        
        // Approach 3: Get all products and filter client-side (fallback)
        if (productsData.length === 0) {
        const response3 = await authFetch('/api/all-products');
        if (response3.ok) {
            const allProducts = await response3.json();
            productsData = allProducts.filter(product => product.sellerId === user._id);
            // console.log('✅ Approach 3 - Found products after filtering:', productsData.length);
        }
        }

        setProducts(productsData);
        
        // Fetch reviews for each product
        productsData.forEach(product => {
        fetchProductReviews(product._id);
        });
        
    } catch (error) {
        // console.error('Error fetching products:', error);
    } finally {
        setLoading(false);
    }
    };

  const fetchProductReviews = async (productId) => {
    try {
      const response = await fetch(`/api/reviews/${productId}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(prev => ({
          ...prev,
          [productId]: reviewsData
        }));
      }
    } catch (error) {
      // console.error('Error fetching reviews:', error);
    }
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await authFetch(`/api/products/${productId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId));
          alert('Product deleted successfully');
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        // console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const calculateAverageRating = (productId) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  if (loading) return <div className="loading">Loading your products...</div>;

  return (
    <div className="my-products-page">
      <div className="page-header">
        <button onClick={() => navigate('/manage-products')} className="back-btn">
          ← Back to Management
        </button>
        <h1>My Products ({products.length})</h1>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h3>No Products Yet</h3>
          <p>You haven't added any products yet. Start by adding your first product!</p>
          <button 
            onClick={() => navigate('/add-product')} 
            className="add-first-product-btn"
          >
            ➕ Add Your First Product
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} />
                ) : (
                  <div className="no-image">📷 No Image</div>
                )}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-type">{product.type} • {product.subcategory}</p>
                <p className="product-quantity">
                  Total: {product.totalQuantity} • Available: {product.availableQuantity || 0}
                </p>
                
                {/* Reviews Summary */}
                <div className="reviews-summary">
                  <div className="rating">
                    <span className="stars">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`star ${star <= calculateAverageRating(product._id) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    <span className="rating-number">
                      ({calculateAverageRating(product._id)})
                    </span>
                  </div>
                  <span className="review-count">
                    {reviews[product._id]?.length || 0} reviews
                  </span>
                </div>

                {/* Variants Summary */}
                {product.variants && product.variants.length > 0 && (
                  <div className="variants-summary">
                    <strong>Variants:</strong> {product.variants.length}
                    <div className="price-range">
                      ${Math.min(...product.variants.map(v => v.price))} - 
                      ${Math.max(...product.variants.map(v => v.price))}
                    </div>
                  </div>
                )}
              </div>

              <div className="product-actions">
                <button 
                  onClick={() => handleViewDetails(product)}
                  className="view-details-btn"
                >
                  👁️ View Details
                </button>
                {/* <button 
                  onClick={() => handleEditProduct(product._id)}
                  className="edit-btn"
                >
                  ✏️ Edit
                </button> */}
                {/* <button 
                  onClick={() => handleDeleteProduct(product._id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="product-details-modal">
            <div className="modal-header">
              <h2>{selectedProduct.name}</h2>
              <button onClick={handleCloseDetails} className="close-btn">×</button>
            </div>
            
            <div className="modal-content">
              <div className="product-images">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="image-gallery">
                    <img 
                      src={selectedProduct.images[0]} 
                      alt={selectedProduct.name} 
                      className="main-image"
                    />
                    <div className="image-thumbnails">
                      {selectedProduct.images.slice(0, 4).map((image, index) => (
                        <img key={index} src={image} alt={`${selectedProduct.name} ${index + 1}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-images">No images available</div>
                )}
              </div>
              
              <div className="product-details">
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                <p><strong>Subcategory:</strong> {selectedProduct.subcategory}</p>
                <p><strong>Total Quantity:</strong> {selectedProduct.totalQuantity}</p>
                <p><strong>Available Quantity:</strong> {selectedProduct.availableQuantity || 0}</p>
                
                {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                  <div className="variants-details">
                    <h4>Variants:</h4>
                    {selectedProduct.variants.map((variant, index) => (
                      <div key={index} className="variant-item">
                        <span>Color: {variant.color}</span>
                        <span>Size: {variant.size}</span>
                        <span>Price: ${variant.price}</span>
                        <span>Qty: {variant.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="product-reviews">
                <h4>Customer Reviews ({reviews[selectedProduct._id]?.length || 0})</h4>
                {reviews[selectedProduct._id]?.length > 0 ? (
                  <div className="reviews-list">
                    {reviews[selectedProduct._id].slice(0, 5).map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <span className="reviewer">
                            {review.userId?.name || review.userName || 'Anonymous'}
                          </span>
                          <span className="review-rating">
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={i < review.rating ? 'filled' : ''}>★</span>
                            ))}
                          </span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-reviews">No reviews yet for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}