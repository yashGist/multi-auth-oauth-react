import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;

// GitHub OAuth Handler
app.post("/api/auth/github", async (req, res) => {
  try {
    const { code } = req.body;
    console.log("GitHub auth request received with code:", code);

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    console.log("Exchanging code for access token...");

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const { access_token, error: tokenError } = tokenResponse.data;

    if (tokenError || !access_token) {
      console.error("Token error:", tokenError);
      return res
        .status(400)
        .json({ error: "Failed to get access token", details: tokenError });
    }

    console.log("Got access token, fetching user data...");

    // Fetch user data
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}` },
    });

    let primaryEmail = userResponse.data.email || "no-email@github.com";

    // Try to fetch emails, but don't fail if it doesn't work
    try {
      console.log("Fetching user emails...");
      const emailResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `token ${access_token}` },
        }
      );

      if (emailResponse.data && emailResponse.data.length > 0) {
        primaryEmail =
          emailResponse.data.find((e) => e.primary)?.email ||
          emailResponse.data[0]?.email ||
          primaryEmail;
      }
    } catch (emailError) {
      console.log("Email fetch failed, using profile email:", primaryEmail);
    }

    const userData = {
      provider: "GitHub",
      name: userResponse.data.name || userResponse.data.login,
      email: primaryEmail,
      picture: userResponse.data.avatar_url,
      id: userResponse.data.id,
    };

    console.log("GitHub user data prepared:", userData);

    return res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("GitHub auth error:", error.message);
    console.error("Full error:", error);
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

// Facebook OAuth Handler
app.post("/api/auth/facebook", async (req, res) => {
  try {
    const { code } = req.body;
    console.log("Facebook auth request received with code:", code);

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    console.log("Exchanging code for access token...");

    // Exchange code for access token
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          redirect_uri: "http://localhost:5173/facebook-callback",
          code: code,
        },
      }
    );

    const { access_token, error: tokenError } = tokenResponse.data;

    if (tokenError || !access_token) {
      console.error("Token error:", tokenError);
      return res
        .status(400)
        .json({ error: "Failed to get access token", details: tokenError });
    }

    console.log("Got access token, fetching user data...");

    // Fetch user data
    const userResponse = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email,picture.type(large)",
        access_token: access_token,
      },
    });

    const userData = {
      provider: "Facebook",
      name: userResponse.data.name,
      email: userResponse.data.email || "no-email@facebook.com",
      picture:
        userResponse.data.picture?.data?.url ||
        "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=0&height=100&width=100",
      id: userResponse.data.id,
    };

    console.log("Facebook user data prepared:", userData);

    return res.status(200).json({ success: true, user: userData });
  } catch (error) {
    console.error("Facebook auth error:", error.message);
    console.error("Full error:", error);
    return res.status(500).json({
      error: "Authentication failed",
      message: error.message,
      details: error.response?.data || "No additional details",
    });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`CORS enabled for http://localhost:5173`);
  console.log(
    `GitHub Client ID: ${
      process.env.GITHUB_CLIENT_ID ? "Configured" : "Missing"
    }`
  );
  console.log(
    `Facebook Client ID: ${
      process.env.FACEBOOK_CLIENT_ID ? "Configured" : "Missing"
    }`
  );
});
