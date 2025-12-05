export interface RollResult {
    sum: number;
    average: number;
    narrative: string;
    luckTier: string;
}

export function rollDice(n: number, swing: number, sides: number = 6): RollResult {
    // swing is 0.0 to 1.0

    // Standard statistics for a single die with 'sides'
    const SINGLE_DIE_MEAN = (sides + 1) / 2;
    const SINGLE_DIE_VARIANCE = (Math.pow(sides, 2) - 1) / 12;

    // 1. Determine the "Luck Bias" for this batch
    // We want the bias to be 0 when swing is 0.
    // Bias = (Random(-1, 1) + Random(-1, 1)) * Swing * Scale

    // Let's use a Box-Muller transform to get a standard normal variable Z
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    // Z is N(0, 1).
    // We want the "luck" to shift the mean.
    // For d6 (mean 3.5), we used 0.8. That's approx 25% of the range.
    // Let's scale it by the die size.
    // Range is [1, sides]. Span is (sides - 1).
    const rangeSpan = sides - 1;
    const luckScale = rangeSpan * 0.16; // 0.16 * 5 = 0.8 (matches d6 logic)

    const luckOffset = z * luckScale * swing;
    let effectiveMean = SINGLE_DIE_MEAN + luckOffset;

    // Clamp effective mean to [1, sides]
    effectiveMean = Math.max(1, Math.min(sides, effectiveMean));

    // 2. Calculate the Sum
    const totalMean = n * effectiveMean;
    const totalVariance = n * SINGLE_DIE_VARIANCE;
    const totalStdDev = Math.sqrt(totalVariance);

    // Sample the final sum from this distribution
    const u3 = Math.random();
    const u4 = Math.random();
    const zSum = Math.sqrt(-2.0 * Math.log(u3)) * Math.cos(2.0 * Math.PI * u4);

    let sum = totalMean + (zSum * totalStdDev);

    // Round to integer
    sum = Math.round(sum);

    // Hard clamp to physical limits
    sum = Math.max(n, Math.min(sides * n, sum));

    const average = sum / n;

    // 3. Generate Narrative
    let luckTier = "Neutral";
    let narrative = "The dice fall as expected.";

    // Normalize deviation relative to the die size
    const deviation = average - SINGLE_DIE_MEAN;
    // For d6, "Godly" was > 1.5 (30% of range).
    // Let's use percentage of range for thresholds.
    const devRatio = deviation / rangeSpan;

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
        sum,
        average,
        narrative,
        luckTier
    };
}
