const mongoose = require('mongoose');

const pageViewSchema = new mongoose.Schema({
  path: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('PageView', pageViewSchema);