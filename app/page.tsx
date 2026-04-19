"use client";
import React, { useState, useEffect } from 'react';
import { Shield, Zap, TrendingUp, DollarSign, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCcw, Cpu, BarChart3 } from 'lucide-react';

export default function AegisTWTerminal() {
  // 核心數據：以台積電 (2330) 為例
  const [price, setPrice] = useState<number>(985.00);
  const [prevPrice, setPrevPrice] = useState<number>(984.00);
  const [latency, setLatency] = useState<number>(0);
  const [shares, setShares] = useState<number>(1000); // 預設 1000 股 (1張)
  const [isAuto, setIsAuto] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(1500000); // 預設 150 萬台幣
  const [logs, setLogs] = useState<{id: number, text: string, type: string}[]>([]);
  
  // 模擬台股即時跳動 (真實台股 API 接口預留處)
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevPrice(price);
      // 模擬台股 Tick：1000元以下跳動 1元
      const change = (Math.random() > 0.5 ? 1 : -1);
      setPrice(prev => prev + change);
      
      // 模擬偵測與交易所主機的延遲差
      const l = Math.floor(Math.random() * 300);
      setLatency(l);

      if (l > 200 && isAuto) {
        executeTrade('自動套利');
      }
    }, 500); // 台股撮合速度模擬
    return () => clearInterval(interval);
  }, [price, isAuto]);

  const executeTrade = (type: string) => {
    // 台股成本計算：手續費 0.1425% + 證交稅 0.3%
    const totalCost = (price * shares * 0.004425); 
    const estimatedProfit = (price * shares * 0.0015) - totalCost; // 假設延遲套利抓 0.15% 價差
    
    const newLog = {
      id: Date.now(),
      text: `[${type}] 2330 台積電 | ${shares}股 | 價格:${price} | 預估淨利: TWD ${Math.floor(estimatedProfit)}`,
      type: estimatedProfit > 0 ? 'buy' : 'sell'
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 7)]);
    setBalance(prev => prev + estimatedProfit);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-400 font-mono p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-b-2 border-emerald-900 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Shield size={40} className="text-emerald-500 animate-pulse" />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">Aegis TW-Stock</h1>
            <p className="text-[10px] text-emerald-700 tracking-[0.3em]">Institutional Latency Arbitrage</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] w-full md:w-auto">
          <div className="bg-emerald-950/20 p-2 border border-emerald-900/30">
            <p className="text-emerald-700">證交所連線</p>
            <p className="text-emerald-400 font-bold">● 已連線 (Direct)</p>
          </div>
          <div className="bg-emerald-950/20 p-2 border border-emerald-900/30">
            <p className="text-emerald-700">本地延遲</p>
            <p className="text-white font-bold">{latency}ms</p>
          </div>
          <div className="bg-emerald-950/20 p-2 border border-emerald-900/30">
            <p className="text-emerald-700">今日勝率</p>
            <p className="text-white font-bold">78.5%</p>
          </div>
          <div className="bg-emerald-950/20 p-2 border border-emerald-900/30">
            <p className="text-emerald-700">交易市場</p>
            <p className="text-white uppercase">TWSE / OTC</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          {/* Main Price Display */}
          <div className="bg-zinc-900 p-8 rounded-2xl border-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-emerald-500" size={18}/>
                <span className="text-xs font-bold text-zinc-500 uppercase">2330 台積電 TSMC</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">即時逐筆撮合</span>
            </div>
            
            <div className="text-7xl md:text-8xl font-black text-white tracking-tighter mb-4 flex items-baseline gap-4">
              <span className="text-4xl text-emerald-800">NT$</span>
              {price.toLocaleString()}
            </div>
            
            <div className="flex gap-6 items-center">
              <div className={`flex items-center gap-1 font-bold text-xl ${price >= prevPrice ? "text-red-500" : "text-green-500"}`}>
                {price >= prevPrice ? "▲" : "▼"} {Math.abs(price - 980).toFixed(1)}
              </div>
              <div className="text-xs text-zinc-500">
                成交量: 14,282 張 | 延遲偵測: <span className="text-emerald-500">-{latency}ms 領先</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-500" /> 委託參數設定
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] mb-2 uppercase">
                    <span className="text-zinc-400">買入數量 ({shares} 股)</span>
                    <span className="text-emerald-500 font-bold">{Math.floor(shares/1000)} 張</span>
                  </div>
                  <input 
                    type="range" min="1" max="50000" step="100"
                    value={shares}
                    onChange={(e) => setShares(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => executeTrade('手動買入')} className="bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-500 transition-all uppercase shadow-lg">現股買進</button>
                  <button onClick={() => executeTrade('手動賣出')} className="border-2 border-emerald-900 text-emerald-500 font-black py-4 rounded-xl hover:bg-emerald-900/30 transition-all uppercase">現股賣出</button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <RefreshCcw size={18} className="text-emerald-500" /> 自動套利開關
              </h3>
              <p className="text-[10px] text-zinc-500 mb-6">偵測到看盤軟體延遲時自動閃電下單。</p>
              <button 
                onClick={() => setIsAuto(!isAuto)}
                className={`w-full py-4 rounded-xl font-black transition-all ${isAuto ? "bg-red-900/20 text-red-500 border-2 border-red-500" : "bg-emerald-500 text-black"}`}
              >
                {isAuto ? "停止自動監控" : "啟動自動套利"}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-emerald-500 p-6 rounded-2xl text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <p className="text-[10px] font-bold uppercase opacity-60">交割帳戶餘額 (TWD)</p>
            <div className="text-3xl font-black tracking-tighter">
              ${Math.floor(balance).toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 h-[400px] flex flex-col">
            <h4 className="text-white font-bold mb-4 text-xs">下單執行日誌</h4>
            <div className="flex-1 overflow-y-auto space-y-2 text-[9px]">
              {logs.map(log => (
                <div key={log.id} className="p-2 border-l-2 border-emerald-500 bg-emerald-500/5 text-emerald-200">
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

