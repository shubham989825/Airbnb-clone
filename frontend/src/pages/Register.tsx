import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import "../styles/Login.css";



const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");



  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault();



    try {

      const res = await axiosInstance.post("/auth/register", { name, email, password });

      

      if (res.data.token) {

        localStorage.setItem("token", res.data.token);

        // Store user data for profile

        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Registration successful");

        navigate("/");

      } else {

        alert(res.data.message || "Registration failed");

      }

    } catch (error: any) {

      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");

    }

  };



  return (

    <div className="login-page">

      <div className="login-card">

        <h2 className="login-title">Create Account 🚀</h2>



        <form className="login-form" onSubmit={handleRegister}>

          <input

            type="text"

            placeholder="Enter your name"

            className="login-input"

            value={name}

            onChange={(e) => setName(e.target.value)}

            required

          />



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

            Register

          </button>

        </form>



        <p className="login-footer">

          Already have an account?{" "}

          <Link to="/login" className="login-link">

            Login

          </Link>

        </p>

      </div>

    </div>

  );

};



export default Register;