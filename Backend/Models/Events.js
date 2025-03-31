import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    hostname: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    duration: {
        type: String, 
    },
    bannerImage: {
        type: String,
        trim: true
    },
    backgroundColor: {
        type: String,
        trim: true
    },
    eventLink: {
        type: String,
        trim: true
    },
    participants: [
        {
            email: { type: String, required: true },
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
        }
    ],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;