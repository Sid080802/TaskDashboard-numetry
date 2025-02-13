import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AddMentor.css";

function AddMentor() {
    const [mentor, setMentor] = useState({ name: "" });
    const [mentors, setMentors] = useState([]);
    const [message, setMessage] = useState(""); // State to store message

    // Fetch mentors on component mount
    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get('http://localhost:5000/mentors');
                setMentors(response.data);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        };
        fetchMentors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/add-mentor', mentor);
            setMentor({ name: "" });
            // Re-fetch the mentors after adding a new one
            const response = await axios.get('http://localhost:5000/mentors');
            setMentors(response.data);
            setMessage("Mentor added successfully!"); // Set success message
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error adding mentor:", error);
            setMessage("Error adding mentor. Please try again."); // Set error message
            setTimeout(() => setMessage(""), 3000);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this mentor?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/delete-mentor/${id}`);
                // Re-fetch the mentors after deleting
                const response = await axios.get('http://localhost:5000/mentors');
                setMentors(response.data);
                setMessage("Mentor deleted successfully!"); // Set success message
                setTimeout(() => setMessage(""), 2000);
            } catch (error) {
                console.error("Error deleting mentor:", error);
                setMessage("Error deleting mentor. Please try again."); // Set error message
                setTimeout(() => setMessage(""), 3000);
            }
        }
    };

    return (
        <div className="add-mentor-container">
            <h2 className="add-mentor-title">Add Mentor</h2>
            <form onSubmit={handleSubmit} className="add-mentor-form">
                <input 
                    type="text" 
                    placeholder="Mentor Name" 
                    value={mentor.name} 
                    onChange={(e) => setMentor({ ...mentor, name: e.target.value })}
                    className="add-mentor-input"
                    required 
                />
                <button type="submit" className="add-mentor-submit">Add Mentor</button>
            </form>

            {/* Display the message */}
            {message && <div className="message">{message}</div>}

            <div className="mentor-list-container">
                <h3 className="mentor-list-heading">Mentors</h3>
                <ul className="mentor-list-items">
                    {mentors.map(mentor => (
                        <li key={mentor._id} className="mentor-item">
                            <span className="mentor-name">{mentor.name}</span>
                            <button onClick={() => handleDelete(mentor._id)} className="delete-mentor-button">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AddMentor;
