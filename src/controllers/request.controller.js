function request(req, res) {
  const role = req.auth?.role;

  if (role === "ADMIN") {
    return res.status(200).json({ message: "Hi from ADMIN" });
  }
  if (role === "USER") {
    return res.status(200).json({ message: "Hi from USER" });
  }

  return res.status(401).json({ message: "You're not allowed to do this" });
}

module.exports = { request };
