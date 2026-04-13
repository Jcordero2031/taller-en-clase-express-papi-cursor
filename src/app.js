const express = require("express");
const authRoutes = require("./routes/auth.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

app.use(express.json());

// El navegador pide GET /; los endpoints del taller son POST /login y GET /request (Postman).
app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "API taller-xpress. El README no define GET /. Usa Postman: POST /login (JSON user/password) y GET /request (header Authorization: Bearer <token>).",
  });
});

app.use(authRoutes);
app.use(requestRoutes);

module.exports = app;
