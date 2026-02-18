import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, BarChart3, ArrowUpRight, ArrowDownLeft, ExternalLink, Globe } from 'lucide-react';

interface TickerData {
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
}

const MexcHlvTicker: React.FC = () => {
  const [data, setData] = useState<TickerData>({
    price: 1.4285,
    change: 12.42,
    high: 1.5840,
    low: 1.2105,
    volume: 14209500,
    amount: 9842100
  });
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const lastPriceRef = useRef<number>(1.4285);

  useEffect(() => {
    // High-fidelity MEXC price simulation engine
    const interval = setInterval(() => {
      const volatility = (Math.random() - 0.48) * 0.005; // Slightly bullish bias
      const newPrice = parseFloat((lastPriceRef.current + volatility).toFixed(4));
      
      if (newPrice > lastPriceRef.current) {
        setDirection('up');
      } else if (newPrice < lastPriceRef.current) {
        setDirection('down');
      }

      setData(prev => ({
        ...prev,
        price: newPrice,
        change: prev.change + (volatility * 10),
        volume: prev.volume + (Math.random() * 500),
        amount: prev.amount + (Math.random() * 300)
      }));

      lastPriceRef.current = newPrice;
      
      const timeout = setTimeout(() => setDirection('neutral'), 400);
      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isPositive = data.change >= 0;

  return (
    <div className="bg-[#0b1217] border border-[#1e2a34] rounded-3xl p-6 relative overflow-hidden group shadow-2xl transition-all duration-300 hover:border-[#20d4ff]/30">
      {/* MEXC Branding Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#20d4ff] opacity-40" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#20d4ff]/10 rounded-xl flex items-center justify-center border border-[#20d4ff]/20">
            <BarChart3 className="w-6 h-6 text-[#20d4ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight uppercase">HLV / USDT</h3>
              <div className="px-1.5 py-0.5 bg-[#20d4ff]/10 text-[#20d4ff] text-[8px] font-black rounded border border-[#20d4ff]/20 uppercase">MEXC Global</div>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Globe className="w-3 h-3 text-slate-500" />
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Exchange Feed</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-2 py-1 bg-[#20d4ff]/5 border border-[#20d4ff]/10 rounded text-[9px] font-black text-[#20d4ff]">
              <div className="w-1 h-1 rounded-full bg-[#20d4ff] animate-pulse" />
              SPOT_LIVE
           </div>
           <a href="#" className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
           </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Main Price Display */}
        <div className="space-y-1">
          <div className={`text-4xl font-black font-mono tracking-tighter transition-all duration-300 ${
            direction === 'up' ? 'text-[#00c582] translate-y-[-2px]' : 
            direction === 'down' ? 'text-[#ff4d4f] translate-y-[2px]' : 
            'text-white'
          }`}>
            {data.price.toFixed(4)}
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xs text-slate-500 font-bold">≈ ${data.price.toFixed(4)}</div>
             <div className={`flex items-center gap-1 text-sm font-black ${isPositive ? 'text-[#00c582]' : 'text-[#ff4d4f]'}`}>
               {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
               {isPositive ? '+' : ''}{data.change.toFixed(2)}%
             </div>
          </div>
        </div>

        {/* 24h Stats Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 border-l border-slate-800/50 pl-8">
           <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">24h High</div>
              <div className="text-xs font-mono font-bold text-slate-200">{data.high.toFixed(4)}</div>
           </div>
           <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">24h Low</div>
              <div className="text-xs font-mono font-bold text-slate-200">{data.low.toFixed(4)}</div>
           </div>
           <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">24h Vol (USDT)</div>
              <div className="text-xs font-mono font-bold text-slate-200">{(data.volume / 1000000).toFixed(2)}M</div>
           </div>
           <div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">24h Amount (HLV)</div>
              <div className="text-xs font-mono font-bold text-slate-200">{(data.amount / 1000000).toFixed(2)}M</div>
           </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
        <div className="flex gap-4">
           <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-[#20d4ff]" />
              <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Latency: 14ms</span>
           </div>
           <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#20d4ff]" />
              <span className="text-[8px] font-mono font-bold text-slate-600 uppercase">Uptime: 99.9%</span>
           </div>
        </div>
        <button className="px-4 py-1.5 bg-[#20d4ff] hover:bg-[#1bb8e0] text-[#0b1217] text-[10px] font-black rounded-lg uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[#20d4ff]/10">
          Trade on MEXC
        </button>
      </div>

      {/* Decorative Wave Design (MEXC-esque) */}
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#20d4ff]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#20d4ff]/10 transition-all duration-700" />
    </div>
  );
};

export default MexcHlvTicker;
