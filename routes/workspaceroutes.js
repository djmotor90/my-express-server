// routes/workspaceRoutes.js
import express from 'express';
import Workspace from '../models/workspacemodel.js';
import User from '../models/userModel.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET route to retrieve all workspaces without token verification
router.get('/', async (req, res) => {
  try {
    // Retrieve all workspaces from the database
    const workspaces = await Workspace.find().populate('owner').populate('users');
    res.json(workspaces);
  } catch (error) {
    console.error('Error retrieving workspaces:', error);
    res.status(500).json({ error: 'Could not retrieve workspaces' });
  }
});

// GET route to retrieve workspaces by ownerId
router.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;

    // Retrieve workspaces where the ownerId matches the provided ID
    const workspaces = await Workspace.find({ owner: ownerId });
    if (!workspaces || workspaces.length === 0) {
      return res.status(404).json({ error: 'No workspaces found for the provided owner ID' });
    }

    res.json(workspaces);
  } catch (error) {
    console.error('Error retrieving workspaces:', error);
    res.status(500).json({ error: 'Could not retrieve workspaces' });
  }
});


// Create a new workspace
router.post('/create', async (req, res) => {
  try {
    const { name, owner, users, api } = req.body;
    console.log("Received payload:", req.body);  // Log the received payload
    const workspace = new Workspace({ name, owner, users, api });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    console.error("Error creating workspace:", error);  // Log the error for debugging
    res.status(400).json({ error: error.message });  // Send back a more descriptive error
  }
});

// Update an existing workspace
router.put('/update/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params; // Get the workspace ID from the URL parameters
    const { name, owner, users, api } = req.body; // Destructure the updated fields from the request body

    console.log("Received update payload:", req.body);  // Log the received payload

    // Find the workspace by ID and update it
    const updatedWorkspace = await Workspace.findByIdAndUpdate(workspaceId, { name, owner, users, api }, { new: true });

    if (!updatedWorkspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.status(200).json(updatedWorkspace);
  } catch (error) {
    console.error("Error updating workspace:", error);  // Log the error for debugging
    res.status(400).json({ error: error.message });  // Send back a more descriptive error
  }
});


// Add a user to a workspace
router.post('/addUser/:workspaceId', verifyToken, async (req, res) => {
  const { workspaceId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the workspace exists
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Ensure the user ID from the token matches the owner of the workspace
    if (req.user.userId !== workspace.owner) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the user to the workspace
    workspace.users.push(userId);
    await workspace.save();

    res.status(200).json({ message: 'User added to workspace successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Adding user to workspace failed' });
  }
});

// Other routes for workspace operations (e.g., removing users, updating settings, etc.)

export default router;
