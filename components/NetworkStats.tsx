import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Activity, Server, Globe, Box, Zap, ShieldCheck, Info, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HealthDataPoint {
  time: string;
  nodes: number;
  blockHeight: number;
}

const NetworkStats: React.FC = () => {
  const [data, setData] = useState<HealthDataPoint[]>([]);
  const [currentNodes, setCurrentNodes] = useState(12402);
  const [currentHeight, setCurrentHeight] = useState(840432);

  // Initial data generation for 24 hours
  useEffect(() => {
    const points: HealthDataPoint[] = [];
    const now = Date.now();
    const baseHeight = 840432 - 144; // Approx 144 blocks in 24h
    
    for (let i = 24; i >= 0; i--) {
      // Fix: '00' is not a valid value for minute in DateTimeFormatOptions; changed to '2-digit'
      const time = new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      points.push({
        time,
        nodes: 12300 + Math.floor(Math.random() * 200),
        blockHeight: baseHeight + Math.floor((24 - i) * 6) // Linear-ish growth
      });
    }
    setData(points);
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const nodeShift = Math.floor(Math.random() * 5 - 2);
      setCurrentNodes(prev => prev + nodeShift);
      
      // Random block height increment
      if (Math.random() > 0.8) {
        setCurrentHeight(prev => prev + 1);
      }

      setData(currentData => {
        const last = currentData[currentData.length - 1];
        const newData = [...currentData.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          nodes: 12300 + Math.floor(Math.random() * 200),
          blockHeight: currentHeight
        });
        return newData;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [currentHeight]);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
        <Activity className="w-80 h-80 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Server className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Network <span className="text-emerald-500">Health Monitor</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            24-Hour Exascale Telemetry Loop
          </p>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Mesh Nodes</div>
              <div className="text-3xl font-black font-mono text-white tracking-tighter flex items-center gap-2">
                {currentNodes.toLocaleString()}
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] text-emerald-500 font-bold uppercase">Verified</span>
                </motion.div>
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Block Height</div>
              <div className="text-xl font-black font-mono text-indigo-400">
                #{currentHeight.toLocaleString()}
              </div>
           </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-[350px] w-full font-mono relative z-10 bg-slate-950/40 rounded-3xl p-6 border border-slate-800/50 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorNodes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#475569', fontSize: 10 }}
              minTickGap={60}
            />
            {/* Fix: Recharts prop is yAxisId, not yId */}
            <YAxis 
              yAxisId="left"
              orientation="left"
              domain={['auto', 'auto']} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#10b981', fontSize: 10 }}
            />
            {/* Fix: Recharts prop is yAxisId, not yId */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={['auto', 'auto']} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6366f1', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#020617', 
                borderColor: '#1e293b', 
                borderRadius: '16px',
                fontSize: '11px',
                color: '#f8fafc',
                fontFamily: 'JetBrains Mono',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
              cursor={{ stroke: '#10b981', strokeWidth: 1 }}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', paddingBottom: '20px' }}
            />
            {/* Fix: Recharts prop is yAxisId, not yId */}
            <Area 
              yAxisId="left"
              type="monotone" 
              name="Active Nodes"
              dataKey="nodes" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorNodes)" 
              animationDuration={1500}
            />
            {/* Fix: Recharts prop is yAxisId, not yId */}
            <Area 
              yAxisId="right"
              type="monotone" 
              name="Block Height"
              dataKey="blockHeight" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHeight)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Validation Integrity: 100%
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
               Exascale Finality: Stable
            </div>
         </div>
         <div className="flex items-center gap-2 text-slate-600">
            <Info className="w-3 h-3" />
            <span className="text-[9px] font-black uppercase tracking-widest">Model Link: SECURE_V3</span>
         </div>
      </div>
    </div>
  );
};

export default NetworkStats;