import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateUserPage.css";

const UpdateUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // user ID from URL (e.g., /update-user/123)

  // State to store form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Optional: fetch user details to pre-populate the form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const user = await response.json();
        // Pre-populate form with existing user data
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit the form -> PUT request to update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Optional: check if passwords match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/users/updateRegister/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password, // optional if user wants to change
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Something went wrong");
      } else {
        alert("User updated successfully");
        // Navigate away or refresh
        navigate("/profile"); // or wherever you want to go after updating
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="update-user-page">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="update-user-form">
        <label>
          First name
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last name
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="save-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
