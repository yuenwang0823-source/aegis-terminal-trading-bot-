"use client";
import React, { useState, useEffect } from 'react';

export default function AegisTerminal() {
  const [price, setPrice] = useState<number>(2050.5); 
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Terminal v4.1 Active..."]);
  const [isRealTime, setIsRealTime] = useState(false);

  // ⚠️ 金鑰已修正，去除了換行與錯誤判斷
  const FUGLE_API_KEY = "MjEzM2FiZTMtNTFiMy00ZGFiLWExNzUtZWE4YWYxNWEyZTYwIDZiNDU5MzVkLWM0YTUtNDk1NS04ZWVlLTUwMjUyYWUzMTU3MQ=="; 

  useEffect(() => {
    const fetchStockData = async () => {
      // 只要金鑰長度夠，就嘗試對接
      if (FUGLE_API_KEY && FUGLE_API_KEY.length > 20) {
        try {
          const res = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
            method: 'GET',
            headers: { 
              'X-API-KEY': FUGLE_API_KEY,
              'Accept': 'application/json'
            }
          });
          const data = await res.json();
          
          // 如果富果有回傳 lastPrice，就更新它
          if (data && data.lastPrice) {
            setPrice(data.lastPrice);
            setIsRealTime(true);
            return; 
          } else {
            console.warn("API 沒報錯，但沒拿到價格 (可能非開盤時間):", data);
          }
        } catch (err) {
          console.error("網路連線失敗");
        }
      }
      
      // 沒抓到真數據時的模擬跳動
      setPrice(p => p + (Math.random() > 0.5 ? 0.2 : -0.2));
    };

    fetchStockData();
    const timer = setInterval(fetchStockData, isRealTime ? 10000 : 3000);
    return () => clearInterval(timer);
  }, [isRealTime]); // 移除 FUGLE_API_KEY 依賴以穩定編譯

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const time = new Date().toLocaleTimeString();
    const msg = `[${time}] ${type} EXECUTED: ${shares} units @ ${price.toFixed(1)}`;
    setLogs(prev => [msg, ...prev].slice(0, 5));
    alert(`⚡ AEGIS 指令確認\n動作: ${type}\n價格: ${price.toFixed(1)}\n數量: ${shares}`);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🛡️ AEGIS TERMINAL</h1>
          <span style={{ fontSize: '12px', color: isRealTime ? '#00ff00' : '#ffaa00' }}>
            {isRealTime ? "● REAL-TIME LINKED" : "○ SIMULATED FEED"}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>2330 TSMC</div>
        </div>
      </div>

      <div style={{ background: '#110000', padding: '50px 20px', border: '1px solid #440000', borderRadius: '10px', textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '15px' }}>MARKET QUOTE (TWD)</div>
        <div style={{ fontSize: '80px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 15px #ff3333' }}>
          {price.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label>QTY: {shares} SHARES</label>
        </div>
        <input 
          type="range" min="1000" max="100000" step="1000" 
          value={shares} 
          onChange={(e) => setShares(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#ff3333', marginBottom: '40px', cursor: 'pointer' }} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button onClick={() => handleTrade('BUY')} style={{ background: '#ff3333', color: '#000', border: 'none', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>EXECUTE BUY</button>
          <button onClick={() => handleTrade('SELL')} style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>EXECUTE SELL</button>
        </div>
      </div>

      <div style={{ marginTop: '40px', background: '#050505', padding: '15px', border: '1px solid #222' }}>
        <div style={{ color: '#444', fontSize: '12px', marginBottom: '10px' }}>SYSTEM LOGS //</div>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '12px', color: i === 0 ? '#ff3333' : '#666', marginBottom: '5px' }}>{log}</div>
        ))}
      </div>
    </div>
  );
}

