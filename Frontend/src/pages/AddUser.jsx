import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns"; // Import the date formatting function
import "../styles/AddUser.css"; // Ensure this file is linked

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  // Ref to the user report section
  const userReportRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !joiningDate) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/add-user", {
        name,
        email,
        joiningDate,
      });
      setMessage("User added successfully!");
      setName("");
      setEmail("");
      setJoiningDate("");
      fetchUsers();

      // Scroll to the user report section with an offset
      const offsetTop = userReportRef.current.offsetTop;
      window.scrollTo({
        top: offsetTop - 0, // Subtract 50px for the offset if needed
        behavior: "smooth",
      });

      // Timeout to clear the success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Error adding user.");
      console.error("Error adding user:", error);
    }
  };

  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/delete-user/${userId}`);
        setMessage("User deleted successfully!");
        fetchUsers();
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } catch (error) {
        setMessage("Error deleting user.");
        console.error("Error deleting user:", error);
      }
    } else {
      console.log("User deletion canceled");
    }
  };

  // Function to format date to DD/MM/YYYY
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return "Invalid Date";
    }
    return format(parsedDate, "dd/MM/yyyy");
  };

  // Sort users by joiningDate in ascending order (oldest first)
  const sortedUsers = [...users].sort((a, b) => {
    return new Date(a.joiningDate) - new Date(b.joiningDate);
  });

  return (
    <div className="user-management">
      {/* Add User Section */}
      <div className="add-user-container">
        <h2 className="add-user-title">Add New User</h2>
        <form className="add-user-form" onSubmit={handleSubmit}>
          <label className="add-user-label">Name:</label>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="add-user-input"
            required
          />

          <label className="add-user-label">Email:</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="add-user-input"
            required
          />

          <label className="add-user-label">Joining Date:</label>
          <input
            type="date"
            value={joiningDate}
            onChange={(e) => setJoiningDate(e.target.value)}
            className="add-user-input"
            required
          />

          <button type="submit" className="add-user-submit">Add User</button>
        </form>

        {message && (
          <p className={`message ${message.includes("success") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </div>

      {/* User Report Section */}
      <div ref={userReportRef} className="user-report-container">
        <h2 className="user-report-title">User Report</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.joiningDate)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUser;
