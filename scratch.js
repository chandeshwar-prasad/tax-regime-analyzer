import { calculateNewRegime, calculateOldRegime } from './src/utils/taxEngine.js';

const scenarios = [
  // 1. Normal Scenarios
  { name: 'Income ₹3 lakh', gross: 300000, expectedNew: 0, expectedOld: 0 },
  { name: 'Income ₹7 lakh', gross: 700000, expectedNew: 0, expectedOld: 44200 },
  { name: 'Income ₹12 lakh', gross: 1200000, expectedNew: 0, expectedOld: 163800 },
  { name: 'Income ₹20 lakh', gross: 2000000, expectedNew: 192400, expectedOld: 413400 },

  // 2. Boundary Scenarios
  { name: 'Income = ₹0', gross: 0, expectedNew: 0, expectedOld: 0 },
  { name: 'Income exactly at new rebate threshold (12L + 75k)', gross: 1275000, expectedNew: 0, expectedOld: 187200 },
  { name: 'Income exactly at old rebate threshold (5L + 50k)', gross: 550000, expectedNew: 0, expectedOld: 0 },
  
  // 4. Deduction Scenarios (Gross 15L)
  { name: 'No deductions (15L)', gross: 1500000, investments: {}, housing: {} },
  { name: 'Maximum 80C (15L)', gross: 1500000, investments: { invest80c: 200000 }, housing: {} }, // Should cap at 1.5L
  { name: 'Max HRA (15L) - 1.5L Rent', gross: 1500000, investments: {}, housing: { paysRent: true, monthlyRent: 30000, isMetro: true } },
  { name: 'Combo (15L)', gross: 1500000, investments: { invest80c: 150000, healthInsurance: 25000, nps: 50000 }, housing: { paysRent: true, monthlyRent: 30000, isMetro: true } },

  // 6. High Income Scenarios
  { name: 'Income ₹50 lakh', gross: 5000000, expectedNew: 1099800, expectedOld: 1349400 },
  { name: 'Income ₹1 crore', gross: 10000000, expectedNew: 2925780, expectedOld: 3200340 },
  { name: 'Income ₹5 crore', gross: 50000000, expectedNew: 18924750, expectedOld: 19236750 },
];

console.log("=== QA Test Results ===\n");

for (const sc of scenarios) {
  const newR = calculateNewRegime(sc.gross, 0);
  const oldR = calculateOldRegime(sc.gross, '<60', 0, sc.investments || {}, sc.housing || {});
  
  console.log(`Test: ${sc.name}`);
  console.log(`  New Regime Tax: ${newR.totalTax}`);
  console.log(`  Old Regime Tax: ${oldR.totalTax}`);
  
  if (sc.expectedNew !== undefined) {
    const newPass = newR.totalTax === sc.expectedNew;
    console.log(`  New Expected: ${sc.expectedNew} -> ${newPass ? 'PASS' : 'FAIL (Diff: ' + (newR.totalTax - sc.expectedNew) + ')'}`);
  }
  
  if (sc.expectedOld !== undefined) {
    const oldPass = oldR.totalTax === sc.expectedOld;
    console.log(`  Old Expected: ${sc.expectedOld} -> ${oldPass ? 'PASS' : 'FAIL (Diff: ' + (oldR.totalTax - sc.expectedOld) + ')'}`);
  }
  console.log("------------------------");
}
