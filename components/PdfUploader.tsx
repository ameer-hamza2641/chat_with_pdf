"use client";

import { Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileUpload, FaFilePdf, FaCheckCircle } from "react-icons/fa";

const PdfUploader = () => {
  const [uploaded, setUploaded] = useState('idle'); // 'idle' | 'success' | 'error'
  // Callback when a file is dropped or selected
  const onDrop = async(acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    // Here is where you would call your upload API
    if (file) {
      setUploaded('loading')
      const response = await fetch('api/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        setUploaded('success');
        console.log("File uploaded successfully");
      } else {
        setUploaded('error');
        console.error("File upload failed");
      }

    }
  };

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
      {uploaded === 'loading' && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-200">Uploading {acceptedFiles[0].name}  <Loader2 className="animate-spin ml-2" size={16} /></span>
        </div>
      )

      }
      {uploaded === 'success' && (
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
      {uploaded === 'error' && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center justify-between">
          <span className="text-sm text-gray-200">Error uploading file : {acceptedFiles[0]?.name ? ` ${acceptedFiles[0].name}` : '' }. Please try again.</span>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
