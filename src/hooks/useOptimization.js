import { useState, useMemo, useRef } from "react";
import { parseCSV, toCSV } from "../utils/csvUtils";
import { optimize, optimizeGreedyMinOrders, optimizeTrueGreedy } from "../utils/optimizer";

export function useOptimization() {
  const [csvText, setCsvText] = useState("");
  const [target, setTarget] = useState(200);
  const [optimizationMethod, setOptimizationMethod] = useState("dynamic"); // "dynamic", "greedy", or "trueGreedy"
  const [groups, setGroups] = useState([]);
  const [leftovers, setLeftovers] = useState([]);
  const [error, setError] = useState("");
  const downloadRef = useRef(null);

  const stats = useMemo(() => {
    const formedGroups = groups.length;
    const exactGroups = groups.filter((g) => g.exact).length;
    const avgWaste = formedGroups ? groups.reduce((a, g) => a + Math.max(0, g.waste), 0) / formedGroups : 0;
    const totalOrders = groups.reduce((a, g) => a + g.ids.length, 0) + leftovers.length;
    return { formedGroups, exactGroups, avgWaste, totalOrders };
  }, [groups, leftovers]);

  const onRun = () => {
    try {
      setError("");
      const rows = parseCSV(csvText);
      let result;
      
      if (optimizationMethod === "greedy") {
        result = optimizeGreedyMinOrders(rows, target);
      } else if (optimizationMethod === "trueGreedy") {
        result = optimizeTrueGreedy(rows, target);
      } else {
        result = optimize(rows, target);
      }
      
      console.log("Optimization result groups:", result.groups);
      setGroups(result.groups);
      setLeftovers(result.leftovers);
    } catch (e) {
      setError(e?.message || String(e));
    }
  };

  const onDownloadCSV = () => {
    const csv = toCSV(
      groups.map((g, i) => ({
        group_id: i + 1,
        broker_ids: g.ids.join(","),
        broker_units: g.units.join("+") + " = " + g.total,
        total_units: g.total,
        meets_target: g.total >= target ? "YES" : "NO",
        waste: Math.max(0, g.waste),
      }))
    );
    
    if (!csv) return;
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = downloadRef.current || document.createElement("a");
    a.href = url;
    a.download = "allocations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
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
    hasResults: groups.length > 0
  };
}
