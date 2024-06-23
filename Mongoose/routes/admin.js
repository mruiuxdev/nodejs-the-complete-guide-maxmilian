const express = require("express");
const {
  getAllProducts,
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/admin/products", isAuth, getAllProducts);

router.get("/admin/add-product", isAuth, getAddProduct);
router.post("/admin/add-product", isAuth, postAddProduct);

router.get("/admin/edit-product/:productId", isAuth, getEditProduct);
router.post("/admin/edit-product", isAuth, postEditProduct);

router.post("/admin/delete-product", isAuth, postDeleteProduct);

module.exports = router;
