import { COINS } from './gameData';

export { COINS as COIN_TYPES }; // Re-export for compatibility if needed

export const flipCoin = (coinType, stats = {}) => {
    const coin = COINS[coinType];
    if (!coin) return { result: 'error', value: 0 };

    // Default Stats from Store
    const {
        headsBonus = 0, // e.g., 0.05
        valueMult = 1,  // e.g., 1.1
        critChance = 0.01,
        tailsValue = 0 // percent of value on loss
    } = stats;

    const roll = Math.random(); // 0.0 to 1.0
    const baseChance = 0.50;

    // Calculate Threshold: < 0.5 is Tails.
    // With bonus, we want Heads to be easier.
    // Standard: Heads if roll >= 0.5.
    // Bonus +10%: Heads if roll >= 0.4.
    // Formula: threshold = baseChance - headsBonus

    const headsThreshold = baseChance - headsBonus;

    // Actually, standard logic:
    // Random(0,100). If < 50 Tails.
    // With bonus, we want more Heads.
    // Improved Logic:
    // Random(0,1).
    // If roll < (0.5 + bonus), HEADS.
    // Wait, let's stick to the PRD Logic:
    // "Heads Mechanic: 50/50 Chance logic"
    // "Luck Upgrades: Shift odds to 60/40"

    // Let's us `roll < probability` for success (Heads).
    // probability = 0.5 + headsBonus.
    // roll = 0.0 to 1.0.

    const successProbability = 0.5 + headsBonus;
    const isHeads = roll < successProbability;

    // Critical Hit (Edge) - Check independently? Or as a sub-set of Heads?
    // PRD: "Critical Flip: 1% chance for coin to land on its Edge. Pays 100x value."
    // Usually this is a separate roll or a slice of the success.
    // Let's do separate roll for Critical to allow it on any flip? 
    // Or Critical implies Success? 
    // Let's make Critical a "Super Heads".

    const critRoll = Math.random();
    const isCritical = critRoll < critChance;

    if (isCritical) {
        return {
            result: 'heads',
            value: coin.value * 100 * valueMult,
            isCritical: true
        };
    }

    if (isHeads) {
        return {
            result: 'heads',
            value: coin.value * valueMult,
            isCritical: false
        };
    } else {
        // Tails
        const salvageValue = coin.value * tailsValue * valueMult;
        return {
            result: 'tails',
            value: salvageValue,
            isCritical: false
        };
    }
};
