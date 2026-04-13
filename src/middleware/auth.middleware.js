const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const NOT_ALLOWED = { message: "You're not allowed to do this" };

function requireJwt(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json(NOT_ALLOWED);
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json(NOT_ALLOWED);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const role = payload.role;

    if (role !== "ADMIN" && role !== "USER") {
      return res.status(401).json(NOT_ALLOWED);
    }

    req.auth = { role };
    return next();
  } catch {
    return res.status(401).json(NOT_ALLOWED);
  }
}

module.exports = { requireJwt };
