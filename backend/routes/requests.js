const express = require("express");
const SavedRequest = require("../models/Request");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Get all requests (optionally filter by collection)
router.get("/", protect, async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.collection) filter.collection = req.query.collection;
    const requests = await SavedRequest.find(filter).sort({ updatedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a request
router.post("/", protect, async (req, res) => {
  try {
    const { name, method, url, headers, params, body, bodyType, collection } =
      req.body;
    if (!name || !url || !collection)
      return res.status(400).json({ message: "name, url, collection required" });

    const saved = await SavedRequest.create({
      name, method, url, headers, params, body, bodyType, collection,
      user: req.user._id,
    });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a request
router.put("/:id", protect, async (req, res) => {
  try {
    const request = await SavedRequest.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!request) return res.status(404).json({ message: "Request not found" });

    Object.assign(request, req.body);
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a request
router.delete("/:id", protect, async (req, res) => {
  try {
    const request = await SavedRequest.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
