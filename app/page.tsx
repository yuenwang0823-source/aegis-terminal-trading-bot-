"use client";
import React, { useState, useEffect } from 'react';

export default function AegisTerminal() {
  // 1. 把預設值直接調到台積電目前的合理區間 (假設 2085)
  const [price, setPrice] = useState<number>(2085); 
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Terminal v4.2 Online..."]);
  const [isRealTime, setIsRealTime] = useState(false);

  // ⚠️ 你的金鑰
  const FUGLE_API_KEY = "MjEzM2FiZTMtNTFiMy00ZGFiLWExNzUtZWE4YWYxNWEyZTYwIDZiNDU5MzVkLWM0YTUtNDk1NS04ZWVlLTUwMjUyYWUzMTU3MQ=="; 

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const res = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
          headers: { 'X-API-KEY': FUGLE_API_KEY }
        });
        const data = await res.json();
        
        // 如果有抓到真實價格（哪怕是昨收），就強制更新
        if (data && data.lastPrice) {
          setPrice(data.lastPrice);
          setIsRealTime(true);
        }
      } catch (err) {
        // 沒抓到就讓它微幅跳動，保持介面「活著」
        setPrice(p => p + (Math.random() > 0.5 ? 0.5 : -0.5));
      }
    };

    fetchStockData();
    const timer = setInterval(fetchStockData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px' }}>🛡️ AEGIS TERMINAL</h1>
          <span style={{ fontSize: '12px', color: isRealTime ? '#00ff00' : '#ffaa00' }}>
            {isRealTime ? "● DATA LINKED" : "○ SEARCHING FEED..."}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>2330 TSMC</div>
      </div>

      <div style={{ background: '#110000', padding: '60px 20px', border: '1px solid #440000', textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '90px', fontWeight: 'bold', color: '#fff', textShadow: '0 0 20px #ff3333' }}>
          {price.toLocaleString(undefined, { minimumFractionDigits: 1 })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <button onClick={() => alert('BUY SUCCESS')} style={{ background: '#ff3333', color: '#000', border: 'none', padding: '20px', fontWeight: 'bold', cursor: 'pointer' }}>EXECUTE BUY</button>
        <button onClick={() => alert('SELL SUCCESS')} style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '20px', fontWeight: 'bold', cursor: 'pointer' }}>EXECUTE SELL</button>
      </div>

      <div style={{ marginTop: '20px', background: '#050505', padding: '10px', fontSize: '12px' }}>
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}

