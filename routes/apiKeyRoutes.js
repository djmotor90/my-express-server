// routes/apiKeyRoutes.js


const router = express.Router();
import express from 'express';
import APIKeyModel from '../models/apiKeyModel.js';

// Route to create a new API key
router.post('/create', async (req, res) => {
  try {
    const { apiKey, userId } = req.body;
    const newAPIKey = new APIKeyModel({ apiKey, userId });
    const savedAPIKey = await newAPIKey.save();
    res.status(201).json(savedAPIKey);
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Could not create API key' });
  }
});

// Route to retrieve API keys by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const userAPIKeys = await APIKeyModel.find({ userId: req.params.userId });
    res.json(userAPIKeys);
  } catch (error) {
    console.error('Error retrieving API keys:', error);
    res.status(500).json({ error: 'Could not retrieve API keys' });
  }
});

// Add more API key routes as needed

export default router;