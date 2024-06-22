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
  User.findById("6676c11618f2ca4d1b17f062")
    .then((user) => {
      req.user = user;

      next();
    })
    .catch((err) => console.log(err));
});

app.use(adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "mruiux",
          email: "mruiux@dev.com",
          cart: { items: [] },
        });

        user.save();
      }
    });

    app.listen(3000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
