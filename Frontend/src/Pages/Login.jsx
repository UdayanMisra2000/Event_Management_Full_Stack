import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import img1 from "../Images/Login.png";

function Login() {
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!(email && password)) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      } else {
        alert(data.message); 
        localStorage.setItem("token", data.accessToken); // Save token to local storage
        navigate("/event"); // Redirect to dashboard
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT: FORM */}
      <div className="auth-form-container">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <label>Email/Username</label>
          <input
            type="text"
            placeholder="Enter your email or username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

          <button type="submit">Log in</button>
        </form>
        <p className="toggle-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      {/* RIGHT: IMAGE */}
      <div className="auth-image-container" />
      <img src={img1} alt="Login Illustration" className="auth-image" />
    </div>
  );
}

export default Login;
