"use client";
import React, { useState, useEffect } from 'react';

export default function AegisTerminal() {
  // --- 狀態管理 ---
  const [price, setPrice] = useState<number>(1035); // 初始模擬價
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Terminal v2.0 Online..."]);
  const [isRealTime, setIsRealTime] = useState(false);

  // ⚠️ 在這裡填入你的富果 API KEY 就能切換真數據
  const FUGLE_API_KEY = "MjEzM2FiZTMtNTFiMy00ZGFiLWExNzUtZWE4YWYxNWEyZTYwIDZiNDU5MzVkLWM0YTUtNDk1NS04ZWVlLTUwMjUyYWUzMTU3MQ=="; 

  // --- 數據抓取引擎 ---
  useEffect(() => {
    const fetchStockData = async () => {
      // 如果還沒填 API Key，就跑模擬跳動邏輯
      if (!FUGLE_API_KEY || FUGLE_API_KEY.includes("貼這裡")) {
        setPrice(p => p + (Math.random() > 0.5 ? 1 : -1));
        return;
      }

      try {
        const res = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
          headers: { 'X-API-KEY': FUGLE_API_KEY }
        });
        const data = await res.json();
        if (data.lastPrice) {
          setPrice(data.lastPrice);
          setIsRealTime(true);
        }
      } catch (err) {
        console.error("API 連接失敗，切換至模擬模式");
      }
    };

    const timer = setInterval(fetchStockData, isRealTime ? 10000 : 2000);
    return () => clearInterval(timer);
  }, [isRealTime]);

  // --- 按鈕執行邏輯 ---
  const handleTrade = (type: 'BUY' | 'SELL') => {
    const time = new Date().toLocaleTimeString();
    const message = `[${time}] ${type} EXECUTED: ${shares} shares @ ${price}`;
    
    // 更新下方日誌
    setLogs(prev => [message, ...prev].slice(0, 5));
    
    // 跳出確認視窗
    alert(`⚡ AEGIS 指令確認\n------------------\n動作: ${type}\n價格: ${price}\n數量: ${shares}\n狀態: 交易已發送至模擬伺服器`);
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      
      {/* 標題區 */}
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px' }}>🛡️ AEGIS TERMINAL</h1>
          <div style={{ fontSize: '12px', color: isRealTime ? '#00ff00' : '#888' }}>
            {isRealTime ? "● REAL-TIME DATA LINKED" : "○ SIMULATED DATA MODE"}
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#666' }}>STK: 2330 TSMC</div>
      </div>

      {/* 股價顯示區 */}
      <div style={{ background: '#110000', padding: '50px 20px', border: '1px solid #440000', borderRadius: '8px', textAlign: 'center', margin: '20px 0', boxShadow: '0 0 30px rgba(255, 51, 51, 0.1)' }}>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px', textTransform: 'uppercase' }}>Current Market Price</div>
        <div style={{ fontSize: '80px', fontWeight: 'bold', letterSpacing: '5px', color: '#fff', textShadow: '0 0 15px #ff3333' }}>
          {price.toLocaleString()}
        </div>
      </div>

      {/* 控制區 */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label style={{ fontSize: '14px' }}>ORDER QUANTITY: <span style={{ color: '#fff' }}>{shares}</span> SHARES</label>
          <span style={{ color: '#666' }}>({shares / 1000} 張)</span>
        </div>
        <input 
          type="range" min="1000" max="100000" step="1000" 
          value={shares} 
          onChange={(e) => setShares(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#ff3333', cursor: 'pointer', marginBottom: '30px' }} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <button 
            onClick={() => handleTrade('BUY')}
            style={{ background: '#ff3333', color: '#000', border: 'none', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', borderRadius: '4px' }}
            onMouseOver={(e) => e.currentTarget.style.background = '#ff6666'}
            onMouseOut={(e) => e.currentTarget.style.background = '#ff3333'}
          >
            EXECUTE BUY
          </button>
          <button 
            onClick={() => handleTrade('SELL')}
            style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', borderRadius: '4px' }}
          >
            EXECUTE SELL
          </button>
        </div>
      </div>

      {/* 終端紀錄區 */}
      <div style={{ marginTop: '30px', background: '#0a0a0a', padding: '15px', border: '1px solid #222', borderRadius: '4px' }}>
        <div style={{ color: '#444', fontSize: '11px', textTransform: 'uppercase', marginBottom: '10px', borderBottom: '1px solid #222', paddingBottom: '5px' }}>Terminal Activity Log</div>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '12px', color: i === 0 ? '#ff3333' : '#666', marginBottom: '4px' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

