const get404 = (req, res) =>
  res.render("404", {
    pageTitle: "404",
    path: "*",
    isAuthenticated: req.session.isLoggedIn,
  });

module.exports = get404;
