import "../styles/Dashboard.css";

// Placeholder for company logo (replace with your actual logo path)
import logo from "../assets/logo.jfif" // Make sure to place your logo image in the assets folder


function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="hero">
        <img src={logo} alt="Numetry Technologies Logo" className="hero-logo" />
        <h1 className="hero-title">Numetry Technologies</h1>
      </header>

      <div className="welcome-message">
        <h2>Welcome to Numetry Technologies!</h2>
        <p>Your journey to innovative technology solutions starts here.</p>
      </div>

    </div>
  );
}

export default Dashboard;
