import clsx from 'clsx';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { COINS, TOOLS, UPGRADES, TABLE_MILESTONES } from '../../utils/gameData';
import { playSound } from '../../utils/sound';

export default function StorePanel() {
    const {
        bank,
        unlockedCoins,
        maxSlots,
        unlockCoin,
        expandTable,
        spendMoney,
        updateSlotCoin,
        slots,
        tools,
        upgrades,
        buyTool,
        buyUpgrade,
        getToolCost,
        prestige,
        mintTokens
    } = useStore();

    const [activeTab, setActiveTab] = useState('mint');

    const tabs = [
        { id: 'mint', label: 'Mint', icon: 'payments' },
        { id: 'table', label: 'Table', icon: 'grid_view' },
        { id: 'auto', label: 'Auto', icon: 'smart_toy' },
        { id: 'upgrades', label: 'Upgrades', icon: 'upgrade' },
    ];

    // --- Helper Functions ---

    const handleUnlockCoin = (key, cost) => {
        if (unlockedCoins.includes(key)) return;
        if (spendMoney(cost)) {
            unlockCoin(key);
            playSound('unlock');
        }
    };

    const handleExpandTable = (cost) => {
        if (spendMoney(cost)) {
            expandTable();
            playSound('unlock');
        }
    };

    const handleEquipCoin = (type) => {
        slots.forEach(slot => {
            updateSlotCoin(slot.id, type);
        });
    };

    const handleBuyTool = (toolId) => {
        if (buyTool(toolId)) {
            playSound('unlock');
        }
    };

    const handleBuyUpgrade = (upgradeId) => {
        if (buyUpgrade(upgradeId)) {
            playSound('unlock');
        }
    };

    return (
        <aside className="w-[420px] bg-background-light dark:bg-[#111811] border-l border-white/10 flex flex-col shadow-2xl z-40 h-full">
            {/* Tabs */}
            <div className="flex border-b border-white/10 shrink-0">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex flex-col items-center gap-1",
                            activeTab === tab.id
                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                : "text-white/40 hover:text-white/60"
                        )}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {/* === MINT TAB === */}
                {activeTab === 'mint' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Available Coinage</h3>
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                                {unlockedCoins.length}/{Object.keys(COINS).length} Unlocked
                            </span>
                        </div>

                        {Object.values(COINS).map((coin) => {
                            const isUnlocked = unlockedCoins.includes(coin.id);
                            const canAfford = bank >= coin.cost;

                            return (
                                <div key={coin.id} className={clsx(
                                    "p-4 rounded-xl bg-white/5 border border-white/10 transition-all relative overflow-hidden group",
                                    !isUnlocked && !canAfford ? "opacity-50" : "hover:border-primary/50"
                                )}>
                                    <div className="flex gap-4">
                                        <div className={clsx(
                                            "size-16 rounded-lg flex items-center justify-center border",
                                            // Simplistic icon logic for now
                                            "bg-white/10 text-white/50 border-white/10"
                                        )}>
                                            <span className="material-symbols-outlined text-3xl">token</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg leading-none">{coin.name}</h4>
                                                {isUnlocked && <span className="text-xs font-bold text-primary">OWNED</span>}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{coin.description}</p>
                                            <p className="text-xs text-primary font-bold mt-1">Value: ${coin.value.toFixed(2)}</p>

                                            <div className="mt-3 flex items-center justify-between">
                                                {!isUnlocked ? (
                                                    <>
                                                        <span className={clsx("font-bold", canAfford ? "text-primary" : "text-red-500")}>
                                                            ${coin.cost.toFixed(2)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUnlockCoin(coin.id, coin.cost)}
                                                            disabled={!canAfford}
                                                            className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-background-dark text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors"
                                                        >
                                                            Unlock
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEquipCoin(coin.id)}
                                                        className="w-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors"
                                                    >
                                                        Equip All
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* === TABLE TAB === */}
                {activeTab === 'table' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Expansion</h3>
                            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                                {maxSlots} Slots
                            </span>
                        </div>

                        {/* Logic to show next available Milestone */}
                        {TABLE_MILESTONES.map((milestone, index) => {
                            // Only show if it's the immediate next upgrade
                            // Current MaxSlots = 1. Next Milestone = 2.
                            const isNext = milestone.slots > maxSlots;
                            const isCurrent = milestone.slots === maxSlots;

                            // Filter out past ones except current
                            if (milestone.slots < maxSlots) return null;
                            if (milestone.slots > maxSlots * 2) return null; // Hide far future stuff

                            // Wait, simple logic: show next 1 upgrade.
                            // Or finding the one where slots > current.
                            const nextUpgrade = TABLE_MILESTONES.find(m => m.slots > maxSlots);
                            if (milestone.slots !== nextUpgrade?.slots && !isCurrent) return null;

                            const canAfford = bank >= milestone.cost;

                            return (
                                <div key={milestone.slots} className={clsx(
                                    "p-4 rounded-xl border transition-all",
                                    isCurrent ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10 hover:border-primary/50"
                                )}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-lg">{milestone.name}</h4>
                                            <p className="text-xs text-slate-400">{milestone.desc}</p>
                                            <p className="text-xs text-slate-500 mt-1">{milestone.slots} Slots</p>
                                        </div>
                                        <div className="text-right">
                                            {isCurrent ? (
                                                <span className="text-xs font-bold text-primary uppercase">Active</span>
                                            ) : (
                                                <>
                                                    <div className={clsx("font-bold mb-1", canAfford ? "text-primary" : "text-red-500")}>
                                                        ${milestone.cost.toFixed(2)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleExpandTable(milestone.cost)}
                                                        disabled={!canAfford}
                                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-background-dark text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors"
                                                    >
                                                        Unique Upgrade
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fallback generic expander if no milestone matches (linear filler) */}
                        {/* ... */}
                    </div>
                )}

                {/* === AUTO TAB === */}
                {activeTab === 'auto' && (
                    <div className="space-y-4">
                        {Object.values(TOOLS).map((tool) => {
                            const count = tools[tool.id] || 0;
                            const cost = getToolCost(tool.id);
                            const canAfford = bank >= cost;

                            return (
                                <div key={tool.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{tool.name}</h4>
                                            <p className="text-xs text-slate-400">{tool.description}</p>
                                            <p className="text-xs text-slate-500 mt-1">Owned: {count}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className={clsx("font-bold mb-1", canAfford ? "text-primary" : "text-red-500")}>
                                                ${cost.toFixed(2)}
                                            </div>
                                            <button
                                                onClick={() => handleBuyTool(tool.id)}
                                                disabled={!canAfford}
                                                className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-background-dark text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors"
                                            >
                                                Buy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* === UPGRADES TAB === */}
                {activeTab === 'upgrades' && (
                    <div className="space-y-4">
                        {Object.values(UPGRADES).map((upgrade) => {
                            const isOwned = upgrades[upgrade.id];
                            const canAfford = bank >= upgrade.cost;

                            if (isOwned) return null; // Hide purchased upgrades? Or show as owned.
                            // Let's show as owned at bottom, or filter out completely for cleaner UI. 
                            // Showing them as owned is satisfying.

                            return (
                                <div key={upgrade.id} className={clsx(
                                    "p-4 rounded-xl border transition-all",
                                    isOwned ? "bg-primary/10 border-primary opacity-50" : "bg-white/5 border-white/10 hover:border-primary/50"
                                )}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-lg">{upgrade.name}</h4>
                                            <p className="text-xs text-slate-400">{upgrade.description}</p>
                                        </div>
                                        <div className="text-right">
                                            {isOwned ? (
                                                <span className="text-xs font-bold text-primary uppercase">Active</span>
                                            ) : (
                                                <>
                                                    <div className={clsx("font-bold mb-1", canAfford ? "text-primary" : "text-red-500")}>
                                                        ${upgrade.cost.toFixed(2)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleBuyUpgrade(upgrade.id)}
                                                        disabled={!canAfford}
                                                        className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-background-dark text-[10px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors"
                                                    >
                                                        Research
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Footer / Prestige */}
            <div className="p-6 bg-black/30 border-t border-white/10 space-y-4 mt-auto shrink-0">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Empire Value</span>
                    <span className="text-primary font-bold">Excellent</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    {/* Progress to next Prestige Token? Simplified visual */}
                    <div className="h-full bg-gradient-to-r from-primary to-emerald-400 w-full shadow-[0_0_10px_#0df20d]"></div>
                </div>
                <button
                    onClick={prestige}
                    className="w-full bg-gradient-to-r from-emerald-600 to-primary py-3 rounded-lg text-background-dark font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Mint Legacy ({mintTokens})
                </button>
                <p className="text-[10px] text-center text-white/30 uppercase font-medium">Reset now to gain Tokens</p>
            </div>
        </aside>
    );
}
