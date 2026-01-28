"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileUpload, FaFilePdf, FaCheckCircle } from "react-icons/fa";

const PdfUploader = () => {
  // Callback when a file is dropped or selected
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log("File ready for RAG processing:", file);
      // Here is where you would call your upload function to localhost:8000
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      multiple: false,
    });

  return (
    <div className="flex justify-center items-center flex-col">
      {/* Container for the Dropzone */}
      <div
        {...getRootProps()}
        className={`
          p-10 w-full border-2 border-dashed rounded-xl flex flex-col items-center gap-4 cursor-pointer transition-all
          ${
            isDragActive
              ? "border-blue-500 bg-blue-900/20 scale-105"
              : "border-gray-700 bg-gray-800 hover:border-gray-500"
          }
        `}
      >
        <input {...getInputProps()} />

        <FaFileUpload
          size={40}
          className={isDragActive ? "text-blue-400" : "text-gray-400"}
        />

        <div className="text-center">
          <p className="text-white font-medium">
            {isDragActive ? "Drop it here!" : "Click or Drag PDF to Upload"}
          </p>
          <p className="text-gray-400 text-sm mt-1">PDF files only</p>
        </div>
      </div>

      {/* Success Feedback: Show the filename once selected */}
      {acceptedFiles.length > 0 && (
        <div className="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaFilePdf className="text-red-400" />
            <span className="text-sm text-gray-200 truncate w-40">
              {acceptedFiles[0].name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase">
            <FaCheckCircle /> Ready
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
