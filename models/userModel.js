// models/userModel.js

import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  password: {
    type: String,
    required: true,
  },
  permissionGroups: {
    type: [String], // You can define the permissionGroups as needed
  },
});

// Create a User model
const User = mongoose.model('User', userSchema);

export default User;
