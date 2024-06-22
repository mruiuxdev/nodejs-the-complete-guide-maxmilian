const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect(process.env.MONGO_URI)
    .then((client) => {
      console.log("Database connected");

      _db = client.db();

      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database found";
};

module.exports = {
  mongoConnect,
  getDb,
};
