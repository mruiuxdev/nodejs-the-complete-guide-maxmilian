const path = require("path");
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const get404 = require("./controllers/404");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;

      next();
    })
    .catch((err) => console.log(err));
});

app.use(adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => User.findByPk(1))
  .then((user) => {
    if (!user) User.create({ name: "MR", email: "mr@gmail.com" });

    return user;
  })
  .then((user) => {
    if (user) user.createCart();
    return user;
  })
  .then(() => app.listen(3000, () => console.log("Server is running")))
  .catch((err) => console.log(err));
