const User = require("../models/UserModal");
// Assuming you have access to the Cloudinary upload middleware here too
const upload = require("../config/cloudinaryConfig");
const { deleteImageFromCloudinary } = require("../utils/cloudinary");

// --- Helper function to handle profile picture update logic ---
async function handleProfilePictureUpdate(req, res, next) {
  // 1. Get the authenticated user ID
  const userId = req.user._id;
  const file = req.file; // The new image file from Multer

  // 2. Find the current user document
  const user = await User.findById(userId);
  if (!user) {
    // This should not happen if 'protect' ran correctly
    return res.status(404).json({ error: "Authenticated user not found" });
  }

  let updateData = { ...req.body };
  let oldPublicId = user.cloudinaryPublicId;
  let newPublicId = null;
  let newUrl = null;

  if (file) {
    // A new file was uploaded, save the new details
    newUrl = file.path;
    newPublicId = file.filename;
    updateData.profilePictureUrl = newUrl;
    updateData.cloudinaryPublicId = newPublicId;
  } else if (req.body.delete_image === "true") {
    // User explicitly asked to delete the image (e.g., from an update form)
    updateData.profilePictureUrl = null;
    updateData.cloudinaryPublicId = null;
    oldPublicId = user.cloudinaryPublicId; // Ensure deletion happens
  } else {
    // No file uploaded and no explicit delete command, proceed with text updates only
    oldPublicId = null;
  }

  // 3. Update text fields and image path/id
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  // 4. Delete the old image from Cloudinary (must happen AFTER the database update is safe)
  if (oldPublicId) {
    await deleteImageFromCloudinary(oldPublicId);
  }

  // 5. Send success response
  return res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
}

// --- Image Deletion Endpoint (DELETE /user/me/profile-picture) ---
async function deleteProfilePicture(req, res) {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user || !user.cloudinaryPublicId) {
    return res
      .status(404)
      .json({ message: "No profile picture found to delete." });
  }

  const publicIdToDelete = user.cloudinaryPublicId;

  // 1. Update the database first
  user.profilePictureUrl = null;
  user.cloudinaryPublicId = null;
  await user.save();

  // 2. Delete the file from the cloud
  await deleteImageFromCloudinary(publicIdToDelete);

  return res
    .status(200)
    .json({ message: "Profile picture deleted successfully." });
}

// --- EXISTING USER CRUD FUNCTIONS (Refactored for security) ---

async function updateUser(req, res) {
  // IMPORTANT: Security improvement: only allow users to update their own profile.
  if (req.params.id !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "Forbidden: You can only update your own profile." });
  }

  // The main logic is handled by handleProfilePictureUpdate if a file is attached.
  // Since this PATCH endpoint now only handles text fields, we update it.
  const body = req.body;

  // Check if the request contains any data to update
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: "No update fields provided." });
  }

  // Prevents accidental password overwrite if not hashed
  if (body.password) {
    return res
      .status(400)
      .json({ error: "Use a dedicated route for password change." });
  }

  const user = await User.findByIdAndUpdate(req.params.id, body, { new: true });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res
    .status(200)
    .json({ message: "User updated successfully", user: user });
}

async function deleteUser(req, res) {
  // IMPORTANT: Only allow users to delete their own profile, unless admin.
  if (req.params.id !== req.user._id.toString() && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Forbidden: You can only delete your own profile." });
  }

  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // --- Image Cleanup on Deletion ---
  if (user.cloudinaryPublicId) {
    await deleteImageFromCloudinary(user.cloudinaryPublicId);
  }

  return res.status(200).json({ message: "User deleted successfully" });
}

// --- Standard functions remain ---
async function showAllUser(req, res) {
  const users = await User.find({});
  return res.status(200).json({ users: users });
}
async function showUserById(req, res) {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user: user });
}

module.exports = {
  showAllUser,
  showUserById,
  updateUser,
  deleteUser,
  handleProfilePictureUpdate,
  deleteProfilePicture,
};
