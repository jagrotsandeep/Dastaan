const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const comment = await Comment.create({
      story: req.params.storyId,
      author: req.userId,
      text,
      parentComment: parentComment || null,
    });
    const populated = await comment.populate('author', 'username avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ story: req.params.storyId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};