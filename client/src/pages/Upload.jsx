import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. import navigate

function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // ✅ 2. place it here (inside component, before return)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/api/documents/upload", {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // ✅ 3. place navigate here (after upload success)
      alert("Upload successful!");
      navigate("/documents"); 
      // 👆 goes to your documents list page
      // or navigate(`/documents/${data.document._id}`) if you want detail page
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-96 text-center">
        <h2 className="text-xl font-bold mb-4">Upload Assignment PDF</h2>

        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 block mb-4"
        >
          {file ? "Change File" : "Choose File"}
        </label>

        {file && (
          <p className="text-sm text-gray-300 mb-4">
            Selected: <span className="font-semibold">{file.name}</span>
          </p>
        )}

        <button
          onClick={handleUpload}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default Upload;
