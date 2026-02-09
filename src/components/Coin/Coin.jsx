import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useStore } from '../../store/useStore';
import { flipCoin } from '../../utils/gameLogic';
import { playSound } from '../../utils/sound';
import { COINS } from '../../utils/gameData';

// Helper Map for Styling (Could be moved to utils/styles)
const COIN_STYLES = {
    penny: {
        bg: "bg-gradient-to-br from-amber-600 to-amber-800",
        border: "border-amber-900",
        edge: "bg-amber-900",
        text: "text-amber-100",
        symbol: "1¢",
        icon: "monetization_on",
        iconColor: "text-amber-900/50"
    },
    nickel: {
        bg: "bg-gradient-to-br from-slate-300 to-slate-500",
        border: "border-slate-600",
        edge: "bg-slate-600",
        text: "text-slate-800",
        symbol: "5¢",
        icon: "stars",
        iconColor: "text-slate-600/50"
    },
    dime: {
        bg: "bg-gradient-to-br from-gray-200 to-gray-400",
        border: "border-gray-500",
        edge: "bg-gray-500",
        text: "text-gray-700",
        symbol: "10¢",
        icon: "toll",
        iconColor: "text-gray-500/50"
    },
    quarter: {
        bg: "bg-gradient-to-br from-gray-100 to-gray-300",
        border: "border-gray-400",
        edge: "bg-gray-400",
        text: "text-gray-900",
        symbol: "25¢",
        icon: "local_laundry_service",
        iconColor: "text-gray-400/50"
    },
    default: {
        bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
        border: "border-yellow-700",
        edge: "bg-yellow-700",
        text: "text-yellow-900",
        symbol: "$",
        icon: "payments",
        iconColor: "text-yellow-800/50"
    }
};

export default function Coin({ slotId, coinType }) {
    const { setSlotFlipping, addMoney, recordFlip, getStatsModifiers, slots } = useStore();

    const slotState = slots.find(s => s.id === slotId);
    const isFlippingFromStore = slotState?.isFlipping || false;

    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState(null);
    const [displayValue, setDisplayValue] = useState(null);
    const [bounceScale, setBounceScale] = useState(1);

    const isAnimating = useRef(false);
    const style = COIN_STYLES[coinType] || COIN_STYLES.default;
    const coinName = COINS[coinType]?.name || "Coin";

    // Trigger Animation
    useEffect(() => {
        if (isFlippingFromStore && !isAnimating.current) {
            performFlip();
        }
    }, [isFlippingFromStore]);

    const performFlip = () => {
        isAnimating.current = true;
        setResult(null);
        setDisplayValue(null);

        // Calculate
        const flipResult = flipCoin(coinType || 'penny', getStatsModifiers());

        // Animate Rotation
        // We want to land on 0 (Heads) or 180 (Tails) modulo 360.
        const spins = 4 * 360; // 4 full spins
        // Add randomness to spin duration? No, sync with logic.

        let target = rotation + spins;
        const isTargetHeads = target % 360 === 0;
        const wantHeads = flipResult.result === 'heads';

        if (wantHeads && !isTargetHeads) target += 180;
        else if (!wantHeads && isTargetHeads) target += 180;

        setRotation(target);

        // Bounce Effect (Scale up then down)
        setBounceScale(1.3);

        setTimeout(() => {
            isAnimating.current = false;
            setBounceScale(1); // Land

            playSound(flipResult.result);

            if (flipResult.result === 'heads') {
                addMoney(flipResult.value);
                setDisplayValue(flipResult.value);
            }
            recordFlip(flipResult.result);
            setSlotFlipping(slotId, false);
            setResult(flipResult.result);

        }, 700); // 0.7s duration
    };

    const handleManualClick = () => {
        if (isAnimating.current) return;
        setSlotFlipping(slotId, true);
    };

    return (
        <div className="relative group select-none flex flex-col items-center justify-center p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer" onClick={handleManualClick}>

            {/* Floating Text */}
            <AnimatePresence>
                {displayValue && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -60, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute -top-10 z-20 pointer-events-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                    >
                        <div className="text-primary font-black text-3xl tracking-tighter">
                            +${displayValue.toFixed(2)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shadow Base (Scales with coin bounce) */}
            <motion.div
                className={clsx(
                    "absolute bottom-8 w-24 h-6 bg-black/40 rounded-[100%] blur-sm transition-all duration-300",
                    result === 'heads' ? "shadow-[0_0_20px_#0df20d]" : ""
                )}
                animate={{
                    scale: isAnimating.current ? 0.5 : 1,
                    opacity: isAnimating.current ? 0.2 : 0.6
                }}
            />

            {/* 3D Coin Container */}
            <div
                className="w-32 h-32 relative"
                style={{ perspective: '1200px' }}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{
                        rotateX: rotation,
                        y: isAnimating.current ? [0, -120, 0] : 0 // Jump Arc
                    }}
                    transition={{
                        rotateX: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
                        y: { duration: 0.7, times: [0, 0.5, 1], ease: "easeOut" }
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* THICKNESS LAYERS (Stacked behind front face) */}
                    {[1, 2, 3, 4, 5].map(i => (
                        <div
                            key={i}
                            className={clsx("absolute inset-0 rounded-full", style.edge)}
                            style={{ transform: `translateZ(-${i}px)` }}
                        />
                    ))}

                    {/* FRONT FACE (Heads) */}
                    <div
                        className={clsx(
                            "absolute inset-0 rounded-full border-[6px] shadow-inner flex items-center justify-center backface-hidden",
                            style.bg,
                            style.border
                        )}
                        style={{ transform: 'translateZ(1px)' }}
                    >
                        {/* Inner Ring */}
                        <div className="absolute inset-1 rounded-full border-2 border-white/20" />

                        <span className={clsx("material-symbols-outlined scale-[3] rotate-12 absolute -right-2 -bottom-2", style.iconColor)}>
                            {style.icon}
                        </span>
                        <div className={clsx("font-black text-4xl drop-shadow-md z-10", style.text)}>
                            {style.symbol}
                        </div>
                    </div>

                    {/* BACK FACE (Tails) */}
                    <div
                        className={clsx(
                            "absolute inset-0 rounded-full border-[6px] shadow-inner flex items-center justify-center backface-hidden",
                            "bg-gradient-to-br from-slate-600 to-slate-800 border-slate-900"
                        )}
                        style={{ transform: 'rotateX(180deg) translateZ(1px)' }}
                    >
                        <div className="absolute inset-2 rounded-full border border-white/10" />
                        <span className="material-symbols-outlined text-white/30 text-6xl">close</span>
                    </div>

                </motion.div>
            </div>

            {/* Label */}
            <p className="mt-6 text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                {coinName} #{slotId}
            </p>
        </div>
    );
}
