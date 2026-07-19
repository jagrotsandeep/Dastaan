const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const trackRoutes = require('./routes/trackRoutes');

connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://dastaan-frontend.vercel.app'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('Dastaan API running'));
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/stories/:storyId/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/track', trackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));