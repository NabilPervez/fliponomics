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
    halfDollar: {
        id: 'halfDollar',
        name: 'Half Dollar',
        value: 0.50,
        cost: 250.00,
        description: "Rare in the wild, common in your pocket."
    },
    loonie: {
        id: 'loonie',
        name: 'Loonie',
        value: 1.00,
        cost: 500.00,
        description: "A golden bird from the north."
    },
    toonie: {
        id: 'toonie',
        name: 'Toonie',
        value: 2.00,
        cost: 1000.00,
        description: "Two-tone Canadian excellence."
    },
    chip: {
        id: 'chip',
        name: 'Casino Chip',
        value: 5.00,
        cost: 2500.00,
        description: "The house always wins. Now you are the house."
    },
    tenDollar: {
        id: 'tenDollar',
        name: 'Ten Dollar Coin',
        value: 10.00,
        cost: 5000.00,
        description: "Commemorative and collectible."
    },
    pound: {
        id: 'pound',
        name: 'British Pound',
        value: 1.27,
        cost: 750.00,
        description: "The Queen's currency. God save the flip."
    },
    euro: {
        id: 'euro',
        name: 'Euro',
        value: 1.08,
        cost: 650.00,
        description: "United in currency, divided by borders."
    },
    yen: {
        id: 'yen',
        name: 'Japanese Yen',
        value: 0.0067,
        cost: 50.00,
        description: "Small value, big culture."
    },
    yuan: {
        id: 'yuan',
        name: 'Chinese Yuan',
        value: 0.14,
        cost: 150.00,
        description: "The dragon's treasure."
    },
    rupee: {
        id: 'rupee',
        name: 'Indian Rupee',
        value: 0.012,
        cost: 75.00,
        description: "Spice trade profits."
    },
    doubloon: {
        id: 'doubloon',
        name: 'Gold Doubloon',
        value: 50.00,
        cost: 25000.00,
        description: "Yarr! Genuine pirate treasure."
    },
    krugerrand: {
        id: 'krugerrand',
        name: 'Krugerrand',
        value: 100.00,
        cost: 50000.00,
        description: "South African gold standard."
    },
    goldBar: {
        id: 'goldBar',
        name: 'Gold Bar',
        value: 500.00,
        cost: 250000.00,
        description: "Fort Knox approved."
    },
    bitcoin: {
        id: 'bitcoin',
        name: 'Bitcoin',
        value: 35000.00,
        cost: 10000000.00,
        description: "Volatile, but digital."
    },
    ethereum: {
        id: 'ethereum',
        name: 'Ethereum',
        value: 2500.00,
        cost: 750000.00,
        description: "Smart contracts, smarter flips."
    },
    platinumCoin: {
        id: 'platinumCoin',
        name: 'Platinum Coin',
        value: 75000.00,
        cost: 25000000.00,
        description: "Rarer than gold, shinier than silver."
    },
    nft: {
        id: 'nft',
        name: 'Rare NFT',
        value: 150000.00,
        cost: 50000000.00,
        description: "Right-click save this flip."
    },
    moonRock: {
        id: 'moonRock',
        name: 'Moon Rock',
        value: 500000.00,
        cost: 250000000.00,
        description: "Literally out of this world."
    },
    antimatter: {
        id: 'antimatter',
        name: 'Antimatter Coin',
        value: 5000000.00,
        cost: 2500000000.00,
        description: "Don't let it touch regular matter."
    },
    starFragment: {
        id: 'starFragment',
        name: 'Star Fragment',
        value: 50000000.00,
        cost: 25000000000.00,
        description: "Forged in the heart of a dying star."
    },
    singularity: {
        id: 'singularity',
        name: 'Singularity Token',
        value: 1000000000.00,
        cost: 500000000000.00,
        description: "The event horizon of wealth."
    }
};

