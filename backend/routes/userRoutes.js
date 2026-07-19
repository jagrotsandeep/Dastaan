const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getUserProfile,
  getMe,
  getDashboard,
  toggleFollow,
  toggleBookmark,
  getBookmarks,
} = require('../controllers/userController');

router.get('/me', protect, getMe);
router.get('/dashboard', protect, getDashboard);
router.get('/bookmarks', protect, getBookmarks);
router.post('/:id/follow', protect, toggleFollow);
router.post('/bookmarks/:storyId', protect, toggleBookmark);
router.get('/:id', getUserProfile);

module.exports = router;