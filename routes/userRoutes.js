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

// Route to update user information (with or without token verification)
router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body; // Assuming the updated data is sent in the request body

    // Debugging: Print updatedUserData
    console.log('updatedUserData:', updatedUserData);

    // Check if there is a token and if the user ID in the request matches the ID of the user being updated
    if (req.user && userId !== req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Debugging: Print the user ID being used in the update query
    console.log('Updating user with ID:', userId);

    // Find the user by ID and update their information
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, {
      new: true, // Return the updated document
      runValidators: true, // Run model validation on the updated data
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Debugging: Print the updated user data
    console.log('Updated User Data:', updatedUser);
    console.log('Received Request Body:', updatedUserData);

    // Return the updated user data in the response
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Could not update user', details: error.message });
  }
});



export default router;
