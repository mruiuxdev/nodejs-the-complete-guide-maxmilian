const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.get("/auth/login", getLogin);
router.post("/auth/login", postLogin);

router.get("/auth/signup", getSignup);
router.post("/auth/signup", postSignup);

router.post("/auth/logout", postLogout);

router.get("/auth/reset", getReset);
router.post("/auth/reset", postReset);

router.get("/auth/rest/:token", getNewPassword);
router.post("/auth/new-password", postNewPassword);

module.exports = router;
