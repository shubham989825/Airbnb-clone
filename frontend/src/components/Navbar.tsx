import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/air logo.jpeg";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      {/*  Logo Left */}
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Airbnb logo" className="logo-img" />
      </Link>

      {/* Icon Buttons Right */}
      <div className="button-container">

        {/* Home */}
        {currentPath !== "/" && (
          <button className="button" onClick={() => navigate("/")}>
            🏠
          </button>
        )}

        {token ? (
          <>
            {/* Wishlist */}
            <button className="button" onClick={() => navigate("/wishlist")}>
              ❤️
            </button>

            {/* Add Property */}
            <button className="button" onClick={() => navigate("/add-property")}>
              ➕ 
    
            </button>

            {/* Profile */}
            <button className="button" onClick={() => navigate("/profile")}>
              👤
            </button>

            {/* Logout */}
            <button className="button" onClick={handleLogout}>
              logout
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <button className="button" onClick={() => navigate("/login")}>
              🔐login
            </button>

            {/* Register */}
            <button className="button" onClick={() => navigate("/register")}>
              📝Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;