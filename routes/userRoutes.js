const express = require("express");
const router = express.Router();
const {
  showAllUser,
  updateUser,
  deleteUser,
  showUserById,
} = require("../controllers/UserControllers");
const { protect, authorize } = require("../middleware/authMiddleware"); // Import both middlewares
const upload = require("../config/cloudinaryConfig");

// Restrict showAllUser to admins only
router.get("/", protect, authorize("admin"), showAllUser);

// All routes here require authentication to access them
// In the future, you should change updateUser/deleteUser to use req.user._id, not req.params.id,
// to ensure a user can only update/delete their own account.
router
  .route("/:id")
  .get(protect, showUserById)
  .patch(protect, upload.none(), updateUser)
  .delete(protect, deleteUser);

module.exports = router;
