const express = require("express");
const axios = require("axios");
const History = require("../models/History");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { method, url, headers = [], params = [], body, bodyType } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  // Build headers object
  const headersObj = {};
  headers.forEach(({ key, value, enabled }) => {
    if (key && enabled !== false) headersObj[key] = value;
  });

  // Build query params
  const paramsObj = {};
  params.forEach(({ key, value, enabled }) => {
    if (key && enabled !== false) paramsObj[key] = value;
  });

  // Build request body
  let requestBody = undefined;
  if (bodyType === "json" && body) {
    try {
      requestBody = JSON.parse(body);
      headersObj["Content-Type"] = "application/json";
    } catch {
      return res.status(400).json({ message: "Invalid JSON body" });
    }
  } else if (bodyType === "raw" && body) {
    requestBody = body;
  }

  const startTime = Date.now();

  try {
    const response = await axios({
      method: method.toLowerCase(),
      url,
      headers: headersObj,
      params: paramsObj,
      data: requestBody,
      validateStatus: () => true, // Don't throw on any HTTP status
      timeout: 30000,
      maxContentLength: 5 * 1024 * 1024, // 5MB max
    });

    const elapsed = Date.now() - startTime;
    const responseBody =
      typeof response.data === "object"
        ? JSON.stringify(response.data, null, 2)
        : String(response.data);

    const size = Buffer.byteLength(responseBody, "utf8");

    // Save to history
    await History.create({
      user: req.user._id,
      method,
      url,
      headers,
      params,
      body,
      bodyType,
      response: {
        status: response.status,
        statusText: response.statusText,
        time: elapsed,
        size,
        headers: response.headers,
        body: responseBody.substring(0, 50000), // Limit stored size
      },
    });

    res.json({
      status: response.status,
      statusText: response.statusText,
      time: elapsed,
      size,
      headers: response.headers,
      body: responseBody,
    });
  } catch (err) {
    const elapsed = Date.now() - startTime;
    if (err.code === "ECONNREFUSED") {
      return res.status(200).json({
        error: true,
        message: "Connection refused — is the server running?",
        time: elapsed,
      });
    }
    if (err.code === "ENOTFOUND") {
      return res.status(200).json({
        error: true,
        message: "Could not resolve host — check the URL",
        time: elapsed,
      });
    }
    if (err.code === "ETIMEDOUT" || err.code === "ECONNABORTED") {
      return res.status(200).json({
        error: true,
        message: "Request timed out after 30 seconds",
        time: elapsed,
      });
    }
    res.status(200).json({
      error: true,
      message: err.message,
      time: elapsed,
    });
  }
});

// Get history
router.get("/history", protect, async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear history
router.delete("/history", protect, async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
