import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Attendance.css";

function Attendance() {
  const [users, setUsers] = useState([]);
  const [attendanceData, setAttendanceData] = useState({
    date: new Date().toISOString().split("T")[0], // Set today's date as default
    user: "",
    status: "Present",
  });
  const [attendanceList, setAttendanceList] = useState([]);
  const [tasks, setTasks] = useState([]); // Store tasks
  const [search, setSearch] = useState({
    date: "",
    user: "",
    status: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/attendance`)
      .then((res) => setAttendanceList(res.data))
      .catch((err) => console.error("Error fetching attendance:", err));

    // Fetch tasks from the backend
    axios
      .get(`${import.meta.env.VITE_API_URL}/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the attendance data (keep the date in YYYY-MM-DD format)
      await axios.post(`${import.meta.env.VITE_API_URL}/add-attendance`, attendanceData);
      // Reset the attendance form but keep today's date
      setAttendanceData({
        date: new Date().toISOString().split("T")[0],
        user: "",
        status: "Present",
      });
      axios
        .get(`${import.meta.env.VITE_API_URL}/attendance`)
        .then((res) => setAttendanceList(res.data));
    } catch (error) {
      console.error("Error adding attendance:", error);
    }
  };

  // Function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setSearch({
      date: "",
      user: "",
      status: "",
    });
  };

  const filteredAttendanceList = attendanceList
    .filter((a) => {
      return (
        (search.date ? a.date.includes(search.date) : true) &&
        (search.user
          ? a.user.toLowerCase().includes(search.user.toLowerCase())
          : true) &&
        (search.status
          ? a.status.toLowerCase().includes(search.status.toLowerCase())
          : true)
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting in ascending order

  // Function to find the tasks related to a specific date
  const getTaskDetails = (date) => {
    return tasks.find((taskGroup) => taskGroup._id === date)?.tasks || [];
  };

  // Update task status
  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/update-task/${taskId}`, {
        completed: status,
      });
      // Update task list after change
      const updatedTasks = tasks.map((taskGroup) => ({
        ...taskGroup,
        tasks: taskGroup.tasks.map((task) =>
          task._id === taskId ? { ...task, completed: status } : task
        ),
      }));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="attendance-wrapper">
      {/* Attendance Form Section */}
      <div className="attendance-container">
        <h2 className="attendance-title">Mark Attendance</h2>
        <form onSubmit={handleSubmit} className="attendance-form">
          <input
            type="date"
            value={attendanceData.date}
            onChange={(e) =>
              setAttendanceData({ ...attendanceData, date: e.target.value })
            }
            className="attendance-input"
          />
          <select
            value={attendanceData.user}
            onChange={(e) =>
              setAttendanceData({ ...attendanceData, user: e.target.value })
            }
            className="attendance-select"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            value={attendanceData.status}
            onChange={(e) =>
              setAttendanceData({ ...attendanceData, status: e.target.value })
            }
            className="attendance-select"
          >
            <option>Present</option>
            <option>Absent</option>
          </select>
          <button type="submit" className="attendance-submit">
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Search Section */}
      <div className="attendance-search-container">
        <h3 className="attendance-search-title">Search Attendance</h3>
        <input
          type="date"
          name="date"
          value={search.date}
          onChange={handleSearchChange}
          placeholder="Search by Date"
          className="attendance-search-input"
        />
        <input
          type="text"
          name="user"
          value={search.user}
          onChange={handleSearchChange}
          placeholder="Search by User"
          className="attendance-search-input"
        />
        <input
          type="text"
          name="status"
          value={search.status}
          onChange={handleSearchChange}
          placeholder="Search by Status"
          className="attendance-search-input"
        />
        <button
          onClick={handleClearFilters}
          className="attendance-clear-filters"
        >
          Clear Filters
        </button>
      </div>

      {/* Full Width Attendance Report Section */}
      <div className="attendance-report-container">
    <h3 className="attendance-report-title">Attendance Report</h3>
    {filteredAttendanceList.length === 0 ? (
        <p className="no-report-message">No Report Available</p>
    ) : (
        <table className="attendance-table">
            <thead>
                <tr>
                    <th>Sr. No.</th>
                    <th>Date</th>
                    <th>User</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredAttendanceList.map((a, index) => {
                    const tasksForDate = getTaskDetails(a.date);
                    return (
                        <tr key={a._id}>
                            <td>{index + 1}</td>
                            <td>{formatDate(a.date)}</td>
                            <td>{a.user}</td>
                            <td>{a.status}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )}
</div>

    </div>
  );
}

export default Attendance;
