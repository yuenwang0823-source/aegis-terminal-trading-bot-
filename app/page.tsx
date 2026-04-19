"use client";
import React, { useState, useEffect } from 'react';

export default function AegisTerminal() {
  // 1. 這裡預設改成 2050，讓你即便沒接 API 也不會差那一千塊
  const [price, setPrice] = useState<number>(2050); 
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Terminal v3.0 Online..."]);
  const [isRealTime, setIsRealTime] = useState(false);

  // ⚠️ 請在這裡輸入你在富果申請到的真實 API Key (例如 "fugle-xxxxxxx")
  // 沒填這行，數字就永遠是我寫死的模擬價
  const FUGLE_API_KEY = "MjEzM2FiZTMtNTFiMy00ZGFiLWExNzUtZWE4YWYxNWEyZTYwIDZiNDU5MzVkLWM0YTUtNDk1NS04ZWVlLTUwMjUyYWUzMTU3MQ==
"; 

  useEffect(() => {
    const fetchStockData = async () => {
      // 如果你沒填 Key，這段就會直接跳過，改跑下面的模擬跳動
      if (FUGLE_API_KEY && !FUGLE_API_KEY.includes("貼這裡")) {
        try {
          const res = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
            headers: { 'X-API-KEY': FUGLE_API_KEY }
          });
          const data = await res.json();
          if (data.lastPrice) {
            setPrice(data.lastPrice);
            setIsRealTime(true);
            return; // 抓到真的，直接結束
          }
        } catch (err) {
          console.error("API 連接失敗");
        }
      }
      
      // 模擬模式：讓數字隨機跳動，看起來像在交易
      setPrice(p => p + (Math.random() > 0.5 ? 0.5 : -0.5));
    };

    const timer = setInterval(fetchStockData, isRealTime ? 10000 : 2000);
    return () => clearInterval(timer);
  }, [isRealTime, FUGLE_API_KEY]);

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const time = new Date().toLocaleTimeString();
    const msg = `[${time}] ${type} EXECUTED: ${shares} shares @ ${price.toFixed(1)}`;
    setLogs(prev => [msg, ...prev].slice(0, 5));
    alert(`⚡ 指令確認: ${type}\n價格: ${price.toFixed(1)}\n數量: ${shares}`);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* HEADER */}
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🛡️ AEGIS TERMINAL</h1>
          <span style={{ fontSize: '12px', color: isRealTime ? '#00ff00' : '#888' }}>
            {isRealTime ? "● REAL-TIME DATA LINKED" : "○ SIMULATED MODE (CHECK API KEY)"}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>2330 TSMC</div>
          <div style={{ fontSize: '12px', color: '#666' }}>TAIWAN STOCK EXCHANGE</div>
        </div>
      </div>

      {/* PRICE DISPLAY */}
      <div style={{ background: '#110000', padding: '60px 20px', border: '1px solid #440000', borderRadius: '10px', textAlign: 'center', margin: '20px 0', boxShadow: '0 0 40px rgba(255, 51, 51, 0.15)' }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '15px' }}>MARKET QUOTE (TWD)</div>
        <div style={{ fontSize: '90px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 20px #ff3333' }}>
          {price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label>ORDER SIZE: <span style={{ color: '#fff' }}>{shares}</span> UNITS</label>
          <span style={{ color: '#666' }}>({(shares/1000).toFixed(1)} LOTS)</span>
        </div>
        <input 
          type="range" min="1000" max="100000" step="1000" 
          value={shares} 
          onChange={(e) => setShares(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#ff3333', cursor: 'pointer', marginBottom: '40px' }} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button onClick={() => handleTrade('BUY')} style={{ background: '#ff3333', color: '#000', border: 'none', padding: '25px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>EXECUTE BUY</button>
          <button onClick={() => handleTrade('SELL')} style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '25px', fontWeight: '900', fontSize: '20px', cursor: 'pointer' }}>EXECUTE SELL</button>
        </div>
      </div>

      {/* LOGS */}
      <div style={{ marginTop: '40px', background: '#050505', padding: '15px', border: '1px solid #222' }}>
        <div style={{ color: '#444', fontSize: '12px', marginBottom: '10px' }}>SYSTEM LOGS //</div>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '13px', color: i === 0 ? '#ff3333' : '#666', marginBottom: '5px' }}>{log}</div>
        ))}
      </div>
    </div>
  );
}
