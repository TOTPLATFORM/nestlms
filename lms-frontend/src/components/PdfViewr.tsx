import { cn } from "@/lib/utils";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

// Set worker path directly - this is the recommended way for Next.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PdfViewer({
  pdfUrl,
  className,
}: {
  pdfUrl: string;
  className?: string;
}) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.log("error from PdfViewer", error);
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
                !className
                  ? " [&>canvas]:max-h-[350px] [&>canvas]:max-w-[250px] overflow-auto"
                  : className
              )}
              renderAnnotationLayer={false}
              scale={1.0}
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
