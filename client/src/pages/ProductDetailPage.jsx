// // // import { useEffect, useState } from "react";
// // // import { useParams } from "react-router-dom";
// // // import Lightbox from "yet-another-react-lightbox";
// // // import "yet-another-react-lightbox/styles.css";
// // // import "./ProductDetailPage.css";
// // // import { useCart } from "../context/CartContext.jsx"; // ✅ IMPORT HERE

// // // export default function ProductDetailPage() {
// // //   const { id } = useParams();
// // //   const { addToCart } = useCart(); // ✅ USE INSIDE COMPONENT
// // //   const [product, setProduct] = useState(null);
// // //   const [open, setOpen] = useState(false);
// // //   const [selectedIndex, setSelectedIndex] = useState(0);

// // //   useEffect(() => {
// // //     fetch(`/api/products/${id}`)
// // //       .then((res) => res.json())
// // //       .then((data) => setProduct(data))
// // //       .catch((err) => console.error("Failed to load product:", err));
// // //   }, [id]);

// // //   if (!product) return <div className="loading">Loading...</div>;

// // //   return (
// // //     <div className="detail-page">
// // //       <div className="product-detail-card">
// // //         <div className="image-section">
// // //           <img
// // //             className="main-image"
// // //             src={product.images?.[selectedIndex]}
// // //             alt={product.name}
// // //             onClick={() => setOpen(true)}
// // //           />

// // //           <div className="thumbnails">
// // //             {product.images?.map((img, index) => (
// // //               <img
// // //                 key={index}
// // //                 src={img}
// // //                 alt={`${product.name}-${index}`}
// // //                 className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
// // //                 onClick={() => setSelectedIndex(index)}
// // //               />
// // //             ))}
// // //           </div>
// // //         </div>

// // //         <div className="detail-info">
// // //           <h2>{product.name}</h2>
// // //           <p className="description">{product.description}</p>
// // //           <p className="price">${product.price}</p>
// // //           {product.totalQuantity && (
// // //             <p className="quantity-info">
// // //               In Stock: {product.availableQuantity} / {product.totalQuantity}
// // //             </p>
// // //           )}
// // //           <button
// // //             className="add-to-cart-btn"
// // //             onClick={() => addToCart(product)}
// // //             disabled={product.availableQuantity <= 0}
// // //           >
// // //             {product.availableQuantity <= 0 ? "Out of Stock" : "Add to Cart"}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {open && (
// // //         <Lightbox
// // //           open={open}
// // //           close={() => setOpen(false)}
// // //           index={selectedIndex}
// // //           slides={product.images.map((img) => ({ src: img }))}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import Lightbox from "yet-another-react-lightbox";
// // import "yet-another-react-lightbox/styles.css";
// // import "./ProductDetailPage.css";
// // import { useCart } from "../context/CartContext.jsx";

// // export default function ProductDetailPage() {
// //   const { id } = useParams();
// //   const { addToCart } = useCart();
// //   const [product, setProduct] = useState(null);
// //   const [open, setOpen] = useState(false);
// //   const [selectedIndex, setSelectedIndex] = useState(0);
// //   const [selectedColor, setSelectedColor] = useState("");
// //   const [selectedSize, setSelectedSize] = useState("");

// //   useEffect(() => {
// //     fetch(`/api/products/${id}`)
// //       .then((res) => res.json())
// //       .then((data) => setProduct(data))
// //       .catch((err) => console.error("Failed to load product:", err));
// //   }, [id]);

// //   if (!product) return <div className="loading">Loading...</div>;

// //   // Extract unique color and size options from variants
// //   const colors = [...new Set(product.variant?.map(v => v.color))];
// //   const sizes = [...new Set(product.variant?.map(v => v.size))];

// //   // Find the selected variant
// //   const selectedVariant = product.variant?.find(v => v.color === selectedColor && v.size === selectedSize);

// //   const handleAddToCart = () => {
// //     if (!selectedVariant) {
// //       alert("Please select color and size.");
// //       return;
// //     }

// //     const productWithVariant = {
// //       ...product,
// //       price: selectedVariant.price,
// //       selectedVariant: {
// //         color: selectedColor,
// //         size: selectedSize,
// //         price: selectedVariant.price,
// //       }
// //     };

