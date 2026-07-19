const User = require('../models/User');
const Story = require('../models/Story');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stories = await Story.find({ author: req.params.id, status: 'published' }).sort({ createdAt: -1 });
    const totalViews = stories.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = stories.reduce((sum, s) => sum + s.likes.length, 0);

    res.json({
      user,
      stories,
      stats: {
        storiesCount: stories.length,
        totalViews,
        totalLikes,
        followers: user.followers.length,
        following: user.following.length,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const stories = await Story.find({ author: req.userId }).sort({ createdAt: -1 });
    const published = stories.filter(s => s.status === 'published');
    const drafts = stories.filter(s => s.status === 'draft');
    const totalViews = published.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = published.reduce((sum, s) => sum + s.likes.length, 0);
    const user = await User.findById(req.userId);

    res.json({
      storiesCount: published.length,
      draftsCount: drafts.length,
      totalViews,
      totalLikes,
      followers: user.followers.length,
      recentStories: stories.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.userId) return res.status(400).json({ message: 'Khud ko follow nahi kar sakte' });

    const me = await User.findById(req.userId);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isFollowing = me.following.includes(targetId);
    if (isFollowing) {
      me.following = me.following.filter(id => id.toString() !== targetId);
      target.followers = target.followers.filter(id => id.toString() !== req.userId);
    } else {
      me.following.push(targetId);
      target.followers.push(req.userId);
    }
    await me.save();
    await target.save();

    res.json({ following: !isFollowing, followersCount: target.followers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const user = await User.findById(req.userId);

    const alreadyBookmarked = user.bookmarks.includes(storyId);
    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== storyId);
    } else {
      user.bookmarks.push(storyId);
    }
    await user.save();
    res.json({ bookmarked: !alreadyBookmarked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'username avatar' },
    });
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};