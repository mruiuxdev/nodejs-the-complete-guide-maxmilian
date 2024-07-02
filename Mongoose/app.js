const path = require("path");
const express = require("express");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { get404, get500 } = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

dotenv.config();

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
});

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;

      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", get500);
app.use(get404);

app.use((error, req, res, next) => {
  res.render("500", {
    pageTitle: "500",
    path: "*",
    isAuthentication: req.session.isLoggedIn,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");

    app.listen(5000, () => console.log("Server is running"));
  })
  .catch((err) => console.log(err));
