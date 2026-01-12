import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* This container aligns the navbar content with the page content */}
      <div className="navbar-container"> 
        <Link to="/" className="nav-logo">TeamUP</Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-item">Explore</Link>
          
          {token ? (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <button onClick={handleLogout} className="btn-logout-link">Logout</button>
            </>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" className="nav-login">Log in</Link>
              <Link to="/signup" className="nav-signup-btn">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;