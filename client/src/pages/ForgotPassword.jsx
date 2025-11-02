import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // Reuse the same CSS

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send reset code');
        return;
      }

      setMessage('Password reset code sent to your email!');
      setStep(2);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-section">
          <div className="logo">
            <span className="logo-icon">🏪</span>
            <h1>Carpets and Rugs Store</h1>
          </div>
          <p className="tagline">Reset Your Password</p>
        </div>

        <div className="features-carousel">
          <div className="feature-item active">
            <div className="feature-icon">🔒</div>
            <h3>Secure Password Reset</h3>
            <p>We'll send a verification code to your email</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode} className="login-form">
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

              <button
                type="submit"
                disabled={loading}
                className={`login-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Sending Code...
                  </>
                ) : (
                  'Send Reset Code'
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <ResetPasswordForm email={email} />
          )}

          <div className="register-section">
            <p>Remember your password?</p>
            <Link to="/login" className="register-link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResetPasswordForm({ email }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code, 
          newPassword 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to reset password');
        return;
      }

      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResetPassword} className="login-form">
      <div className="form-group">
        <label htmlFor="code">Verification Code</label>
        <input
          id="code"
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="input-field"
          maxLength="6"
        />
        <span className="input-icon">🔢</span>
      </div>

      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <div className="password-input-container">
          <input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input-field"
        />
        <span className="input-icon">🔒</span>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`login-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Resetting Password...
          </>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );
}