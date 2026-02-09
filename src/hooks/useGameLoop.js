import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { flipCoin } from '../utils/gameLogic';
import { TOOLS } from '../utils/gameData';
import { playSound } from '../utils/sound'; // We might want to throttle sound for automation

export function useGameLoop() {
    const {
        slots,
        tools,
        setSlotFlipping,
        addMoney,
        recordFlip,
        getStatsModifiers,
        updateSlotCoin
    } = useStore();

    // Refs for mutable state in loop
    const lastTimeRef = useRef(0);
    const accumulatorsRef = useRef({}); // Store time for each tool type

    useEffect(() => {
        let animationFrameId;

        const loop = (timestamp) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const dt = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            // --- Automation Logic ---
            Object.values(TOOLS).forEach(tool => {
                const count = tools[tool.id] || 0;
                if (count === 0) return;

                // Initialize accumulator
                if (!accumulatorsRef.current[tool.id]) accumulatorsRef.current[tool.id] = 0;

                // Add time
                // Speed modifier? (Prestige checks later)
                accumulatorsRef.current[tool.id] += dt;

                // Check if ready to trigger
                // If we have multiple, do we trigger multiple times?
                // Logic: 1 Fidget Finger = 1 flip every 5s.
                // 10 Fidget Fingers = 10 flips every 5s? Or 1 flip every 0.5s?
                // PRD Formula: "Cost scales... Production scales linearly"
                // Usually standard incremental is: Rate = BaseRate * Count.
                // Or Interval = BaseInterval / Count.

                // Let's go with: Interval stays same, but we trigger 'Count' times? 
                // Or simpler: We reduce interval.
                // Let's try: Interval = ToolInterval / Count.

                const effectiveInterval = tool.interval / count;

                if (accumulatorsRef.current[tool.id] >= effectiveInterval) {
                    accumulatorsRef.current[tool.id] -= effectiveInterval;

                    // PERFORMANCE: If interval is super low (Quantum Tunneler), 
                    // this loop might run many times per frame. Cap it?
                    // For now, simple trigger.

                    triggerToolAction(tool, slots, {
                        setSlotFlipping,
                        addMoney,
                        recordFlip,
                        getStatsModifiers
                    });
                }
            });

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(animationFrameId);
    }, [slots, tools, setSlotFlipping, addMoney, recordFlip, getStatsModifiers]); // Dependencies
}

// --- Action Logic ---

function triggerToolAction(tool, slots, actions) {
    const { setSlotFlipping, addMoney, recordFlip, getStatsModifiers } = actions;

    // Define targets based on Tool Type
    let targetSlots = [];

    if (tool.type === 'targeted') {
        const targetIndex = tool.target; // e.g. 0
        const slot = slots.find(s => s.id === targetIndex + 1); // slots are 1-based IDs currently
        if (slot) targetSlots.push(slot);
    }
    else if (tool.type === 'random') {
        const randomIndex = Math.floor(Math.random() * slots.length);
        targetSlots.push(slots[randomIndex]);
    }
    else if (tool.type === 'row') {
        // Mock row logic: First 4 slots?
        const rowSize = 2; // 2x2 grid start
        // For 'rows', let's just grab first 2 for now
        targetSlots = slots.slice(0, 2);
    }
    else if (tool.type === 'all') {
        targetSlots = slots;
    }

    // Execute Flip on Targets
    targetSlots.forEach(slot => {
        if (slot.isFlipping) return; // Busy

        // Trigger Visual (Optional, might be too chaotic for 'all')
        setSlotFlipping(slot.id, true);

        // Immediate Result (No wait for animation in automation? Or fast animation?)
        // If we wait for visual, we limit CPS by animation speed (0.6s).
        // For "Quantum Tunneler" (100x/sec), visuals must be decoupled.
        // For MVP: Let's trigger visual and logic same time, but allow overlap?
        // No, current `Coin` component blocks if `isFlipping` is true.

        // MVP Solution: Automation respects animation time.
        // This naturally caps CPS. 
        // We will need a "Fast Flip" mode later.

        // Let's Run logic immediately:
        const stats = getStatsModifiers();
        const flipResult = flipCoin(slot.coinType || 'penny', stats);

        // Sound? Throttle it.
        // playSound(flipResult.result); 

        // Update State
        if (flipResult.result === 'heads') {
            addMoney(flipResult.value);
        }
        recordFlip(flipResult.result);

        // Reset visual after timeout (simulating the component logic)
        // Actually, the Component handles the timeout if we set `isFlipping`.
        // But the Component `useEffect` isn't setting it back to false automatically?
        // The Component sets it false on `handleFlip`.
        // We need the Component to react to `isFlipping` state change if we control it here.

        // Wait, `Coin.jsx` has `onClick` -> `handleFlip` -> `setSlotFlipping(true)`.
        // It uses a local ref `isFlipping` to block clicks.
        // It uses a `setTimeout` to set `setSlotFlipping(false)`.

        // If we set `isFlipping` true from here, the Component needs to start animation?
        // Currently `Coin.jsx` triggers animation on Click.
        // It DOES check `isFlipping` prop? No, `isFlipping` is a ref inside Coin.
        // `useStore` has `slots[].isFlipping`.
        // `Coin.jsx` reads `setSlotFlipping`.

        // Refactor required: Coin component should watch `props.isFlipping` (from store) 
        // and trigger animation if it changes to true.

        // For now, strictly math:
        // We just add money. Visuals won't trigger. 
        // This is "Ghost Flipping".
        // To fix visuals, we need to refactor Coin.jsx to `useEffect(() => { if (slot.isFlipping) animate... }, [slot.isFlipping])`

        // Let's implement Ghost Flipping first (Money works), 
        // and add a TODO to sync visuals.
    });
}
