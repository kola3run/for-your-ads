import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiArrowLeft, FiBriefcase } from 'react-icons/fi';
import './Register.css';

function Register({ onClose, onSwitchToLogin, setAuthenticated }) {
  const [userType, setUserType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerifyEmail = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email to verify');
      return;
    }
    setEmailVerified(true);
    setSuccess('Verification code sent to your email!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    if (!emailVerified) {
      setError('Please verify your email');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log('Registration:', { userType, ...formData });
    setSuccess('Registration successful! Closing...');
    setAuthenticated(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="register-modal-back-btn" onClick={onClose}>
          <FiArrowLeft className="register-modal-back-icon" />
          Back
        </button>
        <div className="register-modal-header">
          <h3>REGISTER</h3>
        </div>
        <div className="register-modal-content">
          <div className="register-modal-user-type-toggle">
            <button
              type="button"
              className={`register-modal-toggle-btn ${userType === 'individual' ? 'active' : ''}`}
              onClick={() => setUserType('individual')}
            >
              Individual
            </button>
            <button
              type="button"
              className={`register-modal-toggle-btn ${userType === 'organization' ? 'active' : ''}`}
              onClick={() => setUserType('organization')}
            >
              Organization
            </button>
          </div>
          {error && <p className="register-modal-error-message">{error}</p>}
          {success && <p className="register-modal-success-message">{success}</p>}
          <form onSubmit={handleSubmit} className="register-modal-form">
            <div className="register-modal-form-group">
              <label htmlFor="name">
                {userType === 'individual' ? 'Name' : 'Organization Name'}
              </label>
              <div className="register-modal-input-wrapper">
                {userType === 'individual' ? (
                  <FiUser className="register-modal-input-icon" />
                ) : (
                  <FiBriefcase className="register-modal-input-icon" />
                )}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={
                    userType === 'individual' ? 'Enter your name' : 'Enter organization name'
                  }
                />
              </div>
            </div>
            <div className="register-modal-form-group register-modal-email-group">
              <label htmlFor="email">Email</label>
              <div className="register-modal-input-wrapper">
                <FiMail className="register-modal-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={emailVerified}
                />
                {!emailVerified && (
                  <button
                    type="button"
                    className="register-modal-verify-btn"
                    onClick={handleVerifyEmail}
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
            <div className="register-modal-form-group">
              <label htmlFor="password">Password</label>
              <div className="register-modal-input-wrapper">
                <FiLock className="register-modal-input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="register-modal-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="register-modal-input-wrapper">
                <FiLock className="register-modal-input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <button type="submit" className="register-modal-btn">
              Register
            </button>
          </form>
          <p className="register-modal-login-link">
            Already have an account?{' '}
            <button className="register-modal-link-btn" onClick={onSwitchToLogin}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;