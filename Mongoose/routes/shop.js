const express = require("express");
const {
  getAllProducts,
  getProductDetails,
  getCart,
  postCart,
  deleteCart,
  getCheckout,
  getOrders,
  postOrders,
} = require("../controllers/products");
const router = express.Router();

router.get("/", getAllProducts);

router.get("/shop/product-details/:productId", getProductDetails);

// router.get("/shop/cart", getCart);
// router.post("/shop/cart", postCart);
// router.post("/shop/delete-cart", deleteCart);

// router.get("/shop/orders", getOrders);
// router.post("/shop/create-orders", postOrders);

module.exports = router;
