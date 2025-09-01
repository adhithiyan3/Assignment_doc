const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // uploaded, created, updated, deleted
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

module.exports = mongoose.model("Activity", activitySchema);
