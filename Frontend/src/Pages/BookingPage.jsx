import React, { useState, useEffect } from "react";
import { updateEvent } from "../../../Backend/Controllers/Events";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "canceled", label: "Canceled" },
  { key: "past", label: "Past" },
];

const BookingPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming"); // Default tab
  const [events, setEvents] = useState([]); // Events state
  const [showParticipants, setShowParticipants] = useState(null); // Popup state
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch events whenever the activeTab changes
  useEffect(() => {
    fetchAllEvents();
  }, [activeTab]);

  const fetchAllEvents = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/events/myEvents?tab=${activeTab}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data); // Set events
    } catch (error) {
      setError(error.message); // Set error message
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleAccept = async (eventId) => {
    if (!window.confirm("Are you sure you want to accept this event?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/events/accept/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "accepted" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to accept event");
      }
      fetchAllEvents(); // Refresh events
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (eventId) => {
    if (!window.confirm("Are you sure you want to reject this event?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/events/reject/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "rejected" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject event");
      }
      fetchAllEvents(); // Refresh events
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowParticipants = (event) => {
    const acceptedParticipants = event.participants.filter(
      (p) => p.status !== "rejected"
    );
  
    const allParticipants = [
      ...acceptedParticipants,
      { name: event.hostname, email: event.hostname, status: "Host" }
    ];
  
    setShowParticipants({
      eventId: event._id,
      participants: allParticipants,
      host: event.hostname
    });
  };  

  const handleCloseParticipants = () => {
    setShowParticipants(null);
  };

  const filteredEvents = events;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Booking</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              backgroundColor: activeTab === tab.key ? "#007bff" : "#eee",
              color: activeTab === tab.key ? "#fff" : "#000",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Loading Indicator */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table
          width="100%"
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Meeting Topic</th>
              <th>Status / Actions</th>
              <th>Participants</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={4}>No events found.</td>
              </tr>
            ) : (
              filteredEvents.map((event) => {
                const dateStr = new Date(event.dateTime).toLocaleString();
                return (
                  <tr key={event._id}>
                    <td>{dateStr}</td>
                    <td>{event.topic}</td>
                    <td>
                      {event.isHost ? (
                        <span>Host</span>
                      ) : event.userStatus === "pending" ? (
                        <>
                          <button onClick={() => handleAccept(event._id)}>Accept</button>
                          <button onClick={() => handleReject(event._id)}>Reject</button>
                        </>
                      ) : (
                        <span>{event.userStatus}</span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShowParticipants(event)}
                      >
                        {
                          event.participants.filter(
                            (p) => p.status !== "rejected"
                          ).length
                        }
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      {/* Participant Modal */}
      {showParticipants && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "1rem",
            border: "1px solid #000",
          }}
        >
          <h3>Participants</h3>
          {showParticipants.participants.length > 0 ? (
            <ul>
            {showParticipants.participants.map((p) => (
              <li key={p.email}>
                {p.name || p.email}
                {p.status === "Host" && <strong style={{ color: "green" }}> [Host]</strong>}
              </li>
            ))}
          </ul>
          ) : (
            <p>No participants available.</p>
          )}
          <button onClick={handleCloseParticipants}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
