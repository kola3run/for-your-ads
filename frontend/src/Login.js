import React, { useState } from 'react';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

function Login({ onClose, onSwitchToRegister, setAuthenticated }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { email, password } = formData;

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    console.log('Login data:', formData);
    setSuccess('Login successful! Welcome back!');
    setAuthenticated(true);
    setFormData({ email: '', password: '' });
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In');
    setAuthenticated(true);
    setSuccess('Google Sign-In successful!');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="login-back-btn" onClick={onClose}>
          <FiArrowLeft className="login-back-icon" />
          Back
        </button>
        <div className="login-modal-header">
          <h3>LOGIN</h3>
        </div>
        <div className="login-modal-content">
          {error && <p className="login-error-message">{error}</p>}
          {success && <p className="login-success-message">{success}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <div className="login-input-wrapper">
                <FiMail className="login-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <FiLock className="login-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            <button type="button" className="login-google-btn" onClick={handleGoogleSignIn}>
              <FcGoogle className="login-google-icon" />
              Sign in with Google
            </button>
          </form>
          <p className="login-register-link">
            Don't have an account?{' '}
            <button className="login-link-btn" onClick={onSwitchToRegister}>
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;