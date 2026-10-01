import express from 'express';
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', getSubjects);
router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

export default router;
