import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Zap, Cpu, Sparkles, Info } from 'lucide-react';

interface ChartPoint {
  time: string;
  price: number;
}

interface HlvPriceChartProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const HlvPriceChart: React.FC<HlvPriceChartProps> = ({ swarmMetrics }) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.42);
  const [change24h, setChange24h] = useState(12.4);
  const wsRef = useRef<WebSocket | null>(null);

  // Generate initial historical data
  useEffect(() => {
    const points: ChartPoint[] = [];
    const now = new Date();
    let basePrice = 1.42;
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      const volatility = (Math.random() - 0.45) * 0.02;
      basePrice += volatility;
      
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: parseFloat(basePrice.toFixed(4)),
      });
    }
    setData(points);
    setCurrentPrice(basePrice);

    // Connect to real-time feed
    const connectWS = () => {
      const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const btcPrice = parseFloat(payload.c);
        const btcChange = parseFloat(payload.P);
        
        // Derive HLV price from BTC price
        const hlvPrice = (btcPrice / 45000) * 1.4285;
        
        setCurrentPrice(hlvPrice);
        setChange24h(btcChange);

        setData(currentData => {
          const lastPoint = currentData[currentData.length - 1];
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          if (lastPoint && lastPoint.time === nowTime) {
            // Update last point if it's the same minute
            const newData = [...currentData];
            newData[newData.length - 1] = { time: nowTime, price: hlvPrice };
            return newData;
          } else {
            // Add new point
            const newData = [...currentData.slice(1)];
            newData.push({ time: nowTime, price: hlvPrice });
            return newData;
          }
        });
      };

      ws.onclose = () => setTimeout(connectWS, 3000);
    };

    connectWS();
    return () => wsRef.current?.close();
  }, []);

  // Removed old interval-based update as it's now handled by WebSocket

  const priceRange = useMemo(() => {
    if (data.length === 0) return [0, 2];
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.2;
    return [min - padding, max + padding];
  }, [data]);

  return (
    <div className="bg-slate-900/60 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* HUD Background elements */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        <Zap className="w-64 h-64 text-indigo-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV Protocol <span className="text-indigo-400">Live Chart</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Neural Asset Liquidity Tracker
          </p>
        </div>

        <div className="flex items-center gap-10">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">HLV/BTC Index</div>
              <div className="text-4xl font-black font-mono text-white flex items-baseline gap-2">
                ${currentPrice.toFixed(4)}
                <span className={`text-xs font-bold ${change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {change24h >= 0 ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
                </span>
              </div>
           </div>
           <div className="h-12 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Compute Correlation</div>
              <div className="text-xl font-black font-mono text-indigo-400">0.842 SIGMA</div>
           </div>
        </div>
      </div>

      <div className="h-[300px] w-full font-mono relative z-10 bg-slate-950/40 rounded-3xl p-4 border border-slate-800/50 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorHlv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
              minTickGap={60}
            />
            <YAxis 
              domain={priceRange} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
              orientation="right"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#020617', 
                borderColor: '#4338ca', 
                borderRadius: '16px',
                fontSize: '11px',
                color: '#f8fafc',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
              cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
              formatter={(value: number) => [`$${value.toFixed(4)}`, 'Price']}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHlv)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Demand: HIGH</span>
           </div>
           <div className="flex items-center gap-2">
             <Activity className="w-3.5 h-3.5 text-cyan-500" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sentiment: ACCUMULATION</span>
           </div>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
           <Info className="w-3 h-3" />
           Internal Neural Valuation Matrix v1.4
        </div>
      </div>
    </div>
  );
};

export default HlvPriceChart;