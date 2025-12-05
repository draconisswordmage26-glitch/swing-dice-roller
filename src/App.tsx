import { useState } from 'react';
import './index.css';
import { rollDice, type RollResult } from './diceLogic';

function App() {
  const [numDice, setNumDice] = useState<number>(1000000);
  const [swing, setSwing] = useState<number>(50); // 0-100
  const [dieSize, setDieSize] = useState<number>(6);
  const [result, setResult] = useState<RollResult | null>(null);

  const handleRoll = () => {
    const r = rollDice(numDice, swing / 100, dieSize);
    setResult(r);
  };

  return (
    <>
      <h1>Swing Dice Roller</h1>
      <div className="card">
        <div className="controls">
          <div className="control-group">
            <label>Die Type</label>
            <select
              value={dieSize}
              onChange={(e) => setDieSize(parseInt(e.target.value))}
              style={{
                padding: '0.6em',
                fontSize: '1.2em',
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
          </div>

          <div className="control-group">
            <label>Number of Dice</label>
            <input
              type="number"
              value={numDice}
              onChange={(e) => setNumDice(parseInt(e.target.value) || 0)}
              min="1"
            />
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
              0% = Standard Physics (Always ~{(dieSize + 1) / 2} avg)<br />
              100% = Chaos Mode (Anything can happen)
            </small>
          </div>

          <button onClick={handleRoll}>
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
    </>
  );
}

export default App;
