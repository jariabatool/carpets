// // client/src/pages/ProfilePage.jsx
// import { useAuth } from "../context/AuthContext";

// export default function ProfilePage() {
//   const { user } = useAuth();

//   return (
//     <div className="profile-container">
//       <h2>Your Profile</h2>
//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>Role:</strong> {user.role}</p>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <ProfileInfo 
            user={user} 
            setMessage={setMessage}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
          />
        )}
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
    </div>
  );
}

// Profile Information Component with Edit Functionality
function ProfileInfo({ user, setMessage, setError, loading, setLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    companyName: user.companyName || '',
    businessEmail: user.businessEmail || '',
    businessPhone: user.businessPhone || '',
    taxId: user.taxId || '',
    businessAddress: {
      street: user.businessAddress?.street || '',
      city: user.businessAddress?.city || '',
      state: user.businessAddress?.state || '',
      zipCode: user.businessAddress?.zipCode || '',
      country: user.businessAddress?.country || ''
    }
  });

  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      companyName: user.companyName || '',
      businessEmail: user.businessEmail || '',
      businessPhone: user.businessPhone || '',
      taxId: user.taxId || '',
      businessAddress: {
        street: user.businessAddress?.street || '',
        city: user.businessAddress?.city || '',
        state: user.businessAddress?.state || '',
        zipCode: user.businessAddress?.zipCode || '',
        country: user.businessAddress?.country || ''
      }
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('businessAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        businessAddress: {
          ...prev.businessAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }

      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Update local storage user data
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Refresh the page to show updated data
      window.location.reload();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      companyName: user.companyName || '',
      businessEmail: user.businessEmail || '',
      businessPhone: user.businessPhone || '',
      taxId: user.taxId || '',
      businessAddress: {
        street: user.businessAddress?.street || '',
        city: user.businessAddress?.city || '',
        state: user.businessAddress?.state || '',
        zipCode: user.businessAddress?.zipCode || '',
        country: user.businessAddress?.country || ''
      }
    });
    setIsEditing(false);
    setError('');
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'admin': return 'Administrator';
      case 'seller': return 'Seller';
      case 'buyer': return 'Customer';
      default: return user.role;
    }
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3>Personal Information</h3>
        {!isEditing && (
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Seller-specific fields */}
          {user.role === 'seller' && (
            <div className="form-section">
              <h4>Business Information</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Your company name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessEmail">Business Email</label>
                  <input
                    id="businessEmail"
                    name="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Business email (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="businessPhone">Business Phone</label>
                  <input
                    id="businessPhone"
                    name="businessPhone"
                    type="tel"
                    value={formData.businessPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Business phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taxId">Tax ID</label>
                  <input
                    id="taxId"
                    name="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Tax identification number"
                  />
                </div>
              </div>

              <h5>Business Address</h5>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="street">Street Address</label>
                  <input
                    id="street"
                    name="businessAddress.street"
                    type="text"
                    value={formData.businessAddress.street}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    name="businessAddress.city"
                    type="text"
                    value={formData.businessAddress.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State/Province</label>
                  <input
                    id="state"
                    name="businessAddress.state"
                    type="text"
                    value={formData.businessAddress.state}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="State or province"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP/Postal Code</label>
                  <input
                    id="zipCode"
                    name="businessAddress.zipCode"
                    type="text"
                    value={formData.businessAddress.zipCode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="ZIP or postal code"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    name="businessAddress.country"
                    type="text"
                    value={formData.businessAddress.country}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`save-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      ) : (
        // Display Mode
        <div className="profile-display">
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <div className="info-value">{user.name}</div>
            </div>
            <div className="info-item">
              <label>Email Address</label>
              <div className="info-value">{user.email}</div>
            </div>
            <div className="info-item">
              <label>Account Role</label>
              <div className="info-value role-badge">{getRoleDisplayName()}</div>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <div className="info-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* Seller-specific information */}
          {user.role === 'seller' && (
            <div className="seller-section">
              <h4>Business Information</h4>
              <div className="info-grid">
                {user.companyName && (
                  <div className="info-item">
                    <label>Company Name</label>
                    <div className="info-value">{user.companyName}</div>
                  </div>
                )}
                {user.businessEmail && (
                  <div className="info-item">
                    <label>Business Email</label>
                    <div className="info-value">{user.businessEmail}</div>
                  </div>
                )}
                {user.businessPhone && (
                  <div className="info-item">
                    <label>Business Phone</label>
                    <div className="info-value">{user.businessPhone}</div>
                  </div>
                )}
                {user.taxId && (
                  <div className="info-item">
                    <label>Tax ID</label>
                    <div className="info-value">{user.taxId}</div>
                  </div>
                )}
              </div>

              {/* Business Address */}
              {(user.businessAddress?.street || user.businessAddress?.city) && (
                <div className="address-section">
                  <h5>Business Address</h5>
                  <div className="address-display">
                    {user.businessAddress.street && <p>{user.businessAddress.street}</p>}
                    {(user.businessAddress.city || user.businessAddress.state) && (
                      <p>
                        {user.businessAddress.city}
                        {user.businessAddress.city && user.businessAddress.state && ', '}
                        {user.businessAddress.state}
                      </p>
                    )}
                    {(user.businessAddress.zipCode || user.businessAddress.country) && (
                      <p>
                        {user.businessAddress.zipCode}
                        {user.businessAddress.zipCode && user.businessAddress.country && ' '}
                        {user.businessAddress.country}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}