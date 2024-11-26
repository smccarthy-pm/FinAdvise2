import express from 'express';
import { Contact } from '../models/Contact.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Get all contacts
router.get('/', asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id }).sort({ lastName: 1 });
  res.json(contacts);
}));

// Create contact
router.post('/', asyncHandler(async (req, res) => {
  const contact = await Contact.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json(contact);
}));

// Update contact
router.patch('/:id', asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.json(contact);
}));

// Delete contact
router.delete('/:id', asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.json({ message: 'Contact deleted' });
}));

export default router;