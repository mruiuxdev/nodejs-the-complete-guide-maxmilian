const express = require("express");
const { check } = require("express-validator");
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
router.post(
  "/auth/signup",
  check("email").isEmail().withMessage("Please enter a invalid email"),
  postSignup
);

router.post("/auth/logout", postLogout);

router.get("/auth/reset", getReset);
router.post("/auth/reset", postReset);

router.get("/auth/reset/:token", getNewPassword);
router.post("/auth/new-password", postNewPassword);

module.exports = router;
