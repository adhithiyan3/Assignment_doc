const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  searchDocuments,
  semanticSearch,
  questionAnswer,
  getVersionHistory,
  getActivityFeed
} = require("../controllers/documentController");

const router = express.Router();

router.post("/", verifyToken, createDocument);
router.get("/", verifyToken, getDocuments);
router.get("/:id", verifyToken, getDocument);
router.put("/:id", verifyToken, updateDocument);
router.delete("/:id", verifyToken, deleteDocument);

router.get("/search/text", verifyToken, searchDocuments);
router.get("/search/semantic", verifyToken, semanticSearch);
router.post("/qa", verifyToken, questionAnswer);

router.get("/:id/versions", verifyToken, getVersionHistory);
router.get("/feed/activity", verifyToken, getActivityFeed);

module.exports = router;
