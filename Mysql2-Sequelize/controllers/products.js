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

  req.user
    .createProduct({ title, price, imageUrl, description })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  const { edit } = req.query;

  if (!edit) {
    return res.redirect("/admin/products");
  }

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];

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

  Product.findByPk(productId)
    .then((product) => {
      if (!product) res.redirect("/");

      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;

      return product.save();
    })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  const { productId } = req.body;

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => products[0].destroy())
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));
};

exports.getAllProducts = async (req, res) => {
  req.user
    .getProducts()
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

  req.user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];

      res.render("shop/product-details", {
        product: product,
        pageTitle: product.title,
        path: "/shop/product-details",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) =>
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  let fetchedCart;
  let quantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;

        quantity = oldQuantity + 1;

        return product;
      }

      return Product.findByPk(productId);
    })
    .then((product) =>
      fetchedCart.addProduct(product, { through: { quantity } })
    )
    .then(() => res.redirect("/shop/cart"))
    .catch((err) => console.log(err));
};

exports.deleteCart = (req, res) => {
  const { productId } = req.body;

  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then((products) => {
      const product = products[0];

      return product.cartItem.destroy();
    })
    .then(() => res.redirect("/shop/cart"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) =>
      res.render("shop/orders", {
        pageTitle: "Orders",
        path: "/shop/orders",
        orders,
      })
    )
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res) => {
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;

      return cart.getProducts();
    })
    .then((products) =>
      req.user
        .createOrder()
        .then((order) =>
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };

              return product;
            })
          )
        )
        .catch((err) => console.log(err))
    )
    .then(() => fetchedCart.setProducts(null))
    .then(() => res.redirect("/shop/orders"))
    .catch((err) => console.log(err));
};
