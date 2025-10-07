import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CSV } from "@/constants/demoData";

export default function DataInput({
  csvText,
  setCsvText,
  target,
  setTarget,
  optimizationMethod,
  setOptimizationMethod,
  onRun,
  onDownloadCSV,
  error,
  hasResults,
  downloadRef
}) {
  const onLoadDemo = () => {
    setCsvText(DEMO_CSV);
  };

  const onUploadFile = (file) => {
    if (!file) return;
    file.text().then(setCsvText);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">1) נתונים</h2>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-slate-700">יעד לקבוצה (units)</label>
          <Input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value || "200", 10)))}
            className="w-full"
          />
          
          <label className="text-sm text-slate-700 mt-3">שיטת אופטימיזציה</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="optimizationMethod"
                value="dynamic"
                checked={optimizationMethod === "dynamic"}
                onChange={(e) => setOptimizationMethod(e.target.value)}
                className="cursor-pointer"
              />
              <span className="text-sm">Dynamic Programming (מינימום בזבוז)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="optimizationMethod"
                value="greedy"
                checked={optimizationMethod === "greedy"}
                onChange={(e) => setOptimizationMethod(e.target.value)}
                className="cursor-pointer"
              />
              <span className="text-sm">Greedy Instructions (max+min+חיפוש)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="optimizationMethod"
                value="trueGreedy"
                checked={optimizationMethod === "trueGreedy"}
                onChange={(e) => setOptimizationMethod(e.target.value)}
                className="cursor-pointer"
              />
              <span className="text-sm">True Greedy (מינימום הזמנות לקבוצה)</span>
            </label>
          </div>
          
          <Button onClick={onLoadDemo} className="mt-2 w-full">
            טען CSV לדוגמה
          </Button>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-slate-700">תוכן CSV</label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={`חבר בורסה,מחיר, כמות יחידות,מס' מזמינים,סה''כ כמות הזנמה,סה''כ כמות הקצאה\n1123,1,57,1,57.00,34.00\n1131,3,35,2,70.00,42.00\n...`}
            className="w-full h-40 rounded-xl border border-slate-300 px-3 py-2 font-mono text-sm"
          />
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mt-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Label htmlFor="csv" className="text-sm text-slate-700 whitespace-nowrap">או העלאה מקובץ:</Label>
              <Input className="w-full sm:w-52" id="csv" type="file" accept=".csv" onChange={(e) => onUploadFile(e.currentTarget.files?.[0])} />
            </div>
            <Button onClick={onRun} variant="default" className="w-full sm:w-auto">
              הרץ אופטימיזציה
            </Button>
            <Button
              onClick={onDownloadCSV}
              disabled={!hasResults}
              variant="outline"
              className="w-full sm:w-auto"
            >
              הורד תוצאות (CSV)
            </Button>
            <a ref={downloadRef} className="hidden" aria-hidden />
          </div>
          {error && (
            <p className="mt-2 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
