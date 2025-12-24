import React, { useState } from 'react';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      alert('Password Reset Successfully!');
      navigate('/login');
    } catch (err) {
      alert('Error resetting password');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;