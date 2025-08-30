const natural = require("natural");

const TfIdf = natural.TfIdf;

const generateSummary = (content) => {
  return content.split(" ").slice(0, 50).join(" ") + "...";
};

const generateTags = (content) => {
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const freq = {};
  words.forEach(w => freq[w] = (freq[w] || 0) + 1);
  return Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 5);
};

const semanticSearchEngine = (query, docs) => {
  const tfidf = new TfIdf();
  docs.forEach(doc => tfidf.addDocument(doc.content));

  let results = [];
  tfidf.tfidfs(query, (i, measure) => {
    results.push({ doc: docs[i], score: measure });
  });

  results.sort((a, b) => b.score - a.score);
  return results;
};

const simpleQA = (question, docs) => {
  const results = semanticSearchEngine(question, docs);
  return results.length > 0 ? results[0].doc.summary : "No relevant answer found.";
};

module.exports = { generateSummary, generateTags, semanticSearchEngine, simpleQA };
