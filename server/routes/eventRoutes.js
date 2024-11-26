import express from 'express';
import { Event } from '../models/Event.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Get all events
router.get('/', asyncHandler(async (req, res) => {
  const events = await Event.find({ userId: req.user.id }).sort({ date: 1 });
  res.json(events);
}));

// Create event
router.post('/', asyncHandler(async (req, res) => {
  const event = await Event.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json(event);
}));

// Update event
router.patch('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.json(event);
}));

// Delete event
router.delete('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.json({ message: 'Event deleted' });
}));

export default router;