export function optimize(items, target) {
  const small = [];
  const groups = [];

  // Separate items that already meet target from those that don't
  for (const it of items) {
    if (it.units >= target) {
      groups.push({ 
        ids: [it.id],
        units: [it.units],
        total: it.units, 
        exact: it.units === target, 
        waste: it.units - target 
      });
    } else {
      small.push(it);
    }
  }

  const pool = small.map((x, idx) => ({ ...x, uniqueIdx: idx }));

  function extractOneGroup() {
      if (!pool.length) return null;
      

    const total = pool.reduce((a, b) => a + b.units, 0);
    console.log(total);
    if (total < target) return null;
    
    const cap = total;
    const possible = new Int32Array(cap + 1);
    const prev = new Int32Array(cap + 1);
    possible[0] = 1;
    
    // Dynamic programming to find subset sum
    for (let i = 0; i < pool.length; i++) {
      const v = pool[i].units;
      for (let s = cap - v; s >= 0; s--) {
        if (possible[s] && !possible[s + v]) {
          possible[s + v] = i + 1;
          prev[s + v] = s;
        }
      }
    }
    
    // Find the smallest sum >= target
    let chosen = -1;
    for (let s = target; s <= cap; s++) {
      if (possible[s]) { 
        chosen = s; 
        break; 
      }
    }
    
    if (chosen === -1) return null;
    
    // Reconstruct the solution
    const used = [];
    let cur = chosen;
    while (cur > 0) {
      const i1 = possible[cur] - 1;
      used.push(pool[i1]);
      cur = prev[cur];
    }
    
    // Remove used items from pool
    const toRemove = new Set(used.map((x) => x.uniqueIdx));
    for (let i = pool.length - 1; i >= 0; i--) {
      if (toRemove.has(pool[i].uniqueIdx)) pool.splice(i, 1);
    }
    
    const sum = used.reduce((a, b) => a + b.units, 0);
    return { 
      ids: used.map((u) => u.id),
      units: used.map((u) => u.units),
      total: sum, 
      exact: sum === target, 
      waste: sum - target 
    };
  }

  // Extract groups until no more can be formed
  while (true) {
    const g = extractOneGroup();
    if (!g) break;
    groups.push(g);
  }

  const leftovers = pool.map(({ id, units }) => ({ id, units }));
  
  // Sort groups: exact matches first, then by waste
  groups.sort((a, b) => (a.exact === b.exact ? a.waste - b.waste : a.exact ? -1 : 1));
  
  return { groups, leftovers };
}

// Greedy optimization: minimize deviation from target
export function optimizeGreedyMinOrders(items, target) {
  const small = [];
  const groups = [];

  // Separate items that already meet target from those that don't
  for (const it of items) {
    if (it.units >= target) {
      groups.push({ 
        ids: [it.id],
        units: [it.units],
        total: it.units, 
        exact: it.units === target, 
        waste: it.units - target 
      });
    } else {
      small.push(it);
    }
  }

  // Sort items by units (descending) and add unique index for tracking
  const sorted = small.map((item, idx) => ({ ...item, uniqueIdx: idx }))
    .sort((a, b) => b.units - a.units);

  function extractOneGroup() {
    if (sorted.length === 0) return null;
    
    const total = sorted.reduce((a, b) => a + b.units, 0);
    if (total < target) return null;
    
    const used = [];
    const available = [...sorted];
    let sum = 0;
    
    // Step 1: Take the largest
    if (available.length > 0) {
      const largest = available.shift();
      used.push(largest);
      sum += largest.units;
      console.log(`[Greedy] Step 1: Take largest ${largest.units}, sum=${sum}`);
    }
    
    // Step 2: Add the smallest
    if (available.length > 0 && sum < target) {
      const smallest = available.pop();
      used.push(smallest);
      sum += smallest.units;
      console.log(`[Greedy] Step 2: Add smallest ${smallest.units}, sum=${sum}`);
    }
    
    // Step 3: While sum < target, find the best number to add
    let takeFromSmallest = true; // Alternate: start with smallest
    let loopCount = 0;
    while (available.length > 0 && sum < target) {
      loopCount++;
      console.log(`[Greedy] Loop ${loopCount}: sum=${sum}, available=${available.length}`);
      
      let bestIdx = -1;
      let bestWaste = Infinity;
      
      // Search for the number that brings us closest to target from above
      for (let i = 0; i < available.length; i++) {
        const newSum = sum + available[i].units;
        if (newSum >= target) {
          const waste = newSum - target;
          if (waste < bestWaste) {
            bestWaste = waste;
            bestIdx = i;
          }
        }
      }
      
      // If we found a number that brings us >= target, use it
      if (bestIdx !== -1) {
        const item = available.splice(bestIdx, 1)[0];
        used.push(item);
        sum += item.units;
        console.log(`[Greedy] Found best: ${item.units}, sum=${sum} DONE!`);
        break; // We've reached the target
      }
      
      // If no such number exists, alternate between smallest and largest
      if (takeFromSmallest) {
        // Add smallest
        if (available.length > 0) {
          const smallest = available.pop();
          used.push(smallest);
          sum += smallest.units;
          console.log(`[Greedy] Add smallest: ${smallest.units}, sum=${sum}`);
        }
      } else {
        // Add largest
        if (available.length > 0) {
          const largest = available.shift();
          used.push(largest);
          sum += largest.units;
          console.log(`[Greedy] Add largest: ${largest.units}, sum=${sum}`);
        }
      }
      
      // Toggle for next iteration
      takeFromSmallest = !takeFromSmallest;
    }
    
    if (sum < target) return null;
    
    // Remove used items from sorted array by unique index
    const usedIndices = new Set(used.map(u => u.uniqueIdx));
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (usedIndices.has(sorted[i].uniqueIdx)) {
        sorted.splice(i, 1);
      }
    }
    
    return {
      ids: used.map(u => u.id),
      units: used.map(u => u.units),
      total: sum,
      exact: sum === target,
      waste: sum - target
    };
  }

  // Extract groups until no more can be formed
  while (true) {
    const g = extractOneGroup();
    if (!g) break;
    groups.push(g);
  }

  const leftovers = sorted.map(({ id, units }) => ({ id, units }));
  
  // Sort groups: exact matches first, then by waste
  groups.sort((a, b) => (a.exact === b.exact ? a.waste - b.waste : a.exact ? -1 : 1));
  
  return { groups, leftovers };
}

