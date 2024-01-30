//controllers/authController.js

import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Function to handle user signup
export async function signup(req, res) {
  try {
    const { firstName, lastName, email, password, permissionGroups } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Store the hashed password in the database
      permissionGroups,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1800s',
    });

    // Set the token as an HTTP-only cookie
    res.cookie('token', token, { maxAge: 1800000, httpOnly: true, secure: false });
    
    return res.status(201).json({ message: 'Signup successful', userId: savedUser._id.toString(), token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to handle user login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: 'Login successful', userId: user._id, token });
    } else {
      return res.status(401).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

