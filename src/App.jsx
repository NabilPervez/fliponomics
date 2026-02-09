import { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

// COIN DEFINITIONS
const COINS = {
  penny: { name: 'Penny', value: 0.01, cost: 0, symbol: '1¢', flavor: 'Find a penny, pick it up.' },
  nickel: { name: 'Nickel', value: 0.05, cost: 1, symbol: '5¢', flavor: 'Five times the copper. Sort of.' },
  dime: { name: 'Dime', value: 0.10, cost: 5, symbol: '10¢', flavor: 'Smaller, yet more valuable. Economics is weird.' },
  quarter: { name: 'Quarter', value: 0.25, cost: 20, symbol: '25¢', flavor: 'The laundry machine standard.' },
  loonie: { name: 'Loonie', value: 1.00, cost: 100, symbol: '$1', flavor: 'A golden bird from the north.' },
  chip: { name: 'Casino Chip', value: 5.00, cost: 500, symbol: '$5', flavor: 'The house always wins. Now you are the house.' },
  doubloon: { name: 'Gold Doubloon', value: 50.00, cost: 5000, symbol: '$50', flavor: 'Yarr! Genuine pirate treasure.' },
  bitcoin: { name: 'Bitcoin', value: 35000, cost: 1000000, symbol: '₿', flavor: 'Volatile, but digital.' }
};

// SPACE UPGRADES
const SPACE_UPGRADES = [
  { id: 'space1', name: 'Mousepad', slots: 2, cost: 3, description: 'Double the friction, double the fun.' },
  { id: 'space2', name: 'Cafeteria Tray', slots: 4, cost: 30, description: 'Smells like old french fries, fits 4 coins.' },
  { id: 'space3', name: 'Card Table', slots: 8, cost: 250, description: 'Felt surface for professional action.' },
  { id: 'space4', name: 'Craps Table', slots: 16, cost: 3000, description: 'High stakes require high surface area.' },
  { id: 'space5', name: 'Server Rack', slots: 32, cost: 100000, description: 'Digitized flipping slots. High density.' }
];

// AUTOMATION TOOLS
const TOOLS = [
  { id: 'tool1', name: 'Fidget Finger', description: 'Flips Slot #1 every 5s', interval: 5000, cost: 10, flavor: 'Good for early game.', target: 'slot0' },
  { id: 'tool2', name: 'Drinking Bird', description: 'Flips Random Slot every 2s', interval: 2000, cost: 50, flavor: 'It bobs for water, hits a coin.', target: 'random' },
  { id: 'tool3', name: "Dealer's Hand", description: 'Flips Row #1 every 3s', interval: 3000, cost: 200, flavor: 'Efficient for Card Tables.', target: 'row1' },
  { id: 'tool4', name: 'Industrial Fan', description: 'Flips ALL slots every 4s', interval: 4000, cost: 1000, flavor: 'Brute force wind power.', target: 'all' },
  { id: 'tool5', name: 'Mechanical Arm', description: 'Flips ALL slots every 2s', interval: 2000, cost: 5000, flavor: 'Precision robotics.', target: 'all' },
  { id: 'tool6', name: 'Tesla Coil', description: 'Flips ALL slots every 1s', interval: 1000, cost: 20000, flavor: 'Electromagnetic acceleration.', target: 'all' },
  { id: 'tool7', name: 'Time Dilator', description: 'Flips ALL slots 5/s', interval: 200, cost: 50000, flavor: 'Bends time locally.', target: 'all' },
  { id: 'tool8', name: 'Quantum Tunneler', description: 'Flips ALL slots 10/s', interval: 100, cost: 100000, flavor: 'The endgame engine.', target: 'all' }
];

// UPGRADES
const UPGRADES = [
  { id: 'luck1', name: 'Weighted Zinc', description: '+5% Heads chance', cost: 20, effect: 'luck', value: 5, flavor: 'Illegal in 12 states.' },
  { id: 'luck2', name: 'Magnet Core', description: '+8% Heads chance', cost: 500, effect: 'luck', value: 8, flavor: 'Attracts success.' },
  { id: 'luck3', name: 'Insider Trading', description: '+10% Heads chance', cost: 2000, effect: 'luck', value: 10, flavor: 'You know the result before it lands.' },
  { id: 'mult1', name: 'Polished Edges', description: '+10% Coin Value', cost: 100, effect: 'multiplier', value: 0.1, flavor: 'Aerodynamic coins earn more.' },
  { id: 'mult2', name: 'Gold Plating', description: '+25% Coin Value', cost: 2000, effect: 'multiplier', value: 0.25, flavor: 'Everything is better gold-plated.' },
  { id: 'mult3', name: 'Diamond Coating', description: '+50% Coin Value', cost: 10000, effect: 'multiplier', value: 0.5, flavor: 'Luxury compounds interest.' },
  { id: 'crit1', name: 'Lucky Clover', description: '+1% Critical chance', cost: 150, effect: 'critical', value: 1, flavor: 'Landing on the edge pays 100x.' },
  { id: 'crit2', name: 'Rabbit Foot', description: '+2% Critical chance', cost: 1000, effect: 'critical', value: 2, flavor: 'Luck intensifies.' },
  { id: 'crit3', name: 'Four-Leaf Charm', description: '+3% Critical chance', cost: 5000, effect: 'critical', value: 3, flavor: 'Extremely rare fortune.' },
  { id: 'pity1', name: 'Floor Mats', description: 'Tails pays 10% value', cost: 400, effect: 'pity', value: 0.1, flavor: 'Missed clicks give 10% value.' },
  { id: 'pity2', name: 'Safety Net', description: 'Tails pays 25% value', cost: 3000, effect: 'pity', value: 0.25, flavor: 'Even failure pays.' },
  { id: 'speed1', name: 'Caffeine Pills', description: 'Base auto-flip 25% faster', cost: 800, effect: 'speed', value: 0.25, flavor: 'Jittery but effective.' },
  { id: 'speed2', name: 'Overclock Module', description: 'Base auto-flip 50% faster', cost: 5000, effect: 'speed', value: 0.5, flavor: 'WARNING: May void warranty.' }
];

function App() {
  // Load state from local storage or use default
  const loadState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state', e);
        return defaultValue;
      }
    }
    return defaultValue;
  };

  const [bank, setBank] = useState(() => loadState('bank', 0));
  const [slots, setSlots] = useState(() => loadState('slots', [{ id: 1, coin: 'penny', flipping: false }]));
  const [unlockedCoins, setUnlockedCoins] = useState(() => loadState('unlockedCoins', ['penny']));
  const [ownedSpaces, setOwnedSpaces] = useState(() => loadState('ownedSpaces', []));
  const [ownedTools, setOwnedTools] = useState(() => loadState('ownedTools', []));
  const [ownedUpgrades, setOwnedUpgrades] = useState(() => loadState('ownedUpgrades', []));
  const [activeTab, setActiveTab] = useState('coins');
  const [cps, setCps] = useState(0);
  const [stats, setStats] = useState(() => loadState('stats', { totalFlips: 0, totalEarned: 0, successfulFlips: 0, totalAttempts: 0 }));
  const [selectedCoinForSlot, setSelectedCoinForSlot] = useState(null);
  const [achievements, setAchievements] = useState(() => loadState('achievements', []));
  const [notifications, setNotifications] = useState([]);

  // Save state to local storage
  useEffect(() => {
    localStorage.setItem('bank', JSON.stringify(bank));
    localStorage.setItem('slots', JSON.stringify(slots));
    localStorage.setItem('unlockedCoins', JSON.stringify(unlockedCoins));
    localStorage.setItem('ownedSpaces', JSON.stringify(ownedSpaces));
    localStorage.setItem('ownedTools', JSON.stringify(ownedTools));
    localStorage.setItem('ownedUpgrades', JSON.stringify(ownedUpgrades));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [bank, slots, unlockedCoins, ownedSpaces, ownedTools, ownedUpgrades, stats, achievements]);

  const floatNumbersRef = useRef([]);
  const audioContextRef = useRef(null);
  // Force re-render for floating numbers
  const [, setTick] = useState(0);

  // Achievement definitions
  const ACHIEVEMENTS = [
    { id: 'first_dollar', name: 'First Dollar', description: 'Earn $1', check: (s) => s.totalEarned >= 1 },
    { id: 'hundred_flips', name: 'Century Club', description: '100 flips', check: (s) => s.totalFlips >= 100 },
    { id: 'thousand_flips', name: 'Flip Master', description: '1,000 flips', check: (s) => s.totalFlips >= 1000 },
    { id: 'lucky_streak', name: 'Lucky Streak', description: '75% success rate with 100+ flips', check: (s) => s.totalAttempts >= 100 && (s.successfulFlips / s.totalAttempts) >= 0.75 },
    { id: 'big_money', name: 'High Roller', description: 'Earn $1,000', check: (s) => s.totalEarned >= 1000 },
    { id: 'mega_money', name: 'Tycoon', description: 'Earn $100,000', check: (s) => s.totalEarned >= 100000 }
  ];

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    // Animation loop for floating numbers
    const loop = () => {
      setTick(t => t + 1);
      requestAnimationFrame(loop);
    };
    const loopId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopId);
  }, []);

  // Check for achievements
  useEffect(() => {
    ACHIEVEMENTS.forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.check(stats)) {
        setAchievements(prev => [...prev, achievement.id]);
        showNotification(`🏆 ${achievement.name}`, achievement.description);
        playSound(880, 0.5, true);
      }
    });
  }, [stats, achievements]);

  // Show notification
  const showNotification = useCallback((title, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, title, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  // Play sound
  const playSound = useCallback((frequency, duration, isWin) => {
    if (!audioContextRef.current) return;

    // Check if context is suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = isWin ? 'sine' : 'triangle';

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  // Show floating number
  const showFloatingNumber = useCallback((value, x, y, isHeads, isCritical = false) => {
    const id = Date.now() + Math.random();
    const newFloat = {
      id,
      value,
      x,
      y,
      isHeads,
      isCritical
    };

    floatNumbersRef.current = [...floatNumbersRef.current, newFloat];

    setTimeout(() => {
      floatNumbersRef.current = floatNumbersRef.current.filter(f => f.id !== id);
    }, 1500);
  }, []);

  // Calculate critical chance bonus
  const getCriticalBonus = useCallback(() => {
    return ownedUpgrades.reduce((total, upgradeId) => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      return upgrade?.effect === 'critical' ? total + upgrade.value : total;
    }, 0);
  }, [ownedUpgrades]);

  // Calculate speed bonus
  const getSpeedBonus = useCallback(() => {
    return ownedUpgrades.reduce((total, upgradeId) => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      return upgrade?.effect === 'speed' ? total + upgrade.value : total;
    }, 0);
  }, [ownedUpgrades]);

  // Calculate luck bonus
  const getLuckBonus = useCallback(() => {
    return ownedUpgrades.reduce((total, upgradeId) => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      return upgrade?.effect === 'luck' ? total + upgrade.value : total;
    }, 0);
  }, [ownedUpgrades]);

  // Calculate multiplier
  const getMultiplier = useCallback(() => {
    return 1 + ownedUpgrades.reduce((total, upgradeId) => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      return upgrade?.effect === 'multiplier' ? total + upgrade.value : total;
    }, 0);
  }, [ownedUpgrades]);

  // Calculate pity value
  const getPityValue = useCallback(() => {
    const pityUpgrade = ownedUpgrades.find(id => {
      const upgrade = UPGRADES.find(u => u.id === id);
      return upgrade?.effect === 'pity';
    });
    if (!pityUpgrade) return 0;
    const upgrade = UPGRADES.find(u => u.id === pityUpgrade);
    return upgrade?.value || 0;
  }, [ownedUpgrades]);

  // Flip a coin
  const flipCoin = useCallback((slotIndex) => {
    const slot = slots[slotIndex];
    if (!slot || slot.flipping || !slot.coin) return;

    // Set flipping state
    setSlots(prev => prev.map((s, i) =>
      i === slotIndex ? { ...s, flipping: true } : s
    ));

    setTimeout(() => {
      // Need to access latest state for calculations
      // Since this timeout runs later, we need to be careful with closure captures.
      // The easiest way is to use refs or just accept that we use the closure values from when flipCoin was called.
      // However, flipCoin depends on [getLuckBonus] etc which depend on [ownedUpgrades].
      // If ownedUpgrades changes while flipping, it might be stale?
      // Actually, flipCoin is re-created when dependencies change.
      // But the setTimeout closure will capture the dependencies from when it was called. This is generally fine.

      const coin = COINS[slot.coin];
      const luckBonus = getLuckBonus();
      const multiplier = getMultiplier();
      const pityValue = getPityValue();
      const critBonus = getCriticalBonus();

      const roll = Math.random() * 100;
      const headsChance = 50 + luckBonus;
      const criticalChance = 1 + critBonus;

      let earnedValue = 0;
      let isCritical = false;
      let isHeads = false;

      if (roll < criticalChance) {
        // CRITICAL HIT - Edge landing
        isCritical = true;
        isHeads = true;
        earnedValue = coin.value * 100 * multiplier;
        playSound(880, 0.3, true);
        createConfetti();
      } else if (roll < headsChance) {
        // HEADS
        isHeads = true;
        earnedValue = coin.value * multiplier;
        playSound(660, 0.15, true);
      } else {
        // TAILS
        earnedValue = coin.value * pityValue * multiplier;
        playSound(220, 0.1, false);
      }

      setBank(prev => prev + earnedValue);
      setStats(prev => ({
        totalFlips: prev.totalFlips + 1,
        totalEarned: prev.totalEarned + earnedValue,
        successfulFlips: isHeads ? prev.successfulFlips + 1 : prev.successfulFlips,
        totalAttempts: prev.totalAttempts + 1
      }));

      // Show floating number
      const slotElement = document.querySelectorAll('.coin-slot')[slotIndex];
      if (slotElement) {
        const rect = slotElement.getBoundingClientRect();
        showFloatingNumber(
          earnedValue,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          isHeads,
          isCritical
        );
      }

      // Reset flipping state
      setSlots(prev => prev.map((s, i) =>
        i === slotIndex ? { ...s, flipping: false } : s
      ));
    }, 600);
  }, [slots, getLuckBonus, getMultiplier, getPityValue, getCriticalBonus, playSound, showFloatingNumber]);

  // AUTO-FLIP ALL COINS - Start flipping automatically
  useEffect(() => {
    const speedBonus = getSpeedBonus();
    const baseInterval = 1000;
    const adjustedInterval = baseInterval / (1 + speedBonus);

    const autoFlip = setInterval(() => {
      setSlots(currentSlots => {
        // We need access to flipCoin, but flipCoin changes. 
        // However, we can't easily call flipCoin inside this state updater without risk.
        // Instead, we iterate.
        // To avoid infinite loops or stale closures, we can just trigger flips.
        // But `slots` is a dependency of `flipCoin`.
        // If we put `slots` in dependency array, interval resets every time slots change (which is often).
        // We should use a ref for the interval or just let it reset?
        // The current structure resets interval on slots change. That's actually OK as long as it's not too jagged.
        return currentSlots;
      });
      // Actually, the original code had `slots` in dependency array.
      // So every time slot flips, interval resets.
      // This effectively delays auto-flips if manual flipping happens constantly.
      // Let's keep it as is.
      slots.forEach((slot, index) => {
        if (!slot.flipping) {
          setTimeout(() => flipCoin(index), index * 100);
        }
      });
    }, adjustedInterval);

    return () => clearInterval(autoFlip);
  }, [slots, flipCoin, getSpeedBonus]);

  // SPACEBAR TO FLIP ALL COINS
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        slots.forEach((slot, index) => {
          if (!slot.flipping) {
            setTimeout(() => flipCoin(index), index * 50);
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slots, flipCoin]);

  // Auto-flippers
  useEffect(() => {
    const intervals = [];

    ownedTools.forEach(toolId => {
      const tool = TOOLS.find(t => t.id === toolId);
      if (!tool) return;

      const interval = setInterval(() => {
        if (tool.target === 'all') {
          // Flip all coins
          slots.forEach((_, index) => {
            setTimeout(() => flipCoin(index), index * 50);
          });
        } else if (tool.target === 'slot0') {
          // Flip only slot 0
          if (slots[0]) flipCoin(0);
        } else if (tool.target === 'random') {
          // Flip random coin
          const randomIndex = Math.floor(Math.random() * slots.length);
          flipCoin(randomIndex);
        } else if (tool.target === 'row1') {
          // Flip first row (up to 4 coins)
          const rowSize = Math.min(4, slots.length);
          for (let i = 0; i < rowSize; i++) {
            setTimeout(() => flipCoin(i), i * 50);
          }
        }
      }, tool.interval);

      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [ownedTools, slots, flipCoin]);

  // Calculate CPS
  useEffect(() => {
    const headsChance = (50 + getLuckBonus()) / 100;
    const multiplier = getMultiplier();
    const speedBonus = getSpeedBonus();

    let totalCps = 0;

    // Base auto-flip (affected by speed upgrades)
    const baseFlipsPerSecond = 1 * (1 + speedBonus);
    const baseValue = slots.reduce((sum, slot) => {
      const coin = COINS[slot.coin];
      return sum + coin.value * headsChance * multiplier;
    }, 0);
    totalCps += baseValue * baseFlipsPerSecond;

    ownedTools.forEach(toolId => {
      const tool = TOOLS.find(t => t.id === toolId);
      if (!tool) return;

      const flipsPerSecond = 1000 / tool.interval;
      let coinsFlipped = 0;

      if (tool.target === 'all') {
        coinsFlipped = slots.length;
      } else if (tool.target === 'slot0') {
        coinsFlipped = slots[0] ? 1 : 0;
      } else if (tool.target === 'random') {
        coinsFlipped = 1;
      } else if (tool.target === 'row1') {
        coinsFlipped = Math.min(4, slots.length);
      }

      const avgValue = slots.reduce((sum, slot) => {
        const coin = COINS[slot.coin];
        return sum + coin.value * headsChance * multiplier;
      }, 0) / slots.length;

      totalCps += flipsPerSecond * coinsFlipped * avgValue;
    });

    setCps(totalCps);
  }, [ownedTools, slots, getLuckBonus, getMultiplier, getSpeedBonus]);

  // Buy coin
  const buyCoin = useCallback((coinType) => {
    const coin = COINS[coinType];
    if (bank >= coin.cost && !unlockedCoins.includes(coinType)) {
      setBank(prev => prev - coin.cost);
      setUnlockedCoins(prev => [...prev, coinType]);
      createConfetti();
      playSound(880, 0.3, true);
    }
  }, [bank, unlockedCoins, playSound]);

  // Buy space
  const buySpace = useCallback((spaceId) => {
    const space = SPACE_UPGRADES.find(s => s.id === spaceId);
    if (!space || bank < space.cost || ownedSpaces.includes(spaceId)) return;

    setBank(prev => prev - space.cost);
    setOwnedSpaces(prev => [...prev, spaceId]);

    // Add new slots
    const currentSlots = slots.length;
    const newSlotCount = space.slots - currentSlots;
    if (newSlotCount > 0) {
      const newSlots = Array.from({ length: newSlotCount }, (_, i) => ({
        id: currentSlots + i + 1,
        coin: 'penny',
        flipping: false
      }));
      setSlots(prev => [...prev, ...newSlots]);
    }

    createConfetti();
    playSound(880, 0.3, true);
  }, [bank, ownedSpaces, slots, playSound]);

  // Buy tool
  const buyTool = useCallback((toolId) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool || bank < tool.cost || ownedTools.includes(toolId)) return;

    setBank(prev => prev - tool.cost);
    setOwnedTools(prev => [...prev, toolId]);
    createConfetti();
    playSound(880, 0.3, true);
  }, [bank, ownedTools, playSound]);

  // Buy upgrade
  const buyUpgrade = useCallback((upgradeId) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade || bank < upgrade.cost || ownedUpgrades.includes(upgradeId)) return;

    setBank(prev => prev - upgrade.cost);
    setOwnedUpgrades(prev => [...prev, upgradeId]);
    createConfetti();
    playSound(880, 0.3, true);
  }, [bank, ownedUpgrades, playSound]);

  // Change coin in slot
  const changeCoinInSlot = useCallback((slotIndex, coinType) => {
    setSlots(prev => prev.map((s, i) =>
      i === slotIndex ? { ...s, coin: coinType } : s
    ));
    setSelectedCoinForSlot(null);
  }, []);

  // Handle slot click for coin selection
  const handleSlotClick = useCallback((slotIndex) => {
    if (selectedCoinForSlot) {
      changeCoinInSlot(slotIndex, selectedCoinForSlot);
    } else {
      flipCoin(slotIndex);
    }
  }, [selectedCoinForSlot, changeCoinInSlot, flipCoin]);

  // Confetti
  const createConfetti = useCallback(() => {
    const colors = ['#FFD700', '#00F0FF', '#FF006E', '#00FF00', '#FFA500'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-20px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear forwards`;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
      }, i * 20);
    }
  }, []);

  // Get maximum possible slots based on owned spaces
  const getMaxSlots = useCallback(() => {
    if (ownedSpaces.length === 0) return 1;
    const lastSpace = SPACE_UPGRADES.find(s => s.id === ownedSpaces[ownedSpaces.length - 1]);
    return lastSpace ? lastSpace.slots : 1;
  }, [ownedSpaces]);

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="title-group">
            <h1 className="title">FLIP-O-NOMICS</h1>
            <div className="tagline">The Infinite Mint</div>
          </div>
          <div className="ledger">
            <div className="stat">
              <div className="stat-label">Bank</div>
              <div className="stat-value">{formatCurrency(bank)}</div>
            </div>
            <div className="stat">
              <div className="stat-label">$/Second</div>
              <div className="stat-value">{formatCurrency(cps)}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Success</div>
              <div className="stat-value">{stats.successfulFlips.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Success Rate</div>
              <div className="stat-value">
                {stats.totalAttempts > 0 ? ((stats.successfulFlips / stats.totalAttempts) * 100).toFixed(1) : '0.0'}%
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Total Flips</div>
              <div className="stat-value">{stats.totalFlips.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ width: '1px' }}></div>
        </div>
      </header>

      <main className="main-content">
        <div className="coin-mat">
          {selectedCoinForSlot && (
            <div style={{
              position: 'absolute',
              top: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#FFD700',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              zIndex: 10,
              border: '1px solid #FFD700'
            }}>
              Click a slot to place {COINS[selectedCoinForSlot].name}
            </div>
          )}
          <div className={`coin-grid slots-${Math.max(slots.length, getMaxSlots())}`}>
            {Array.from({ length: getMaxSlots() }).map((_, index) => {
              const slot = slots[index];
              const isLocked = index >= slots.length;

              return (
                <div key={index} className="coin-slot">
                  {slot && slot.coin ? (
                    <>
                      <button
                        className={`coin-button coin-${slot.coin} ${slot.flipping ? 'flipping' : ''} ${selectedCoinForSlot ? 'selecting' : ''}`}
                        onClick={() => handleSlotClick(index)}
                        disabled={slot.flipping && !selectedCoinForSlot}
                      >
                        {COINS[slot.coin].symbol}
                      </button>
                      <div className="coin-label">{COINS[slot.coin].name}</div>
                    </>
                  ) : isLocked ? (
                    <>
                      <div className="empty-slot locked">
                        🔒<br />Locked
                      </div>
                      <div className="coin-label" style={{ opacity: 0.3 }}>Buy Space</div>
                    </>
                  ) : (
                    <>
                      <div
                        className="empty-slot"
                        onClick={() => {
                          if (selectedCoinForSlot) {
                            changeCoinInSlot(index, selectedCoinForSlot);
                          }
                        }}
                      >
                        {selectedCoinForSlot ? 'Click to place' : 'Empty'}
                      </div>
                      <div className="coin-label" style={{ opacity: 0.5 }}>Available</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="shop">
          <div className="shop-tabs">
            <button
              className={`tab-button ${activeTab === 'coins' ? 'active' : ''}`}
              onClick={() => setActiveTab('coins')}
            >
              Coins
            </button>
            <button
              className={`tab-button ${activeTab === 'space' ? 'active' : ''}`}
              onClick={() => setActiveTab('space')}
            >
              Space
            </button>
            <button
              className={`tab-button ${activeTab === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('tools')}
            >
              Tools
            </button>
            <button
              className={`tab-button ${activeTab === 'upgrades' ? 'active' : ''}`}
              onClick={() => setActiveTab('upgrades')}
            >
              Upgrades
            </button>
          </div>

          <div className="shop-items">
            {activeTab === 'coins' && Object.entries(COINS).map(([type, coin]) => {
              const isOwned = unlockedCoins.includes(type);
              const canAfford = bank >= coin.cost;
              const isSelected = selectedCoinForSlot === type;

              return (
                <div
                  key={type}
                  className={`shop-item ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'disabled' : ''}`}
                  style={isSelected ? { borderColor: '#00FF88', background: 'rgba(0, 255, 136, 0.1)' } : {}}
                  onClick={() => {
                    if (isOwned) {
                      setSelectedCoinForSlot(isSelected ? null : type);
                    } else if (canAfford) {
                      buyCoin(type);
                    }
                  }}
                >
                  <div className="item-header">
                    <div className="item-name">{coin.name}</div>
                    {!isOwned && coin.cost > 0 && (
                      <div className={`item-cost ${canAfford ? 'affordable' : 'unaffordable'}`}>
                        {formatCurrency(coin.cost)}
                      </div>
                    )}
                  </div>
                  <div className="item-description">
                    Value: {formatCurrency(coin.value)} per flip
                    {coin.flavor && <><br /><em style={{ opacity: 0.7, fontSize: '0.8rem' }}>{coin.flavor}</em></>}
                  </div>
                  {isOwned && !isSelected && <div className="item-owned-badge">CLICK TO SELECT</div>}
                  {isSelected && <div className="item-owned-badge" style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00FF88', borderColor: '#00FF88' }}>SELECTED ✓</div>}
                </div>
              );
            })}

            {activeTab === 'space' && SPACE_UPGRADES.map(space => {
              const isOwned = ownedSpaces.includes(space.id);
              const canAfford = bank >= space.cost;

              return (
                <div
                  key={space.id}
                  className={`shop-item ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'disabled' : ''}`}
                  onClick={() => !isOwned && buySpace(space.id)}
                >
                  <div className="item-header">
                    <div className="item-name">{space.name}</div>
                    {!isOwned && (
                      <div className={`item-cost ${canAfford ? 'affordable' : 'unaffordable'}`}>
                        {formatCurrency(space.cost)}
                      </div>
                    )}
                  </div>
                  <div className="item-description">
                    Unlocks {space.slots} total coin slots
                    <br />
                    <em style={{ opacity: 0.7, fontSize: '0.8rem' }}>{space.description}</em>
                  </div>
                  {isOwned && <div className="item-owned-badge">OWNED</div>}
                </div>
              );
            })}

            {activeTab === 'tools' && TOOLS.map(tool => {
              const isOwned = ownedTools.includes(tool.id);
              const canAfford = bank >= tool.cost;

              return (
                <div
                  key={tool.id}
                  className={`shop-item ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'disabled' : ''}`}
                  onClick={() => !isOwned && buyTool(tool.id)}
                >
                  <div className="item-header">
                    <div className="item-name">{tool.name}</div>
                    {!isOwned && (
                      <div className={`item-cost ${canAfford ? 'affordable' : 'unaffordable'}`}>
                        {formatCurrency(tool.cost)}
                      </div>
                    )}
                  </div>
                  <div className="item-description">
                    {tool.description}
                    {tool.flavor && <><br /><em style={{ opacity: 0.7, fontSize: '0.8rem' }}>{tool.flavor}</em></>}
                  </div>
                  {isOwned && <div className="item-owned-badge">ACTIVE</div>}
                </div>
              );
            })}

            {activeTab === 'upgrades' && UPGRADES.map(upgrade => {
              const isOwned = ownedUpgrades.includes(upgrade.id);
              const canAfford = bank >= upgrade.cost;

              return (
                <div
                  key={upgrade.id}
                  className={`shop-item ${isOwned ? 'owned' : ''} ${!canAfford && !isOwned ? 'disabled' : ''}`}
                  onClick={() => !isOwned && buyUpgrade(upgrade.id)}
                >
                  <div className="item-header">
                    <div className="item-name">{upgrade.name}</div>
                    {!isOwned && (
                      <div className={`item-cost ${canAfford ? 'affordable' : 'unaffordable'}`}>
                        {formatCurrency(upgrade.cost)}
                      </div>
                    )}
                  </div>
                  <div className="item-description">
                    {upgrade.description}
                    {upgrade.flavor && <><br /><em style={{ opacity: 0.7, fontSize: '0.8rem' }}>{upgrade.flavor}</em></>}
                  </div>
                  {isOwned && <div className="item-owned-badge">ACTIVE</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Numbers */}
        {floatNumbersRef.current.map(float => (
          <div
            key={float.id}
            className={`float-number ${float.isHeads ? 'heads' : 'tails'} ${float.isCritical ? 'critical' : ''}`}
            style={{
              left: `${float.x}px`,
              top: `${float.y}px`
            }}
          >
            {float.isCritical && '🎰 '}
            {formatCurrency(float.value)}
            {float.isCritical && ' CRITICAL!'}
          </div>
        ))}

        {/* Notifications */}
        <div className="notification-container">
          {notifications.map(notif => (
            <div key={notif.id} className="notification">
              <div className="notification-title">{notif.title}</div>
              <div className="notification-message">{notif.message}</div>
            </div>
          ))}
        </div>

        {/* Hotkey Hint */}
        <div className="hotkey-hint">
          Press <kbd>SPACE</kbd> to flip all coins
        </div>
      </main>
    </div>
  );
}

export default App;
