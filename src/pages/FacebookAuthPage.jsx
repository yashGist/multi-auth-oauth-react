import { useNavigate } from "react-router-dom";
import "../styles/FacebookAuthPage.css";

function FacebookAuthPage({ facebookClientId }) {
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    const redirectUri = encodeURIComponent(
      "http://localhost:5173/facebook-callback"
    );

    const facebookAuthUrl =
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${facebookClientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=public_profile`; // ✅ FIXED

    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Facebook Authentication</h1>

        <div className="auth-form">
          <p>Sign in with your Facebook account</p>
          <p style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>
            (Demo Mode - Production coming soon)
          </p>
          <button className="facebook-btn" onClick={handleFacebookLogin}>
            Sign in with Facebook
          </button>
        </div>

        <div className="back-link">
          <a href="/all">← Back to All Auth Methods</a>
        </div>
      </div>
    </div>
  );
}

export default FacebookAuthPage;
