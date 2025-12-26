import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AllAuthPage from "./pages/AllAuthPage";
import GoogleAuthPage from "./pages/GoogleAuthPage";
import GitHubAuthPage from "./pages/GitHubAuthPage";
import FacebookAuthPage from "./pages/FacebookAuthPage";
import GitHubCallbackPage from "./pages/GitHubCallbackPage";
import FacebookCallbackPage from "./pages/FacebookCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const facebookClientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <Routes>
          <Route
            path="/all"
            element={
              <AllAuthPage
                githubClientId={githubClientId}
                facebookClientId={facebookClientId}
              />
            }
          />
          <Route path="/google" element={<GoogleAuthPage />} />
          <Route
            path="/git"
            element={<GitHubAuthPage githubClientId={githubClientId} />}
          />
          <Route
            path="/fb"
            element={<FacebookAuthPage facebookClientId={facebookClientId} />}
          />
          <Route path="/github-callback" element={<GitHubCallbackPage />} />
          <Route path="/facebook-callback" element={<FacebookCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Navigate to="/all" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
