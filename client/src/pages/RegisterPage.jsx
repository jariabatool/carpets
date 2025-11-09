// // client/src/pages/RegisterPage.jsx
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './RegisterPage.css';

// export default function RegisterPage() {
//   const [userType, setUserType] = useState('buyer');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     companyName: '',
//     businessStreet: '',
//     businessCity: '',
//     businessState: '',
//     businessZipCode: '',
//     businessCountry: '',
//     taxId: '',
//     businessPhone: '',
//     businessEmail: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     // Validation
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       return setError('Please fill in all required fields');
//     }

//     if (formData.password !== formData.confirmPassword) {
//       return setError('Passwords do not match');
//     }

//     if (userType === 'seller') {
//       if (!formData.companyName || !formData.businessStreet || !formData.businessCity || 
//           !formData.businessState || !formData.businessZipCode || !formData.businessCountry ||
//           !formData.taxId || !formData.businessPhone) {
//         return setError('Please fill in all business information fields');
//       }
//     }

//     setLoading(true);

//     try {
//       const requestData = {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: userType
//       };

//       // Add seller-specific fields if user is a seller
//       if (userType === 'seller') {
//         requestData.companyName = formData.companyName;
//         requestData.businessAddress = {
//           street: formData.businessStreet,
//           city: formData.businessCity,
//           state: formData.businessState,
//           zipCode: formData.businessZipCode,
//           country: formData.businessCountry
//         };
//         requestData.taxId = formData.taxId;
//         requestData.businessPhone = formData.businessPhone;
//         requestData.businessEmail = formData.businessEmail || '';
//       }

//       const response = await fetch('/api/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess(data.message);
//         setTimeout(() => navigate('/login'), 2000);
//       } else {
//         setError(data.message);
//       }
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="register-container">
//       <div className="register-card">
//         <h2>Create Account</h2>
//         <p className="website-info">
//           Welcome to <strong>Carpets & Rugs Marketplace</strong> —  
//           where global sellers meet buyers to trade unique designs, oriental patterns,  
//           and modern styles. Join today as a Buyer or Seller!
//         </p>

//         <div className="user-type-selector">
//           <button 
//             type="button"
//             className={userType === 'buyer' ? 'active' : ''}
//             onClick={() => setUserType('buyer')}
//           >
//             I'm a Buyer
//           </button>
//           <button 
//             type="button"
//             className={userType === 'seller' ? 'active' : ''}
//             onClick={() => setUserType('seller')}
//           >
//             I'm a Seller
//           </button>
//         </div>

//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Full Name *</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="email">Email Address *</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="password">Password *</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength="6"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password *</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>
          
//           {userType === 'seller' && (
//             <>
//               <h3>Business Information</h3>
//               <div className="form-group">
//                 <label htmlFor="companyName">Company Name *</label>
//                 <input
//                   type="text"
//                   id="companyName"
//                   name="companyName"
//                   value={formData.companyName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="businessStreet">Street Address *</label>
//                 <input
//                   type="text"
//                   id="businessStreet"
//                   name="businessStreet"
//                   value={formData.businessStreet}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="businessCity">City *</label>
//                   <input
//                     type="text"
//                     id="businessCity"
//                     name="businessCity"
//                     value={formData.businessCity}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="businessState">State *</label>
//                   <input
//                     type="text"
//                     id="businessState"
//                     name="businessState"
//                     value={formData.businessState}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="businessZipCode">ZIP Code *</label>
//                   <input
//                     type="text"
//                     id="businessZipCode"
//                     name="businessZipCode"
//                     value={formData.businessZipCode}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label htmlFor="businessCountry">Country *</label>
//                   <input
//                     type="text"
//                     id="businessCountry"
//                     name="businessCountry"
//                     value={formData.businessCountry}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="taxId">Tax ID *</label>
//                 <input
//                   type="text"
//                   id="taxId"
//                   name="taxId"
//                   value={formData.taxId}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="businessPhone">Business Phone *</label>
//                 <input
//                   type="tel"
//                   id="businessPhone"
//                   name="businessPhone"
//                   value={formData.businessPhone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="businessEmail">Business Email</label>
//                 <input
//                   type="email"
//                   id="businessEmail"
//                   name="businessEmail"
//                   value={formData.businessEmail}
//                   onChange={handleChange}
//                 />
//               </div>
//             </>
//           )}
          
//           <button type="submit" className="submit-btn" disabled={loading}>
//             {loading 
//               ? (userType === 'buyer' ? 'Creating Account...' : 'Submitting Request...') 
//               : (userType === 'buyer' ? 'Register as Buyer' : 'Register as Seller')
//             }
//           </button>
//         </form>
        
