import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  togglePin,
  toggleFavorite,
} from '../controllers/notesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.get('/search', searchNotes);
router.patch('/:id/pin', togglePin);
router.patch('/:id/favorite', toggleFavorite);

export default router;
