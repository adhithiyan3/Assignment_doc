import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ added
import API from "../utils/api";
import DocumentCard from "../components/DocumentCard";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  // separate busy states
  const [summarizingId, setSummarizingId] = useState(null);
  const [taggingId, setTaggingId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

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

  const handleSummarize = async (id) => {
    try {
      setSummarizingId(id);
      const res = await API.post(`/documents/${id}/summarize`);
      const updated = res.data.doc;

      setDocs((prev) =>
        prev.map((d) => (d._id === id ? { ...d, summary: updated.summary } : d))
      );

      alert("✅ Summary updated successfully!");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "❌ Failed to summarize");
    } finally {
      setSummarizingId(null);
    }
  };

  const handleGenerateTags = async (id) => {
    try {
      setTaggingId(id);
      const res = await API.post(`/documents/${id}/generate-tags`);
      const updated = res.data.doc;

      setDocs((prev) =>
        prev.map((d) => (d._id === id ? { ...d, tags: updated.tags } : d))
      );

      alert("✅ Tags generated successfully!");
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "❌ Failed to generate tags");
    } finally {
      setTaggingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await API.delete(`/documents/${id}`);
      setDocs((prev) => prev.filter((d) => d._id !== id));
      alert("✅ Document deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to delete document");
    }
  };

  // unique tags
  const uniqueTags = [...new Set(docs.flatMap((d) => d.tags || []))];

  return (
    <div className="p-6">
      {/* Tag Filter */}
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

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs
          .filter((doc) => !activeTag || doc.tags?.includes(activeTag))
          .map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onSummarize={handleSummarize}
              onGenerateTags={handleGenerateTags}
              summarizing={summarizingId === doc._id}
              tagging={taggingId === doc._id}
              onView={(id) => navigate(`/documents/${id}`)}
              onEdit={(id) => navigate(`/documents/${id}/edit`)}
              onDelete={handleDelete}
              currentUser={currentUser} // ✅ pass user
            />
          ))}
      </div>
    </div>
  );
}
