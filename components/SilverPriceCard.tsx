
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, CircleDollarSign, Info } from 'lucide-react';

interface SilverData {
  price: number;
  change24h: number;
}

const SilverPriceCard: React.FC = () => {
  const [data, setData] = useState<SilverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Simulation parameters for Silver (XAG)
  const generateMockPrice = (base: number = 31.24) => {
    // Silver is more volatile than Gold but less than BTC
    const change = (Math.random() - 0.5) * 0.15;
    return base + change;
  };

  const fetchSilverPrice = async () => {
    try {
      // Internal neural feed simulation for Silver spot prices
      const simulatedPrice = generateMockPrice(data?.price || 31.24);
      const simulatedChange = data ? ((simulatedPrice - 31.24) / 31.24) * 100 : 0.85;

      setData({
        price: simulatedPrice,
        change24h: simulatedChange
      });
      
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setLoading(false);
      setIsUsingFallback(true);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSilverPrice();
    const interval = setInterval(fetchSilverPrice, 12000); 
    return () => clearInterval(interval);
  }, [data?.price]);

  if (loading || !data) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4 animate-pulse">
        <div className="p-3 rounded-lg bg-slate-800 text-slate-400/50">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-16 bg-slate-800 rounded"></div>
          <div className="h-4 w-24 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  const isPositive = data.change24h >= 0;

  return (
    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-400/50 transition-all group relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
        <CircleDollarSign className="w-12 h-12 text-slate-400 select-none" />
      </div>
      
      <div className="p-3 rounded-lg bg-slate-400/10 text-slate-400 group-hover:bg-slate-400/20 transition-colors">
        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Silver (XAG)</div>
          <div className="flex items-center gap-1">
            <div className={`w-1 h-1 rounded-full animate-pulse ${isUsingFallback ? 'bg-slate-400' : 'bg-emerald-500'}`}></div>
            <span className={`text-[8px] font-mono ${isUsingFallback ? 'text-slate-400/70' : 'text-emerald-500/70'}`}>
              {isUsingFallback ? 'SENTINEL_FEED' : 'LIVE'}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-black text-white">
            ${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-[10px] font-bold font-mono ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
          </div>
        </div>
        <div className="text-[8px] text-slate-600 font-mono mt-1 uppercase flex items-center gap-1">
          <span className="flex items-center gap-1 group/info cursor-help">
            <Info className="w-2 h-2" />
            Spot Price/Oz
          </span>
          <span className="ml-2">Upd: {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};

export default SilverPriceCard;
