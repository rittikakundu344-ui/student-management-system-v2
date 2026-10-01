import express from 'express';
import {
  getResources,
  addResource,
  deleteResource,
} from '../controllers/resourcesController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.get('/', getResources);
router.post('/', addResource);
router.delete('/:id', deleteResource);

export default router;
