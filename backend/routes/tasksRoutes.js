import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleCompletion,
} from '../controllers/tasksController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleCompletion);

export default router;
