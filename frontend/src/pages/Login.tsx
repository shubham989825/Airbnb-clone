import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        // Store user data for profile
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        alert("Login successful");
        navigate("/");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back! 👋</h2>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
