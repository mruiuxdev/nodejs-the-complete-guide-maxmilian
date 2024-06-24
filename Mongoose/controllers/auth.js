const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const user = require("../models/user");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRIP_HOST,
  port: process.env.MAILTRIP_PORT,
  secure: false, // use SSL
  auth: {
    user: process.env.MAILTRIP_USER,
    pass: process.env.MAILTRIP_PASS,
  },
});

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid credential");

        return res.redirect("/auth/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          console.log(passwordMatch);
          if (passwordMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              console.log(err);

              return res.redirect("/");
            });
          } else {
            req.flash("error", "Invalid credential");

            return res.redirect("/auth/login");
          }
        })
        .catch((err) => {
          console.log(err);

          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);

    res.redirect("/");
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    path: "/auth/signup",
    pageTitle: "Signup",
    errorMessage: req.flash("error"),
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "Email already exists, please pick a different one");

        return res.redirect("/auth/signup");
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });

          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            console.log(err);

            return user.save();
          });
        })
        .then(() => {
          return transporter
            .sendMail({
              to: email,
              from: "mr.uiux.dev@gmail.com",
              subject: "Shop Nodejs",
              html: "<h1>You successfully signed up!!!</h1>",
            })
            .catch((err) => console.log(err));
        })
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err));
    })

    .catch((err) => console.log(err));
};

exports.getReset = (req, res) => {
  res.render("auth/reset", {
    path: "/auth/reset",
    pageTitle: "Reset",
    errorMessage: req.flash("error"),
  });
};

exports.postReset = (req, res) => {
  const { email } = req.body;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);

      return res.redirect("/auth/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found");

          return res.redirect("/auth/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter
          .sendMail({
            to: email,
            from: "mr.uiux.dev@gmail.com",
            subject: "Password reset",
            html: `
                <p>You requested a password</p>
                <p>Click this <a href="http://localhost:3000/auth/reset/${token}">link</a> to set a new password</p>
              `,
          })
          .catch((err) => console.log(err));

        return res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res) => {
  const { token } = req.params;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(() => {
      res.render("auth/new-password", {
        path: "/auth/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error"),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res) => {
  const { password, userId, passwordToken } = req.body;
  let resetUser;

  User.find({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          resetUser.password = hashedPassword;
          resetUser.resetToken = null;
          resetUser.resetTokenExpiration = undefined;
          return resetUser.save();
        })
        .then(() => {
          res.redirect("/auth/login");
        });
    })
    .catch((err) => console.log(err));
};
