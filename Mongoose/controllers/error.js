const get404 = (req, res) =>
  res.render("404", {
    pageTitle: "404",
    path: "*",
    isAuthentication: req.session.isLoggedIn,
  });

const get500 = (req, res) =>
  res.render("500", {
    pageTitle: "500",
    path: "*",
    isAuthentication: req.session.isLoggedIn,
  });

module.exports = { get404, get500 };
