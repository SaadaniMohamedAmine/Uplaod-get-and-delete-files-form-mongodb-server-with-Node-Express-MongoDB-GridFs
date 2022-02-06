const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1/images";
const connection = async () => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true });
    console.log("Connected to database ...");
  } catch (err) {
    if (err) throw err;
    console.log("Connection is not established !!");
  }
};
module.exports = connection;
