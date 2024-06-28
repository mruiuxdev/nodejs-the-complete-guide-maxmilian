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
const { body } = require("express-validator");

const router = express.Router();

router.get("/admin/products", isAuth, getAllProducts);

router.get("/admin/add-product", isAuth, getAddProduct);
router.post(
  "/admin/add-product",
  [
    body("title").isAlphanumeric().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postAddProduct
);

router.get("/admin/edit-product/:productId", isAuth, getEditProduct);
router.post(
  "/admin/edit-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat(),
    body("imageUrl").isURL(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  postEditProduct
);

router.post("/admin/delete-product", isAuth, postDeleteProduct);

module.exports = router;
