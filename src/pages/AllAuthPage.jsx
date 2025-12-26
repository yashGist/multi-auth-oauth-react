import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/AllAuthPage.css";

function AllAuthPage({ githubClientId, facebookClientId }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const googleUser = JSON.parse(jsonPayload);

    const user = {
      provider: "Google", // ✅ ADD THIS
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
    };

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  };

  const handleGitHubLogin = () => {
    const redirectUri = "http://localhost:5173/github-callback";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  const handleFacebookLogin = () => {
    const redirectUri = "http://localhost:5173/facebook-callback";

    const facebookAuthUrl =
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${facebookClientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=public_profile`; // ✅ email REMOVED

    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Choose Login Method</h1>

        <div className="auth-options">
          {/* Google Login */}
          <div className="auth-option google-option">
            <h3>Google</h3>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Google login failed")}
            />
          </div>

          {/* GitHub Login */}
          <div className="auth-option github-option">
            <h3>GitHub</h3>
            <button className="auth-btn github-btn" onClick={handleGitHubLogin}>
              Sign in with GitHub
            </button>
          </div>

          {/* Facebook Login */}
          <div className="auth-option facebook-option">
            <h3>Facebook</h3>
            <button
              className="auth-btn facebook-btn"
              onClick={handleFacebookLogin}
            >
              Sign in with Facebook
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <p>Or go to specific auth:</p>
          <a href="/google">Google Only</a>
          <a href="/git">GitHub Only</a>
          <a href="/fb">Facebook Only</a>
        </div>
      </div>
    </div>
  );
}

export default AllAuthPage;
