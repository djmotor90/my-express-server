// routes/userRoutes.js

import express from 'express';
import UserModel from '../models/userModel.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // Import verifyToken

const router = express.Router();



// Route to retrieve all users (authentication required)
router.get('/', async (req, res) => {
  try {
    // Fetch all user data from the database
    const users = await UserModel.find();

    // Return the list of users in the response
    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Could not retrieve users' });
  }
});



// Route to retrieve user by ID (does not require authentication)
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Could not retrieve user' });
  }
});

// Route to retrieve user by email (does not require authentication)
router.get('/email/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    res.status(500).json({ error: 'Could not retrieve user by email' });
  }
});

// Route to update user information with token verification
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body;

    // Ensure the user ID from the token matches the user ID in the request
    if (req.user.userId !== userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user information
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Could not update user' });
  }
});



export default router;
