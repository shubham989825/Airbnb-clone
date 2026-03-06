import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("token");
  console.log("Token in Navbar:", token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Airbnb Clone</Link>
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/profile" className="navbar-button">Profile</Link>
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">Login</Link>
            <Link to="/register" className="navbar-button">Register</Link>
            <Link to="/add-property" className="navbar-button">Add Property</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
