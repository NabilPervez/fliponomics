import { useStore } from '../../store/useStore';
import CoinMat from '../Mat/CoinMat';
import StorePanel from '../Store/StorePanel';

export default function Layout() {
    const { bank, prestige, prestigeStars } = useStore();

    // Format currency
    const formattedBank = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(bank);

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white selection:bg-primary/30">

            {/* Header / HUD */}
            <header className="flex items-center justify-between border-b border-white/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-3 z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-background-dark shadow-[0_0_15px_rgba(13,242,13,0.5)]">
                        <span className="material-symbols-outlined font-bold">currency_exchange</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Flip-O-Nomics</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Bank</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">{formattedBank}</span>
                            <span className="material-symbols-outlined text-primary text-sm animate-pulse">trending_up</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="h-10 w-px bg-white/10"></div>

                    {/* Prestige & Stars */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Prestige</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <span className="material-symbols-outlined text-lg">hotel_class</span>
                            <span className="text-xl font-bold">{prestigeStars}</span>
                        </div>
                    </div>

                    {/* Prestige Button (Visible when eligible) */}
                    {bank >= 1000000000 && (
                        <button
                            onClick={prestige}
                            className="ml-4 px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase text-xs rounded shadow-[0_0_15px_rgba(234,179,8,0.6)] animate-pulse transition-transform active:scale-95"
                        >
                            PRESTIGE
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 overflow-hidden">
                <CoinMat />
                <StorePanel />
            </main>

            {/* Footer */}
            <footer className="bg-black text-[10px] px-4 py-1 flex justify-between items-center text-white/40 font-bold uppercase tracking-widest border-t border-white/5 shrink-0">
                <div className="flex gap-4">
                    <span>Session: 00h 00m</span>
                    <span className="text-primary">Server: Local</span>
                </div>
                <div className="flex gap-4">
                    <span>Version: 0.1.0</span>
                </div>
            </footer>

        </div>
    );
}
