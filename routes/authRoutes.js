const express = require("express");
const { createUser, loginUser } = require("../controllers/AuthControllers");
const upload = require("../config/cloudinaryConfig");
const router = express.Router();

router.post("/Login", upload.none(), loginUser);
router.post("/SignUp", upload.single("profilePicture"), createUser);
// router.get("/totalLogin", totalLogin);
//router.get("/logout", redirectToUrl);
module.exports = router;
