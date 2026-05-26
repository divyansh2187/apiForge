const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    color: { type: String, default: "#6366f1" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
