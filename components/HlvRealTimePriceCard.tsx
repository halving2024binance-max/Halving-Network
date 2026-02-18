import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Globe, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

interface PriceData {
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

const HlvRealTimePriceCard: React.FC = () => {
  const [data, setData] = useState<PriceData | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [isLive, setIsLive] = useState(false);
  const lastPriceRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWS = () => {
      // We use BTCUSDT as a base to drive the HLV price so it moves with the real market
      const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
      wsRef.current = ws;

      ws.onopen = () => setIsLive(true);
      
      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const btcPrice = parseFloat(payload.c);
        const btcChange = parseFloat(payload.P);
        
        // Derive HLV price from BTC price with a specific multiplier
        // This makes the token feel "real" as it tracks market movements
        const hlvPrice = (btcPrice / 45000) * 1.4285;
        const hlvVolume = parseFloat(payload.q) * 0.0012; // Scaled volume
        const hlvMarketCap = hlvPrice * 100000000; // 100M supply simulation

        if (lastPriceRef.current !== 0) {
          if (hlvPrice > lastPriceRef.current) {
            setDirection('up');
          } else if (hlvPrice < lastPriceRef.current) {
            setDirection('down');
          }
        }

        lastPriceRef.current = hlvPrice;
        setData({
          price: hlvPrice,
          change: btcChange, // Tracking BTC change for market correlation
          volume: hlvVolume,
          marketCap: hlvMarketCap
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
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-center animate-pulse min-w-[320px] h-[220px]">
        <Activity className="w-8 h-8 text-indigo-500/50 animate-spin" />
      </div>
    );
  }

  const isPositive = data.change >= 0;

  return (
    <div className={`bg-slate-950/90 border-2 transition-all duration-500 p-8 rounded-[2.5rem] relative overflow-hidden group min-w-[340px] shadow-2xl ${
      direction === 'up' ? 'border-emerald-500/40 bg-emerald-500/5' : 
      direction === 'down' ? 'border-rose-500/40 bg-rose-500/5' : 
      'border-slate-800'
    }`}>
      {/* Visual background glow based on direction */}
      <div className={`absolute inset-0 opacity-10 blur-[80px] transition-all duration-700 ${
        direction === 'up' ? 'bg-emerald-500' : 
        direction === 'down' ? 'bg-rose-500' : 
        'bg-indigo-500/10'
      }`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <BarChart3 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">HLV/USDT Perpetual</h3>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Sentry_Mesh_Feed</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-widest ${isLive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`} />
            LIVE
          </div>
        </div>

        <div className="flex items-baseline gap-4 mb-2">
          <div className={`text-5xl font-black font-mono tracking-tighter transition-all duration-300 ${
            direction === 'up' ? 'text-emerald-400 scale-[1.01]' : 
            direction === 'down' ? 'text-rose-400 scale-[1.01]' : 
            'text-white'
          }`}>
            ${data.price.toFixed(4)}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black transition-all ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{data.change.toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-800/50">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">24h Volume</span>
            <div className="flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-amber-500" />
               <span className="text-sm font-mono font-black text-slate-300">${(data.volume / 1000).toFixed(2)}K</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Neural Market Cap</span>
            <div className="flex items-center gap-2">
               <span className="text-sm font-mono font-black text-indigo-400">${(data.marketCap / 1000000).toFixed(2)}M</span>
               <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
           <div className="flex items-center gap-2 text-[8px] font-mono text-slate-700 uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              Latency: 14ms
           </div>
           <div className="text-[8px] font-black text-slate-800 uppercase tracking-[0.3em]">
              Halving Sentinel Protocol
           </div>
        </div>
      </div>
    </div>
  );
};

export default HlvRealTimePriceCard;
