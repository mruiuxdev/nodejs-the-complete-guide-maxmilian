const express = require("express");
const { check, body } = require("express-validator");
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
const User = require("../models/user");

const router = express.Router();

router.get("/auth/login", getLogin);
router.post(
  "/auth/login",
  [
    check("email").isEmail().withMessage("Please enter a invalid email"),
    body("password", "Password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  postLogin
);

router.get("/auth/signup", getSignup);
router.post(
  "/auth/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a invalid email")
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email address if forbidden");
        // }

        // return true;
        return User.find({ email: value }).then((userDoc) => {
          if (userDoc.email) {
            return Promise.reject(
              "Email already exists, please pick a different one"
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter only numbers and text at least 5 characters")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password have to match");
      }

      return true;
    }),
  ],
  postSignup
);

router.post("/auth/logout", postLogout);

router.get("/auth/reset", getReset);
router.post("/auth/reset", postReset);

router.get("/auth/reset/:token", getNewPassword);
router.post("/auth/new-password", postNewPassword);

module.exports = router;
