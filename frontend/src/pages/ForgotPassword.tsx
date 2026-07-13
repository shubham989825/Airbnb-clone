import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage(res.data.message || "If that email exists, reset instructions have been sent.");
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Reset Password</h2>

        {error && (
          <div className="error-message" style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            ✅ {message}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your account email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Sending email..." : "Send reset link"}
          </button>
        </form>

        <p className="login-footer">
          Remembered your password? <Link to="/login" className="login-link">Login</Link>
        </p>

        <p className="login-footer">
          Don't have an account? <Link to="/register" className="login-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
