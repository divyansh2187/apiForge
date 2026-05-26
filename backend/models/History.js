const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    method: { type: String, required: true },
    url: { type: String, required: true },
    headers: { type: Array, default: [] },
    params: { type: Array, default: [] },
    body: { type: String, default: "" },
    bodyType: { type: String, default: "none" },
    response: {
      status: Number,
      statusText: String,
      time: Number,
      size: Number,
      headers: Object,
      body: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
