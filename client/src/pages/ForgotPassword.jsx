import React, { useState } from 'react';
import api from '../api';
import '../Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Reset link sent to backend console (Simulation).');
    } catch (err) {
      setMessage('Error sending email.');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Forgot Password</h2>
        {message && <p style={{color: 'green', textAlign:'center'}}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn">Send Link</button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;