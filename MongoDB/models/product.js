const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/database");

class Product {
  constructor(id, title, price, imageUrl, description, userId) {
    this._id = id ? ObjectId.createFromHexString(id) : null;
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static fetchById(id) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: ObjectId.createFromHexString(id) })
      .next()
      .then((product) => product)
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: ObjectId.createFromHexString(id) })
      .then(() => console.log("Product deleted"))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
