import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function FacebookCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Facebook authentication failed");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
      return;
    }

    if (code) {
      exchangeCodeForToken(code);
    } else {
      setError("No authorization code received");
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code) => {
    try {
      // Call backend to exchange code for user data
      const response = await fetch("http://localhost:5000/api/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Failed to get user data");
        setLoading(false);
        setTimeout(() => navigate("/all"), 2000);
      }
    } catch (err) {
      console.error("Error exchanging code:", err);
      setError("Authentication error: " + err.message);
      setLoading(false);
      setTimeout(() => navigate("/all"), 2000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1877f2 0%, #0a66c2 100%)",
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
              Authenticating with Facebook...
            </h2>
            <p style={{ color: "#666" }}>Please wait...</p>
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #1877f2",
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

export default FacebookCallbackPage;
