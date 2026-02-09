import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import Coin from '../Coin/Coin';

export default function CoinMat() {
    const { slots, maxSlots } = useStore();

    return (
        <section className="relative flex-1 p-8 felt-texture flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

            <div className="mb-8 text-center z-10 w-full">
                <h2 className="text-white/60 uppercase tracking-[0.4em] text-xs font-bold mb-2">The Workbench</h2>
                <div className="h-1 w-24 bg-primary mx-auto rounded-full shadow-[0_0_10px_#0df20d]"></div>
            </div>

            <div className={clsx(
                "grid gap-4 sm:gap-8 w-full z-10 transition-all duration-300 px-4 place-items-center",
                maxSlots <= 1 ? "grid-cols-1" :
                    maxSlots <= 4 ? "grid-cols-2" :
                        maxSlots <= 9 ? "grid-cols-3" :
                            "grid-cols-4 xl:grid-cols-5" // Added xl breakpoint
            )}>
                {slots.map((slot) => (
                    <Coin
                        key={slot.id}
                        slotId={slot.id}
                        coinType={slot.coinType}
                    />
                ))}

                {/* Fill remaining slots with "Locked" indicators if we want to show capacity */}
                {/* For now, we only render what is in 'slots' array. */}
            </div>
        </section>
    );
}
