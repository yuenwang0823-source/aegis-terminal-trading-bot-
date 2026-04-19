"use client";
import React, { useState, useEffect } from 'react';

export default function AegisMini() {
  const [price, setPrice] = useState(985);
  const [shares, setShares] = useState(1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrice(p => p + (Math.random() > 0.5 ? 1 : -1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', padding: '40px', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#fff', fontSize: '24px' }}>🛡️ AEGIS TW-STOCK TERMINAL v2.0</h1>
      <hr style={{ borderColor: '#333' }} />
      <div style={{ marginTop: '40px' }}>
        <p style={{ color: '#666' }}>2330 台積電 TSMC / 即時報價</p>
        <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#fff' }}>NT$ {price}</div>
      </div>
      <div style={{ marginTop: '40px', background: '#111', padding: '20px', borderRadius: '10px' }}>
        <p>交易數量: {shares} 股 ({shares/1000} 張)</p>
        <input type="range" min="1000" max="50000" step="1000" value={shares} onChange={(e) => setShares(Number(e.target.value))} style={{ width: '100%' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          <button style={{ background: '#ef4444', color: '#fff', padding: '20px', border: 'none', fontWeight: 'bold' }}>閃電買入</button>
          <button style={{ background: '#222', color: '#ef4444', padding: '20px', border: '2px solid #ef4444', fontWeight: 'bold' }}>閃電賣出</button>
        </div>
      </div>
    </div>
  );
}
