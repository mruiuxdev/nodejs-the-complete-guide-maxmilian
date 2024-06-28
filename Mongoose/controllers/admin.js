const { validationResult } = require("express-validator");
const Product = require("../models/product");

exports.getAllProducts = (req, res) => {
  Product.find({ userId: req.user._id })
    // .select("-_id")
    // .populate("userId", "username")
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

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    edit: false,
    hasError: false,
    errorMessage: req.flash("error"),
    oldInput: { title: "", price: "", imageUrl: "", description: "" },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0]?.path);

    return res.render("admin/edit-product", {
      pageTitle: "Add product",
      path: "/admin/add-product",
      edit: false,
      hasError: false,
      errorMessage: req.flash("error"),
      oldInput: { title, price, imageUrl, description },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  const { edit } = req.query;

  if (!edit) {
    return res.redirect("/admin/products");
  }

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        product,
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        edit,
        hasError,
        errorMessage: req.flash("error"),
        oldInput: { title: "", price: "", imageUrl: "", description: "" },
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0]?.msg);

    return res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      edit: true,
      hasError,
      errorMessage: req.flash("error"),
      oldInput: { title, price, imageUrl, description },
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;

      return product.save().then(() => res.redirect("/admin/products"));
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};
