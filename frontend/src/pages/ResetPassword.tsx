import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Login.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || "Your password has been reset.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error: any) {
      setError(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Create New Password</h2>

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
            type="password"
            placeholder="New password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="login-footer">
          Go back to <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
