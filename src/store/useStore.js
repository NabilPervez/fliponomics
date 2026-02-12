import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COINS, TOOLS, UPGRADES, TABLE_MILESTONES } from '../utils/gameData';

// Universal Cost Formula: Base * (Growth)^Count
const calculateCost = (baseCost, count, growth = 1.15) => {
    return baseCost * Math.pow(growth, count);
};

export const useStore = create(
    persist(
        (set, get) => ({
            // --- Slices ---
            // --- Slices ---
            bank: 0,
            lifetimeEarnings: 0,
            prestigeStars: 0, // Prestige Currency

            // Inventory
            unlockedCoins: ['penny'],
            maxSlots: 1,

            // Tools & Upgrades
            // Format: { fidgetFinger: 0, drinkingBird: 0 }
            tools: Object.keys(TOOLS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
            upgrades: Object.keys(UPGRADES).reduce((acc, key) => ({ ...acc, [key]: false }), {}),

            // The Table state
            slots: [
                { id: 1, coinType: 'penny', isFlipping: false }
            ],

            // Stats & Multipliers
            stats: {
                totalFlips: 0,
                headsCount: 0,
                tailsCount: 0,
                // Derived stats will be calculated on the fly or cached here if needed
            },

            // --- Actions ---

            // 1. Bank Operations
            addMoney: (amount) => set((state) => {
                // Apply Global Multipliers here? Or in the Component?
                // Better to have a "getMultiplier()" selector, but for now we apply raw amount.
                // We will trust the caller (Coin.jsx / GameLoop) to calculate the final value.
                return {
                    bank: state.bank + amount,
                    lifetimeEarnings: state.lifetimeEarnings + amount
                };
            }),

            spendMoney: (amount) => {
                const { bank } = get();
                if (bank >= amount) {
                    set({ bank: bank - amount });
                    return true;
                }
                return false;
            },

            // 2. Slot Operations
            setSlotFlipping: (slotId, isFlipping) => set((state) => ({
                slots: state.slots.map((s) => s.id === slotId ? { ...s, isFlipping } : s)
            })),

            updateSlotCoin: (slotId, coinType) => set((state) => ({
                slots: state.slots.map((s) => s.id === slotId ? { ...s, coinType } : s)
            })),

            // 3. Expansion (Market)
            unlockCoin: (coinId) => set((state) => ({
                unlockedCoins: [...state.unlockedCoins, coinId]
            })),

            expandTable: () => set((state) => {
                // Find next milestone
                // Current slots -> Find next in TABLE_MILESTONES
                // Logic handled in Component for cost, here we just set slots.
                // For safety, let's just increment or set to specific Value.

                // Let's assume the component calculates the target size.
                // But to be safe, let's just add 1 slot for now as per MVP, 
                // OR if we strictly follow the milestones:

                const currentCount = state.slots.length;
                const nextCount = currentCount + 1; // Simple linear expansion for now to match UI

                const newSlots = [...state.slots, { id: nextCount, coinType: 'penny', isFlipping: false }];

                return {
                    maxSlots: nextCount,
                    slots: newSlots
                };
            }),

            // 4. Buying Tools (Automation)
            buyTool: (toolId) => {
                const state = get();
                const tool = TOOLS[toolId];
                const count = state.tools[toolId];
                const cost = calculateCost(tool.baseCost, count);

                if (state.bank >= cost) {
                    set({
                        bank: state.bank - cost,
                        tools: { ...state.tools, [toolId]: count + 1 }
                    });
                    return true;
                }
                return false;
            },

            // 5. Buying Upgrades
            buyUpgrade: (upgradeId) => {
                const state = get();
                const upgrade = UPGRADES[upgradeId];
                const cost = upgrade.cost; // Upgrades are usually one-time

                if (!state.upgrades[upgradeId] && state.bank >= cost) {
                    set({
                        bank: state.bank - cost,
                        upgrades: { ...state.upgrades, [upgradeId]: true }
                    });
                    return true;
                }
                return false;
            },

            recordFlip: (result) => set((state) => ({
                stats: {
                    ...state.stats,
                    totalFlips: state.stats.totalFlips + 1,
                    headsCount: state.stats.headsCount + (result === 'heads' ? 1 : 0),
                    tailsCount: state.stats.tailsCount + (result === 'tails' ? 1 : 0),
                }
            })),

            // 6. Prestige
            prestige: () => {
                const state = get();
                // Call of Duty Style: Reset everything, gain a star.
                // Requirement: 100 Million Bank
                if (state.bank < 100000000) return false;

                // Reset
                set({
                    bank: 0,
                    lifetimeEarnings: 0,
                    prestigeStars: state.prestigeStars + 1,

                    unlockedCoins: ['penny'],
                    maxSlots: 1,
                    slots: [{ id: 1, coinType: 'penny', isFlipping: false }],

                    tools: Object.keys(TOOLS).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
                    upgrades: Object.keys(UPGRADES).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                });
                return true;
            },

            // Selectors / Helpers
            getToolCost: (toolId) => {
                const state = get();
                const tool = TOOLS[toolId];
                return calculateCost(tool.baseCost, state.tools[toolId] || 0);
            },

            getStatsModifiers: () => {
                const state = get();

                let headsBonus = 0; // Additive percentage (e.g. 0.05 for 5%)
                let valueMult = 1; // Multiplicative
                let critChance = 0.01; // Base 1%
                let tailsValue = 0; // 0%

                if (state.upgrades.weightedZinc) headsBonus += 0.05;
                if (state.upgrades.insiderTrading) headsBonus += 0.10;

                if (state.upgrades.polishedEdges) valueMult *= 1.10;

                if (state.upgrades.luckyClover) critChance += 0.01;

                if (state.upgrades.floorMats) tailsValue = 0.10;

                // Prestige Bonus?
                // state.mintTokens * 0.1? (Phase 3)

                return { headsBonus, valueMult, critChance, tailsValue };
            }

        }),
        {
            name: 'flip-o-nomics-storage',
        }
    )
);
