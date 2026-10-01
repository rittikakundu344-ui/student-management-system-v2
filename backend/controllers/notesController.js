import Note from '../models/Note.js';

export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { subjectId, pinned, favorite } = req.query;

    const filter = { userId };

    if (subjectId) filter.subjectId = subjectId;
    if (pinned === 'true') filter.isPinned = true;
    if (favorite === 'true') filter.isFavorite = true;

    const notes = await Note.find(filter)
      .populate('subjectId', 'name color')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const createNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, content, subjectId, tags } = req.body;

    if (!title || !subjectId) {
      return res.status(400).json({ error: 'Title and subject are required' });
    }

    const note = new Note({
      userId,
      subjectId,
      title,
      content: content || '',
      tags: tags || [],
    });

    await note.save();
    await note.populate('subjectId', 'name color');

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, content, subjectId, isPinned, isFavorite, tags } = req.body;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (subjectId !== undefined) note.subjectId = subjectId;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (isFavorite !== undefined) note.isFavorite = isFavorite;
    if (tags !== undefined) note.tags = tags;

    note.updatedAt = Date.now();
    await note.save();
    await note.populate('subjectId', 'name color');

    res.json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const note = await Note.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const userId = req.userId;
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const notes = await Note.find({
      userId,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    })
      .populate('subjectId', 'name color')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
};

export const togglePin = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = Date.now();
    await note.save();

    res.json({
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note,
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const note = await Note.findOne({ _id: id, userId });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    note.isFavorite = !note.isFavorite;
    note.updatedAt = Date.now();
    await note.save();

    res.json({
      message: `Note marked as ${note.isFavorite ? 'favorite' : 'not favorite'} successfully`,
      note,
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};
