const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: { type: String, enum: ["created", "updated", "deleted"], required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