// True Greedy: Minimize number of orders by always taking largest first
export function optimizeTrueGreedy(items, target) {
  const small = [];
  const groups = [];

  // Separate items that already meet target from those that don't
  for (const it of items) {
    if (it.units >= target) {
      groups.push({ 
        ids: [it.id],
        units: [it.units],
        total: it.units, 
        exact: it.units === target, 
        waste: it.units - target 
      });
    } else {
      small.push(it);
    }
  }

  // Sort items by units (descending) for greedy approach
  const sorted = [...small].sort((a, b) => b.units - a.units);

  function extractOneGroup() {
    if (sorted.length === 0) return null;
    
    const total = sorted.reduce((a, b) => a + b.units, 0);
    if (total < target) return null;
    
    const used = [];
    const available = [...sorted];
    let sum = 0;
    
    // Greedy: Keep taking largest and searching for best completion
    while (available.length > 0 && sum < target) {
      // Take the largest available
      const largest = available.shift();
      used.push(largest);
      sum += largest.units;
      
      // If we've reached target, done
      if (sum >= target) break;
      
      // Search for the single best item to complete the group
      let bestIdx = -1;
      let bestWaste = Infinity;
      
      for (let i = 0; i < available.length; i++) {
        const newSum = sum + available[i].units;
        if (newSum >= target) {
          const waste = newSum - target;
          if (waste < bestWaste) {
            bestWaste = waste;
            bestIdx = i;
          }
        }
      }
      
      // If found a good completion, use it and stop
      if (bestIdx !== -1) {
        const item = available.splice(bestIdx, 1)[0];
        used.push(item);
        sum += item.units;
        break;
      }
      
      // Otherwise, continue taking largest items
    }
    
    if (sum < target) return null;
    
    // Remove used items from sorted array
    const usedIds = new Set(used.map(u => u.id));
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (usedIds.has(sorted[i].id)) {
        sorted.splice(i, 1);
      }
    }
    
    return {
      ids: used.map(u => u.id),
      units: used.map(u => u.units),
      total: sum,
      exact: sum === target,
      waste: sum - target
    };
  }

  // Extract groups until no more can be formed
  while (true) {
    const g = extractOneGroup();
    if (!g) break;
    groups.push(g);
  }

  const leftovers = sorted.map(({ id, units }) => ({ id, units }));
  
  // Sort groups: exact matches first, then by waste
  groups.sort((a, b) => (a.exact === b.exact ? a.waste - b.waste : a.exact ? -1 : 1));
  
  return { groups, leftovers };
}
