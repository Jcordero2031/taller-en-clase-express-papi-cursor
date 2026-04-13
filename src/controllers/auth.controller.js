const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN, USERS } = require("../config/constants");

function login(req, res) {
  const { user, password } = req.body ?? {};

  const account = USERS.find(
    (u) => u.user === user && u.password === password
  );

  if (!account) {
    return res.status(400).json({ message: "invalid credentials" });
  }

  const token = jwt.sign({ role: account.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return res.status(200).json({ Token: token });
}

module.exports = { login };
