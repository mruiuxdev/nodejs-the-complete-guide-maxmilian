const Product = require("../models/product");
const Order = require("../models/order");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    edit: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res) => {
  const { title, price, description, imageUrl } = req.body;

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

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        product,
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        edit,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId, title, description, price, imageUrl } = req.body;

  Product.findByIdAndUpdate(
    productId,
    { title, description, price, imageUrl },
    { new: true, runValidators: true }
  )
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  Product.findByIdAndDelete(productId)
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getAllProducts = async (req, res) => {
  Product.find()
    .then((products) => {
      res.render("shop", {
        products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products?.length > 0,
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
          isAuthenticated: req.session.isLoggedIn,
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
          isAuthenticated: req.session.isLoggedIn,
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
        user: { username: req.user.username, userId: req.user },
        products,
      });

      return order.save();
    })
    .then(() => req.user.clearCart())
    .then(() => res.redirect("/shop/orders"))
    .catch((err) => console.log(err));
};
