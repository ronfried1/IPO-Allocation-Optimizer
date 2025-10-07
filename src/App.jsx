import React from "react";
import { useOptimization } from "./hooks/useOptimization";
import DataInput from "./components/DataInput";
import StatsSection from "./components/StatsSection";
import ResultsTable from "./components/ResultsTable";

export default function App() {
  const {
    csvText,
    setCsvText,
    target,
    setTarget,
    optimizationMethod,
    setOptimizationMethod,
    groups,
    leftovers,
    error,
    stats,
    onRun,
    onDownloadCSV,
    downloadRef,
    hasResults
  } = useOptimization();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">IPO Allocation Optimizer – React</h1>
          <div className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">יעד ברירת מחדל: 200</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <DataInput
          csvText={csvText}
          setCsvText={setCsvText}
          target={target}
          setTarget={setTarget}
          optimizationMethod={optimizationMethod}
          setOptimizationMethod={setOptimizationMethod}
          onRun={onRun}
          onDownloadCSV={onDownloadCSV}
          error={error}
          hasResults={hasResults}
          downloadRef={downloadRef}
        />

        <StatsSection stats={stats} target={target} optimizationMethod={optimizationMethod} />

        <ResultsTable groups={groups} leftovers={leftovers} target={target} />
      </main>
    </div>
  );
}

