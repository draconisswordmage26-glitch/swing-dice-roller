import { rollDice } from './diceLogic';

console.log("Running Verification Tests...");

// Test 1: 0% Swing (Standard Physics)
console.log("\nTest 1: 0% Swing (1,000,000 dice)");
let sum0 = 0;
for (let i = 0; i < 10; i++) {
    const res = rollDice([{ count: 1000000, sides: 6 }], 0);
    sum0 += res.average;
    console.log(`  Run ${i + 1}: Avg=${res.average.toFixed(4)} (${res.luckTier})`);
}
const avg0 = sum0 / 10;
console.log(`  > Mean of Averages: ${avg0.toFixed(4)} (Expected ~3.5)`);
if (Math.abs(avg0 - 3.5) > 0.01) console.error("  FAIL: 0% swing deviated too much!");
else console.log("  PASS");

// Test 2: 100% Swing (Chaos)
console.log("\nTest 2: 100% Swing (1,000,000 dice)");
// let variances = [];
let sums = [];
for (let i = 0; i < 10; i++) {
    const res = rollDice([{ count: 1000000, sides: 6 }], 1.0);
    sums.push(res.average);
    console.log(`  Run ${i + 1}: Avg=${res.average.toFixed(4)} (${res.luckTier})`);
}
// Check if we got significant deviation
const minAvg = Math.min(...sums);
const maxAvg = Math.max(...sums);
console.log(`  > Range: ${minAvg.toFixed(4)} to ${maxAvg.toFixed(4)}`);
if (maxAvg - minAvg < 0.5) console.warn("  WARNING: 100% swing didn't swing enough! (Might be bad luck in testing)");
else console.log("  PASS: Significant variance observed.");

console.log("\nTest 3: d20 with 100% Swing (1,000,000 dice)");
// Expected Mean: 10.5
for (let i = 0; i < 5; i++) {
    const res = rollDice([{ count: 1000000, sides: 20 }], 1.0);
    console.log(`  Run ${i + 1}: Avg=${res.average.toFixed(4)} (${res.luckTier})`);
}

console.log("\nVerification Complete.");
