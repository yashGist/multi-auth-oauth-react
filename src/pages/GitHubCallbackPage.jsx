import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GitHubCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("GitHub authentication failed");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
      return;
    }

    if (!code) {
      setError("No authorization code received");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
      return;
    }

    // ✅ Standardized user object (same shape as Google & Facebook)
    const githubUser = {
      name: "GitHub User",
      email: "github-user@example.com",
      picture:
        "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      provider: "GitHub",
    };

    localStorage.setItem("user", JSON.stringify(githubUser));
    setLoading(false);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #333 0%, #1a1a1a 100%)",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
        }}
      >
        {loading && (
          <>
            <h2 style={{ color: "#333", marginBottom: "20px" }}>
              Authenticating with GitHub...
            </h2>
            <p style={{ color: "#666" }}>Please wait...</p>
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #333",
                borderRadius: "50%",
                margin: "20px auto",
                animation: "spin 1s linear infinite",
              }}
            ></div>
          </>
        )}

        {error && (
          <>
            <h2 style={{ color: "#d32f2f", marginBottom: "20px" }}>
              Authentication Error
            </h2>
            <p style={{ color: "#666" }}>{error}</p>
            <p style={{ color: "#999", fontSize: "12px" }}>
              Redirecting back...
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GitHubCallbackPage;
