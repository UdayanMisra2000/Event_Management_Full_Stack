import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventPage1.css";

const UpdateEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: "",
    password: "",
    hostname: "",
    description: "",
    dateTime: "",
    duration: "1 hour",
  });

  // Fetch the existing event details to pre-populate the form
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `https://event-management-full-stack-2.onrender.com/events/getEventById/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setFormData({
            topic: data.topic || "",
            password: "", // Do not pre-populate password for security
            hostname: data.hostname || "",
            description: data.description || "",
            dateTime: data.dateTime
              ? new Date(data.dateTime).toISOString().slice(0, 16)
              : "",
            duration: data.duration || "1 hour",
          });
        } else {
          alert(data.message || "Failed to load event details");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://event-management-full-stack-2.onrender.com/events/updateCreateEvent/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Navigate to the event details page or any other desired route
        navigate(`/create-event/${id}`);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="page1-container">
      <h2>Update Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          placeholder="Event Topic *"
          value={formData.topic}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="hostname"
          placeholder="Host Name (Give hosts' registered username) *"
          value={formData.hostname}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={formData.dateTime}
          onChange={handleChange}
          required
        />
        <select name="duration" value={formData.duration} onChange={handleChange}>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="3 hours">3 hours</option>
        </select>
        <div className="buttons">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEventPage;
