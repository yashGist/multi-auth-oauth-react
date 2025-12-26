import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/LoginPage.css";

function LoginPage({ githubClientId }) {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);

    // Decode the JWT token to get user info
    const token = credentialResponse.credential;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const userData = JSON.parse(jsonPayload);

    // Save user data to localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    setError(null);

    // Redirect to dashboard
    navigate("/dashboard");
  };

  const handleLoginError = () => {
    setError("Login failed. Please try again.");
    console.error("Login failed");
  };

  const handleGitHubLogin = () => {
    const redirectUri = "http://localhost:5173/github-callback";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;

    window.location.href = githubAuthUrl;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Authentication</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="login-section">
          <p>Sign in with your account</p>

          <div className="auth-buttons">
            <div className="google-login">
              <p>Google</p>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>

            <div className="github-login">
              <p>GitHub</p>
              <button className="github-btn" onClick={handleGitHubLogin}>
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
