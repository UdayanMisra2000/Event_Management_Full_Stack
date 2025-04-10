import React, { useState, useEffect } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Availability = () => {
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({ day, times: [] }))
  );
  const [error, setError] = useState(null);

  // Fetch availability on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`https://event-management-full-stack-2.onrender.com/users/getAvailability`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json" ,
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
          credentials: "include", 
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch availability: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Fetched availability:", data);
        const newAvailability = daysOfWeek.map((day) => ({
          day,
          times: data.availability[day] || [], 
        }));
        setAvailability(newAvailability);
      } catch (err) {
        console.error("Error fetching availability:", err.message);
        setError(err.message);
      }
    };

    fetchAvailability();
  }, []);

  const updateAvailabilityAPI = async (newAvailability) => {
    try {
      const availabilityObj = newAvailability.reduce((acc, { day, times }) => {
        acc[day] = times;
        return acc;
      }, {});
      console.log("Updating availability:", availabilityObj); 
      const res = await fetch(`https://event-management-full-stack-2.onrender.com/users/updateAvailability`, {
        method: "PUT",
        headers: { 
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json" 
        },
        credentials: "include",
        body: JSON.stringify({ availability: availabilityObj }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update availability: ${res.statusText}`);
      }
      const data = await res.json();
      console.log("Updated availability response:", data); 
      return data;
    } catch (err) {
      console.error("Error updating availability:", err.message); 
      setError(err.message);
    }
  };

  const addTimeSlot = async (dayIndex) => {
    if (availability[dayIndex].day === "Sun") return; // Sunday remains unavailable
    const newAvailability = [...availability];
    newAvailability[dayIndex].times.push({ from: "", to: "" });
    setAvailability(newAvailability);
    await updateAvailabilityAPI(newAvailability);
  };

  const updateTimeSlot = async (dayIndex, timeIndex, field, value) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].times[timeIndex][field] = value;
    setAvailability(newAvailability);
    await updateAvailabilityAPI(newAvailability);
  };

  const removeTimeSlot = async (dayIndex, timeIndex) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].times.splice(timeIndex, 1);
    setAvailability(newAvailability);
    await updateAvailabilityAPI(newAvailability);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Availability</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div>
        {availability.map((dayData, dayIndex) => (
          <div key={dayData.day} style={{ marginBottom: "1rem" }}>
            <strong>{dayData.day}:</strong>{" "}
            {dayData.day === "Sun" ? (
              <span>Unavailable</span>
            ) : (
              <>
                {dayData.times.map((time, timeIndex) => (
                  <div
                    key={timeIndex}
                    style={{
                      display: "inline-block",
                      marginRight: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <input
                      type="time"
                      value={time.from || ""}
                      onChange={(e) =>
                        updateTimeSlot(dayIndex, timeIndex, "from", e.target.value)
                      }
                    />{" "}
                    -{" "}
                    <input
                      type="time"
                      value={time.to || ""}
                      onChange={(e) =>
                        updateTimeSlot(dayIndex, timeIndex, "to", e.target.value)
                      }
                    />{" "}
                    <button onClick={() => removeTimeSlot(dayIndex, timeIndex)}>
                      X
                    </button>
                  </div>
                ))}
                <button onClick={() => addTimeSlot(dayIndex)}>+</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Availability;
