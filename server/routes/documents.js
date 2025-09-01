const express = require("express");
const {
  createDocument,
  getDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  semanticSearch,
  qa,
  getActivityFeed,
  getVersionHistory,
  uploadPdf,
  summarizeDocument,
  generateTagsGemini 
} = require("../controllers/documentController");

const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("file"), uploadPdf);


// Document CRUD
router.post("/", verifyToken, createDocument);
router.get("/", verifyToken, getDocuments);
router.get("/:id", verifyToken, getDocumentById);
router.put("/:id", verifyToken, updateDocument);
router.delete("/:id", verifyToken, isAdmin, deleteDocument);

// AI Features
router.post("/search", verifyToken, semanticSearch);
router.post("/qa", verifyToken, qa);

// Activity Feed & Versions
router.get("/activity/feed", verifyToken, getActivityFeed);
router.get("/:id/versions", verifyToken, getVersionHistory);

router.post("/:id/summarize", verifyToken, summarizeDocument);
router.post("/:id/tags", verifyToken, generateTagsGemini);


module.exports = router;
