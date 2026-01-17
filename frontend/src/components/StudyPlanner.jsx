import React, { useEffect, useState } from "react";
import axios from "axios";
import "./planner.css";
import Img from "../assets/bg.jpg";

const API = "http://localhost:5000/api";

// TEMP: hardcoded studentId (replace later with auth/session)
const studentId = "65a123456789abcdef123456";

function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newSubtask, setNewSubtask] = useState({});
  const [priority, setPriority] = useState("Medium");

  /* =========================
     Fetch tasks on load
  ========================= */
  useEffect(() => {
    axios
      .get(`${API}/tasks/${studentId}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* =========================
     Add Task
  ========================= */
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await axios.post(`${API}/tasks`, {
      studentId,
      name: newTask,
      priority,
      completed: false,
      subtasks: [],
    });

    setTasks([...tasks, res.data]);
    setNewTask("");
    setPriority("Medium");
  };

  /* =========================
     Delete Task
  ========================= */
  const deleteTask = async (taskId) => {
    await axios.delete(`${API}/tasks/${taskId}`);
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  /* =========================
     Add Subtask
  ========================= */
  const addSubtask = async (taskId, index) => {
    const name = newSubtask[index];
    if (!name || !name.trim()) return;

    const res = await axios.post(
      `${API}/tasks/${taskId}/subtasks`,
      { name }
    );

    setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    setNewSubtask({ ...newSubtask, [index]: "" });
  };

  /* =========================
     Toggle Subtask
  ========================= */
  const toggleSubtask = async (taskId, subtaskId) => {
    const res = await axios.patch(
      `${API}/tasks/${taskId}/subtasks/${subtaskId}`
    );

    setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
  };

  /* =========================
     Delete Subtask
  ========================= */
  const deleteSubtask = async (taskId, subtaskId) => {
    const res = await axios.delete(
      `${API}/tasks/${taskId}/subtasks/${subtaskId}`
    );

    setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
  };

  /* =========================
     Sort by priority
  ========================= */
  const sortedTasks = [...tasks].sort((a, b) => {
    const value = { High: 3, Medium: 2, Low: 1 };
    return value[b.priority] - value[a.priority];
  });

  return (
    <div
      className="planner-wrapper"
      style={{
        backgroundImage: `url(${Img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="study-planner-container">
        <header className="planner-header">
          <h1>📘 Study Planner</h1>
          <p>Plan your study goals, add subtasks, and track progress!</p>
        </header>

        <div className="planner-inputs">
          <input
            type="text"
            placeholder="Enter main study goal..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="task-list">
          {sortedTasks.length === 0 ? (
            <p className="empty-state">
              No study plans yet — start by adding one!
            </p>
          ) : (
            sortedTasks.map((task, taskIndex) => {
              const completedCount = task.subtasks.filter(
                (s) => s.completed
              ).length;
              const progress =
                task.subtasks.length === 0
                  ? 0
                  : Math.round(
                      (completedCount / task.subtasks.length) * 100
                    );

              return (
                <div
                  key={task._id}
                  className={`task-card ${task.completed ? "done" : ""}`}
                >
                  <div className="task-info">
                    <h3>{task.name}</h3>
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority} Priority
                    </span>

                    {task.subtasks.length > 0 && (
                      <>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="progress-label">
                          {progress}% complete
                        </p>
                      </>
                    )}

                    <ul className="subtask-list">
                      {task.subtasks.map((sub) => (
                        <li
                          key={sub._id}
                          className={`subtask-item ${
                            sub.completed ? "subtask-done" : ""
                          }`}
                        >
                          <label>
                            <input
                              type="checkbox"
                              checked={sub.completed}
                              onChange={() =>
                                toggleSubtask(task._id, sub._id)
                              }
                            />
                            <span className="subtask-text">
                              {sub.name}
                            </span>
                          </label>
                          <button
                            className="delete-sub-btn"
                            onClick={() =>
                              deleteSubtask(task._id, sub._id)
                            }
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="subtask-input-wrapper">
                      <input
                        type="text"
                        placeholder="Add subtask..."
                        value={newSubtask[taskIndex] || ""}
                        onChange={(e) =>
                          setNewSubtask({
                            ...newSubtask,
                            [taskIndex]: e.target.value,
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          addSubtask(task._id, taskIndex)
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;
