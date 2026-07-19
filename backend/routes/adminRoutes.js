const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/auth');
const {
  getPendingStories, approveStory, rejectStory, getStats, getUsers, toggleBanUser,
} = require('../controllers/adminController');

router.get('/stats', adminProtect, getStats);
router.get('/pending-stories', adminProtect, getPendingStories);
router.post('/stories/:id/approve', adminProtect, approveStory);
router.post('/stories/:id/reject', adminProtect, rejectStory);
router.get('/users', adminProtect, getUsers);
router.post('/users/:id/toggle-ban', adminProtect, toggleBanUser);

module.exports = router;