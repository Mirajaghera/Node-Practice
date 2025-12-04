const express = require("express");
const {
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  createUser,
} = require("../controllers/user");
const router = express.Router();
router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

router.route("/").post(createUser).get(getAllUsers);

// app.get("/Users", (req, res) => {
//   const html = `
//     <ul>
//     ${Data.map((item) => `<li>${item.first_name}</li>`).join("")}
//     </ul>
//     `;
//   return res.send(html);
// });

// app.get("/Users/:id", (req, res) => {

// });
module.exports = router;
