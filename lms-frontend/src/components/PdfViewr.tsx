import { cn } from "@/lib/utils";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
// Important: You need to set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({
  pdfUrl,
  width,
  height,
}: {
  pdfUrl: string;
  width?: number;
  height?: number;
}) {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: any) {
    console.log("error from PdfViewr", error);
  }

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="mb-4 flex justify-center border rounded-lg p-4 bg-white">
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-40">
                Loading PDF...
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              className={cn(
                !width
                  ? " w-[250px] h-[300px]  [&>canvas]:!w-[250px] [&>canvas]:!h-[300px] overflow-auto"
                  : "w-full"
              )}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
      </div>

      <div className="flex items-center justify-between px-4">
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <p className="text-sm text-gray-600">
          Page {pageNumber} of {numPages}
        </p>

        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </>
  );
}
