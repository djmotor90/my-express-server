//server.js

// Import necessary modules and dependencies
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import workspaceroute from './routes/workspaceroutes.js';
import contactus from './routes/contactUs.js'



dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Use the environment variable
  credentials: true
}));
  app.use(cookieParser());

app.use(express.json());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Add the /api/logout route
app.post('/api/logout', (req, res) => {
  try {
    res.clearCookie('token'); // Clear the token cookie
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Could not log out user' });
  }
});

// Define other routes
app.use('/api/users', userRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workspace', workspaceroute);
app.use('/api/contact', contactus)


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('JWT_SECRET:', process.env.JWT_SECRET);

});
