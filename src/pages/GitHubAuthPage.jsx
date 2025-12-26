import { useNavigate } from 'react-router-dom';
import '../styles/GitHubAuthPage.css';

function GitHubAuthPage({ githubClientId }) {
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    const redirectUri = 'http://localhost:5173/github-callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>GitHub Authentication</h1>
        
        <div className="auth-form">
          <p>Sign in with your GitHub account</p>
          <button className="github-btn" onClick={handleGitHubLogin}>
            Sign in with GitHub
          </button>
        </div>

        <div className="back-link">
          <a href="/all">← Back to All Auth Methods</a>
        </div>
      </div>
    </div>
  );
}

export default GitHubAuthPage;