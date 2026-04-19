"use client";
import React, { useState, useEffect } from 'react';

export default function AegisUltimate() {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState(1000);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] AEGIS Real-time Link Initialized..."]);

  // ⚠️ 請在這裡輸入你在富果申請到的真實 API Key
  const FUGLE_API_KEY = "你的富果API金鑰貼這裡"; 

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // 我們以台積電 (2330) 作為範例，如果你要看大盤就改代號
        const res = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
          headers: { 'X-API-KEY': FUGLE_API_KEY }
        });
        const data = await res.json();
        if (data.lastPrice) {
          setPrice(data.lastPrice);
          setLoading(false);
        }
      } catch (err) {
        console.error("數據連接中...");
      }
    };

    fetchStockData();
    const timer = setInterval(fetchStockData, 5000); // 每 5 秒自動抓一次真實股價
    return () => clearInterval(timer);
  }, []);

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const time = new Date().toLocaleTimeString();
    const msg = `[${time}] ${type} ORDER: ${shares} units at ${price}`;
    setLogs(prev => [msg, ...prev].slice(0, 5));
    alert(`${type} 執行成功！\n成交價格: ${price}\n成交數量: ${shares}`);
  };

  if (loading && price === 0) {
    return (
      <div style={{ background: '#000', color: '#ff3333', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>🛡️ AEGIS SYSTEM LOADING...</div>
        <div style={{ fontSize: '14px' }}>請確認已填入 API Key 且現在為開盤時間</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#ff3333', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      {/* 標題 */}
      <div style={{ borderBottom: '2px solid #ff3333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>🛡️ AEGIS TACTICAL TERMINAL</h1>
        <span style={{ fontSize: '12px', color: '#888' }}>REAL-TIME MARKET DATA // SOURCE: FUGLE API</span>
      </div>

      {/* 真實價格顯示區 */}
      <div style={{ background: '#110000', padding: '40px', border: '1px solid #440000', borderRadius: '5px', textAlign: 'center', boxShadow: '0 0 20px rgba(255, 51, 51, 0.1)' }}>
        <div style={{ fontSize: '16px', color: '#888', marginBottom: '10px' }}>2330 TSMC / LAST PRICE</div>
        <div style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 10px #ff3333' }}>
          {price.toLocaleString()}
        </div>
      </div>

      {/* 交易控制區 */}
      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>ORDER SIZE: {shares} SHARES</label>
          <span style={{ color: '#888' }}>({shares / 1000} 張)</span>
        </div>
        <input 
          type="range" min="1000" max="100000" step="1000" 
          value={shares} 
          onChange={(e) => setShares(Number(e.target.value))}
          style={{ width: '100%', marginTop: '15px', accentColor: '#ff3333', cursor: 'pointer' }} 
        />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={() => handleTrade('BUY')}
            style={{ background: '#ff3333', color: '#000', border: 'none', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', transition: '0.2s' }}
          >
            EXECUTE BUY
          </button>
          <button 
            onClick={() => handleTrade('SELL')}
            style={{ background: '#000', color: '#ff3333', border: '2px solid #ff3333', padding: '20px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}
          >
            EXECUTE SELL
          </button>
        </div>
      </div>

      {/* 終端紀錄區 */}
      <div style={{ marginTop: '40px', background: '#0a0a0a', padding: '15px', border: '1px solid #222', borderRadius: '4px' }}>
        <div style={{ color: '#666', fontSize: '12px', marginBottom: '8px', borderBottom: '1px solid #222', paddingBottom: '5px' }}>TERMINAL LOGS:</div>
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: '13px', marginBottom: '4px', color: i === 0 ? '#ff3333' : '#666' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

