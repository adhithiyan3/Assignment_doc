import Document from "../models/Document.js";
import DocumentVersion from "../models/DocumentVersion.js";
import Activity from "../models/Activity.js";
import { documentSchema } from "../validations/documentValidation.js";
import { generateSummary, generateTags, semanticSearchEngine, simpleQA } from "../services/aiService.js";

// 🆕 Helper: Log Activity
const logActivity = async (action, documentId, userId) => {
  await new Activity({ action, documentId, userId }).save();
};

// ==================== CRUD ==================== //

// Create Document with AI + log
const createDocument = async (req, res, next) => {
  try {
    const parsed = documentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const { title, content } = parsed.data;
    const summary = generateSummary(content);
    const tags = generateTags(content);

    const doc = new Document({
      ...parsed.data,
      summary,
      tags,
      createdBy: req.user.id
    });

    await doc.save();
    await logActivity("created", doc._id, req.user.id);

    res.status(201).json({ message: "Document created", document: doc });
  } catch (err) {
    next(err);
  }
};

// Get All Documents
const getDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find().populate("createdBy", "firstname lastname role");
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// Get Single Document
const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id).populate("createdBy", "firstname lastname role");
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// Update Document with version history + log
const updateDocument = async (req, res, next) => {
  try {
    const parsed = documentSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ errors: parsed.error.errors });

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Save old version before updating
    await new DocumentVersion({
      documentId: doc._id,
      title: doc.title,
      content: doc.content,
      tags: doc.tags,
      summary: doc.summary,
      editedBy: req.user.id
    }).save();

    // Apply updates
    Object.assign(doc, parsed.data, { updatedAt: Date.now() });

    if (parsed.data.content) {
      doc.summary = generateSummary(parsed.data.content);
      doc.tags = generateTags(parsed.data.content);
    }

    await doc.save();
    await logActivity("updated", doc._id, req.user.id);

    res.json({ message: "Document updated", document: doc });
  } catch (err) {
    next(err);
  }
};

// Delete Document + log
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await doc.deleteOne();
    await logActivity("deleted", doc._id, req.user.id);

    res.json({ message: "Document deleted" });
  } catch (err) {
    next(err);
  }
};

// ==================== AI Features ==================== //

// Text Search
const searchDocuments = async (req, res, next) => {
  try {
    const { query } = req.query;
    const docs = await Document.find({
      $or: [
        { title: new RegExp(query, "i") },
        { content: new RegExp(query, "i") },
        { tags: { $in: [query] } }
      ]
    });
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// Semantic Search
const semanticSearch = async (req, res, next) => {
  try {
    const { query } = req.query;
    const docs = await Document.find();

    const results = semanticSearchEngine(query, docs);
    res.json(results.map(r => ({ ...r.doc.toObject(), score: r.score })));
  } catch (err) {
    next(err);
  }
};

// Q&A
const questionAnswer = async (req, res, next) => {
  try {
    const { question } = req.body;
    const docs = await Document.find();
    const answer = simpleQA(question, docs);
    res.json({ question, answer });
  } catch (err) {
    next(err);
  }
};



// Version History
const getVersionHistory = async (req, res, next) => {
  try {
    const versions = await DocumentVersion.find({ documentId: req.params.id })
      .populate("editedBy", "firstname lastname")
      .sort({ editedAt: -1 });

    res.json(versions);
  } catch (err) {
    next(err);
  }
};

// Activity Feed
const getActivityFeed = async (req, res, next) => {
  try {
    const feed = await Activity.find()
      .populate("userId", "firstname lastname role")
      .populate("documentId", "title")
      .sort({ timestamp: -1 })
      .limit(5);

    res.json(feed);
  } catch (err) {
    next(err);
  }
};


module.exports = {
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
};

