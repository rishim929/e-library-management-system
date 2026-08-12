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

  const user = JSON.parse(localStorage.getItem("user"));
  const upgradeHref = user ? "/user/subscription" : "/register";

  return (
    <div className="flex flex-col items-center">

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<p className="text-gray-500 py-8">Loading PDF document...</p>}
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

      {isPremium && !hasSubscription && (
        <div className="mt-10 bg-amber-50 border border-amber-300 p-6 rounded-xl text-center shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600">
            {numPages > 5 ? "Preview Ended" : "End of Preview"}
          </h2>

          <p className="mt-2 text-gray-700">
            {numPages > 5
              ? "You can read only the first 5 pages. Upgrade your subscription to access the full book."
              : "This is a premium book preview. Upgrade your subscription for full access."}
          </p>

          <a
            href={upgradeHref}
            className="inline-block mt-5 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Upgrade to Premium
          </a>
        </div>
      )}
    </div>
  );
}

export default PdfPreview;