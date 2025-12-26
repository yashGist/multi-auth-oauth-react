import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GitHubCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("GitHub authentication was cancelled");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
      return;
    }

    if (!code) {
      setError("No authorization code received from GitHub");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
      return;
    }

    // 🔒 PREVENT DOUBLE CALL (VERY IMPORTANT)
    if (attempts > 0) return;

    setAttempts(1);
    exchangeCodeForToken(code);
  }, []); // ⬅️ EMPTY dependency array ON PURPOSE

  const exchangeCodeForToken = async (code) => {
    try {
      console.log(
        "Attempting to exchange code:",
        code.substring(0, 10) + "..."
      );

      const response = await fetch("http://localhost:5000/api/auth/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Received user data:", data);

      if (data.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Full error:", err);
      setError(`Authentication error: ${err.message}`);
      setLoading(false);

      setTimeout(() => navigate("/all"), 3000);
    }
  };

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
            <p style={{ color: "#666" }}>
              Please wait while we verify your credentials
            </p>
            <div
              style={{
                width: "40px",
                height: "40px",
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
              ⚠️ Authentication Error
            </h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>{error}</p>
            <p style={{ color: "#999", fontSize: "12px" }}>
              Redirecting back in a moment...
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
