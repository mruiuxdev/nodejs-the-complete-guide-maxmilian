const express = require("express");
const { getLogin, postLogin, postLogout } = require("../controllers/auth");

const router = express.Router();

router.get("/auth/login", getLogin);
router.post("/auth/login", postLogin);
router.post("/auth/logout", postLogout);

module.exports = router;
