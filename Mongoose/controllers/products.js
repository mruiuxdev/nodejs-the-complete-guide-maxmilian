const Product = require("../models/product");
const Order = require("../models/order");

exports.getAllProducts = async (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop", {
        products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products?.length > 0,

        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res) => {
  const { productId } = req.params;

  Product.findById(productId)
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
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    req.user
      .populate("cart.items.productId")
      .then((user) => {
        res.render("shop/cart", {
          path: "/shop/cart",
          pageTitle: "Your Cart",
          products: user.cart.items,
        });
      })
      .catch((err) => console.log(err));
  }
};

exports.postCart = (req, res) => {
  const { productId } = req.body;

  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    Product.findById(productId)
      .then((product) => req.user.addToCart(product))
      .then(() => res.redirect("/shop/cart"))
      .catch((err) => console.log(err));
  }
};

exports.deleteCart = (req, res) => {
  const { productId } = req.body;

  req.user
    .removeFromCart(productId)
    .then(() => res.redirect("/shop/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    Order.find({ "user.userId": req.user._id })
      .then((orders) =>
        res.render("shop/orders", {
          pageTitle: "Orders",
          path: "/shop/orders",
          orders,
        })
      )
      .catch((err) => console.log(err));
  }
};

exports.postOrders = (req, res) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });

      const order = new Order({
        user: { email: req.user.email, userId: req.user },
        products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/shop/orders"))
    .catch((err) => console.log(err));
};
