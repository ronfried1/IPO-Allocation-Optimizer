import Papa from 'papaparse';

export function parseCSV(text) {
  if (!text.trim()) return [];
  
  // Parse CSV using Papa Parse
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transform: (value) => value.trim()
  });
  
  // Check for parsing errors
  if (result.errors.length > 0) {
    const errorMessages = result.errors.map(err => err.message).join(', ');
    throw new Error(`CSV parsing error: ${errorMessages}`);
  }
  
  // Validate required columns
  const data = result.data;
  if (!data.length) return [];
  
  const firstRow = data[0];
  const headers = Object.keys(firstRow);
  
  // Look for required columns
  const brokerColumn = headers.find(h => 
    h.includes('חבר') || h.includes('בורסה') || h.toLowerCase().includes('broker')
  );
  const allocationColumn = headers.find(h => 
    h.includes('סה') && h.includes('הקצאה')
  );
  const orderersColumn = headers.find(h => 
    h.includes('מזמינים')
  );
  
  if (!brokerColumn || !allocationColumn || !orderersColumn) {
    throw new Error("CSV חייב לכלול עמודות 'חבר בורסה', 'סה''כ כמות הקצאה' ו'מס' מזמינים'");
  }
  
  // Process and validate data - calculate allocation per orderer
  // and create separate entries for each orderer
  const out = [];
  for (const row of data) {
    const id = row[brokerColumn]?.trim();
    const allocationStr = row[allocationColumn]?.replace(/[^\d.-]/g, "") || "0";
    const orderersStr = row[orderersColumn]?.replace(/[^\d.-]/g, "") || "1";
    
    const allocation = parseFloat(allocationStr);
    const orderers = Math.round(parseFloat(orderersStr));
    
    if (!id || orderers === 0) continue;
    
    // Calculate allocation per orderer
    const unitsPerOrderer = allocation / orderers;
    
    if (Number.isFinite(unitsPerOrderer) && unitsPerOrderer > 0) {
      // Create separate entries for each orderer
      for (let i = 0; i < orderers; i++) {
        out.push({ id, units: Math.round(unitsPerOrderer) });
      }
    }
  }
  
  return out;
}

export function toCSV(rows) {
  if (!rows.length) return "";
  
  // Use Papa Parse to generate CSV - handles escaping automatically
  return Papa.unparse(rows, {
    header: true,
    skipEmptyLines: true
  });
}
