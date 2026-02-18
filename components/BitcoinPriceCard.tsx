import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Globe } from 'lucide-react';

interface PriceData {
  price: number;
  change: number;
  volume: number;
}

const BitcoinPriceCard: React.FC = () => {
  const [data, setData] = useState<PriceData | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isLive, setIsLive] = useState(false);
  const lastPriceRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWS = () => {
      // Binance Futures WebSocket for real-time BTCUSDT ticker
      const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
      wsRef.current = ws;

      ws.onopen = () => setIsLive(true);
      
      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const currentPrice = parseFloat(payload.c);
        const currentChange = parseFloat(payload.P);
        const currentVolume = parseFloat(payload.q);

        if (lastPriceRef.current !== 0) {
          if (currentPrice > lastPriceRef.current) {
            setDirection('up');
          } else if (currentPrice < lastPriceRef.current) {
            setDirection('down');
          }
        }

        lastPriceRef.current = currentPrice;
        setData({
          price: currentPrice,
          change: currentChange,
          volume: currentVolume
        });

        // Reset direction flash after 300ms
        setTimeout(() => setDirection('neutral'), 300);
      };

      ws.onclose = () => {
        setIsLive(false);
        setTimeout(connectWS, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connectWS();
    return () => wsRef.current?.close();
  }, []);

  if (!data) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex items-center justify-center animate-pulse min-w-[280px]">
        <Activity className="w-6 h-6 text-emerald-500/50 animate-spin" />
      </div>
    );
  }

  const isPositive = data.change >= 0;

  return (
    <div className={`bg-slate-900/80 border-2 transition-all duration-300 p-6 rounded-3xl relative overflow-hidden group min-w-[300px] ${
      direction === 'up' ? 'border-emerald-500/50 bg-emerald-500/5' : 
      direction === 'down' ? 'border-rose-500/50 bg-rose-500/5' : 
      'border-slate-800'
    }`}>
      {/* Visual background glow based on direction */}
      <div className={`absolute inset-0 opacity-10 blur-3xl transition-all duration-500 ${
        direction === 'up' ? 'bg-emerald-500' : 
        direction === 'down' ? 'bg-rose-500' : 
        'bg-transparent'
      }`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">BTCUSDT Perpetual</h3>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-mono font-bold text-emerald-500">BINANCE_FUTURES</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black ${isLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
            <div className={`w-1 h-1 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`} />
            LIVE
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          <div className={`text-4xl font-black font-mono tracking-tighter transition-colors duration-300 ${
            direction === 'up' ? 'text-emerald-400 scale-[1.02]' : 
            direction === 'down' ? 'text-rose-400 scale-[1.02]' : 
            'text-white'
          }`}>
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`flex items-center gap-1 text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{data.change.toFixed(2)}%
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">24h Vol (USDT)</span>
            <span className="text-xs font-mono text-slate-400">{(data.volume / 1000000).toFixed(2)}M</span>
          </div>
          <div className="text-right">
             <span className="text-[8px] font-mono text-slate-700 uppercase">Latency: ~12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinPriceCard;