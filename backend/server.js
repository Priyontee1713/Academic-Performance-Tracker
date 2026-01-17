import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

/* =========================
   Reference Students Table
========================= */


/* =========================
   Task Schema
========================= */
const SubtaskSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    priority: { type: String, enum: ["High", "Medium", "Low"] },
    completed: { type: Boolean, default: false },
    subtasks: [SubtaskSchema]
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

/* =========================
   Routes
========================= */

// Get tasks for student
app.get("/api/tasks/:studentId", async (req, res) => {
  const tasks = await Task.find({ studentId: req.params.studentId });
  res.json(tasks);
});

// Add task
app.post("/api/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

// Delete task
app.delete("/api/tasks/:taskId", async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: "Task deleted" });
});

// Add subtask
app.post("/api/tasks/:taskId/subtasks", async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  task.subtasks.push({ name: req.body.name });
  await task.save();
  res.json(task);
});

// Toggle subtask
app.patch("/api/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  const subtask = task.subtasks.id(req.params.subtaskId);
  subtask.completed = !subtask.completed;

  task.completed =
    task.subtasks.length &&
    task.subtasks.every((s) => s.completed);

  await task.save();
  res.json(task);
});

// Delete subtask
app.delete("/api/tasks/:taskId/subtasks/:subtaskId", async (req, res) => {
  const task = await Task.findById(req.params.taskId);
  task.subtasks.id(req.params.subtaskId).remove();
  await task.save();
  res.json(task);
});

/* =========================
   Server
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
