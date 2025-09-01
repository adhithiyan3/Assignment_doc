const Document = require("../models/Document");
const DocumentVersion = require("../models/DocumentVersion");
const Activity = require("../models/Activity");
const { documentSchema } = require("../validations/documentValidation");
const {
  generateSummary,
  generateTags,
  semanticSearchEngine,
  simpleQA,
  geminiSummarize,
  geminiGenerateTags,
} = require("../services/aiService");

const fs = require("fs");
const pdf = require("pdf-parse");

const uploadPdf = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdf(dataBuffer);

    // Now pdfData.text contains extracted text
    const doc = new Document({
      title: req.file.originalname,
      content: pdfData.text,
      tags: generateTags(pdfData.text),
      summary: generateSummary(pdfData.text),
      createdBy: req.user.id,
    });
    await doc.save();

    // Log activity
    await Activity.create({
      action: "uploaded",
      documentId: doc._id,
      userId: req.user.id,
    });
    // After saving the main document
    await DocumentVersion.create({
  documentId: doc._id,
  title: doc.title,
  content: doc.content,
  editedBy: req.user.id,
});


    res.status(201).json({ message: "PDF uploaded and processed", document: doc });
  } catch (err) {
    next(err);
  }
};


// ✅ Create Document
const createDocument = async (req, res, next) => {
  try {
    const parsed = documentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { title, content, tags } = parsed.data;
    const summary = generateSummary(content);

    const doc = new Document({
      title,
      content,
      tags: tags || generateTags(content),
      summary,
      createdBy: req.user.id,
    });
    // console.log("req.file:", req.file);
    // console.log("req.user:", req.user);

    await doc.save();

    await Activity.create({
      action: "created",
      documentId: doc._id,
      userId: req.user.id,
    });

    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// ✅ Get All Documents
const getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find().populate("createdBy", "firstname lastname email");
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// ✅ Get Document by ID
const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate("createdBy", "firstname lastname email");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Document
const updateDocument = async (req, res, next) => {
  try {
    const parsed = documentSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // 🔒 Only admin OR creator can edit
    if (req.user.role !== "admin" && doc.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to edit this document" });
    }

   // Before updating the document
const oldDoc = await Document.findById(req.params.id);

await DocumentVersion.create({
  documentId: oldDoc._id,
  title: oldDoc.title,
  content: oldDoc.content,
  editedBy: req.user.id,
});


    const { title, content, tags } = parsed.data;
    if (title) doc.title = title;
    if (content) {
      doc.content = content;
      doc.summary = generateSummary(content);
      if (!tags) doc.tags = generateTags(content);
    }
    if (tags) doc.tags = tags;

    await doc.save();

    await Activity.create({
      action: "updated",
      documentId: doc._id,
      userId: req.user.id,
    });

    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete Document
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // 🔒 Only admin OR creator can delete
    if (req.user.role !== "admin" && doc.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to delete this document" });
    }

    await doc.deleteOne();

    await Activity.create({
      action: "deleted",
      documentId: doc._id,
      userId: req.user.id,
    });

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// ✅ Semantic Search
const semanticSearch = async (req, res, next) => {
  try {
    const { query } = req.body;
    const docs = await Document.find();
    const results = semanticSearchEngine(query, docs);
    res.json(results.map(r => ({ document: r.doc, score: r.score })));
  } catch (err) {
    next(err);
  }
};

// ✅ Simple Q&A
const qa = async (req, res, next) => {
  try {
    const { question } = req.body;
    const docs = await Document.find();
    const answer = simpleQA(question, docs);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
};

const getVersionHistory = async (req, res, next) => {
  try {
    const versions = await DocumentVersion.find({ documentId: req.params.id })
      .populate("editedBy", "firstname lastname email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: versions.length,
      versions,  // ✅ always return an array
    });
  } catch (err) {
    console.error("❌ Version history error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ Activity Feed
const getActivityFeed = async (req, res, next) => {
  try {
    const feed = await Activity.find()
      .populate("userId", "firstname lastname email")
      .populate("documentId", "title")
      .sort({ timestamp: -1 });
    res.json(feed);
  } catch (err) {
    next(err);
  }
};

const summarizeDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  const summary = await geminiSummarize(doc.content); // your Gemini API fn
  doc.summary = summary;
  await doc.save();
  res.json({ message: "Summary updated", doc });
};

const generateTagsGemini = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const tags = await geminiGenerateTags(doc.content); // ✅ exists in aiService
    doc.tags = tags;
    await doc.save();

    res.json({ message: "Tags generated", doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





module.exports = {
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
};
