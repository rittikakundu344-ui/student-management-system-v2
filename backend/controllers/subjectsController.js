import Subject from '../models/Subject.js';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import Resource from '../models/Resource.js';

export const getSubjects = async (req, res) => {
  try {
    const userId = req.userId;

    const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });

    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

export const createSubject = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, color, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Subject name is required' });
    }

    // Check for duplicate
    const existingSubject = await Subject.findOne({ userId, name });
    if (existingSubject) {
      return res.status(400).json({ error: 'Subject with this name already exists' });
    }

    const subject = new Subject({
      userId,
      name,
      color: color || '#007bff',
      description: description || '',
    });

    await subject.save();

    res.status(201).json({
      message: 'Subject created successfully',
      subject,
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { name, color, description } = req.body;

    const subject = await Subject.findOne({ _id: id, userId });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    if (name !== undefined) subject.name = name;
    if (color !== undefined) subject.color = color;
    if (description !== undefined) subject.description = description;

    subject.updatedAt = Date.now();
    await subject.save();

    res.json({
      message: 'Subject updated successfully',
      subject,
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({ _id: id, userId });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Cascade delete: delete related notes, tasks, and resources
    await Note.deleteMany({ subjectId: id });
    await Task.deleteMany({ subjectId: id });
    await Resource.deleteMany({ subjectId: id });

    res.json({ message: 'Subject and related data deleted successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};
