import "../styles/FacebookAuthPage.css";

function FacebookAuthPage() {
  const facebookClientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

  const handleFacebookLogin = () => {
    const redirectUri = "http://localhost:5173/facebook-callback";

    const facebookAuthUrl =
      `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${facebookClientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=public_profile`; // ✅ EMAIL REMOVED

    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Facebook Authentication</h1>

        <div className="auth-form">
          <p>Sign in with Facebook</p>
          <button className="facebook-btn" onClick={handleFacebookLogin}>
            Sign in with Facebook
          </button>
        </div>

        <div className="back-link">
          <a href="/all">← Back</a>
        </div>
      </div>
    </div>
  );
}

export default FacebookAuthPage;
