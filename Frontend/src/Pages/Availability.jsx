import React, { useState, useEffect, useMemo } from "react";
import AvailabilitySection from "./AvailabilitySection";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Tabs for Availability
const TABS = [
  { key: "availability", label: "Availability" },
  { key: "calendar", label: "Calendar View" },
];

// Create localizer with moment
const localizer = momentLocalizer(moment);

const Availability = () => {
  const [activeTab, setActiveTab] = useState("availability");
  const [events, setEvents] = useState([]);   // raw events from backend
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch events once on mount (or whenever you want)
  useEffect(() => {
    if (activeTab === "calendar") {
      const startDate = new Date().toISOString();
      const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();
      fetchCalendarEvents(startDate, endDate);
    }
  }, [activeTab]);

  const fetchCalendarEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://event-management-full-stack-2.onrender.com/events/myEvents?tab=all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // Convert our fetched events to big-calendar compatible events
  const transformToCalendarEvents = (rawEvents) => {
    return rawEvents.map((ev) => {
      // Start & end times
      const start = new Date(ev.dateTime);
      const durationHours = parseInt(ev.duration, 10) || 1;
      const end = new Date(start);
      end.setHours(end.getHours() + durationHours);
      console.log("Start Date:", start);
      console.log("End Date:", end);

      return {
        id: ev._id,
        title: ev.topic,
        start,
        end,
        // We'll store the userStatus so we can style it
        status: ev.userStatus, 
      };
    });
  };

  // Big Calendar event style
  const eventPropGetter = (event) => {
    let newStyle = {
      backgroundColor: "#d9d9d9",
      color: "black",
      borderRadius: "0px",
      border: "none",
      display: "block",
    };
    if (event.status === "accepted") {
      newStyle.backgroundColor = "blue";
      newStyle.color = "white";
    } else if (event.status === "rejected") {
      newStyle.backgroundColor = "gray";
      newStyle.color = "white";
    }
    return { style: newStyle };
  };

  const handleEventClick = (event) => {
    console.log("Event clicked:", event);
    // Navigate to event details or open a modal
  };
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  // Prepare the data for the calendar
  const calendarEvents = useMemo(() => {
    console.log("Transforming events:", events); // Debug log
    return transformToCalendarEvents(events);
  }, [events]);

  // Render
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Availability</h1>
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

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Content based on activeTab */}
      {activeTab === "availability" ? (
        // 1)"Availability" tab
        <AvailabilitySection />
      ) : (
        // 2) Calendar View
        <div style={{ height: "600px" }}>
          {isLoading ? (
            <p>Loading calendar...</p>
          ) : (
            <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventPropGetter}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            toolbar={true}
            date={currentDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleEventClick}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Availability;
