const Story = require('../models/Story');

exports.createStory = async (req, res) => {
  try {
    const { status, ...rest } = req.body;
    const finalStatus = status === 'published' ? 'pending' : (status || 'draft');
    const story = await Story.create({ ...rest, status: finalStatus, author: req.userId });
    res.status(201).json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const { search, category, page, limit } = req.query;
    let filter = { status: 'published' };
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 9;
      const skip = (pageNum - 1) * limitNum;
      const totalStories = await Story.countDocuments(filter);
      const stories = await Story.find(filter).populate('author', 'username avatar').sort({ createdAt: -1 }).skip(skip).limit(limitNum);
      return res.json({ stories, totalPages: Math.ceil(totalStories / limitNum), currentPage: pageNum, totalStories });
    }
    const stories = await Story.find(filter).populate('author', 'username avatar').sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategoryCounts = async (req, res) => {
  try {
    const counts = await Story.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const result = {};
    counts.forEach((c) => { result[c._id] = c.count; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('author', 'username avatar bio');
    if (!story) return res.status(404).json({ message: 'Story not found' });
    story.views += 1;
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStoryForEdit = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.userId) return res.status(403).json({ message: 'Ye story tumhari nahi hai' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.userId) return res.status(403).json({ message: 'Ye story tumhari nahi hai' });

    const { title, description, content, category, status, tags } = req.body;
    if (title !== undefined) story.title = title;
    if (description !== undefined) story.description = description;
    if (content !== undefined) story.content = content;
    if (category !== undefined) story.category = category;
    if (tags !== undefined) story.tags = tags;
    if (status !== undefined) {
      if (status === 'published') {
        story.status = 'pending';
        story.rejectionReason = '';
      } else {
        story.status = status;
      }
    }

    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.userId) return res.status(403).json({ message: 'Ye story tumhari nahi hai' });
    await story.deleteOne();
    res.json({ message: 'Story delete ho gayi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    const alreadyLiked = story.likes.includes(req.userId);
    if (alreadyLiked) story.likes = story.likes.filter(id => id.toString() !== req.userId);
    else story.likes.push(req.userId);
    await story.save();
    res.json({ likes: story.likes.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reportStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    res.json({ message: 'Report darj ho gayi, dhanyawad' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};