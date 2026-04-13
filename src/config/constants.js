/**
 * Valores fijos del taller (sin variables de entorno, por acuerdo del proyecto).
 */
const JWT_SECRET = "taller-xpress-classroom-secret-not-for-production";
const JWT_EXPIRES_IN = "8h";

const USERS = [
  { user: "ADMIN", password: "ADMIN", role: "ADMIN" },
  { user: "USER", password: "USER", role: "USER" },
];

module.exports = { JWT_SECRET, JWT_EXPIRES_IN, USERS };
