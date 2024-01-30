import dotenv from 'dotenv'; // Load environment variables from .env file
import mongoose from 'mongoose';
import Message from './models/Message.js'; // Import your Message model

dotenv.config();

// Define your seed data
const messagesData = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a sample message from John Doe.',
  },
  {
    name: 'Alice Smith',
    email: 'alice@example.com',
    message: 'This is a sample message from Alice Smith.',
  },
  // Add more message data as needed
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Function to insert seed data into the database
async function seedData() {
  try {
    // Remove existing messages (optional)
    await Message.deleteMany({});

    // Insert seed data
    await Message.insertMany(messagesData);
    console.log('Seed data inserted successfully');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}
