"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function AegisMasterController() {
  // --- 1. 核心狀態 ---
  const [balance, setBalance] = useState(100000);
  const [vault, setVault] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  
  // --- 2. 切換功能狀態 ---
  const [timeframe, setTimeframe] = useState(30000); // 預設 30秒 (毫秒)
  const [riskPercent, setRiskPercent] = useState(15);
  const [targetTP, setTargetTP] = useState(50);
  const [targetStop, setTargetStop] = useState(30);

  // --- 3. 市場數據 ---
  const [offset, setOffset] = useState(0);
  const [rawPrice, setRawPrice] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [candles, setCandles] = useState<any[]>([]);
  
  const lastPriceRef = useRef(0);
  const currentOrderSizeRef = useRef(0);
  const displayPrice = rawPrice + offset;

  // 動態計算建議下單量
  const calculatedOrderSize = (balance * (riskPercent / 100)) / (displayPrice || 60000);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let p = parseFloat(data.p) + offset;
      setRawPrice(parseFloat(data.p));

      // 動態時框採樣
      const timeBucket = Math.floor(Date.now() / timeframe); 

      setCandles(prev => {
        let newCandles = [...prev];
        if (newCandles.length === 0 || newCandles[newCandles.length - 1].time !== timeBucket) {
          newCandles.push({ time: timeBucket, open: lastPriceRef.current || p, high: p, low: p, close: p });
          // 切換時框時清空舊數據以防比例錯誤，或保留最近40根
          return newCandles.slice(-40);
        } else {
          const last = { ...newCandles[newCandles.length - 1] };
          last.high = Math.max(last.high, p);
          last.low = Math.min(last.low, p);
          last.close = p;
          newCandles[newCandles.length - 1] = last;
          return newCandles;
        }
      });
      lastPriceRef.current = p;

      // 自動模式下的邏輯
      if (isAutoMode && !isProcessing) {
        if (!isHolding) {
          if (candles.length > 2 && p > lastPriceRef.current && p > candles[candles.length-1].open) {
            setIsProcessing(true);
            executeTrade('買入', '機器人趨勢進場', p, calculatedOrderSize);
          }
        } else {
          const pnl = (p - entryPrice) * currentOrderSizeRef.current;
          if (pnl >= targetTP || pnl <= -targetStop) {
            setIsProcessing(true);
            executeTrade('賣出', pnl >= targetTP ? '機器人止盈' : '機器人止損', p, currentOrderSizeRef.current);
          }
        }
      }
    };
    return () => ws.close();
  }, [isAutoMode, isHolding, isProcessing, entryPrice, offset, balance, riskPercent, targetTP, candles, timeframe]);

  const executeTrade = (type: '買入' | '賣出', reason: string, price: number, size: number) => {
    if (type === '買入') {
      setIsHolding(true); setEntryPrice(price); currentOrderSizeRef.current = size;
      setTrades(prev => [{ type, price, size, time: new Date().toLocaleTimeString(), reason }, ...prev.slice(0, 10)]);
    } else {
      const pnl = (price - entryPrice) * size;
      const actualProfit = pnl - (price * size * 0.0004);
      if (actualProfit > 0) {
        setVault(v => v + actualProfit * 0.7);
        setBalance(b => b + actualProfit * 0.3);
      } else {
        setBalance(b => b + actualProfit);
      }
      setIsHolding(false);
      setTrades(prev => [{ type, price, pnl: actualProfit, time: new Date().toLocaleTimeString(), reason }, ...prev.slice(0, 10)]);
    }
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="bg-[#0c0d10] text-[#d1d4dc] p-6 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Header - 橘色看板與時框切換 */}
        <header className="flex justify-between items-center border-b border-[#2a2e39] pb-4">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-black italic text-white tracking-tighter">AEGIS <span className="text-blue-500">PRO-X</span></h1>
            <div className="flex flex-col border-l border-[#2a2e39] pl-6">
               <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Live BTC Market</span>
               <span className="text-2xl font-black text-orange-500">${displayPrice.toFixed(2)}</span>
            </div>
            {/* 時框切換器 */}
            <div className="flex bg-[#1e222d] p-1 rounded-sm gap-1 ml-4 border border-[#2a2e39]">
              {[2000, 10000, 30000, 60000].map(ms => (
                <button key={ms} onClick={() => {setTimeframe(ms); setCandles([]);}} className={`px-3 py-1 text-[10px] font-bold rounded-sm transition-all ${timeframe === ms ? 'bg-[#2962ff] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  {ms/1000}S
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
             <div className="flex bg-[#1e222d] p-1 rounded-sm border border-[#2a2e39]">
                <button onClick={() => setIsAutoMode(false)} className={`px-4 py-2 text-[10px] font-bold rounded-sm ${!isAutoMode ? 'bg-[#f0b90b] text-black' : 'text-zinc-500'}`}>手動</button>
                <button onClick={() => setIsAutoMode(true)} className={`px-4 py-2 text-[10px] font-bold rounded-sm ${isAutoMode ? 'bg-[#2962ff] text-white' : 'text-zinc-500'}`}>機器</button>
             </div>
             <button onClick={() => {const v = prompt("Ref Price:"); if(v) setOffset(parseFloat(v)-rawPrice)}} className="px-3 py-2 text-[10px] text-zinc-600 hover:text-white uppercase font-bold">校準</button>
          </div>
        </header>

        {/* 實時看板 */}
        <div className="grid grid-cols-4 gap-0.5 bg-[#2a2e39] border border-[#2a2e39]">
          <StatPanel label="帳戶餘額" value={`$${balance.toLocaleString()}`} />
          <StatPanel label="安全金庫" value={`$${vault.toFixed(2)}`} color="text-blue-400" />
          <StatPanel label="建議下單 (15%)" value={`${calculatedOrderSize.toFixed(4)} BTC`} />
          <div className="bg-[#1e222d] p-3 flex gap-2">
             <button 
               disabled={isAutoMode || isHolding} 
               onClick={() => executeTrade('買入', '手動進場', displayPrice, calculatedOrderSize)}
               className={`flex-1 font-black text-xs rounded-sm ${!isAutoMode && !isHolding ? 'bg-[#089981] hover:bg-[#067d6a] text-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
             >
               手動買入
             </button>
             <button 
               disabled={isAutoMode || !isHolding} 
               onClick={() => executeTrade('賣出', '手動平倉', displayPrice, currentOrderSizeRef.current)}
               className={`flex-1 font-black text-xs rounded-sm ${!isAutoMode && isHolding ? 'bg-[#f23645] hover:bg-[#d92121] text-white' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
             >
               手動賣出
             </button>
          </div>
        </div>

        {/* 圖表 */}
        <div className="bg-[#131722] border border-[#2a2e39] h-[380px] relative overflow-hidden rounded-sm">
          <svg width="100%" height="100%" viewBox="0 0 1000 380" preserveAspectRatio="none">
            <g transform="translate(45, 0)">
              {candles.map((c, i) => {
                const x = i * 22;
                const all = candles.flatMap(cand => [cand.high, cand.low]);
                const min = Math.min(...all) - 10;
                const max = Math.max(...all) + 10;
                const range = max - min || 20;
                const getY = (val: number) => 380 - ((val - min) / range) * 300 - 40;
                const isUp = c.close >= c.open;
                return (
                  <g key={i}>
                    <line x1={x+9} y1={getY(c.high)} x2={x+9} y2={getY(c.low)} stroke={isUp ? '#089981' : '#f23645'} strokeWidth="1.5" />
                    <rect x={x} y={getY(Math.max(c.open, c.close))} width="18" height={Math.max(Math.abs(getY(c.open)-getY(c.close)), 1.5)} fill={isUp ? '#089981' : '#f23645'} rx="1" />
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="absolute right-0 top-0 h-full w-14 border-l border-[#2a2e39] bg-[#131722]/90 flex flex-col justify-between py-10 text-[9px] text-[#787b86] items-center z-20 font-mono">
            <span>{Math.round(displayPrice+50)}</span>
            <span className="bg-orange-500 text-white font-bold px-1 py-0.5 rounded-sm w-full text-center">{Math.round(displayPrice)}</span>
            <span>{Math.round(displayPrice-50)}</span>
          </div>
          {isHolding && (
            <div className="absolute left-0 w-[calc(100%-60px)] z-30 flex items-center" style={{ top: '50%' }}>
              <div className="w-full border-t border-dashed border-blue-500 opacity-40"></div>
              <div className="absolute left-4 bg-blue-600 text-white text-[10px] px-3 py-1 font-black rounded-sm">
                 {isAutoMode ? 'AUTO LONG' : 'MANUAL LONG'} @ {entryPrice.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* 底部面板 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#1e222d] border border-[#2a2e39] p-4 h-40 overflow-y-auto scrollbar-hide font-mono">
            <p className="text-[10px] text-[#787b86] font-black uppercase mb-2 italic">Trade Master Log</p>
            {trades.map((t, i) => (
              <div key={i} className="flex justify-between text-[11px] py-1 border-b border-[#2a2e39]/30">
                <span className={t.type === '買入' ? 'text-blue-400 font-bold' : 'text-orange-400 font-bold'}>{t.type} {t.size?.toFixed(4)} BTC @ {t.price.toFixed(2)}</span>
                <span className={t.pnl > 0 ? 'text-[#089981] font-bold' : 'text-zinc-500'}>{t.pnl ? `PnL: $${t.pnl.toFixed(2)}` : t.reason}</span>
              </div>
            ))}
          </div>
          <div className="bg-[#1e222d] border border-[#2a2e39] p-5 flex flex-col justify-between rounded-sm">
             <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-[#787b86] font-black uppercase">複利滑桿</span>
                  <span className="text-blue-500 font-bold text-xs">{riskPercent}%</span>
                </div>
                <input type="range" min="1" max="50" value={riskPercent} onChange={e => setRiskPercent(Number(e.target.value))} className="w-full h-1 bg-[#2a2e39] rounded-lg appearance-none cursor-pointer accent-blue-500" />
             </div>
             <div className="grid grid-cols-2 gap-2 mt-4">
                <div>
                  <p className="text-[10px] text-[#787b86] font-bold uppercase mb-1">機器止盈</p>
                  <input type="number" value={targetTP} onChange={e => setTargetTP(Number(e.target.value))} className="bg-transparent text-white border-b border-[#2a2e39] w-full text-sm outline-none" />
                </div>
                <div>
                  <p className="text-[10px] text-[#787b86] font-bold uppercase mb-1">機器止損</p>
                  <input type="number" value={targetStop} onChange={e => setTargetStop(Number(e.target.value))} className="bg-transparent text-white border-b border-[#2a2e39] w-full text-sm outline-none" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPanel({ label, value, color = "text-white" }) {
  return (
    <div className="bg-[#1e222d] p-4 hover:bg-[#2a2e39] transition-all">
      <p className="text-[10px] text-[#787b86] font-black mb-1 uppercase tracking-tighter">{label}</p>
      <p className={`text-xl font-black ${color}`}>{value}</p>
    </div>
  );
}
