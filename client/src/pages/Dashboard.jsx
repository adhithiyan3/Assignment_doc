import { useEffect, useState } from "react";
import API from "../utils/api";
import DocumentCard from "../components/DocumentCard";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    refreshDocs();
  }, []);

  const refreshDocs = async () => {
    try {
      const res = await API.get("/documents");
      setDocs(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  // ✅ Call summarize endpoint
  const handleSummarize = async (id) => {
    try {
      await API.post(`/documents/${id}/summarize`);
      alert("Summary updated!");
      refreshDocs();
    } catch (err) {
      console.error("Summarize error:", err.response?.data || err.message);
    }
  };

  // ✅ Call generate-tags endpoint
  const handleGenerateTags = async (id) => {
    try {
      await API.post(`/documents/${id}/generate-tags`);
      alert("Tags generated!");
      refreshDocs();
    } catch (err) {
      console.error("Generate tags error:", err.response?.data || err.message);
    }
  };

  // ✅ gather unique tags
  const uniqueTags = [...new Set(docs.flatMap((d) => d.tags || []))];

  return (
    <div className="p-6">
      {/* Tag Filter Bar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {uniqueTags.map((tag, i) => (
          <button
            key={i}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              activeTag === tag
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {tag}
          </button>
        ))}
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="px-3 py-1 rounded-full bg-red-600 text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filtered documents grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs
          .filter((doc) => !activeTag || doc.tags?.includes(activeTag))
          .map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onSummarize={handleSummarize}
              onGenerateTags={handleGenerateTags}
            />
          ))}
      </div>
    </div>
  );
}
