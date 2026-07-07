"use client";

import { useState } from "react";
import {
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import FileUploader from "@/components/FileUploader";
import CsvPreviewTable from "@/components/CsvPreviewTable";
import ImportSummary from "@/components/ImportSummary";
import ResultTable from "@/components/ResultTable";

import type {
  CsvData,
  ImportResult,
} from "@/types/csv";

export default function Home() {
  const [csvData, setCsvData] =
    useState<CsvData | null>(null);

  const [result, setResult] =
    useState<ImportResult | null>(null);

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] = useState("");

  const clearFile = () => {
    setCsvData(null);
    setResult(null);
    setError("");
  };

  const handleConfirmImport = async () => {
    if (!csvData) {
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      setResult(null);

      const formData = new FormData();

      formData.append("file", csvData.file);

      const response = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/import/process`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Import failed"
        );
      }

      setResult(data as ImportResult);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4">
          <div className="rounded-xl bg-blue-600 p-2.5">
            <Sparkles className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              GrowEasy AI CSV Importer
            </h1>

            <p className="text-sm text-slate-500">
              Intelligent CRM lead extraction from any CSV format
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Step 1
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Upload your lead data
          </h2>

          <p className="mt-3 max-w-2xl text-slate-600">
            Upload any valid CSV export. Preview the
            original data before starting AI-powered CRM
            extraction.
          </p>
        </div>

        <FileUploader
          onFileParsed={(data) => {
            setCsvData(data);
            setResult(null);
            setError("");
          }}
          selectedFile={csvData?.file ?? null}
          onClear={clearFile}
        />

        {csvData && (
          <>
            <CsvPreviewTable
              headers={csvData.headers}
              rows={csvData.rows}
            />

            {!result && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmImport}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Confirm Import
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className="mt-12">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Step 2
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Import completed
                  </h2>

                  <p className="mt-2 text-slate-600">
                    AI extraction and CRM normalization have
                    finished successfully.
                  </p>
                </div>

                <ImportSummary
                  totalImported={result.totalImported}
                  totalSkipped={result.totalSkipped}
                />

                <ResultTable records={result.records} />
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}