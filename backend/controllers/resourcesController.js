import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  try {
    const userId = req.userId;
    const { subjectId } = req.query;

    const filter = { userId };
    if (subjectId) filter.subjectId = subjectId;

    const resources = await Resource.find(filter)
      .populate('subjectId', 'name color')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

export const addResource = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, url, subjectId, resourceType } = req.body;

    if (!title || !url || !subjectId) {
      return res.status(400).json({ error: 'Title, URL, and subject are required' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const resource = new Resource({
      userId,
      title,
      url,
      subjectId,
      resourceType: resourceType || 'link',
    });

    await resource.save();
    await resource.populate('subjectId', 'name color');

    res.status(201).json({
      message: 'Resource added successfully',
      resource,
    });
  } catch (error) {
    console.error('Add resource error:', error);
    res.status(500).json({ error: 'Failed to add resource' });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const resource = await Resource.findOneAndDelete({ _id: id, userId });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};
