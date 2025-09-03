// src/pages/CreateDocument.jsx
import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateDocument() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/documents", {
        title,
        content,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      });

      alert("Document created successfully!");
      navigate("/documents"); // go back to docs list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || " Failed to create document");
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">📝 Create Document</h2>

        <div className="mb-3">
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-32 bg-white dark:bg-gray-700"
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. react, frontend, javascript"
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
