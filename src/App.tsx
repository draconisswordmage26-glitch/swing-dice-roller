import { useState } from 'react';
import './index.css';
import { rollDice, type RollResult, type DiceGroup } from './diceLogic';

function App() {
  const [diceGroups, setDiceGroups] = useState<DiceGroup[]>([
    { count: 1000000, sides: 6 }
  ]);
  const [swing, setSwing] = useState<number>(50); // 0-100
  const [result, setResult] = useState<RollResult | null>(null);

  // Visual Effects State
  const [isShaking, setIsShaking] = useState(false);
  const [splashText, setSplashText] = useState<{ text: string, type: 'good' | 'bad' } | null>(null);

  const handleRoll = () => {
    // Reset animations
    setIsShaking(false);
    setSplashText(null);

    // Small delay to allow react to reset state if re-rolling quickly
    setTimeout(() => {
      const r = rollDice(diceGroups, swing / 100);
      setResult(r);
      triggerVisuals(r);
    }, 10);
  };

  const triggerVisuals = (r: RollResult) => {
    const tier = r.luckTier;

    // Screenshake for extreme results
    if (["Godly", "Legendary", "Cursed", "Terrible"].includes(tier)) {
      setIsShaking(true);
    }

    // Splash Text
    if (tier === "Godly") {
      setSplashText({ text: "IMPOSSIBLE LUCK!", type: 'good' });
    } else if (tier === "Legendary") {
      setSplashText({ text: "LEGENDARY ROLL!", type: 'good' });
    } else if (tier === "Cursed") {
      setSplashText({ text: "CURSED!", type: 'bad' });
    } else if (tier === "Terrible") {
      setSplashText({ text: "DISASTER!", type: 'bad' });
    }
  };

  const addGroup = () => {
    setDiceGroups([...diceGroups, { count: 1000, sides: 6 }]);
  };

  const removeGroup = (index: number) => {
    const newGroups = [...diceGroups];
    newGroups.splice(index, 1);
    setDiceGroups(newGroups);
  };

  const updateGroup = (index: number, field: keyof DiceGroup, value: number) => {
    const newGroups = [...diceGroups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setDiceGroups(newGroups);
  };

  return (
    <>
      {splashText && (
        <div className={`splash-text ${splashText.type === 'bad' ? 'cursed' : ''}`}>
          {splashText.text}
        </div>
      )}

      <div className={isShaking ? "shake" : ""}>
        <h1>Swing Dice Roller</h1>
        <div className="card">
          <div className="controls">

            <div className="groups-container" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Dice Groups</label>
              {diceGroups.map((group, index) => (
                <div key={index} className="dice-group-row" style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center', justifyContent: 'center' }}>
                  <input
                    type="number"
                    value={group.count}
                    onChange={(e) => updateGroup(index, 'count', parseInt(e.target.value) || 0)}
                    min="1"
                    style={{ width: '100px' }}
                    placeholder="Count"
                  />
                  <select
                    value={group.sides}
                    onChange={(e) => updateGroup(index, 'sides', parseInt(e.target.value))}
                    style={{
                      padding: '0.6em',
                      fontSize: '1em',
                      background: '#333',
                      border: '1px solid #555',
                      color: 'white',
                      borderRadius: '4px',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value={4}>d4</option>
                    <option value={6}>d6</option>
                    <option value={8}>d8</option>
                    <option value={10}>d10</option>
                    <option value={12}>d12</option>
                    <option value={20}>d20</option>
                    <option value={100}>d100</option>
                  </select>
                  <button
                    onClick={() => removeGroup(index)}
                    style={{ padding: '0.6em', background: '#442222', color: '#ffaaaa' }}
                    title="Remove Group"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addGroup} style={{ width: '100%', marginTop: '10px', background: '#2a2a2a' }}>
                + Add Dice Group
              </button>
            </div>

            <div className="control-group">
              <label>Swing Factor: {swing}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={swing}
                onChange={(e) => setSwing(parseInt(e.target.value))}
              />
              <small style={{ color: '#888' }}>
                0% = Standard Physics<br />
                100% = Chaos Mode
              </small>
            </div>

            <button onClick={handleRoll} style={{ fontSize: '1.2em', padding: '0.8em 1.6em' }}>
              ROLL THE DICE
            </button>
          </div>

          {result && (
            <div className="result-display">
              <div className="stat-row">
                <span>Total Sum:</span>
                <span>{result.sum.toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span>Average Die:</span>
                <span>{result.average.toFixed(4)}</span>
              </div>
              <div className="stat-row">
                <span>Luck Tier:</span>
                <span className="luck-tier">{result.luckTier}</span>
              </div>
              <div className="narrative">
                "{result.narrative}"
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
