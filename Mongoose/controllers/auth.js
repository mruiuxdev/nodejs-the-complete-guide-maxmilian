const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
        .then(() => res.redirect("/"));
    })

    .catch((err) => console.log(err));
};
