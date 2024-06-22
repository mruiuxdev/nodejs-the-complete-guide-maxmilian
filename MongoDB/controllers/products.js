const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body;

  const product = new Product(
    null,
    title,
    price,
    imageUrl,
    description,
    req.user._id
  );

  product
    .save()
    .then(() => {
      console.log("Product created");
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

  Product.fetchById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        product,
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        edit,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body;

  const product = new Product(productId, title, price, imageUrl, description);

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.deleteById(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getAllProducts = async (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop", {
        products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products?.length > 0,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res) => {
  const { productId } = req.params;

  Product.fetchById(productId)
    .then((product) => {
      res.render("shop/product-details", {
        product: product,
        pageTitle: product?.title,
        path: "/shop/product-details",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) =>
      res.render("shop/cart", {
        path: "/shop/cart",
        pageTitle: "Your Cart",
        products: products,
      })
    )
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;

  Product.fetchById(productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect("/shop/cart"))
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res) => {
  const { productId } = req.body;

  req.user
    .deleteItemFromCart(productId)
    .then(() => res.redirect("/shop/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/shop/orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res) => {
  req.user
    .addOrders()
    .then(() => res.redirect("/shop/orders"))
    .catch((err) => console.log(err));
};
