import { Link } from 'react-router-dom';
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item"><Link to="/dashboard" className="navbar-link">Home</Link></li>
        <li className="navbar-item"><Link to="/tasks" className="navbar-link">Tasks</Link></li>
        <li className="navbar-item"><Link to="/attendance" className="navbar-link">Attendance</Link></li>
        <li className="navbar-item"><Link to="/add-user" className="navbar-link">Add User</Link></li>
        <li className="navbar-item"><Link to="/add-mentor" className="navbar-link">Add Mentor</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

