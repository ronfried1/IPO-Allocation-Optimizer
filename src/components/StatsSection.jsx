import React from "react";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
      <div className="text-slate-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

export default function StatsSection({ stats, target, optimizationMethod }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">2) סטטוס ותובנות</h2>
      <div className="flex flex-wrap gap-3">
        <Stat label={'סה"כ הזמנות'} value={stats.totalOrders} />
        <Stat label="קבוצות שנוצרו" value={stats.formedGroups} />
        <Stat label={`קבוצות בדיוק ${target}`} value={stats.exactGroups} />
        <Stat label="בזבוז ממוצע לקבוצה" value={stats.avgWaste.toFixed(2)} />
      </div>
      <p className="text-xs text-slate-500 mt-3">
        {optimizationMethod === "dynamic" && (
          <span>לוגיקה: הזמנות ≥ יעד, נספרות כקבוצה יחידנית. הזמנות קטנות מקובצות ע"י מציאת תת-קבוצה עם סכום מינימלי שהוא ≥ יעד.</span>
        )}
        {optimizationMethod === "greedy" && (
          <span>לוגיקה: הזמנות ≥ יעד, נספרות כקבוצה יחידנית. הזמנות קטנות: לוקחים מקס+מין, מחפשים את המספר הטוב ביותר להשלמה, מחליפים אם נדרש.</span>
        )}
        {optimizationMethod === "trueGreedy" && (
          <span>לוגיקה: הזמנות ≥ יעד נספרות כקבוצה יחידנית. הזמנות קטנות: לוקחים את הגדול ביותר חוזר ונשנה, מחפשים השלמה עם בזבוז מינימלי.</span>
        )}
      </p>
    </section>
  );
}





