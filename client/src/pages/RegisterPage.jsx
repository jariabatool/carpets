// client/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const [userType, setUserType] = useState('buyer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessStreet: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessCountry: '',
    taxId: '',
    businessPhone: '',
    businessEmail: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError('Please fill in all required fields');
    }

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (userType === 'seller') {
      if (!formData.companyName || !formData.businessStreet || !formData.businessCity || 
          !formData.businessState || !formData.businessZipCode || !formData.businessCountry ||
          !formData.taxId || !formData.businessPhone) {
        return setError('Please fill in all business information fields');
      }
    }

    setLoading(true);

    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType
      };

      // Add seller-specific fields if user is a seller
      if (userType === 'seller') {
        requestData.companyName = formData.companyName;
        requestData.businessAddress = {
          street: formData.businessStreet,
          city: formData.businessCity,
          state: formData.businessState,
          zipCode: formData.businessZipCode,
          country: formData.businessCountry
        };
        requestData.taxId = formData.taxId;
        requestData.businessPhone = formData.businessPhone;
        requestData.businessEmail = formData.businessEmail || '';
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="website-info">
          Welcome to <strong>Carpets & Rugs Marketplace</strong> —  
          where global sellers meet buyers to trade unique designs, oriental patterns,  
          and modern styles. Join today as a Buyer or Seller!
        </p>

        <div className="user-type-selector">
          <button 
            type="button"
            className={userType === 'buyer' ? 'active' : ''}
            onClick={() => setUserType('buyer')}
          >
            I'm a Buyer
          </button>
          <button 
            type="button"
            className={userType === 'seller' ? 'active' : ''}
            onClick={() => setUserType('seller')}
          >
            I'm a Seller
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          {userType === 'seller' && (
            <>
              <h3>Business Information</h3>
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="businessStreet">Street Address *</label>
                <input
                  type="text"
                  id="businessStreet"
                  name="businessStreet"
                  value={formData.businessStreet}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessCity">City *</label>
                  <input
                    type="text"
                    id="businessCity"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessState">State *</label>
                  <input
                    type="text"
                    id="businessState"
                    name="businessState"
                    value={formData.businessState}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessZipCode">ZIP Code *</label>
                  <input
                    type="text"
                    id="businessZipCode"
                    name="businessZipCode"
                    value={formData.businessZipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessCountry">Country *</label>
                  <input
                    type="text"
                    id="businessCountry"
                    name="businessCountry"
                    value={formData.businessCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="taxId">Tax ID *</label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="businessPhone">Business Phone *</label>
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="businessEmail">Business Email</label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading 
              ? (userType === 'buyer' ? 'Creating Account...' : 'Submitting Request...') 
              : (userType === 'buyer' ? 'Register as Buyer' : 'Register as Seller')
            }
          </button>
        </form>
        
        <div className="login-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}