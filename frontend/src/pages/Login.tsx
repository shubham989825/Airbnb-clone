import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGoogleCredentialResponse = async (response: any) => {
    setGoogleError("");
    setGoogleLoading(true);

    try {
      const res = await axiosInstance.post("/auth/google-login", {
        idToken: response.credential,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role || "user",
        }));
        alert(`Login successful! Welcome ${res.data.name} 🎉`);
        navigate("/");
      } else {
        setGoogleError(res.data.message || "Google login failed");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Google login failed";
      setGoogleError(errorMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const google = (window as any).google;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!google || !clientId) {
      return;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large", width: "100%", text: "continue_with" }
    );
  }, []);

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Attempting login with:", email);
      
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      console.log("✅ Login response:", res.data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        
        // Save user data (without token) to localStorage
        const userData = {
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role || "user"
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ Token and user data saved to localStorage");
        console.log("👤 User:", res.data.name, `(Email: ${res.data.email})`);
        
        alert(`Login successful! Welcome ${res.data.name} 🎉`);
        navigate("/");
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Something went wrong";
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back! 👋</h2>

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

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ margin: "20px 0", textAlign: "center" }}>
          <span style={{ color: "#777", fontSize: "14px" }}>or</span>
        </div>

        <div id="googleSignInDiv" style={{ width: "100%", marginBottom: "10px" }} />
        {googleLoading && (
          <div style={{ marginBottom: "12px", color: "#2e7d32" }}>
            Signing in with Google...
          </div>
        )}
        {googleError && (
          <div style={{ marginBottom: "12px", color: "#c62828", fontSize: "14px" }}>
            ⚠️ {googleError}
          </div>
        )}

        <p className="login-footer">
          <Link to="/forgot-password" className="login-link">
            Forgot password?
          </Link>
        </p>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">
            Register
          </Link>
        </p>

        {/* Test credentials info */}
        <div style={{
          background: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '6px',
          padding: '10px',
          marginTop: '15px',
          fontSize: '12px',
          color: '#2e7d32'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>🧪 Test Credentials:</p>
          <p style={{ margin: '0 0 4px 0' }}>Email: testuser1775160481503@example.com</p>
          <p style={{ margin: '0' }}>Password: TestPassword123!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
