import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // get JWT token from localStorage (set during login)
  const token = localStorage.getItem("token");

  // Semantic Search
  const handleSemanticSearch = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/documents/search", // ✅ backend route
        { query },
        {
          headers: {
            token: token, // ✅ send token as "token"
          },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error("Semantic Search Error:", err.response?.data || err.message);
    }
  };

  // Q&A
  const handleQA = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/documents/qa", // ✅ backend route
        { question },
        {
          headers: {
            token: token, // ✅ send token as "token"
          },
        }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Q&A Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔍 Semantic Search</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query..."
        className="border p-2 w-full rounded mb-2"
      />
      <button
        onClick={handleSemanticSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <div className="mt-4">
        {results.map((r, i) => (
          <div key={i} className="border-b py-2">
            <p className="font-semibold">{r.document?.title}</p>
            <p className="text-gray-600">Score: {r.score?.toFixed(2)}</p>
            <p>{r.document?.content?.substring(0, 150)}...</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">💡 Team Q&A</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question..."
        className="border p-2 w-full rounded mb-2"
      />
      <button
        onClick={handleQA}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Ask
      </button>

      {answer && (
        <div className="mt-4 p-3 bg-gray-700 rounded">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};

export default Search;
