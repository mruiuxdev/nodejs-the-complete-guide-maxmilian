const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class User {
  constructor(id, username, email, cart) {
    this._id = id;
    this.username = username;
    this.email = email;
    this.cart = cart;
  }

  save() {
    const db = getDb();

    return db.collection("users").insertOne(this);
  }

  static fetchById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(userId) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();
    const cartProductIndex = this.cart.items.findIndex(
      (cP) => cP.productId.toString() === product._id.toString()
    );
    const updatedCartItems = [...this.cart.items];
    let quantity = 1;

    if (cartProductIndex >= 0) {
      quantity = this.cart.items[cartProductIndex].quantity + 1;

      updatedCartItems[cartProductIndex].quantity = quantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity });
    }

    const updatedCart = { items: updatedCartItems };

    db.collection("users").updateOne(
      { _id: this._id },
      { $set: { cart: updatedCart } }
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((pro) => pro.productId);

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) =>
        products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find(
              (pro) => pro.productId.toString() === product._id.toString()
            ).quantity,
          };
        })
      );
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    const db = getDb();

    return db
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrders() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: { _id: this._id, username: this.username, email: this.email },
        };

        return db.collection("orders").insertOne(order);
      })
      .then(() => {
        this.cart = { items: [] };

        return db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
      });
  }

  getOrders() {
    const db = getDb();

    return db.collection("orders").find({ "user._id": this._id }).toArray();
  }
}

module.exports = User;
