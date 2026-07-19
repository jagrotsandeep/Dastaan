const express = require('express');
const router = express.Router();
const PageView = require('../models/PageView');

router.post('/', async (req, res) => {
  try {
    await PageView.create({ path: req.body.path || '/' });
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;