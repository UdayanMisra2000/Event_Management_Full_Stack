import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EventPage1.css";

const EventPage1 = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        topic: "",
        password: "",
        hostname: "",
        description: "",
        dateTime: "",
        duration: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://event-management-full-stack-2.onrender.com/events/createEvent`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                navigate(`/user/create-event/${data.event._id}`);
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <div className="page1-container">
            <h2>Add Event</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="topic" placeholder="Event Topic *" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <input type="text" name="hostname" placeholder="Host Name (Give hosts' registered username) *" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} />
                <input type="datetime-local" name="dateTime" onChange={handleChange} required />
                <select name="duration" onChange={handleChange}>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                </select>
                <div className="buttons">
                    <button type="button" onClick={() => navigate(`/user/event`)}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EventPage1;
