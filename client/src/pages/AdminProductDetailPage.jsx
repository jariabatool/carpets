import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import './AdminProductDetailPage.css';

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await authFetch(`/api/products/${id}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        console.error('Failed to fetch product:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      } else {
        console.error('Failed to fetch reviews:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="admin-product-detail-page">
      <div className="detail-header">
        <Link to="/admin/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        <h1>Product Details</h1>
      </div>

      <div className="product-detail-card">
        <div className="image-section">
          <h3>Product Images</h3>
          {product.images && product.images.length > 0 ? (
            <>
              <img
                className="main-image"
                src={product.images[selectedIndex]}
                alt={product.name}
                onClick={() => setOpen(true)}
              />
              
              <div className="thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name}-${index}`}
                    className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
                    onClick={() => setSelectedIndex(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="description">{product.description}</p>
          <p><strong>Type:</strong> {product.type}</p>
          <p><strong>Subcategory:</strong> {product.subcategory}</p>
          <p><strong>Total Quantity:</strong> {product.totalQuantity}</p>
          <p><strong>Available Quantity:</strong> {product.availableQuantity}</p>
          
          {product.variants && product.variants.length > 0 && (
            <div className="variants-section">
              <h4>Variants</h4>
              <div className="variants-list">
                {product.variants.map((variant, index) => (
                  <div key={index} className="variant-item">
                    <p><strong>Color:</strong> {variant.color}</p>
                    <p><strong>Size:</strong> {variant.size}</p>
                    <p><strong>Price:</strong> ${variant.price}</p>
                    <p><strong>Quantity:</strong> {variant.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews ({reviews.length})</h2>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet for this product.</p>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="reviewer-name">
                        {review.userId?.name || review.userName || 'User'}
                      </span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="review-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`star ${i < review.rating ? 'filled' : ''}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for product images */}
      {open && product.images && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={selectedIndex}
          slides={product.images.map((img) => ({ src: img }))}
        />
      )}
    </div>
  );
}