// src/pages/DocumentDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`http://localhost:3000/api/documents/${id}`, {
      headers: { token }
    })
    .then(res => setDoc(res.data))
    .catch(err => console.error(err));
  }, [id]);

  if (!doc) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{doc.title}</h1>
      <p className="mt-2">{doc.summary}</p>
      <Link to={`/documents/${id}/versions`} className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded">
        View Versions
      </Link>
    </div>
  );
}
