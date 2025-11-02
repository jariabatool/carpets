import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./SellerCouponsPage.css";

export default function SellerCouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user._id) {
      fetchSellerCoupons();
    }
  }, [user]);

  const fetchSellerCoupons = async () => {
    try {
      console.log('🔄 Fetching coupons for seller:', user._id);
      setLoading(true);
      setError("");
      
      const response = await fetch(`/api/seller/coupons?sellerId=${user._id}`);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Received coupons data:', data);
      
      setCoupons(data);
      setMessage("");
    } catch (err) {
      console.error('❌ Error fetching coupons:', err);
      setError(`Failed to fetch coupons: ${err.message}`);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      console.log('🎫 Creating coupon:', couponData);
      
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(couponData)
      });

      const data = await response.json();
      console.log('📨 Create coupon response:', data);

      if (response.ok) {
        setMessage("Coupon created successfully!");
        setShowCreateForm(false);
        // Refresh the coupons list
        fetchSellerCoupons();
      } else {
        setError(data.message || "Failed to create coupon");
      }
    } catch (err) {
      console.error('❌ Create coupon error:', err);
      setError("Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        setMessage("Coupon deleted successfully!");
        fetchSellerCoupons();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete coupon");
      }
    } catch (err) {
      console.error('❌ Delete coupon error:', err);
      setError("Failed to delete coupon");
    }
  };

  // Debug: Check user and loading state
  console.log('👤 Current user:', user);
  console.log('⏳ Loading state:', loading);
  console.log('🎫 Coupons state:', coupons);

  if (loading) {
    return (
      <div className="seller-coupons-container">
        <div className="loading">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="seller-coupons-container">
      <div className="coupons-header">
        <h1>🎫 Manage Coupons</h1>
        <button 
          className="create-coupon-btn"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New Coupon
        </button>
      </div>

      {message && (
        <div className="message success">
          <span>✅</span> {message}
        </div>
      )}
      
      {error && (
        <div className="message error">
          <span>⚠️</span> {error}
        </div>
      )}

      {showCreateForm && (
        <CreateCouponForm
          sellerId={user._id}
          onSubmit={handleCreateCoupon}
          onCancel={() => {
            setShowCreateForm(false);
            setError("");
          }}
        />
      )}

      <div className="coupons-list">
        {coupons.length === 0 ? (
          <div className="empty-state">
            <h3>No coupons created yet</h3>
            <p>Create your first coupon to offer discounts to customers</p>
            <button 
              className="create-first-coupon-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Coupon
            </button>
          </div>
        ) : (
          <div className="coupons-grid">
            {coupons.map(coupon => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onDelete={handleDeleteCoupon}
              />
            ))}
          </div>
        )}
      </div>

      {/* Debug info - remove in production */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
        <h4>Debug Info:</h4>
        <p>Seller ID: {user?._id}</p>
        <p>Coupons Count: {coupons.length}</p>
        <button onClick={fetchSellerCoupons} style={{ marginRight: '10px' }}>
          Refresh Coupons
        </button>
        <button onClick={() => console.log('Coupons:', coupons)}>
          Log Coupons to Console
        </button>
      </div>
    </div>
  );
}

function CreateCouponForm({ sellerId, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    applicableTo: "all_products",
    productIds: [],
    maxUses: "",
    usageLimitPerUser: 1,
    minOrderValue: 0,
    userEligibility: "all_users",
    minOrdersRequired: 0,
    validUntil: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Basic validation
      if (!formData.code.trim()) {
        alert("Please enter a coupon code");
        return;
      }

      if (!formData.validUntil) {
        alert("Please select a valid until date");
        return;
      }

      const couponData = {
        ...formData,
        sellerId,
        validUntil: new Date(formData.validUntil),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        discountValue: parseFloat(formData.discountValue)
      };

      console.log('📤 Submitting coupon data:', couponData);
      await onSubmit(couponData);
    } catch (err) {
      console.error('❌ Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set default validUntil to 30 days from now
  useEffect(() => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    const formattedDate = defaultDate.toISOString().slice(0, 16);
    
    setFormData(prev => ({
      ...prev,
      validUntil: formattedDate
    }));
  }, []);

  return (
    <div className="create-coupon-form">
      <h3>Create New Coupon</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Coupon Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="SUMMER20"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Summer special discount"
            />
          </div>

          <div className="form-group">
            <label>Discount Type *</label>
            <select name="discountType" value={formData.discountType} onChange={handleChange}>
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Discount Value *</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              min="1"
              max={formData.discountType === "percentage" ? 100 : 1000}
              step="0.01"
            />
            <small>
              {formData.discountType === "percentage" 
                ? "Enter percentage (1-100%)" 
                : "Enter fixed amount in dollars"
              }
            </small>
          </div>

          <div className="form-group">
            <label>Applicable To</label>
            <select name="applicableTo" value={formData.applicableTo} onChange={handleChange}>
              <option value="all_products">All Products</option>
              <option value="seller_products">My Products Only</option>
              <option value="specific_products">Specific Products</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Uses</label>
            <input
              type="number"
              name="maxUses"
              value={formData.maxUses}
              onChange={handleChange}
              placeholder="Unlimited if empty"
              min="1"
            />
            <small>Leave empty for unlimited uses</small>
          </div>

          <div className="form-group">
            <label>Uses Per User</label>
            <input
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Minimum Order Value ($)</label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>User Eligibility</label>
            <select name="userEligibility" value={formData.userEligibility} onChange={handleChange}>
              <option value="all_users">All Users</option>
              <option value="new_users">New Users Only</option>
              <option value="existing_users">Existing Users Only</option>
              <option value="min_orders">Users with Min Orders</option>
            </select>
          </div>

          {formData.userEligibility === "min_orders" && (
            <div className="form-group">
              <label>Minimum Orders Required</label>
              <input
                type="number"
                name="minOrdersRequired"
                value={formData.minOrdersRequired}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Valid Until *</label>
            <input
              type="datetime-local"
              name="validUntil"
              value={formData.validUntil}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="create-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CouponCard({ coupon, onDelete }) {
  const isExpired = new Date() > new Date(coupon.validUntil);
  const isUsedUp = coupon.maxUses && coupon.usedCount >= coupon.maxUses;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`coupon-card ${isExpired ? 'expired' : ''} ${isUsedUp ? 'used-up' : ''}`}>
      <div className="coupon-header">
        <h3 className="coupon-code">{coupon.code}</h3>
        <div className="coupon-actions">
          <button 
            className="delete-btn"
            onClick={() => onDelete(coupon._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <p className="coupon-description">{coupon.description}</p>

      <div className="coupon-details">
        <div className="discount-info">
          <span className="discount-value">
            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
          </span>
          <span className="discount-label">OFF</span>
        </div>

        <div className="coupon-meta">
          <div className="meta-item">
            <span className="label">Uses:</span>
            <span className="value">
              {coupon.usedCount || 0}
              {coupon.maxUses ? ` / ${coupon.maxUses}` : ' / ∞'}
            </span>
          </div>
          <div className="meta-item">
            <span className="label">Valid until:</span>
            <span className="value">{formatDate(coupon.validUntil)}</span>
          </div>
          <div className="meta-item">
            <span className="label">Min order:</span>
            <span className="value">${coupon.minOrderValue || 0}</span>
          </div>
        </div>

        <div className="coupon-status">
          {isExpired && <div className="status-badge expired">Expired</div>}
          {isUsedUp && <div className="status-badge used-up">Used Up</div>}
          {!isExpired && !isUsedUp && <div className="status-badge active">Active</div>}
        </div>
      </div>
    </div>
  );
}