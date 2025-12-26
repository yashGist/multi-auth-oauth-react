import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/GoogleAuthPage.css";

function GoogleAuthPage() {
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

    const decodedUser = JSON.parse(jsonPayload);

    const googleUser = {
      provider: "Google",
      name: decodedUser.name,
      email: decodedUser.email,
      picture: decodedUser.picture,
    };

    localStorage.setItem("user", JSON.stringify(googleUser));
    navigate("/dashboard");
  };

  const handleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Google Authentication</h1>

        <div className="auth-form">
          <p>Sign in with your Google account</p>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleLoginError}
          />
        </div>

        <div className="back-link">
          <a href="/all">← Back to All Auth Methods</a>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthPage;
