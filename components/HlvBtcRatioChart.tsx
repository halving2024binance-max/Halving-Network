
import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, BarChart2, Zap, Divide, Info, Target, Cpu, ArrowRight } from 'lucide-react';

interface RatioPoint {
  time: string;
  ratio: number;
}

const HlvBtcRatioChart: React.FC = () => {
  const [data, setData] = useState<RatioPoint[]>([]);
  const [currentRatio, setCurrentRatio] = useState(0.00002104);
  const [isLive, setIsLive] = useState(false);

  // Generate 24h historical data simulation
  useEffect(() => {
    const points: RatioPoint[] = [];
    const now = new Date();
    let baseRatio = 0.00001950;
    
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      const volatility = (Math.random() - 0.4) * 0.00000050; // Slight upward drift for the pair
      baseRatio += volatility;
      
      points.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ratio: parseFloat(baseRatio.toFixed(8)),
      });
    }
    setData(points);
    setCurrentRatio(baseRatio);
    setIsLive(true);
  }, []);

  // Real-time tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const shift = (Math.random() - 0.48) * 0.00000010;
      setCurrentRatio(prev => {
        const next = parseFloat((prev + shift).toFixed(8));
        setData(current => {
          const newData = [...current.slice(1)];
          newData.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ratio: next
          });
          return newData;
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };
    const values = data.map(d => d.ratio);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    };
  }, [data]);

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background HUD elements */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        <Divide className="w-64 h-64 text-cyan-400" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <BarChart2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HLV / BTC <span className="text-cyan-400">Ratio Intelligence</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            Relative Protocol Valuation Matrix
          </p>
        </div>

        <div className="flex items-center gap-10">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pair Exchange Rate</div>
              <div className="text-3xl font-black font-mono text-white flex items-baseline gap-2">
                {currentRatio.toFixed(8)}
                <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-tighter">SATS/HLV</span>
              </div>
           </div>
           <div className="h-12 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Correlation</div>
              <div className="text-xl font-black font-mono text-emerald-400">0.982 ADJ</div>
           </div>
        </div>
      </div>

      <div className="h-[320px] w-full font-mono relative z-10 bg-slate-950/40 rounded-[2rem] p-6 border border-slate-800/50 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
              minTickGap={60}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
              orientation="right"
              tickFormatter={(val) => val.toFixed(7)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#020617', 
                borderColor: '#0891b2', 
                borderRadius: '16px',
                fontSize: '11px',
                color: '#f8fafc',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
              formatter={(value: number) => [`${value.toFixed(8)} BTC`, 'Exchange Rate']}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}
            />
            <ReferenceLine y={stats.avg} stroke="#475569" strokeDasharray="3 3" label={{ value: 'AVG', position: 'left', fill: '#475569', fontSize: 8, fontWeight: 'bold' }} />
            <Line 
              type="monotone" 
              dataKey="ratio" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10">
        <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center gap-1 group/stat hover:border-cyan-500/20 transition-all">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">24H RANGE LOW</span>
          <span className="text-sm font-black font-mono text-slate-300">{stats.min.toFixed(8)}</span>
        </div>
        <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center gap-1 group/stat hover:border-cyan-500/20 transition-all">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">24H RANGE HIGH</span>
          <span className="text-sm font-black font-mono text-white">{stats.max.toFixed(8)}</span>
        </div>
        <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center gap-1 group/stat hover:border-cyan-500/20 transition-all">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">PAIR VOLATILITY</span>
          <span className="text-sm font-black font-mono text-cyan-400">0.42% (LOW)</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
             <Target className="w-3.5 h-3.5 text-cyan-500" />
             Pair Status: OPTIMAL_ARB
           </div>
           <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
             <Cpu className="w-3.5 h-3.5 text-indigo-500" />
             Neural Sync: 99.4%
           </div>
        </div>
        <button className="text-[10px] text-cyan-400 hover:text-white uppercase font-black tracking-widest transition-all flex items-center gap-2 group/btn">
          Advanced Pair Analytics
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HlvBtcRatioChart;
