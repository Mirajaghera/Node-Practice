const mongo = require("mongoose");
const userScheme = new mongo.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    gender: { type: String },
    job_title: { type: String, require: true },
  },
  { timestamps: true }
);
const UserData = mongo.model("userData", userScheme);

module.exports = UserData;
