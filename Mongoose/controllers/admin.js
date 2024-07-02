const { validationResult } = require("express-validator");
const Product = require("../models/product");
const { default: mongoose } = require("mongoose");

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
    hasError: true,
    errorMessage: req.flash("error"),
    oldInput: { title: "", price: "", imageUrl: "", description: "" },
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, price, imageUrl, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0]?.path);

    return res.status(442).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "/admin/add-product",
      edit: false,
      hasError: true,
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
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);

      error.httpStatusCode = 500;

      return next(error);
    });
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
        hasError: true,
        errorMessage: req.flash("error"),
        oldInput: {
          title: product?.title || "",
          price: product?.price || null,
          imageUrl: product?.imageUrl || "",
          description: product?.description || "",
        },
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);

      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash("error", errors.array()[0]?.msg);

    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      edit: true,
      hasError: true,
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
    .catch((err) => {
      const error = new Error(err);

      error.httpStatusCode = 500;

      return next(error);
    });
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => {
      const error = new Error(err);

      error.httpStatusCode = 500;

      return next(error);
    });
};
