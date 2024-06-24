const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    cart: {
      items: [
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, required: true },
        },
      ],
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },
  { timeseries: true, timestamps: true }
);

userSchema.methods.addToCart = function (product) {
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

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };

  return this.save();
};

module.exports = mongoose.model("User", userSchema);
