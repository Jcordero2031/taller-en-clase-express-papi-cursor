const { Router } = require("express");
const { requireJwt } = require("../middleware/auth.middleware");
const { request } = require("../controllers/request.controller");

const router = Router();

router.get("/request", requireJwt, request);

module.exports = router;
