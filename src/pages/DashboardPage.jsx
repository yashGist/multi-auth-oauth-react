import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If no user data, redirect to all auth
      navigate("/all");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/all");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <div className="user-profile">
          <img src={user.picture} alt={user.name} className="profile-pic" />
          <h2>Welcome, {user.name}!</h2>
          <p className="email">{user.email}</p>
        </div>

        <div className="user-details">
          <h3>Your Information</h3>
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="label">Provider:</span>
            <span className="value">Google</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
