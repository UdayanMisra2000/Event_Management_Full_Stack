import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./HomePage.css"; // optional external CSS
import img2 from "../Images/Booking.png"

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = () => {
    navigate("/register"); // Navigate to the Sign Up page
  };

  const handleLogIn = () => {
    navigate("/login"); // Navigate to the Log In page
  };

  return (
    <div className="homepage-container">
      {/* ========== HERO SECTION ========== */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>CNNCT – Easy Scheduling Ahead</h1>
          <p>
            CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what
            matters. Set your availability, share your link, and let others book time with you
            instantly.
          </p>
          <button className="cta-button" onClick={handleSignUp}>
            Sign up free
          </button>
        </div>
        <div className="hero-image">
          {/* Replace with your actual image or screenshot */}
          <img
            src={img2}
            alt="Booking screenshot"
          />
        </div>
      </section>

      {/* ========== FEATURES / EXPLANATION SECTION ========== */}
      <section className="features-section">
        <h2>Simplified scheduling for you and your team</h2>
        <p>
          CNNCT streamlines meeting scheduling by letting you set your availability and share a
          simple link. Your clients and colleagues can then pick a time that works for everyone,
          eliminating the endless email threads.
        </p>
        <div className="features-grid">
          <div className="feature-box">
            <h3>Stay Organized</h3>
            <p>All your upcoming meetings in one place.</p>
          </div>
          <div className="feature-box">
            <h3>Seamless Integrations</h3>
            <p>Connect with your calendar, CRM, and more.</p>
          </div>
          <div className="feature-box">
            <h3>Secure & Private</h3>
            <p>We prioritize your data privacy and security.</p>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="testimonials-section">
        <h2>Here’s what our customers have to say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              “Amazing tool! Saved me months. This is a placeholder for your testimonials and what
              your client has to say. You can show how user data is 100% true and meaningful.”
            </p>
            <strong>– Customer Name</strong>
          </div>
          <div className="testimonial-card">
            <p>
              “Another glowing testimonial. CNNCT has made my scheduling seamless. I can’t imagine
              going back to emailing back and forth!”
            </p>
            <strong>– Another Customer</strong>
          </div>
          <div className="testimonial-card">
            <p>
              “Couldn’t live without it. Scheduling was always a pain, but with CNNCT, it’s so easy
              and straightforward. Highly recommend!”
            </p>
            <strong>– Happy User</strong>
          </div>
        </div>
      </section>

      {/* ========== INTEGRATIONS SECTION ========== */}
      <section className="integrations-section">
        <h2>All Link Apps and Integrations</h2>
        <div className="integrations-grid">
          {/* Replace placeholder images or text with your actual integration logos */}
          <div className="integration-logo">Audionook</div>
          <div className="integration-logo">Badaamazon</div>
          <div className="integration-logo">Bonjo</div>
          <div className="integration-logo">Buy Me a DRI</div>
          <div className="integration-logo">Clickhouse</div>
          <div className="integration-logo">Community</div>
          <div className="integration-logo">Contact Details</div>
        </div>
      </section>

      {/* ========== FOOTER SECTION ========== */}
      <footer className="footer-section">
        <div className="footer-links">
          <button className="footer-link" onClick={handleLogIn}>
            Log in
          </button>
          <button className="footer-link" onClick={handleSignUp}>
            Sign up
          </button>
        </div>
        <p className="footer-text">
          We have transformed the traditional way of scheduling by allowing you to share your link,
          let others pick a time, and automatically manage your calendar. No more emailing back and
          forth, no more confusion.
        </p>
        <div className="footer-socials">
          {/* Replace with icons or links to your actual social media pages */}
          <span>Facebook</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
          <span>Instagram</span>
        </div>
        <p style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
          &copy; {new Date().getFullYear()} CNNCT. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
