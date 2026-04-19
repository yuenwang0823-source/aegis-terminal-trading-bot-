"use client";
import React, { useState, useEffect } from 'react';

export default function AegisTerminal() {
  // 設定初始價格為 22500 (對應台股大盤規模)
  const [price, setPrice] = useState(22584);
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Terminal v2.0 Initialized..."]);

  // 模擬即時跳動
  useEffect(() => {
    const timer = setInterval(() => {
      setPrice(p => p + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) : -Math.floor(Math.random() * 5)));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // 按鈕功能函數
  const handleTrade = (type: 'BUY' | 'SELL') => {
    const time = new Date().toLocaleTimeString();
    const message = `[${time}] ${type} ORDER: ${shares} units at ${price}`;
    setLogs(prev => [message, ...prev].slice(0, 5));
    alert(`${type} 成功！\n價格: ${price}\n數量: ${shares}`);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* 標題欄 */}
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🛡️ AEGIS TACTICAL TRADING TERMINAL</h1>
        <span style={{ fontSize: '12px', color: '#888' }}>SECURE LINK ESTABLISHED // DEPLOYMENT: VERCEL</span>
      </div>

      {/* 價格顯示區 */}
      <div style={{ background: '#110000', padding: '30px', border: '1px solid #440000', borderRadius: '5px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>TW STOCK INDEX / REAL-TIME FEED</div>
        <div style={{ fontSize: '56px', fontWeight: 'bold', letterSpacing: '2px' }}>
          {price.toLocaleString()}
        </div>
      </div>

      {/* 控制區 */}
      <div style={{ marginTop: '20px' }}>
        <label>ORDER SIZE: {shares} SHARES</label>
        <input 
          type="range" min="1000" max="50000" step="1000" 
          value={shares} 
          onChange={(e) => setShares(Number(e.target.value))}
          style={{ width: '100%', marginTop: '10px', accentColor: '#ff3333' }} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
          <button 
            onClick={() => handleTrade('BUY')}
            style={{ background: '#ff3333', color: '#000', border: 'none', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            EXECUTE BUY
          </button>
          <button 
            onClick={() => handleTrade('SELL')}
            style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            EXECUTE SELL
          </button>
        </div>
      </div>

      {/* 終端日誌區 */}
      <div style={{ marginTop: '30px', background: '#0a0a0a', padding: '15px', border: '1px solid #222', height: '120px', overflowY: 'hidden' }}>
        <div style={{ color: '#666', fontSize: '12px', marginBottom: '5px' }}>TERMINAL LOGS:</div>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '12px', marginBottom: '2px' }}>{log}</div>
        ))}
      </div>
    </div>
  );
}

