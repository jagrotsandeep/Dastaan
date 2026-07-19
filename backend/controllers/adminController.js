const Story = require('../models/Story');
const User = require('../models/User');
const PageView = require('../models/PageView');

exports.getPendingStories = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'pending' })
      .populate('author', 'username email')
      .sort({ createdAt: 1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    story.status = 'published';
    story.rejectionReason = '';
    await story.save();
    res.json({ message: 'Story approve ho gayi', story });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectStory = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Reject karne ka karan likhna zaroori hai' });
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    story.status = 'rejected';
    story.rejectionReason = reason;
    await story.save();
    res.json({ message: 'Story reject kar di gayi', story });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStories = await Story.countDocuments();
    const pendingCount = await Story.countDocuments({ status: 'pending' });
    const publishedCount = await Story.countDocuments({ status: 'published' });
    const rejectedCount = await Story.countDocuments({ status: 'rejected' });

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeNow = await User.countDocuments({ lastActive: { $gte: fiveMinAgo } });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const viewsToday = await PageView.countDocuments({ createdAt: { $gte: oneDayAgo } });

    res.json({ totalUsers, totalStories, pendingCount, publishedCount, rejectedCount, activeNow, viewsToday });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBanned = !user.isBanned;
    await user.save();
    res.json({ message: user.isBanned ? 'User ban ho gaya' : 'User unban ho gaya', isBanned: user.isBanned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};