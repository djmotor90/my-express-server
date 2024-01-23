// models/apiKeyModels.js


import mongoose from 'mongoose';

// Define the API key schema
const apiKeySchema = new mongoose.Schema({
  // Define your schema fields here, for example:
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
  // Add any other fields you need
});

// Create an APIKey model
const APIKey = mongoose.model('APIKey', apiKeySchema);

export default APIKey;
