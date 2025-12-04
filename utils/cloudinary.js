const cloudinary = require("cloudinary").v2;
require("dotenv").config(); // Ensure env vars are loaded

// Re-configure Cloudinary if not done in config file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} publicId - The public_id of the image to delete.
 */
const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion status for ${publicId}:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting image ${publicId} from Cloudinary:`, error);
    // Log the error but don't fail the API request
  }
};

module.exports = { deleteImageFromCloudinary };
