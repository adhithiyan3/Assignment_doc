import React, { useEffect, useState } from "react";
import axios from "axios";

const Versions = ({ documentId, token }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/documents/${documentId}/versions`,
          { headers: { token } }
        );

        if (res.data.success) {
          setVersions(res.data.versions || []);
        } else {
          setError("Failed to load versions");
        }
      } catch (err) {
        console.error("❌ Error fetching versions:", err);
        setError("Server error while loading versions");
      } finally {
        setLoading(false);
      }
    };

    if (documentId) fetchVersions();
  }, [documentId, token]);

  if (loading) return <p className="text-gray-500">⏳ Loading versions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!versions.length) return <p className="text-gray-400">No versions found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Version History</h2>
      <ul className="space-y-3">
        {versions.map((v) => (
          <li key={v._id} className="p-3 rounded-lg shadow bg-gray-100 dark:bg-gray-800">
            <p><strong>Title:</strong> {v.title}</p>
            <p><strong>Edited By:</strong> {v.editedBy?.firstname} {v.editedBy?.lastname}</p>
            <p><strong>Updated At:</strong> {new Date(v.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Versions;
