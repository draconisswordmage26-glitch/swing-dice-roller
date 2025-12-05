export interface RollResult {
    sum: number;
    average: number;
    narrative: string;
    luckTier: string;
}

export interface DiceGroup {
    count: number;
    sides: number;
}

export function rollDice(groups: DiceGroup[], swing: number): RollResult {
    // swing is 0.0 to 1.0

    let totalDiceCount = 0;
    let baseTotalMean = 0;
    let totalVariance = 0;
    let totalRangeSpan = 0;
    let minSum = 0;
    let maxSum = 0;

    // 1. Aggregate Statistics from all groups
    for (const group of groups) {
        if (group.count <= 0) continue;

        const n = group.count;
        const s = group.sides;

        totalDiceCount += n;
        minSum += n; // Min value for a die is 1
        maxSum += n * s;

        const singleDieMean = (s + 1) / 2;
        const singleDieVariance = (Math.pow(s, 2) - 1) / 12;
        const rangeSpan = s - 1;

        baseTotalMean += n * singleDieMean;
        totalVariance += n * singleDieVariance;
        totalRangeSpan += n * rangeSpan;
    }

    if (totalDiceCount === 0) {
        return { sum: 0, average: 0, narrative: "No dice rolled.", luckTier: "Neutral" };
    }

    // 2. Determine "Luck Bias" (Global Luck Factor)
    // We use a Box-Muller transform to get a standard normal variable Z
    const u1 = Math.random();
    const u2 = Math.random();
    const zLuck = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Calculate Luck Shift
    // Previous logic: luckScale per die = (sides - 1) * 0.16
    // Total luck shift = Sum(n * luckScale) * swing
    // This is exactly: totalRangeSpan * 0.16 * swing
    const luckScaleFactor = 0.16;
    const luckShift = zLuck * (totalRangeSpan * luckScaleFactor) * swing;

    let targetMean = baseTotalMean + luckShift;

    // Clamp target mean to physical limits [Min, Max]
    targetMean = Math.max(minSum, Math.min(maxSum, targetMean));

    // 3. Sample the Final Sum
    const totalStdDev = Math.sqrt(totalVariance);

    const u3 = Math.random();
    const u4 = Math.random();
    const zSum = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);

    let finalSum = targetMean + (zSum * totalStdDev);

    // Round and Clamp
    finalSum = Math.round(finalSum);
    finalSum = Math.max(minSum, Math.min(maxSum, finalSum));

    const average = finalSum / totalDiceCount;

    // 4. Generate Narrative
    // Calculate deviation ratio relative to the total possible range span
    const deviation = finalSum - baseTotalMean;
    const devRatio = totalRangeSpan > 0 ? deviation / totalRangeSpan : 0;

    let luckTier = "Neutral";
    let narrative = "The dice fall as expected.";

    if (Math.abs(devRatio) < 0.02) {
        luckTier = "Neutral";
        narrative = "Perfectly balanced, as all things should be.";
    } else if (devRatio > 0.3) {
        luckTier = "Godly";
        narrative = "IMPOSSIBLE LUCK! The universe bends to your will!";
    } else if (devRatio > 0.16) {
        luckTier = "Legendary";
        narrative = "A golden wave of fortune washes over the table.";
    } else if (devRatio > 0.08) {
        luckTier = "Great";
        narrative = "The winds of fate are blowing in your favor.";
    } else if (devRatio > 0.02) {
        luckTier = "Good";
        narrative = "A slight edge in your favor.";
    } else if (devRatio < -0.3) {
        luckTier = "Cursed";
        narrative = "The dice are haunted. Burn them.";
    } else if (devRatio < -0.16) {
        luckTier = "Terrible";
        narrative = "Dark clouds gather... a disastrous roll.";
    } else if (devRatio < -0.08) {
        luckTier = "Bad";
        narrative = "Luck is not on your side today.";
    } else {
        luckTier = "Unlucky";
        narrative = "Slightly below average.";
    }

    return {
        sum: finalSum,
        average,
        narrative,
        luckTier
    };
}
