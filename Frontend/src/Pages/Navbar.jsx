import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend logout API
      const response = await fetch(`https://event-management-full-stack-2.onrender.com/users/logout`, {
        method: "POST",
        credentials: "include", // Include cookies if needed
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Navigate to the home page
        navigate("/");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        paddingTop: "1rem",
      }}
    >
      <div>
        <h2 style={{ margin: "1rem" }}>CNNCT</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button style={navButtonStyle} onClick={() => navigate("/user/event")}>
            Events
          </button>
          <button style={navButtonStyle} onClick={() => navigate("/user/book-event")}>
            Booking
          </button>
          <button style={navButtonStyle} onClick={() => navigate("/user/availability")}>
            Availability
          </button>
          <button style={navButtonStyle} onClick={() => navigate("/user/settings")}>
            Settings
          </button>
          <button
            style={{ ...navButtonStyle, backgroundColor: "#007bff", color: "#fff" }}
            onClick={() => navigate("/user/create-event")}
          >
            + Create
          </button>
        </nav>
      </div>

      {/* Sign out at bottom-left */}
      <div style={{ margin: "1rem" }}>
        <button
          style={{
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#ff4d4d",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          {localStorage.getItem("username") || "User"} (Sign out)
        </button>
      </div>
    </div>
  );
};

// Minimal styles for nav buttons
const navButtonStyle = {
  padding: "0.5rem 1rem",
  margin: "0.5rem",
  backgroundColor: "rgba(16, 14, 14, 0.25)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  textAlign: "left",
};

export default Navbar;