// --- 2. THE TABLE (Space Expansion) ---
export const TABLE_MILESTONES = [
    { id: 'space0', slots: 1, name: "Coaster", cost: 0, desc: "It's just a cardboard circle." },
    { id: 'space1', slots: 2, name: "Mousepad", cost: 15.00, desc: "Double the friction, double the fun." },
    { id: 'space2', slots: 4, name: "Cafeteria Tray", cost: 150.00, desc: "Smells like old french fries." },
    { id: 'space3', slots: 6, name: "Coffee Table", cost: 500.00, desc: "Perfect for casual flipping." },
    { id: 'space4', slots: 8, name: "Card Table", cost: 1200.00, desc: "Felt surface for professional action." },
    { id: 'space5', slots: 12, name: "Poker Table", cost: 5000.00, desc: "All-in on coin flips." },
    { id: 'space6', slots: 16, name: "Craps Table", cost: 15000.00, desc: "High stakes require high surface area." },
    { id: 'space7', slots: 24, name: "Roulette Wheel", cost: 75000.00, desc: "Spin to win, flip to profit." },
    { id: 'space8', slots: 32, name: "Server Rack", cost: 500000.00, desc: "Digitized flipping slots. High density." },
    { id: 'space9', slots: 48, name: "Mainframe", cost: 5000000.00, desc: "Industrial-scale coin operations." },
    { id: 'space10', slots: 64, name: "Quantum Array", cost: 50000000.00, desc: "Superposition flipping technology." }
];

// --- 3. AUTOMATION (Robotics) ---
export const TOOLS = {
    fidgetFinger: {
        id: 'fidgetFinger',
        name: "Fidget Finger",
        baseCost: 50.00,
        interval: 5000,
        description: "Flips Slot #1 every 5s.",
        type: 'targeted',
        target: 0
    },
    thumbTwitch: {
        id: 'thumbTwitch',
        name: "Thumb Twitch",
        baseCost: 100.00,
        interval: 4000,
        description: "Flips Slot #2 every 4s.",
        type: 'targeted',
        target: 1
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
        description: "Flips first 4 slots every 3s.",
        type: 'row',
        rowSize: 4
    },
    industrialFan: {
        id: 'industrialFan',
        name: "Industrial Fan",
        baseCost: 5000.00,
        interval: 4000,
        description: "Flips ALL slots every 4s.",
        type: 'all'
    },
    mechanicalArm: {
        id: 'mechanicalArm',
        name: "Mechanical Arm",
        baseCost: 25000.00,
        interval: 2000,
        description: "Flips ALL slots every 2s.",
        type: 'all'
    },
    teslaCoil: {
        id: 'teslaCoil',
        name: "Tesla Coil",
        baseCost: 100000.00,
        interval: 1000,
        description: "Flips ALL slots every 1s.",
        type: 'all'
    },
    timeDilator: {
        id: 'timeDilator',
        name: "Time Dilator",
        baseCost: 500000.00,
        interval: 500,
        description: "Flips ALL slots 2x/sec.",
        type: 'all'
    },
    quantumTunneler: {
        id: 'quantumTunneler',
        name: "Quantum Tunneler",
        baseCost: 2500000.00,
        interval: 200,
        description: "Flips ALL slots 5x/sec.",
        type: 'all'
    },
    nanoSwarm: {
        id: 'nanoSwarm',
        name: "Nano Swarm",
        baseCost: 10000000.00,
        interval: 100,
        description: "Flips ALL slots 10x/sec.",
        type: 'all'
    },
    aiOverlord: {
        id: 'aiOverlord',
        name: "AI Overlord",
        baseCost: 100000000.00,
        interval: 50,
        description: "Flips ALL slots 20x/sec.",
        type: 'all'
    },
    godHand: {
        id: 'godHand',
        name: "God Hand",
        baseCost: 1000000000.00,
        interval: 25,
        description: "Flips ALL slots 40x/sec.",
        type: 'all'
    }
};

