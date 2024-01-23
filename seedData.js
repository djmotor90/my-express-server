require('dotenv').config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const User = require('./models/userModel'); // Import your user model

// Define your seed data
const usersData = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    permissionGroups: ['guest'],
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'alice123',
    permissionGroups: ['guest'],
  },
  // Add more user data as needed
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
    // Remove existing users (optional)
    await User.deleteMany({});

    // Insert seed data
    await User.insertMany(usersData);
    console.log('Seed data inserted successfully');

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
}
