import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/all");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/all");
  };

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  // ✅ Provider (never hard-coded)
  const provider = user.provider || "Unknown";

  // ✅ Profile image with safe fallbacks
  const profileImage =
    user.picture ||
    (provider === "GitHub"
      ? "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
      : provider === "Facebook"
      ? "https://www.facebook.com/images/fb_icon_325x325.png"
      : "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png");

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <div className="user-profile">
          <img
            src={profileImage}
            alt={user.name || "User"}
            className="profile-pic"
          />
          <h2>Welcome, {user.name || "User"}!</h2>
          <p className="email">{user.email || "Email not available"}</p>
        </div>

        <div className="user-details">
          <h3>Your Information</h3>

          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{user.name || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span className="label">Email:</span>
            <span className="value">{user.email || "N/A"}</span>
          </div>

          <div className="detail-row">
            <span className="label">Provider:</span>
            <span className="value">{provider}</span>
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
