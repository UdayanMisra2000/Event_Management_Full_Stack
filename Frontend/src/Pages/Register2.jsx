import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Register2.css";

// The same categories in my schema
const categories = [
  "Sales",
  "Education",
  "Finance",
  "Government&Politics",
  "Consulting",
  "Recruiting",
  "Tech",
  "Marketing",
];

export default function Register2() {
  const { id, email } = useParams();
  const navigate = useNavigate();

  // Local state
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState("");

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!username.trim() || !selectedCategory) {
      setError("Please enter your username and select a category.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/users/registerWithUsername/${id}/${email}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, category: selectedCategory }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // If server returns an error message
        setError(data.message || "Failed to update user.");
        return;
      }

      // If successful
      alert("User updated successfully!");
      localStorage.setItem("token", data.accessToken); // Save token to local storage
      navigate("/create-event"); // Redirect to create event page
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="register2-container">
      {/* Left section (form) */}
      <div className="register2-form-section">
        <h1>Your Preferences</h1>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="username-input">
            <label htmlFor="username">Tell us your username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. SarthakPal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Categories */}
          <p>Select one category that best describes your CNNCT:</p>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={
                  selectedCategory === cat ? "category-btn selected" : "category-btn"
                }
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {error && <p className="error">{error}</p>}

          {/* Submit Button */}
          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>
      </div>
      {/* Right section (image) */}
      <div className="register2-image-section">
        {/* Replace the src with your own image URL */}
        <img
          src="https://images.pexels.com/photos/3807693/pexels-photo-3807693.jpeg"
          alt="Right side"
        />
      </div>
    </div>
  );
}

