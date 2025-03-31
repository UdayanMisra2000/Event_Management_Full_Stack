import Event from "../Models/Events.js";

export const createEvent = async (req, res) => {
    const { topic, password, hostname, description, dateTime, duration } = req.body;

    // Validate input
    if (!(topic && hostname && dateTime)) {
        return res.status(400).json({ message: 'All marked inputs are required' });
    }

    try {
        // Create the new event
        const newEvent = new Event({
            topic,
            password,
            hostname,
            description,
            dateTime,
            duration
        });
        // Save the event to the database
        await newEvent.save();

        // Respond with success (exclude sensitive fields like password)
        const { password: _, ...eventWithoutPassword } = newEvent.toObject();
        res.status(201).json({ message: 'Event created successfully', event: eventWithoutPassword });
    } catch (error) {
        console.error('Error saving event:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateCreateEvent = async (req, res) => {
    const { id } = req.params;
    const { topic, password, hostname, description, dateTime, duration } = req.body;

    // Validate input
    if (!(topic && hostname && dateTime)) {
        return res.status(400).json({ message: 'All marked inputs are required' });
    }

    try {
        // Update the event
        await Event.findByIdAndUpdate(id, {
            topic,
            password,
            hostname,
            description,
            dateTime,
            duration
        },{new: true, runValidators: true});

        // Respond with success
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { bannerImage, backgroundColor, eventLink, participants } = req.body;

    // Validate input
    if (!(eventLink && participants)) {
        return res.status(400).json({ message: 'All marked inputs are required' });
    }

    // Split the participants string into an array
    const participantsArray = participants.split(',').map(email => ({
        email: email.trim(),
        status: 'pending' // or set to a default or keep existing if updating
      }));

    try {
        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(id, {
            bannerImage,
            backgroundColor,
            eventLink,
            participants: participantsArray
        },{new: true, runValidators: true});
        if(!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Respond with success
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching the event.' });
    }
}

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the event in a single query
        const event = await Event.findOneAndDelete({ _id: id, hostname: req.user.username });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to delete it.' });
        }

        res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).json({ error: 'An error occurred while deleting the event.' });
    }
};

export const getUserEvents = async (req, res) => {
    try {
        const userEmail = req.user.email;
        const userName = req.user.username;
        const tab = req.query.tab;

        const now = new Date();
        let filter = {};

        switch (tab) {
            case "upcoming":
                filter = {
                    dateTime: { $gte: now },
                    $or: [
                        { hostname: userName },
                        { participants: { $elemMatch: { email: userEmail, status: "accepted" } } }
                    ]
                };
                break;
            case "pending":
                filter = {
                    participants: { $elemMatch: { email: userEmail, status: "pending" } }
                };
                break;
            case "canceled":
                filter = {
                    participants: { $elemMatch: { email: userEmail, status: "rejected" } }
                };
                break;
            case "past":
                filter = {
                    dateTime: { $lt: now },
                    $or: [
                        { hostname: userName },
                        { participants: { $elemMatch: { email: userEmail, status: "accepted" } } }
                    ]
                };
                break;
            case "all":
                filter = {
                    $or: [
                        { hostname: userName },
                        { participants: { $elemMatch: { email: userEmail } } }
                    ]
                };
                break;
            default:
                return res.status(400).json({ message: "Invalid tab" });
        }

        // Fetch events and return lean objects for performance optimization
        const events = await Event.find(filter).lean();

        // Add isHost and userStatus for each event
        const updatedEvents = events.map(event => {
            const participant = event.participants.find(p => p.email === userEmail);
            return {
                ...event,
                isHost: event.hostname === userName,
                userStatus: participant ? participant.status : "N/A",
            };
        });
        res.status(200).json(updatedEvents);
    } catch (error) {
        console.error("Error fetching user events:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const acceptEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userEmail = req.user.email;

        // Check if the user is a participant
        const participant = event.participants.find((p) => p.email === userEmail);
        if (!participant) {
            return res.status(400).json({ message: "You are not a participant of this event" });
        }

        // Update the participant's status to "accepted"
        participant.status = "accepted";

        // Save the updated event
        await event.save();

        res.status(200).json({ message: "Event accepted successfully", event });
    } catch (error) {
        console.error("Error accepting event:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const rejectEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const userEmail = req.user.email;

        // Check if the user is a participant
        const participant = event.participants.find((p) => p.email === userEmail);
        if (!participant) {
            return res.status(400).json({ message: "You are not a participant of this event" });
        }

        // Update the participant's status to "rejected"
        participant.status = "rejected";

        // Save the updated event
        await event.save();

        res.status(200).json({ message: "Event rejected successfully", event });
    } catch (error) {
        console.error("Error rejecting event:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getEventsCreatedByUser = async (req, res) => {
    try {
        const userName = req.user.username;
        const events = await Event.find({ hostname: userName }).lean();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching user-created events:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const toggleEventActiveState = async (req, res) => {
    const { eventId } = req.params;
    const { isActive } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Ensure only the host can toggle the state
        if (event.hostname !== req.user.username) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        event.isActive = isActive;
        await event.save();

        res.status(200).json({ message: "Event active state updated successfully" });
    } catch (error) {
        console.error("Error toggling event active state:", error.message);
        res.status(500).json({ error: error.message });
    }
};