import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [doc, setDoc] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });

  // Fetch doc details
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/documents/${id}`, {
          headers: { token },
        });
        setDoc(res.data);
        setForm({
          title: res.data.title,
          content: res.data.content,
          tags: res.data.tags?.join(", ") || "",
        });
      } catch (err) {
        console.error("❌ Error fetching document", err);
      }
    };
    fetchDoc();
  }, [id, token]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update doc
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/documents/${id}`,
        { ...form, tags: form.tags.split(",").map((t) => t.trim()) },
        { headers: { token } }
      );
      alert("✅ Document updated successfully");
      navigate("/documents");
    } catch (err) {
      console.error("❌ Error updating doc", err);
      alert(err.response?.data?.message || "Error updating document");
    }
  };

  if (!doc) return <p className="text-center mt-10">Loading document...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-xl font-bold mb-4">✏️ Edit Document</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full p-2 border rounded h-40"
          required
        />

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Comma separated tags"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditDocument;
