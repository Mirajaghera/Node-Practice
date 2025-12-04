const jwt = require("jsonwebtoken"); // 1. Import JWT
const User = require("../models/UserModal"); // Note: You'll need to update your actual UserModal to import mongoose instead of monggose and export User.

// NOTE: In a real app, use a configuration file (like a .env)
// to load the JWT_SECRET securely.

// Helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token validity (e.g., 30 days)
  });
};

async function createUser(req, res) {
  const body = req.body;
  const file = req.file; // Get the uploaded file from multer

  if (!body.firstName || !body.email || !body.password || !body.lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }

  // Get profile picture URL from multer/Cloudinary (if file was uploaded)
  const profilePictureUrl = file ? file.path : null;

  // Mongoose pre-save hook handles hashing the password
  const newUser = await User.create({
    firstName: body.firstName,
    email: body.email,
    password: body.password,
    role: body.role || "normal",
    lastName: body.lastName,
    profilePicture: profilePictureUrl, // Store the Cloudinary URL
  });

  // Respond with success and the generated JWT
  if (newUser) {
    return res.status(201).json({
      message: "User created successfully",
      _id: newUser._id,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
    });
  } else {
    return res.status(400).json({ error: "Invalid user data" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password are required" });
  }

  // 1. Find user by email (we need the full document to call comparePassword)
  const user = await User.findOne({ email: email });

  if (user && (await user.comparePassword(password))) {
    return res.status(200).json({
      message: "Login successful",
      data: {
        _id: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName,
        profilePicture: user.profilePicture || null,
        role: user.role,
        token: generateToken(user._id), // Generate and return the token
      },
    });
  } else {
    // Return generic error for security
    return res.status(401).json({ error: "Invalid email or password" });
  }
}

// Ensure you export the new functions if you defined totalLogin previously
module.exports = { createUser, loginUser };
