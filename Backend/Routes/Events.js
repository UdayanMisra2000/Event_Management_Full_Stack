import express from 'express';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent, updateCreateEvent, getUserEvents, acceptEvent, rejectEvent, getEventsCreatedByUser, toggleEventActiveState } from '../Controllers/Events.js';

const eventRouter = express.Router();

eventRouter.get('/getEvents', getEvents);
eventRouter.get('/getEvent/:id', getEventById);
eventRouter.post('/createEvent', createEvent);
eventRouter.put('/updateCreateEvent/:id', updateCreateEvent);
eventRouter.put('/updateEvent/:id', updateEvent);
eventRouter.delete('/deleteEvent/:id', deleteEvent);
eventRouter.get("/myEvents", getUserEvents);
eventRouter.put("/accept/:eventId", acceptEvent);
eventRouter.put("/reject/:eventId", rejectEvent);
eventRouter.get("/getEventsCreatedByUser", getEventsCreatedByUser);
eventRouter.put("/toggleActive/:eventId", toggleEventActiveState);

export default eventRouter;