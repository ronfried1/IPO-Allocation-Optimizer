import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center text-slate-600">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mb-2 opacity-70">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h3A2.25 2.25 0 0111.25 6v3A2.25 2.25 0 019 11.25H6A2.25 2.25 0 013.75 9V6zM12.75 6A2.25 2.25 0 0115 3.75h3A2.25 2.25 0 0120.75 6v3A2.25 2.25 0 0118 11.25h-3A2.25 2.25 0 0112.75 9V6zM3.75 15A2.25 2.25 0 016 12.75h3A2.25 2.25 0 0111.25 15v3A2.25 2.25 0 019 20.25H6A2.25 2.25 0 013.75 18v-3zM15 12.75A2.25 2.25 0 0117.25 15v3A2.25 2.25 0 0115 20.25h-3A2.25 2.25 0 019.75 18v-3A2.25 2.25 0 0112 12.75h3z"/>
      </svg>
      <p>עדיין אין תוצאות. טען/י CSV, קבע/י יעד, ולחץ/י על "הרץ אופטימיזציה".</p>
    </div>
  );
}

export default function ResultsTable({ groups, leftovers, target }) {
  if (!groups.length) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">3) הקצאות</h2>
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">3) הקצאות</h2>
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Table dir="rtl" className="min-w-[640px]">
          <TableHeader>
            <TableRow className="bg-slate-100 text-left text-sm">
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap"># קבוצה</TableHead>
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap" dir="rtl">חברי בורסה</TableHead>
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap">חישוב</TableHead>
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap">סכום יחידות</TableHead>
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap">עומד ביעד ({target})</TableHead>
              <TableHead className="px-2 sm:px-3 py-2 whitespace-nowrap">בזבוז</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {groups.map((g, i) => (
              <TableRow key={i} className="odd:bg-white even:bg-slate-50">
                <TableCell className="px-2 sm:px-3 py-2">{i + 1}</TableCell>
                <TableCell className="px-2 sm:px-3 py-2">{g.ids.join(", ")}</TableCell>
                <TableCell className="px-2 sm:px-3 py-2 font-mono text-xs" dir="ltr">
                  {g.units && g.units.length > 0 ? g.units.join(" + ") + " = " + g.total : g.total}
                </TableCell>
                <TableCell className="px-2 sm:px-3 py-2">{g.total}</TableCell>
                <TableCell className="px-2 sm:px-3 py-2">{g.total >= target ? "כן" : "לא"}</TableCell>
                <TableCell className="px-2 sm:px-3 py-2">{Math.max(0, g.waste)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {leftovers.length ? (
          <p className="mt-3 text-sm text-slate-600 break-words">
            יתרות שלא הגיעו ל-{target}: {leftovers.map((l) => `${l.id}:${l.units}`).join(", ")}
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-600">אין יתרות – כל ההזמנות שובצו לקבוצות.</p>
        )}
      </div>
    </section>
  );
}
