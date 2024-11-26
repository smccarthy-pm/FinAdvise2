import express from 'express';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

// Get all tasks
router.get('/', asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
  res.json(tasks);
}));

// Create task
router.post('/', asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json(task);
}));

// Update task
router.patch('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json(task);
}));

// Delete task
router.delete('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ 
    _id: req.params.id, 
    userId: req.user.id 
  });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ message: 'Task deleted' });
}));

export default router;