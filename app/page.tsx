"use client";
import React, { useState, useEffect } from 'react';

export default function AegisReal() {
  const [price, setPrice] = useState(0); 
  const [loading, setLoading] = useState(true);
  
  // 這裡填入你在富果申請到的 API KEY
  const API_KEY = MjEzM2FiZTMtNTFiMy00ZGFiLWExNzUtZWE4YWYxNWEyZTYwIDZiNDU5MzVkLWM0YTUtNDk1NS04ZWVlLTUwMjUyYWUzMTU3MQ==""; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 以台積電 (2330) 為例
        const response = await fetch(`https://api.fugle.tw/marketdata/v1.0/stock/snapshot/2330`, {
          headers: { 'X-API-KEY': API_KEY }
        });
        const data = await response.json();
        if (data.lastPrice) {
          setPrice(data.lastPrice);
          setLoading(false);
        }
      } catch (err) {
        console.error("數據抓取失敗");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // 每 5 秒更新一次真股價
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{background: '#000', color: '#ff4d4d', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>AEGIS 數據對接中...</div>;

  return (
    // ... 這裡接你原本的 UI 程式碼
    // 裡面的價格就會顯示真實的 ${price}
  );
}
