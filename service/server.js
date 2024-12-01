const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const corsOptions = {
  origin: '*', 
  credentials: true, // Access-Control-Allow-Credentials: true
  optionSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Custom CORS Headers (Optional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '1800');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
  
const PORT = process.env.PORT || 5000;
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Define a Task schema and model
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});
const Task = mongoose.model('Task', taskSchema);

// ******* API Routes *******

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Add a task

app.post('/tasks', async (req, res) => {
  try {
    const { title, completed } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ title, completed: completed || false });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
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