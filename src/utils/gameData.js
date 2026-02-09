// --- 1. THE MINT (Coin Tiers) ---
export const COINS = {
    penny: {
        id: 'penny',
        name: 'Penny',
        value: 0.01,
        cost: 0,
        description: "Find a penny, pick it up."
    },
    nickel: {
        id: 'nickel',
        name: 'Nickel',
        value: 0.05,
        cost: 5.00,
        description: "Five times the copper. Sort of."
    },
    dime: {
        id: 'dime',
        name: 'Dime',
        value: 0.10,
        cost: 25.00,
        description: "Smaller, yet more valuable. Economics is weird."
    },
    quarter: {
        id: 'quarter',
        name: 'Quarter',
        value: 0.25,
        cost: 100.00,
        description: "The laundry machine standard."
    },
    loonie: {
        id: 'loonie',
        name: 'Loonie',
        value: 1.00,
        cost: 500.00,
        description: "A golden bird from the north."
    },
    chip: {
        id: 'chip',
        name: 'Casino Chip',
        value: 5.00,
        cost: 2500.00,
        description: "The house always wins. Now you are the house."
    },
    doubloon: {
        id: 'doubloon',
        name: 'Gold Doubloon',
        value: 50.00,
        cost: 25000.00,
        description: "Yarr! Genuine pirate treasure."
    },
    bitcoin: {
        id: 'bitcoin',
        name: 'Bitcoin',
        value: 35000.00,
        cost: 10000000.00,
        description: "Volatile, but digital."
    }
};

// --- 2. THE TABLE (Space Expansion) ---
// Not a standard registry, handled via simple scaling logic in store, 
// but we can define the "Milestones" for flavor text.
export const TABLE_MILESTONES = [
    { slots: 1, name: "Coaster", cost: 0, desc: "It's just a cardboard circle." },
    { slots: 2, name: "Mousepad", cost: 15.00, desc: "Double the friction, double the fun." },
    { slots: 4, name: "Cafeteria Tray", cost: 150.00, desc: "Smells like old french fries." },
    { slots: 8, name: "Card Table", cost: 1200.00, desc: "Felt surface for professional action." },
    { slots: 16, name: "Craps Table", cost: 15000.00, desc: "High stakes require high surface area." },
    { slots: 32, name: "Server Rack", cost: 500000.00, desc: "Digitized flipping slots. High density." }
];

// --- 3. AUTOMATION (Robotics) ---
export const TOOLS = {
    fidgetFinger: {
        id: 'fidgetFinger',
        name: "Fidget Finger",
        baseCost: 50.00,
        interval: 5000, // ms
        description: "Flips Slot #1 every 5s.",
        type: 'targeted',
        target: 0 // Slot index
    },
    drinkingBird: {
        id: 'drinkingBird',
        name: "Drinking Bird",
        baseCost: 250.00,
        interval: 2000,
        description: "Flips a Random Slot every 2s.",
        type: 'random'
    },
    dealerHand: {
        id: 'dealerHand',
        name: "Dealer's Hand",
        baseCost: 1000.00,
        interval: 3000,
        description: "Flips Row #1 (Slots 0-1) every 3s.", // Simplified for now
        type: 'row',
        rowIndex: 0
    },
    industrialFan: {
        id: 'industrialFan',
        name: "Industrial Fan",
        baseCost: 5000.00,
        interval: 4000,
        description: "Flips ALL slots every 4s.",
        type: 'all'
    },
    quantumTunneler: {
        id: 'quantumTunneler',
        name: "Quantum Tunneler",
        baseCost: 1000000.00,
        interval: 100, // 10x per sec
        description: "Flips ALL slots 10x/sec.",
        type: 'all'
    }
};

// --- 4. R&D LAB (Upgrades) ---
export const UPGRADES = {
    weightedZinc: {
        id: 'weightedZinc',
        name: "Weighted Zinc",
        cost: 100.00,
        description: "Heads Chance +5%.",
        effect: { type: 'luck', value: 5 }
    },
    polishedEdges: {
        id: 'polishedEdges',
        name: "Polished Edges",
        cost: 500.00,
        description: "Coin Value +10%.",
        effect: { type: 'valueMult', value: 0.10 }
    },
    luckyClover: {
        id: 'luckyClover',
        name: "Lucky Clover",
        cost: 750.00,
        description: "Crit Chance +1%.",
        effect: { type: 'crit', value: 0.01 }
    },
    floorMats: {
        id: 'floorMats',
        name: "Floor Mats",
        cost: 2000.00,
        description: "Missed clicks (Tails) give 10% value.",
        effect: { type: 'tailsValue', value: 0.10 }
    },
    insiderTrading: {
        id: 'insiderTrading',
        name: "Insider Trading",
        cost: 10000.00,
        description: "Heads Chance +10%.",
        effect: { type: 'luck', value: 10 }
    }
};
