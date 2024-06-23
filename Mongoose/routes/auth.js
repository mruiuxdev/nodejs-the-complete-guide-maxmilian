const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
} = require("../controllers/auth");

const router = express.Router();

router.get("/auth/login", getLogin);
router.post("/auth/login", postLogin);

router.get("/auth/signup", getSignup);
router.post("/auth/signup", postSignup);

router.post("/auth/logout", postLogout);

module.exports = router;
