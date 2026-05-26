const mongoose = require("mongoose");

const savedRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      default: "GET",
    },
    url: { type: String, required: true },
    headers: { type: Array, default: [] },
    params: { type: Array, default: [] },
    body: { type: String, default: "" },
    bodyType: {
      type: String,
      enum: ["none", "json", "form-data", "raw"],
      default: "none",
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastResponse: {
      status: Number,
      time: Number,
      size: Number,
      body: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedRequest", savedRequestSchema);
