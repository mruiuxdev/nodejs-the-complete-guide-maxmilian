const User = require("../models/user");

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById("6676c11618f2ca4d1b17f062")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);

        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);

    res.redirect("/auth/login");
  });
};
