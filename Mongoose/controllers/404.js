const get404 = (req, res) =>
  res.render("404", {
    pageTitle: "404",
    path: "*",
  });

module.exports = get404;
