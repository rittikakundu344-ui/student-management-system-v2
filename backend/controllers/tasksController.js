import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
  try {
    const userId = req.userId;
    const { subjectId, completed } = req.query;

    const filter = { userId };

    if (subjectId) filter.subjectId = subjectId;
    if (completed === 'true') filter.isCompleted = true;
    if (completed === 'false') filter.isCompleted = false;

    const tasks = await Task.find(filter)
      .populate('subjectId', 'name color')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, description, subjectId, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      userId,
      title,
      description: description || '',
      subjectId: subjectId || null,
      dueDate: dueDate || null,
    });

    await task.save();
    if (task.subjectId) {
      await task.populate('subjectId', 'name color');
    }

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, subjectId, dueDate } = req.body;

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (subjectId !== undefined) task.subjectId = subjectId;
    if (dueDate !== undefined) task.dueDate = dueDate;

    task.updatedAt = Date.now();
    await task.save();
    if (task.subjectId) {
      await task.populate('subjectId', 'name color');
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const toggleCompletion = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.isCompleted = !task.isCompleted;
    task.updatedAt = Date.now();
    await task.save();

    res.json({
      message: `Task marked as ${task.isCompleted ? 'completed' : 'incomplete'} successfully`,
      task,
    });
  } catch (error) {
    console.error('Toggle completion error:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
};
