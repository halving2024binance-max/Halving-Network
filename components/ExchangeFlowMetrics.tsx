
import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, Activity, ArrowRight, Info, TrendingUp, TrendingDown } from 'lucide-react';

const ExchangeFlowMetrics: React.FC = () => {
  const [flow, setFlow] = useState({
    inflow: 14209,
    outflow: 12154,
    netFlow: 2055,
    sentiment: 'ACCUMULATION'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFlow(prev => {
        const dIn = (Math.random() * 20 - 5);
        const dOut = (Math.random() * 18 - 4);
        const newIn = Math.max(5000, prev.inflow + dIn);
        const newOut = Math.max(5000, prev.outflow + dOut);
        const net = newIn - newOut;
        
        return {
          inflow: newIn,
          outflow: newOut,
          netFlow: net,
          sentiment: net > 1000 ? 'ACCUMULATION' : net < -1000 ? 'DISTRIBUTION' : 'NEUTRAL'
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const total = flow.inflow + flow.outflow;
  const inflowPercent = (flow.inflow / total) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-emerald-950/20 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
         <Activity className="w-16 h-16 text-emerald-500" />
      </div>

      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Activity className="w-4 h-4 text-emerald-400" />
        EXCHANGE LIQUIDITY FLOW (24H)
      </h4>

      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <LogIn className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Inflow</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {flow.inflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-[10px] text-slate-500 ml-1">BTC</span>
            </div>
          </div>
          <div className="p-3 bg-slate-950/50 border border-slate-800/50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <LogOut className="w-3 h-3 text-rose-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase">Outflow</span>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {flow.outflow.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-[10px] text-slate-500 ml-1">BTC</span>
            </div>
          </div>
        </div>

        {/* Ratio Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Liquidity Bias</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{inflowPercent.toFixed(1)}% IN</span>
          </div>
          <div className="h-1.5 bg-rose-500/20 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-emerald-500 transition-all duration-1000 ease-in-out" 
              style={{ width: `${inflowPercent}%` }}
            />
          </div>
        </div>

        {/* Net Flow Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 uppercase font-bold">24H Net Flow</span>
            <div className={`text-sm font-black font-mono flex items-center gap-1 ${flow.netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {flow.netFlow >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {flow.netFlow >= 0 ? '+' : ''}{flow.netFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })} BTC
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Sentiment</span>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tighter border ${
              flow.sentiment === 'ACCUMULATION' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
              flow.sentiment === 'DISTRIBUTION' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
              'bg-slate-500/10 border-slate-500/30 text-slate-400'
            }`}>
              {flow.sentiment}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeFlowMetrics;
