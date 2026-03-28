import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthTest = () => {
  const [authStatus, setAuthStatus] = useState<string>("Checking...");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      console.log("Token:", token);
      console.log("User:", user);
      
      if (!token) {
        setAuthStatus("No token found");
        return;
      }

      try {
        const response = await axiosInstance.get("/api/profile/profile");
        console.log("Auth test response:", response.data);
        setAuthStatus("✅ Auth working - User: " + response.data.user.name);
      } catch (error: any) {
        console.error("Auth test error:", error);
        setAuthStatus("❌ Auth failed: " + (error.message || "Unknown error"));
      }
    };

    checkAuth();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Authentication Test</h2>
      <p>{authStatus}</p>
      <button 
        onClick={() => window.location.href = "/login"}
        style={{ padding: "10px 20px", background: "#ff5a5f", color: "white", border: "none", borderRadius: "5px" }}
      >
        Go to Login
      </button>
    </div>
  );
};

export default AuthTest;
