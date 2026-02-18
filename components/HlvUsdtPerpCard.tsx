import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, Globe, BarChart3, Clock } from 'lucide-react';

interface PriceData {
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
  fundingRate: number;
  countdown: string;
}

const HlvUsdtPerpCard: React.FC = () => {
  const [data, setData] = useState<PriceData>({
    price: 1.4285,
    change: 12.42,
    volume: 14209500,
    high: 1.5840,
    low: 1.2105,
    fundingRate: 0.0100,
    countdown: '06:42:15'
  });
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const lastPriceRef = useRef<number>(1.4285);

  useEffect(() => {
    // High-fidelity Binance-styled simulation engine
    const interval = setInterval(() => {
      const volatility = (Math.random() - 0.48) * 0.004; // Slightly bullish bias
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
        volume: prev.volume + (Math.random() * 500)
      }));

      lastPriceRef.current = newPrice;
      
      const timeout = setTimeout(() => setDirection('neutral'), 300);
      return () => clearTimeout(timeout);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const isPositive = data.change >= 0;

  return (
    <div className={`bg-slate-900/80 border-2 transition-all duration-300 p-6 rounded-[2rem] relative overflow-hidden group ${
      direction === 'up' ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 
      direction === 'down' ? 'border-rose-500/40 bg-rose-500/5 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 
      'border-slate-800 shadow-2xl'
    }`}>
      {/* Decorative Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full transition-colors duration-700 ${
        direction === 'up' ? 'bg-emerald-500/20' : 
        direction === 'down' ? 'bg-rose-500/20' : 
        'bg-indigo-500/10'
      }`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <BarChart3 className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">HLVUSDT Perpetual</h3>
                <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[8px] font-black rounded uppercase">Futures</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Globe className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest">Binance_Futures_Live</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-400">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                SYNCED_L12
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-1">
            <div className={`text-5xl font-black font-mono tracking-tighter transition-all duration-300 ${
              direction === 'up' ? 'text-emerald-400 translate-y-[-2px]' : 
              direction === 'down' ? 'text-rose-400 translate-y-[2px]' : 
              'text-white'
            }`}>
              {data.price.toFixed(4)}
            </div>
            <div className="flex items-center gap-3">
               <div className="text-xs text-slate-500 font-bold">Mark: {data.price.toFixed(4)}</div>
               <div className={`flex items-center gap-1 text-sm font-black ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                 {isPositive ? '+' : ''}{data.change.toFixed(2)}%
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4 border-l border-slate-800/50 pl-6">
             <div>
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-500" />
                  Funding / 8h
                </div>
                <div className="text-xs font-mono font-bold text-amber-500/90">{data.fundingRate.toFixed(4)}%</div>
             </div>
             <div>
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-500" />
                  Countdown
                </div>
                <div className="text-xs font-mono font-bold text-slate-300">{data.countdown}</div>
             </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/50 grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">24h High</span>
            <span className="text-xs font-mono text-slate-400 font-bold">{data.high.toFixed(4)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">24h Low</span>
            <span className="text-xs font-mono text-slate-400 font-bold">{data.low.toFixed(4)}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">24h Vol (USDT)</span>
            <span className="text-xs font-mono text-slate-400 font-bold">{(data.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>
      </div>
      
      {/* Visual background scanning effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -translate-x-full group-hover:animate-[scan_2s_linear_infinite]" />
      
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default HlvUsdtPerpCard;
