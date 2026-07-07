"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import Papa from "papaparse";
import type { CsvData, CsvRow } from "@/types/csv";

interface FileUploaderProps {
  onFileParsed: (data: CsvData) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUploader({
  onFileParsed,
  selectedFile,
  onClear,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = (file: File) => {
    setError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a valid CSV file.");
      return;
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          setError("Unable to parse this CSV file.");
          return;
        }

        const headers = results.meta.fields ?? [];

        if (headers.length === 0 || results.data.length === 0) {
          setError("The CSV file contains no data.");
          return;
        }

        onFileParsed({
          file,
          headers,
          rows: results.data,
        });
      },
      error: () => {
        setError("Something went wrong while reading the CSV file.");
      },
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50"
          }`}
        >
          <UploadCloud className="mx-auto mb-4 h-12 w-12 text-blue-600" />

          <h2 className="text-lg font-semibold text-slate-800">
            Upload your CSV file
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Drag and drop your file here, or click to browse
          </p>

          <p className="mt-3 text-xs text-slate-400">
            CSV files only
          </p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                processFile(file);
              }

              event.target.value = "";
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {selectedFile.name}
              </p>

              <p className="text-sm text-slate-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Remove selected CSV file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}