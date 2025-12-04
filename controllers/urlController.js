const { nanoid } = require("nanoid");
const URL = require("../models/urlModel");

async function createShortUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "Url is required" });
  }
  const shortId = nanoid(8);
  await URL.create({ shortId, redirectUrl: body.url, VisitsHistory: [] });
  return res.status(201).json({ shortUrl: shortId });
}
async function redirectToUrl(req, res) {
  const { shortId } = req.params;
  const urlData = await URL.findOne({ shortId });
  if (!urlData) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  res.redirect(urlData.redirectUrl);
}
async function getAnalytics(req, res) {
  const { shortId } = req.params;
  const urlData = await URL.findOne({ shortId });
  if (!urlData) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  res.json({
    analytics: urlData.VisitsHistory,
    totalClicks: urlData.VisitsHistory.length,
  });
}
module.exports = { createShortUrl, redirectToUrl, getAnalytics };
