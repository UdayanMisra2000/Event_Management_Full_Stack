import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventPage2.css";

const EventPage2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bannerImage: "",
        backgroundColor: "#000000",
        eventLink: "",
        participants: ""
    });

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`https://event-management-full-stack-2.onrender.com/events/getEvent/${id}`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include",
                });
                const data = await response.json();
                if (response.ok) {
                    setFormData({
                        bannerImage: data.bannerImage || "",
                        backgroundColor: data.backgroundColor || "#000000",
                        eventLink: data.eventLink || "",
                        participants: data.participants.join(", ") || ""
                    });
                } else {
                    alert(data.message || "Something went wrong");
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchEventData();
    }, [id]); 

    const validateEmails = (emails) => {
        const emailArray = emails.split(",").map((email) => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailArray.every((email) => emailRegex.test(email));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmails(formData.participants)) {
            alert("Please enter valid email addresses.");
            return;
        }
        try {
            const response = await fetch(`https://event-management-full-stack-2.onrender.com/events/updateEvent/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                alert("Event updated successfully");
                navigate("/user/event");
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error updating event:", error);
            alert("An error occurred while updating the event. Please try again.");
        }
    };

    return (
        <div className="page2-container">
            <h2>Add Event</h2>
            <div className="banner-preview" style={{ backgroundColor: formData.backgroundColor }}>
                <div>Banner Preview</div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} />
                <input
                    type="text"
                    name="eventLink"
                    placeholder="Add Link *"
                    value={formData.eventLink}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="participants"
                    placeholder="Add Emails * (comma separated)"
                    value={formData.participants}
                    onChange={handleChange}
                    required
                />
                <div className="buttons">
                    <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EventPage2;
