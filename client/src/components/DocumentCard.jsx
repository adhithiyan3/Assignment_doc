export default function DocumentCard({
  doc,
  onSummarize,
  onGenerateTags,
  summarizing,
  tagging,
  onView,
  onEdit,
  onDelete,
  currentUser,
}) {
  const canEditOrDelete =
    currentUser &&
    (currentUser.role === "admin" ||
      currentUser._id === doc.createdBy?._id);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{doc.title}</h3>
      <p className="text-sm text-gray-300 mb-2">{doc.summary}</p>

      {/* tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {doc.tags?.map((tag, i) => (
          <span key={i} className="bg-blue-600 text-xs px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-3">
        By: {doc.createdBy?.firstname}
      </p>

      {/* actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onSummarize(doc._id)}
          disabled={summarizing}
          className={`px-3 py-1 rounded ${
            summarizing ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {summarizing ? "Working..." : "Summarize with Gemini"}
        </button>

        <button
          onClick={() => onGenerateTags(doc._id)}
          disabled={tagging}
          className={`px-3 py-1 rounded ${
            tagging ? "bg-gray-500" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {tagging ? "Working..." : "Generate Tags"}
        </button>

        {/* View always available */}
        <button
          onClick={() => onView(doc._id)}
          className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          View
        </button>

        {/* Edit/Delete only for admin or owner */}
        {canEditOrDelete && (
          <>
            <button
              onClick={() => onEdit(doc._id)}
              className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(doc._id)}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
