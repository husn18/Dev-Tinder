const mongoose = require("mongoose");

const connectDb = async () => {
  return mongoose.connect(
    "mongodb+srv://Dev-Tinder:8qbvzP0BDJEYVHYb@dev-tinder.uxi7hcw.mongodb.net/Dev-Tinder?retryWrites=true&w=majority"
  );
};

module.exports = connectDb;