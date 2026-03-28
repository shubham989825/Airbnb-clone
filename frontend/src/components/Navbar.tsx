import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏠 Airbnb Clone
      </Link>
      <div className="navbar-links">
        {/* Show Home button only when not on home page */}
        {currentPath !== "/" && (
          <Link to="/" className="navbar-button">🏠 Home</Link>
        )}
        
        {token ? (
          <>
            <Link to="/wishlist" className="navbar-button">❤️ Wishlist</Link>
            <Link to="/add-property" className="navbar-button">➕ Add Property</Link>
            <Link to="/profile" className="navbar-button">👤 Profile</Link>
            <button onClick={handleLogout} className="navbar-button">🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">🔐 Login</Link>
            <Link to="/register" className="navbar-button">📝 Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
