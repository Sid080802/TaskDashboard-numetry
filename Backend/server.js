const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(helmet()); // Adds security headers to protect against certain vulnerabilities

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Schemas and Models
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    joiningDate: { type: String, required: true } // Added joining date
});
const User = mongoose.model('users', UserSchema);

const MentorSchema = new mongoose.Schema({
    name: String
});
const Mentor = mongoose.model('mentors', MentorSchema);

const TaskSchema = new mongoose.Schema({
    date: String,
    mentor: String,
    description: String,
    completed: Boolean
});
const Task = mongoose.model('tasks', TaskSchema);

const AttendanceSchema = new mongoose.Schema({
    date: String,
    user: String,
    status: String,
    taskStatus: { type: String, default: 'Not Done' } // Added taskStatus field
});
const Attendance = mongoose.model('attendances', AttendanceSchema);

// API Routes

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Add a user
app.post('/add-user', async (req, res) => {
    const { name, email, joiningDate } = req.body;
    if (!name || !email || !joiningDate) {
        return res.status(400).json({ message: "Name, email, and joining date are required" });
    }

    try {
        const newUser = new User({ name, email, joiningDate });
        await newUser.save();
        res.status(201).send("User added");
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user" });
    }
});

// Delete a user by ID
app.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Get all mentors
app.get('/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find();
        res.json(mentors);
    } catch (error) {
        console.error("Error fetching mentors:", error);
        res.status(500).json({ message: "Error fetching mentors" });
    }
});

// Add a mentor
app.post('/add-mentor', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Mentor name is required" });
    }

    try {
        const newMentor = new Mentor({ name });
        await newMentor.save();
        res.status(201).send("Mentor added");
    } catch (error) {
        console.error("Error adding mentor:", error);
        res.status(500).json({ message: "Error adding mentor" });
    }
});

// Delete a mentor by ID
app.delete('/delete-mentor/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMentor = await Mentor.findByIdAndDelete(id);
        if (!deletedMentor) {
            return res.status(404).json({ message: "Mentor not found" });
        }
        res.status(200).json({ message: "Mentor deleted" });
    } catch (error) {
        console.error("Error deleting mentor:", error);
        res.status(500).json({ message: "Error deleting mentor" });
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Add a task
app.post('/add-task', async (req, res) => {
    const { date, mentor, description } = req.body;
    if (!date || !mentor || !description) {
        return res.status(400).json({ message: "All fields (date, mentor, description) are required" });
    }

    try {
        const newTask = new Task({ date, mentor, description, completed: false });
        await newTask.save();
        res.status(201).send("Task added");
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).json({ message: "Error adding task" });
    }
});

// Get all attendance
app.get('/attendance', async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Error fetching attendance" });
    }
});

// Add attendance
app.post('/add-attendance', async (req, res) => {
    const { date, user, status } = req.body;
    if (!date || !user || !status) {
        return res.status(400).json({ message: "All fields (date, user, status) are required" });
    }

    try {
        const newAttendance = new Attendance({ date, user, status });
        await newAttendance.save();
        res.status(201).send("Attendance added");
    } catch (error) {
        console.error("Error adding attendance:", error);
        res.status(500).json({ message: "Error adding attendance" });
    }
});




  


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