// //     addToCart(productWithVariant);
// //   };

// //   return (
// //     <div className="detail-page">
// //       <div className="product-detail-card">
// //         <div className="image-section">
// //           <img
// //             className="main-image"
// //             src={product.images?.[selectedIndex]}
// //             alt={product.name}
// //             onClick={() => setOpen(true)}
// //           />

// //           <div className="thumbnails">
// //             {product.images?.map((img, index) => (
// //               <img
// //                 key={index}
// //                 src={img}
// //                 alt={`${product.name}-${index}`}
// //                 className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
// //                 onClick={() => setSelectedIndex(index)}
// //               />
// //             ))}
// //           </div>
// //         </div>

// //         <div className="detail-info">
// //           <h2>{product.name}</h2>
// //           <p className="description">{product.description}</p>
// //           <p className="price">${selectedVariant?.price || product.price}</p>
// //           <p className="quantity-info">
// //             In Stock: {product.availableQuantity} / {product.totalQuantity}
// //           </p>

// //           <div className="variant-selectors">
// //             <label>
// //               Color:
// //               <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
// //                 <option value="">--Select--</option>
// //                 {colors.map(color => (
// //                   <option key={color} value={color}>{color}</option>
// //                 ))}
// //               </select>
// //             </label>
// //             <label>
// //               Size:
// //               <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
// //                 <option value="">--Select--</option>
// //                 {sizes.map(size => (
// //                   <option key={size} value={size}>{size}</option>
// //                 ))}
// //               </select>
// //             </label>
// //           </div>

// //           <button
// //             className="add-to-cart-btn"
// //             onClick={handleAddToCart}
// //             disabled={!selectedVariant || selectedVariant.quantity <= 0}
// //           >
// //             {selectedVariant?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
// //           </button>
// //         </div>
// //       </div>

// //       {open && (
// //         <Lightbox
// //           open={open}
// //           close={() => setOpen(false)}
// //           index={selectedIndex}
// //           slides={product.images.map((img) => ({ src: img }))}
// //         />
// //       )}
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";
// import "./ProductDetailPage.css";
// import { useCart } from "../context/CartContext.jsx";

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");

//   useEffect(() => {
//     fetch(`/api/products/${id}`)
//       .then((res) => res.json())
//       .then((data) => setProduct(data))
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [id]);

//   if (!product) return <div className="loading">Loading...</div>;

//   // ✅ Use variants (plural)
//   const colors = [...new Set(product.variants?.map(v => v.color))];
//   const sizes = [...new Set(product.variants?.map(v => v.size))];

//   // ✅ Match selected variant
//   const selectedVariant = product.variants?.find(
//     v => v.color === selectedColor && v.size === selectedSize
//   );

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       alert("Please select color and size.");
//       return;
//     }

//     const productWithVariant = {
//       ...product,
//       price: selectedVariant.price, // ✅ always from variant
//       selectedVariant: {
//         color: selectedColor,
//         size: selectedSize,
//         price: selectedVariant.price,
//       }
//     };

//     addToCart(productWithVariant);
//   };

//   return (
//     <div className="detail-page">
//       <div className="product-detail-card">
//         <div className="image-section">
//           <img
//             className="main-image"
//             src={product.images?.[selectedIndex]}
//             alt={product.name}
//             onClick={() => setOpen(true)}
//           />

//           <div className="thumbnails">
//             {product.images?.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`${product.name}-${index}`}
//                 className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
//                 onClick={() => setSelectedIndex(index)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="detail-info">
//           <h2>{product.name}</h2>
//           <p className="description">{product.description}</p>

//           {/* ✅ Always show price from selected variant */}
//           <p className="price">
//             {selectedVariant ? `$${selectedVariant.price}` : "Select a variant to see price"}
//           </p>

//           <p className="quantity-info">
//             In Stock: {selectedVariant ? selectedVariant.quantity : 0} / {product.totalQuantity}
//           </p>

