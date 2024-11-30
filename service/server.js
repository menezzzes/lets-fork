const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

// Enable CORS for all origins (you can change this to a specific URL for production)
app.use(cors()); // Allow all origins for development
// For production, you can specify the allowed origin:
// app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
}).then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));



// Define a Task schema and model
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});
const Task = mongoose.model('Task', taskSchema);

// API Routes

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
// app.post('/tasks', async (req, res) => {
//   try {
//     const newTask = new Task(req.body);
//     await newTask.save();
//     res.json(newTask);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating task' });
//   }
// });

app.post('/tasks', async (req, res) => {
    try {
      console.log("Request body received:", req.body);
  
      const { title, completed } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
  
      const newTask = new Task({ title, completed: completed || false });
      console.log("Saving task to database:", newTask);
  
      const savedTask = await newTask.save();
      console.log("Task saved successfully:", savedTask);
  
      res.status(201).json(savedTask);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task", error: error.message });
    }
  });
  
  

// Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
