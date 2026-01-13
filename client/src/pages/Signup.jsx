import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'medium';
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({...formData, password: newPassword});
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.fullname.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/signup', formData);
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="back-to-home">
        <Link to="/">← Back</Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1 className="auth-logo-text">TeamUP</h1>
          </div>

          <div className="auth-header">
            <h2>Create your account</h2>
            <p>Start finding your perfect team today</p>
          </div>

          {error ? (
            <div className="auth-message auth-error">{error}</div>
          ) : (
            <div className="auth-message-placeholder"></div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text"
                className="form-input"
                value={formData.fullname}
                onChange={(e) => setFormData({...formData, fullname: e.target.value})} 
                placeholder="David Mills"
                disabled={loading}
                required 
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                placeholder="example@gmail.com"
                disabled={loading}
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                className="form-input"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                disabled={loading}
                minLength="6"
                required 
              />
              {passwordStrength && (
                <div className={`password-strength password-${passwordStrength}`}>
                  {passwordStrength === 'weak' && '● Weak password'}
                  {passwordStrength === 'medium' && '●● Medium password'}
                  {passwordStrength === 'strong' && '●●● Strong password'}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;