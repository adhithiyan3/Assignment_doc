const mongoose = require("mongoose");

const documentVersionSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    title: String,
    content: String,
    tags: [String],
    summary: String,
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // must match "editedBy"
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocumentVersion", documentVersionSchema);
