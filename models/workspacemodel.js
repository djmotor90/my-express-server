import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId, // Array of references to User model
    ref: 'User'
  }],
  api: {
    type: String,
    required: true,
  },
  listId: {
    type: String, // Change the type to String
    required: true,
  },
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
