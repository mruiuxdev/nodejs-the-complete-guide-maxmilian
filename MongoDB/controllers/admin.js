const Product = require("../models/product");

exports.getAllProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        products,
        pageTitle: "Admin",
        path: "/admin/products",
        hasProducts: products?.length > 0,
      });
    })
    .catch((err) => console.log(err));
};
