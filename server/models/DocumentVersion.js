const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
  title: String,
  content: String,
  tags: [String],
  summary: String,
  editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  editedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DocumentVersion", versionSchema);
