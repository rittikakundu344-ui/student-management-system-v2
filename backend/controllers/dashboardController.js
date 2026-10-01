import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Subject from '../models/Subject.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalNotes = await Note.countDocuments({ userId });
    const totalSubjects = await Subject.countDocuments({ userId });
    const pendingTasks = await Task.countDocuments({ userId, isCompleted: false });
    const completedTasks = await Task.countDocuments({ userId, isCompleted: true });

    res.json({
      totalNotes,
      totalSubjects,
      pendingTasks,
      completedTasks,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