//           <div className="variant-selectors">
//             <label>
//               Color:
//               <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
//                 <option value="">--Select--</option>
//                 {colors.map(color => (
//                   <option key={color} value={color}>{color}</option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               Size:
//               <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
//                 <option value="">--Select--</option>
//                 {sizes.map(size => (
//                   <option key={size} value={size}>{size}</option>
//                 ))}
//               </select>
//             </label>
//           </div>

//           <button
//             className="add-to-cart-btn"
//             onClick={handleAddToCart}
//             disabled={!selectedVariant || selectedVariant.quantity <= 0}
//           >
//             {selectedVariant?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
//           </button>
//         </div>
//       </div>

//       {open && (
//         <Lightbox
//           open={open}
//           close={() => setOpen(false)}
//           index={selectedIndex}
//           slides={product.images.map((img) => ({ src: img }))}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./ProductDetailPage.css";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    comment: "",
    userName: "",
    userEmail: "",
    rememberDetails: false,
    isAnonymous: false
  });
  const [reviewImages, setReviewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
  });
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProduct();
    fetchReviews(1);
    fetchReviewStats();
    
    // Check if user details are saved in localStorage
    const savedName = localStorage.getItem('reviewUserName');
    const savedEmail = localStorage.getItem('reviewUserEmail');
    if (savedName && savedEmail) {
      setReviewData(prev => ({
        ...prev,
        userName: savedName,
        userEmail: savedEmail
      }));
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      console.error("Failed to load product:", err);
    }
  };

  const fetchReviews = async (page) => {
    try {
      const response = await fetch(`/api/reviews/product/${id}?page=${page}&limit=5`);
      const data = await response.json();
      
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews([...reviews, ...data.reviews]);
      }
      setReviewPage(page);
      setTotalReviewPages(data.totalPages);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats/${id}`);
      const data = await response.json();
      setReviewStats(data);
    } catch (err) {
      console.error("Failed to load review stats:", err);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewData({
      ...reviewData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Create previews for selected images
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setReviewImages([...reviewImages, ...files]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...reviewImages];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setReviewImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append all form data
      Object.keys(reviewData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, reviewData[key]);
        }
      });
      
      // Append images
      reviewImages.forEach((image) => {
        formData.append('images', image);
      });
      
      const url = editingReview ? `/api/reviews/${editingReview._id}` : '/api/reviews';
      const method = editingReview ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (response.ok) {
        const savedReview = await response.json();
        
        if (editingReview) {
          setReviews(reviews.map(r => r._id === savedReview._id ? savedReview : r));
        } else {
          setReviews([savedReview, ...reviews]);
        }
        
        // Save user details if requested
        if (reviewData.rememberDetails) {
          localStorage.setItem('reviewUserName', reviewData.userName);
          localStorage.setItem('reviewUserEmail', reviewData.userEmail);
        }
        
        // Refresh stats
        fetchReviewStats();
        
        resetReviewForm();
        setShowReviewForm(false);
      } else {
        console.error('Failed to submit review');
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const resetReviewForm = () => {
    setReviewData({
      rating: 0,
      title: "",
      comment: "",
      userName: "",
      userEmail: "",
      rememberDetails: false,
      isAnonymous: false
    });
    setReviewImages([]);
    setImagePreviews([]);
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewData({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      userName: review.userName,
      userEmail: review.userEmail,
      rememberDetails: false,
      isAnonymous: review.isAnonymous
    });
    setImagePreviews(review.images ? review.images.map(img => ({ preview: img })) : []);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setReviews(reviews.filter(r => r._id !== reviewId));
          // Refresh stats
          fetchReviewStats();
        } else {
          console.error('Failed to delete review');
          alert('Failed to delete review. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review. Please try again.');
      }
    }
  };

  const canEditReview = (review) => {
    // Check by email since we don't have user authentication
    const storedEmail = localStorage.getItem('reviewUserEmail');
    return storedEmail === review.userEmail;
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const renderRatingDistribution = () => {
    return Object.entries(reviewStats.ratingDistribution)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .map(([rating, count]) => {
        const percentage = reviewStats.totalReviews > 0 
          ? (count / reviewStats.totalReviews) * 100 
          : 0;
        
        return (
          <div key={rating} className="rating-distribution-item">
            <span className="rating-star">{rating} ★</span>
            <div className="rating-bar-container">
              <div 
                className="rating-bar" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="rating-count">{count}</span>
          </div>
        );
      });
  };

  if (!product) return <div className="loading">Loading...</div>;

  // ✅ Use variants (plural)
  const colors = [...new Set(product.variants?.map(v => v.color))];
  const sizes = [...new Set(product.variants?.map(v => v.size))];

  // ✅ Match selected variant
  const selectedVariant = product.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select color and size.");
      return;
    }

    const productWithVariant = {
      ...product,
      price: selectedVariant.price, // ✅ always from variant
      selectedVariant: {
        color: selectedColor,
        size: selectedSize,
        price: selectedVariant.price,
      }
    };

    addToCart(productWithVariant);
  };

  return (
    <div className="detail-page">
      <div className="product-container">
        <div className="product-detail-card">
          <div className="image-section">
            <img
              className="main-image"
              src={product.images?.[selectedIndex]}
              alt={product.name}
              onClick={() => setOpen(true)}
            />

            <div className="thumbnails">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name}-${index}`}
                  className={`thumbnail ${selectedIndex === index ? "active-thumb" : ""}`}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="detail-info">
            <h2>{product.name}</h2>
            
            {/* Product Tabs */}
            <div className="product-tabs">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviewStats.totalReviews})
              </button>
              <button 
                className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Care
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <>
                  <p className="description">{product.description}</p>

                  {/* ✅ Always show price from selected variant */}
                  <p className="price">
                    {selectedVariant ? `$${selectedVariant.price}` : "Select a variant to see price"}
                  </p>

                  <p className="quantity-info">
                    In Stock: {selectedVariant ? selectedVariant.quantity : 0} / {product.totalQuantity}
                  </p>

                  <div className="variant-selectors">
                    <label>
                      Color:
                      <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                        <option value="">--Select--</option>
                        {colors.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Size:
                      <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                        <option value="">--Select--</option>
                        {sizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.quantity <= 0}
                  >
                    {selectedVariant?.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-tab-content">
                  <div className="review-summary">
                    <div className="average-rating-box">
                      <div className="average-rating-number">{reviewStats.averageRating.toFixed(1)}</div>
                      <div className="average-rating-stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={`star ${i < Math.floor(reviewStats.averageRating) ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="total-reviews">{reviewStats.totalReviews} reviews</div>
                    </div>
                    
                    <div className="rating-distribution">
                      {renderRatingDistribution()}
                    </div>
                    
                    <button 
                      className="write-review-btn"
                      onClick={() => setShowReviewForm(true)}
                    >
                      <span className="plus-icon">+</span> Write a Review
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="shipping-tab-content">
                  <div className="info-section">
                    <div 
                      className="info-section-header"
                      onClick={() => toggleSection('shipping')}
                    >
                      <h3>Shipping & Returns</h3>
                      <span className="toggle-icon">
                        {expandedSection === 'shipping' ? '−' : '+'}
                      </span>
                    </div>
                    {expandedSection === 'shipping' && (
                      <div className="info-section-content">
                        <p><span className="info-bold">Shipping Times:</span> Orders are typically processed and shipped within 2-3 business days. The estimated delivery time will vary depending on your location.</p>
                        <p><span className="info-bold">Shipping Costs:</span> Shipping costs will be calculated based on the delivery method chosen and the total weight and dimensions of the items in your order.</p>
                        <p><span className="info-bold">Returns:</span> We want you to be completely satisfied with your purchase from Musa Carpets. If you receive a product that is damaged or not as described, please contact us within 7 days of receiving the item.</p>
                        <p><span className="info-bold">Refunds:</span> Upon receiving the returned item and verifying its condition, we will process a refund or replacement as per your preference.</p>
                      </div>
                    )}
                  </div>

                  <div className="info-section">
                    <div 
                      className="info-section-header"
                      onClick={() => toggleSection('care')}
                    >
                      <h3>Product Care</h3>
                      <span className="toggle-icon">
                        {expandedSection === 'care' ? '−' : '+'}
                      </span>
                    </div>
                    {expandedSection === 'care' && (
                      <div className="info-section-content">
                        <ul>
                          <li><span className="info-bold">Use furniture pads</span> and avoid dragging heavy objects.</li>
                          <li><span className="info-bold">Long term exposure to humid weather</span> can be harmful.</li>
                          <li><span className="info-bold">Regularly remove dust and dirt</span> using a soft broom or vacuum with a soft brush attachment.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section (Full Page) */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            {/* Review Form Modal */}
            {showReviewForm && (
              <div className="modal-overlay">
                <div className="review-form-modal">
                  <div className="modal-header">
                    <h3>{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
                    <button 
                      className="close-modal"
                      onClick={() => {
                        setShowReviewForm(false);
                        resetReviewForm();
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <div className="form-group">
                      <label>Rating *</label>
                      <div className="star-rating-large">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            className={`star ${star <= reviewData.rating ? 'filled' : ''}`}
                            onClick={() => setReviewData({...reviewData, rating: star})}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="title">Review Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={reviewData.title}
                        onChange={handleReviewChange}
                        placeholder="What's most important to know?"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="comment">Your Review *</label>
                      <textarea
                        id="comment"
                        name="comment"
                        value={reviewData.comment}
                        onChange={handleReviewChange}
                        rows="5"
                        placeholder="Share your experience with this product..."
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="images">Upload Images (Optional, max 5)</label>
                      <div className="image-upload-container">
                        <label htmlFor="images" className="image-upload-btn">
                          <span className="upload-icon">📷</span>
                          Add Photos
                        </label>
                        <input
                          type="file"
                          id="images"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={imagePreviews.length >= 5}
                          style={{ display: 'none' }}
                        />
                        {imagePreviews.length >= 5 && (
                          <p className="max-images-message">Maximum 5 images allowed</p>
                        )}
                      </div>
                      <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview.preview} alt="Preview" />
                            <button 
                              type="button" 
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="userName">Your Name *</label>
                        <input
                          type="text"
                          id="userName"
                          name="userName"
                          value={reviewData.userName}
                          onChange={handleReviewChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="userEmail">Your Email *</label>
                        <input
                          type="email"
                          id="userEmail"
                          name="userEmail"
                          value={reviewData.userEmail}
                          onChange={handleReviewChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="form-options">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="rememberDetails"
                          name="rememberDetails"
                          checked={reviewData.rememberDetails}
                          onChange={handleReviewChange}
                        />
                        <label htmlFor="rememberDetails">Remember my details for future reviews</label>
                      </div>
                      
                      <div className="form-check">
                        <input
                          type="checkbox"
                          id="isAnonymous"
                          name="isAnonymous"
                          checked={reviewData.isAnonymous}
                          onChange={handleReviewChange}
                        />
                        <label htmlFor="isAnonymous">Post as anonymous</label>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => {
                          setShowReviewForm(false);
                          resetReviewForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="submit-review-btn">
                        {editingReview ? 'Update Review' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Reviews List */}
            <div className="reviews-list">
              <div className="reviews-header">
                <h3>Customer Reviews ({reviewStats.totalReviews})</h3>
                <div className="sort-options">
                  <select>
                    <option value="newest">Newest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>
              
              {reviews.length === 0 ? (
                <div className="no-reviews-container">
                  <div className="no-reviews-icon">🌟</div>
                  <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                  <button 
                    className="write-first-review-btn"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                <>
                  {reviews.map(review => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.isAnonymous ? '👤' : review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="reviewer-name">
                              {review.isAnonymous ? 'Anonymous' : review.userName}
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
                      
                      <h4 className="review-title">{review.title}</h4>
                      <p className="review-comment">{review.comment}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="review-images">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="review-image"
                            />
                          ))}
                        </div>
                      )}
                      
                      {canEditReview(review) && (
                        <div className="review-actions">
                          <button 
                            className="edit-review-btn"
                            onClick={() => handleEditReview(review)}
                          >
                            <span className="edit-icon">✏️</span> Edit
                          </button>
                          <button 
                            className="delete-review-btn"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <span className="delete-icon">🗑️</span> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {reviewPage < totalReviewPages && (
                    <div className="load-more-container">
                      <button 
                        className="load-more-reviews"
                        onClick={() => fetchReviews(reviewPage + 1)}
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Lightbox for product images */}
      {open && (
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