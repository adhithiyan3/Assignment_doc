import { useEffect, useState } from "react";
import API from "../utils/api";
import DocumentCard from "../components/DocumentCard";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
  API.get("/documents") 
    .then(res => setDocs(res.data))
    .catch(err => console.error("Error fetching documents:", err));
}, []);

  return (
    <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {docs.map((doc) => (
        <DocumentCard key={doc._id} doc={doc} />
      ))}
    </div>
  );
}
