import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Fix for worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfPreview({ file, onClear }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  if (!file) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-2">📄 PDF Preview</h2>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex justify-center"
      >
        <Page pageNumber={pageNumber} width={400} />
      </Document>

      <div className="flex justify-between items-center mt-3">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={onClear}
        className="mt-3 w-full bg-red-500 text-white py-2 rounded"
      >
        Remove PDF
      </button>
    </div>
  );
}
