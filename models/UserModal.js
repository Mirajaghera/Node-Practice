const monggose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new monggose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["normal", "admin"], // Define the allowed roles
      default: "normal", // Set the default role for new signups
    },
  },
  { timestamps: true }
);
// --- Hashing Middleware (Pre-Save Hook) ---
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    return next();
  }

  // 2. Hash the password with a salt round of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// --- Method to compare passwords for Login ---
userSchema.methods.comparePassword = async function (candidatePassword) {
  // 3. Compare the candidate (login) password with the stored hashed password
  return await bcrypt.compare(candidatePassword, this.password);
};
const User = monggose.model("User", userSchema);

module.exports = User;
