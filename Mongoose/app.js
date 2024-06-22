const path = require("path");
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const get404 = require("./controllers/404");
const mongoose = require("mongoose");
const User = require("./models/user");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // User.fetchById("6674141b038d8ff08a2e9ef1")
  //   .then((user) => {
  //     req.user = new User(user._id, user.username, user.email, user.cart);

  //     next();
  //   })
  //   .catch((err) => console.log(err));

  next();
});

app.use(adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
