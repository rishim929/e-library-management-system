import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PdfPreview({
  pdfUrl,
  isPremium,
  hasSubscription,
}) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("PDF Loaded Successfully");
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    console.error("PDF ERROR:", error);
  }

const pagesToShow =
  isPremium && !hasSubscription
    ? Math.min(5, numPages || 0)
    : numPages;

  return (
    <div className="flex flex-col items-center">

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<p>Loading PDF...</p>}
      >
        {numPages &&
          Array.from(new Array(pagesToShow), (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={700}
            />
          ))}
      </Document>

{isPremium && !hasSubscription && numPages > 5 && (
  <div className="mt-10 bg-yellow-100 border p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Preview Ended
          </h2>

          <p className="mt-2">
            You can read only the first 5 pages.
          </p>

          <a
            href="/register"
            className="inline-block mt-5 bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            Upgrade to Premium
          </a>
        </div>
      )}
    </div>
  );
}

export default PdfPreview;