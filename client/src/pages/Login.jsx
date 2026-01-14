import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
            <h2>Welcome back</h2>
            <p>Log in to your account to continue</p>
          </div>

          {successMessage ? (
            <div className="auth-message auth-success">{successMessage}</div>
          ) : error ? (
            <div className="auth-message auth-error">{error}</div>
          ) : (
            <div className="auth-message-placeholder"></div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                placeholder="••••••••"
                disabled={loading}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;