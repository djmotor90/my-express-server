// routes/authRoutes.js

import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Add similar route for login
router.post('/login', login);

export default router;
