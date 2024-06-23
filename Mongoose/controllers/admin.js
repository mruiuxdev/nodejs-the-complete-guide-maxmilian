const Product = require("../models/product");

exports.getAllProducts = (req, res) => {
  Product.find()
    // .select("-_id")
    // .populate("userId", "username")
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin",
        path: "/admin/products",
        hasProducts: products?.length > 0,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
