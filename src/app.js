const express = require("express");
const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Define it as an environment variable."
    );
  }
  return secret;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1h" });
}

function extractBearerToken(req) {
  const header = req.get("authorization");
  if (!header) return null;

  const [scheme, ...rest] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || rest.length === 0) return null;

  const raw = rest.join(" ").trim();
  if (!raw) return null;

  // Accept tokens that accidentally include "Token " prefix.
  if (raw.toLowerCase().startsWith("token ")) {
    return raw.slice("token ".length).trim();
  }

  return raw;
}

function auth(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }
}

function validateCredentials({ user, password }) {
  if (user === "ADMIN" && password === "ADMIN") return { user: "ADMIN", role: "ADMIN" };
  if (user === "USER" && password === "USER") return { user: "USER", role: "USER" };
  return null;
}

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "Auth/Roles API is running",
    endpoints: ["GET /health", "POST /login", "GET /request"],
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post("/login", (req, res) => {
  const { user, password } = req.body || {};
  const validated = validateCredentials({ user, password });

  if (!validated) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const token = signToken({ user: validated.user, role: validated.role });
  return res.status(200).json({ Token: token });
});

app.get("/request", auth, (req, res) => {
  const role = req.user?.role;

  if (role === "ADMIN") {
    return res.status(200).json({ message: "Hi from ADMIN" });
  }

  if (role === "USER") {
    return res.status(200).json({ message: "Hi from USER" });
  }

  return res.status(401).json({ message: "You're not allowed to do this" });
});

module.exports = { app };

