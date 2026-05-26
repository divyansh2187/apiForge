const express = require("express");
const Collection = require("../models/Collection");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Get all collections
router.get("/", protect, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create collection
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    const collection = await Collection.create({
      name,
      description,
      color,
      user: req.user._id,
    });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update collection
router.put("/:id", protect, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });

    const { name, description, color } = req.body;
    collection.name = name || collection.name;
    collection.description = description ?? collection.description;
    collection.color = color || collection.color;
    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete collection
router.delete("/:id", protect, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!collection)
      return res.status(404).json({ message: "Collection not found" });
    res.json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
