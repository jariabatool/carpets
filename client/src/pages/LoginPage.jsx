// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // Import the auth context
// import './LoginPage.css';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth(); // Get the login function from context

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       const res = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || 'Login failed');
//         return;
//       }

//       // Use the auth context login function which will store both user and token
//       login(data.user, data.token);
      
//       // Handle different user roles including admin
//       if (data.user.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else if (data.user.role === 'seller') {
//         navigate('/manage-products');
//       } else {
//         navigate('/');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       <div className="register-redirect">
//         Don't have an account? <Link to="/register">Register here</Link>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Features carousel
  const features = [
    {
      icon: '🏪',
      title: 'Premium Carpets and Rugs',
      description: 'Discover our exclusive collection of handcrafted carpets'
    },
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Free delivery on orders available'
    },
    {
      icon: '💎',
      title: 'Quality Guarantee',
      description: '100% quality assurance on all products'
    },
    {
      icon: '🛡️',
      title: 'Secure Payment',
      description: 'Your payments are safe and secure'
    }
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      login(data.user, data.token);
      
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'seller') {
        navigate('/manage-products');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      seller: { email: 'seller@demo.com', password: 'seller123' },
      buyer: { email: 'buyer@demo.com', password: 'buyer123' }
    };

    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
  };

  return (
    <div className="login-page">
      {/* Left Side - Branding & Features */}
      <div className="login-left">
        <div className="brand-section">
          <div className="logo">
            <span className="logo-icon">🏪</span>
            <h1>Carpets and Rugs Store</h1>
          </div>
          <p className="tagline">Luxury Carpets for Every Place</p>
        </div>

        <div className="features-carousel">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-item ${index === currentFeature ? 'active' : ''}`}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="stats-section">
          <div className="stat">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Products</div>
          </div>
          <div className="stat">
            <div className="stat-number">15+</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
              <span className="input-icon">📧</span>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
                <span className="input-icon">🔒</span>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              {/* <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`login-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Login Buttons */}
          {/* <div className="demo-section">
            <p className="demo-label">Quick Demo Login:</p>
            <div className="demo-buttons">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="demo-btn admin"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('seller')}
                className="demo-btn seller"
              >
                Seller Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('buyer')}
                className="demo-btn buyer"
              >
                Buyer Demo
              </button>
            </div>
          </div> */}

          <div className="register-section">
            <p>Don't have an account?</p>
            <Link to="/register" className="register-link">
              Create an account
            </Link>
          </div>

          {/* <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn google">
                <span className="social-icon">🔵</span>
                Google
              </button>
              <button type="button" className="social-btn facebook">
                <span className="social-icon">📘</span>
                Facebook
              </button>
            </div>
          </div> */}
        </div>

        <div className="login-footer">
          <p>&copy; 2025 Carpets and Rugs Store. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>
      <div className="decorative-circle circle-3"></div>
    </div>
  );
}