import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Tasks.css";

function Tasks() {
  const [mentors, setMentors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    date: new Date().toISOString().split("T")[0], // Set today's date
    mentor: "",
    description: "",
    completed: false,
  });
  const [search, setSearch] = useState({
    date: "",
    mentor: "",
    description: "",
  });

  useEffect(() => {
    fetchMentors();
    fetchTasks();
  }, []);

  const fetchMentors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mentors");
      setMentors(res.data);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks");
      setTasks(res.data.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort tasks by date (ascending)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/add-task", taskData);
      setTaskData({
        date: new Date().toISOString().split("T")[0], // Keep today's date
        mentor: "",
        description: "",
        completed: false,
      });
      await fetchTasks(); // Re-fetch tasks after adding a new one
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Clear search filters
  const handleClearFilters = () => {
    setSearch({
      date: "",
      mentor: "",
      description: "",
    });
  };

  

  // Filter & Sort tasks (ensure sorted order)
  const filteredTasks = tasks
    .filter((task) => {
      return (
        (search.date ? task.date.includes(search.date) : true) &&
        (search.mentor
          ? task.mentor.toLowerCase().includes(search.mentor.toLowerCase())
          : true) &&
        (search.description
          ? task.description.toLowerCase().includes(search.description.toLowerCase())
          : true)
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure sorting even after filtering

  return (
    <div className="task-container">
      {/* Task Form */}
      <div className="task-form-container">
        <h2 className="task-title">Add Task</h2>
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="date"
            value={taskData.date}
            onChange={(e) => setTaskData({ ...taskData, date: e.target.value })}
            className="task-input"
          />
          <select
            value={taskData.mentor}
            onChange={(e) => setTaskData({ ...taskData, mentor: e.target.value })}
            className="task-input"
          >
            <option value="">Select Mentor</option>
            {mentors.length > 0 ? (
              mentors.map((m) => (
                <option key={m._id} value={m.name}>
                  {m.name}
                </option>
              ))
            ) : (
              <option>No mentors available</option>
            )}
          </select>
          <input
            type="text"
            placeholder="Task Description"
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
            className="task-input"
          />
          <button type="submit" className="task-button">
            Add Task
          </button>
        </form>
      </div>

      {/* Search Section */}
      <div className="task-search-container">
        <h3 className="task-search-title">Search Tasks</h3>
        <input
          type="date"
          name="date"
          value={search.date}
          onChange={handleSearchChange}
          className="task-search-input"
        />
        <input
          type="text"
          name="mentor"
          value={search.mentor}
          onChange={handleSearchChange}
          placeholder="Search by Mentor"
          className="task-search-input"
        />
        <input
          type="text"
          name="description"
          value={search.description}
          onChange={handleSearchChange}
          placeholder="Search by Description"
          className="task-search-input"
        />
        <button onClick={handleClearFilters} className="task-clear-filters">
          Clear Filters
        </button>
      </div>

      {/* Task Reports Table */}
      <div className="task-report-container">
        <h3 className="task-reports-title">Task Reports</h3>
        {filteredTasks.length > 0 ? (
          <table className="task-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Mentor</th>
                <th>Task</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((t) => (
                <tr key={t._id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.mentor}</td>
                  <td>{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="task-no-data">No tasks found</p>
        )}
      </div>
    </div>
  );
}

export default Tasks;
