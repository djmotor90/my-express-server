// contactUs.js
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// POST route for submitting a message
router.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new message
    const newMessage = new Message({
      name,
      email,
      message,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
