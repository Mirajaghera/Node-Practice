const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectToUrl,
  getAnalytics,
} = require("../controllers/urlController");
router.post("/", createShortUrl);
router.get("/analytics/:shortId", getAnalytics);
router.get("/:shortId", redirectToUrl);
module.exports = router;
