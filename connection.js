const mongo = require("mongoose");
async function connectDB(url) {
  try {
    await mongo.connect(url);
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connectDB };
