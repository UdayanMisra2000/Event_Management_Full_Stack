import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        padding: "1rem",
        backgroundColor: "#f44336",
        color: "#fff",
        borderRadius: "5px",
        zIndex: 9999,
      }}
    >
      {message}
      <button
        style={{
          marginLeft: "1rem",
          backgroundColor: "#fff",
          color: "#f44336",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

const EventPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/events/getEventsCreatedByUser", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await res.json();
      setEvents(data);
      checkForConflicts(data);
    } catch (err) {
      console.error("Error fetching user events:", err);
    }
  };

  const checkForConflicts = (eventsData) => {
    const sorted = [...eventsData].sort(
      (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      const currentEnd = new Date(sorted[i].dateTime);
      const nextStart = new Date(sorted[i + 1].dateTime);
      if (currentEnd.getTime() === nextStart.getTime()) {
        setToastMessage("Conflict detected between events!");
        return;
      }
    }
  };

  const handleToggleActive = async (eventId, currentValue) => {
    try {
      const res = await fetch(`http://localhost:5000/events/toggleActive/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ isActive: !currentValue }),
      });
      if (!res.ok) {
        throw new Error("Failed to update active state");
      }
      fetchUserEvents();
    } catch (err) {
      console.error("Error toggling active state:", err);
    }
  };

  const handleEdit = (eventId) => {
    navigate("/create-event");
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`http://localhost:5000/events/deleteEvent/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delete event");
      }
      fetchUserEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleCloseToast = () => {
    setToastMessage("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Event Types</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => {
            const eventDate = new Date(event.dateTime).toLocaleString();
            return (
              <div
                key={event._id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: event.isActive ? "#eef5ff" : "#f0f0f0",
                }}
              >
                <h3 style={{ marginTop: 0 }}>{event.topic}</h3>
                <p style={{ margin: 0 }}>
                  {eventDate} <br />
                  Duration: {event.duration}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}>
                      <input
                        type="checkbox"
                        checked={event.isActive}
                        onChange={() => handleToggleActive(event._id, event.isActive)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          cursor: "pointer",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: event.isActive ? "#4caf50" : "#ccc",
                          transition: "0.4s",
                          borderRadius: "20px",
                        }}
                      ></span>
                      <span
                        style={{
                          position: "absolute",
                          height: "14px",
                          width: "14px",
                          left: event.isActive ? "22px" : "4px",
                          bottom: "3px",
                          backgroundColor: "#fff",
                          transition: "0.4s",
                          borderRadius: "50%",
                        }}
                      ></span>
                    </label>
                    <span style={{ marginLeft: "0.5rem" }}>
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <button style={{ marginRight: "0.5rem", cursor: "pointer" }} onClick={() => handleEdit(event._id)}>
                      &#9998;
                    </button>
                    <button style={{ cursor: "pointer" }} onClick={() => handleDelete(event._id)}>
                      &#128465;
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Toast message={toastMessage} onClose={handleCloseToast} />
    </div>
  );
};

export default EventPage;
