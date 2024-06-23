const express = require("express");
const {
  getAllProducts,
  getProductDetails,
  getCart,
  postCart,
  deleteCart,
  getOrders,
  postOrders,
} = require("../controllers/products");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/", getAllProducts);

router.get("/shop/product-details/:productId", getProductDetails);

router.get("/shop/cart", isAuth, getCart);
router.post("/shop/cart", isAuth, postCart);
router.post("/shop/delete-cart", isAuth, deleteCart);

router.get("/shop/orders", isAuth, getOrders);
router.post("/shop/create-orders", isAuth, postOrders);

module.exports = router;
