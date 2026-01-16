import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user")); 

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Hackathons", path: "/hackathons" },
    { label: "Find Teammates", path: "/teammates" },
    {
      label: "Dashboard",
      path: user ? `/dashboard/${user.id}` : "/login", 
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 

  toast.success("Logged out successfully 👋");
  navigate("/login");
};

  return (
    <>
      <nav className="navbar" ref={menuRef}>
        <div className="navbar-inner">
          {/* LOGO */}
          <div className="navbar-logo">
            <span className="logo-text-nav">
              Team<span className="logo-up-nav">UP</span>
            </span>
          </div>

          {/* DESKTOP NAV */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP AUTH */}
          <div className="auth-desktop">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-btn-nav">
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="login-btn-nav"
                  style={{ textDecoration: "none" }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="signup-btn-nav"
                  style={{ textDecoration: "none" }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`nav-mobile ${menuOpen ? "show" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="auth-mobile">
            {isLoggedIn ? (
              <button
                className="logout-btn-nav"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="login-btn-nav"
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="signup-btn-nav"
                  onClick={() => setMenuOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-spacer" />
    </>
  );
}