//         <div className="login-redirect">
//           Already have an account? <Link to="/login">Login here</Link>
//         </div>
//       </div>
//     </div>
//   );
// }
// client/src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation rules
  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Name should contain only letters and spaces (2-50 characters)'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      required: true,
      minLength: 6,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'Password must be at least 6 characters with uppercase, lowercase, and number'
    },
    confirmPassword: {
      required: true,
      match: 'password',
      message: 'Passwords do not match'
    },
    companyName: {
      required: userType === 'seller',
      minLength: 2,
      maxLength: 100,
      message: 'Company name is required (2-100 characters)'
    },
    businessStreet: {
      required: userType === 'seller',
      minLength: 5,
      maxLength: 200,
      message: 'Street address is required (5-200 characters)'
    },
    businessCity: {
      required: userType === 'seller',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'City is required (letters only, 2-50 characters)'
    },
    businessState: {
      required: userType === 'seller',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'State is required (letters only, 2-50 characters)'
    },
    businessZipCode: {
      required: userType === 'seller',
      pattern: /^[A-Z0-9\s-]+$/,
      message: 'Please enter a valid ZIP/postal code'
    },
    businessCountry: {
      required: userType === 'seller',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Country is required (letters only, 2-50 characters)'
    },
    taxId: {
      required: userType === 'seller',
      pattern: /^[A-Z0-9\s-]+$/,
      message: 'Please enter a valid Tax ID'
    },
    businessPhone: {
      required: userType === 'seller',
      pattern: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number'
    },
    businessEmail: {
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid business email address'
    }
  };

  // Validate individual field
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (value.trim()) {
      if (rules.minLength && value.length < rules.minLength) {
        return `Minimum ${rules.minLength} characters required`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximum ${rules.maxLength} characters allowed`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message;
      }

      if (rules.match && value !== formData[rules.match]) {
        return rules.message;
      }
    }

    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      if (userType === 'buyer' && field.startsWith('business')) {
        return; // Skip business fields for buyers
      }
      
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Reset form when user type changes
  useEffect(() => {
    if (userType === 'buyer') {
      // Clear business fields and their errors
      const businessFields = [
        'companyName', 'businessStreet', 'businessCity', 'businessState',
        'businessZipCode', 'businessCountry', 'taxId', 'businessPhone', 'businessEmail'
      ];
      
      const clearedData = { ...formData };
      const clearedErrors = { ...errors };
      const clearedTouched = { ...touched };
      
      businessFields.forEach(field => {
        clearedData[field] = '';
        delete clearedErrors[field];
        delete clearedTouched[field];
      });
      
      setFormData(clearedData);
      setErrors(clearedErrors);
      setTouched(clearedTouched);
    }
  }, [userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (userType === 'buyer' && key.startsWith('business')) return;
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: userType
      };

      // Add seller-specific fields if user is a seller
      if (userType === 'seller') {
        requestData.companyName = formData.companyName.trim();
        requestData.businessAddress = {
          street: formData.businessStreet.trim(),
          city: formData.businessCity.trim(),
          state: formData.businessState.trim(),
          zipCode: formData.businessZipCode.trim(),
          country: formData.businessCountry.trim()
        };
        requestData.taxId = formData.taxId.trim();
        requestData.businessPhone = formData.businessPhone.trim();
        requestData.businessEmail = formData.businessEmail.trim() || '';
      }

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(userType === 'buyer' 
          ? 'Account created successfully! Redirecting to login...' 
          : 'Seller registration submitted! Please wait for admin approval.'
        );
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (userType === 'buyer') {
      return formData.name && formData.email && formData.password && formData.confirmPassword;
    } else {
      return Object.values(formData).every(value => value.trim());
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
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.name ? 'error' : ''}
                required
                maxLength="50"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password ? 'error' : ''}
                  required
                  minLength="6"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword ? 'error' : ''}
                  required
                />
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>
          
          {/* Business Information - Only for Sellers */}
          {userType === 'seller' && (
            <div className="form-section">
              <h3>Business Information</h3>
              
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.companyName ? 'error' : ''}
                  required
                  maxLength="100"
                />
                {errors.companyName && <span className="field-error">{errors.companyName}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="businessStreet">Street Address *</label>
                <input
                  type="text"
                  id="businessStreet"
                  name="businessStreet"
                  value={formData.businessStreet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.businessStreet ? 'error' : ''}
                  required
                  maxLength="200"
                />
                {errors.businessStreet && <span className="field-error">{errors.businessStreet}</span>}
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
                    onBlur={handleBlur}
                    className={errors.businessCity ? 'error' : ''}
                    required
                    maxLength="50"
                  />
                  {errors.businessCity && <span className="field-error">{errors.businessCity}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessState">State *</label>
                  <input
                    type="text"
                    id="businessState"
                    name="businessState"
                    value={formData.businessState}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.businessState ? 'error' : ''}
                    required
                    maxLength="50"
                  />
                  {errors.businessState && <span className="field-error">{errors.businessState}</span>}
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
                    onBlur={handleBlur}
                    className={errors.businessZipCode ? 'error' : ''}
                    required
                  />
                  {errors.businessZipCode && <span className="field-error">{errors.businessZipCode}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessCountry">Country *</label>
                  <input
                    type="text"
                    id="businessCountry"
                    name="businessCountry"
                    value={formData.businessCountry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.businessCountry ? 'error' : ''}
                    required
                    maxLength="50"
                  />
                  {errors.businessCountry && <span className="field-error">{errors.businessCountry}</span>}
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
                  onBlur={handleBlur}
                  className={errors.taxId ? 'error' : ''}
                  required
                />
                {errors.taxId && <span className="field-error">{errors.taxId}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="businessPhone">Business Phone *</label>
                <input
                  type="tel"
                  id="businessPhone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.businessPhone ? 'error' : ''}
                  required
                />
                {errors.businessPhone && <span className="field-error">{errors.businessPhone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="businessEmail">Business Email</label>
                <input
                  type="email"
                  id="businessEmail"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.businessEmail ? 'error' : ''}
                />
                {errors.businessEmail && <span className="field-error">{errors.businessEmail}</span>}
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            className={`submit-btn ${!isFormValid() || loading ? 'disabled' : ''}`}
            disabled={!isFormValid() || loading}
          >
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