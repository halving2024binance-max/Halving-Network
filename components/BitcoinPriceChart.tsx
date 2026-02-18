
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Info, AlertTriangle } from 'lucide-react';

interface ChartPoint {
  time: string;
  price: number;
}

const BitcoinPriceChart: React.FC = () => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const generateFallbackData = () => {
    const points: ChartPoint[] = [];
    const now = new Date();
    let basePrice = 67000 + Math.random() * 2000;
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      // Create a wavy, realistic price curve
      const volatility = (Math.random() - 0.5) * 800;
      basePrice += volatility;
      
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: basePrice,
      });
    }
    return points;
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1',
        { signal: AbortSignal.timeout(8000) }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const json = await response.json();
      
      const formattedData = json.prices.map((p: [number, number]) => ({
        time: new Date(p[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: p[1],
      }));
      
      setData(formattedData);
      setLoading(false);
      setIsFallback(false);
    } catch (error) {
      console.warn('BTC History Fetch Failed, Rendering Internal Dataset:', error);
      setData(generateFallbackData());
      setLoading(false);
      setIsFallback(true);
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, []);

  const priceRange = useMemo(() => {
    if (data.length === 0) return [0, 0];
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.15;
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [data]);

  if (loading || data.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 h-[300px] flex items-center justify-center animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-cyan-500/50 animate-bounce" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Compiling Neural Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            24H Market Trajectory
          </h3>
          <span className="text-[10px] text-slate-600 font-mono mt-1">
            {isFallback ? 'Simulated via Sentinel Intelligence' : 'Sourced from decentralized indexers'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isFallback ? 'bg-amber-500' : 'bg-cyan-500'}`}></div>
            <span className={`text-[10px] font-mono ${isFallback ? 'text-amber-500' : 'text-cyan-500'}`}>
              {isFallback ? 'INTERNAL_MODEL' : 'REALTIME_SYNC'}
            </span>
          </div>
          {isFallback && (
            <div className="group/alert relative">
              <AlertTriangle className="w-4 h-4 text-amber-500 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-950 border border-slate-800 rounded text-[9px] text-slate-400 opacity-0 group-hover/alert:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                External indexer unreachable. Displaying internal neural trajectory simulation.
              </div>
            </div>
          )}
          <Info className="w-4 h-4 text-slate-700 hover:text-cyan-400 cursor-help transition-colors" />
        </div>
      </div>

      <div className="h-[220px] w-full font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isFallback ? "#f59e0b" : "#06b6d4"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isFallback ? "#f59e0b" : "#06b6d4"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="time" 
              hide={true}
            />
            <YAxis 
              domain={priceRange} 
              hide={true} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#1e293b',
                borderRadius: '8px',
                fontSize: '10px',
                color: '#f8fafc',
                fontFamily: 'JetBrains Mono'
              }}
              itemStyle={{ color: isFallback ? '#f59e0b' : '#22d3ee' }}
              formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Price']}
              labelStyle={{ color: '#64748b', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={isFallback ? "#f59e0b" : "#06b6d4"} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
        <span>-24 Hours</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-amber-500/50' : 'bg-cyan-500/50'}`} /> 
            Price (USD)
          </span>
        </div>
        <span>Current</span>
      </div>
    </div>
  );
};

export default BitcoinPriceChart;