// --- 4. R&D LAB (Upgrades) ---
export const UPGRADES = {
    // Luck Upgrades (Heads Chance)
    weightedZinc: {
        id: 'weightedZinc',
        name: "Weighted Zinc",
        cost: 100.00,
        description: "Heads Chance +5%.",
        effect: { type: 'luck', value: 5 }
    },
    magnetCore: {
        id: 'magnetCore',
        name: "Magnet Core",
        cost: 2500.00,
        description: "Heads Chance +8%.",
        effect: { type: 'luck', value: 8 }
    },
    insiderTrading: {
        id: 'insiderTrading',
        name: "Insider Trading",
        cost: 10000.00,
        description: "Heads Chance +10%.",
        effect: { type: 'luck', value: 10 }
    },
    quantumBias: {
        id: 'quantumBias',
        name: "Quantum Bias",
        cost: 100000.00,
        description: "Heads Chance +15%.",
        effect: { type: 'luck', value: 15 }
    },

    // Value Multipliers
    polishedEdges: {
        id: 'polishedEdges',
        name: "Polished Edges",
        cost: 500.00,
        description: "Coin Value +10%.",
        effect: { type: 'valueMult', value: 0.10 }
    },
    goldPlating: {
        id: 'goldPlating',
        name: "Gold Plating",
        cost: 5000.00,
        description: "Coin Value +25%.",
        effect: { type: 'valueMult', value: 0.25 }
    },
    diamondCoating: {
        id: 'diamondCoating',
        name: "Diamond Coating",
        cost: 50000.00,
        description: "Coin Value +50%.",
        effect: { type: 'valueMult', value: 0.50 }
    },
    cosmicEnhancement: {
        id: 'cosmicEnhancement',
        name: "Cosmic Enhancement",
        cost: 500000.00,
        description: "Coin Value +100%.",
        effect: { type: 'valueMult', value: 1.00 }
    },

    // Critical Chance
    luckyClover: {
        id: 'luckyClover',
        name: "Lucky Clover",
        cost: 750.00,
        description: "Crit Chance +1%.",
        effect: { type: 'crit', value: 0.01 }
    },
    rabbitFoot: {
        id: 'rabbitFoot',
        name: "Rabbit's Foot",
        cost: 5000.00,
        description: "Crit Chance +2%.",
        effect: { type: 'crit', value: 0.02 }
    },
    horseshoe: {
        id: 'horseshoe',
        name: "Golden Horseshoe",
        cost: 25000.00,
        description: "Crit Chance +3%.",
        effect: { type: 'crit', value: 0.03 }
    },
    wishingWell: {
        id: 'wishingWell',
        name: "Wishing Well",
        cost: 100000.00,
        description: "Crit Chance +5%.",
        effect: { type: 'crit', value: 0.05 }
    },

    // Tails Value (Pity)
    floorMats: {
        id: 'floorMats',
        name: "Floor Mats",
        cost: 2000.00,
        description: "Tails pays 10% value.",
        effect: { type: 'tailsValue', value: 0.10 }
    },
    safetyNet: {
        id: 'safetyNet',
        name: "Safety Net",
        cost: 15000.00,
        description: "Tails pays 25% value.",
        effect: { type: 'tailsValue', value: 0.25 }
    },
    insurancePolicy: {
        id: 'insurancePolicy',
        name: "Insurance Policy",
        cost: 75000.00,
        description: "Tails pays 50% value.",
        effect: { type: 'tailsValue', value: 0.50 }
    },

    // Speed Upgrades
    caffeinePills: {
        id: 'caffeinePills',
        name: "Caffeine Pills",
        cost: 4000.00,
        description: "Auto-flip 25% faster.",
        effect: { type: 'speed', value: 0.25 }
    },
    overclockModule: {
        id: 'overclockModule',
        name: "Overclock Module",
        cost: 25000.00,
        description: "Auto-flip 50% faster.",
        effect: { type: 'speed', value: 0.50 }
    },
    timeCompression: {
        id: 'timeCompression',
        name: "Time Compression",
        cost: 200000.00,
        description: "Auto-flip 100% faster.",
        effect: { type: 'speed', value: 1.00 }
    },

    // Special Upgrades
    doubleDown: {
        id: 'doubleDown',
        name: "Double Down",
        cost: 50000.00,
        description: "Critical hits pay 200x instead of 100x.",
        effect: { type: 'critMult', value: 2.0 }
    },
    luckyStreak: {
        id: 'luckyStreak',
        name: "Lucky Streak",
        cost: 250000.00,
        description: "3 Heads in a row = bonus flip.",
        effect: { type: 'streak', value: 3 }
    }
};
