const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createStory, getStories, getStoryById, getStoryForEdit,
  updateStory, deleteStory, likeStory, reportStory,
} = require('../controllers/storyController');

router.get('/', getStories);
router.get('/edit/:id', protect, getStoryForEdit);
router.get('/:id', getStoryById);
router.post('/', protect, createStory);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/like', protect, likeStory);
router.post('/:id/report', protect, reportStory);

module.exports = router;