import React, { useState, useEffect, useMemo } from 'react';
/* Added Landmark to the lucide-react import list */
import { X, BarChart3, TrendingUp, Zap, MousePointer2, Eye, DollarSign, ArrowRight, ShieldCheck, Target, Activity, Globe, Flame, Clock, Terminal, ChevronRight, Download, Filter, Search, Percent, Landmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AdRevenueExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PerformanceData {
  time: string;
  revenue: number;
  burn: number;
}

const CAMPAIGNS = [
  { id: 'C-842', client: 'NVIDIA_GPGPU', status: 'ACTIVE', budget: '$1.2M', ctr: '2.42%', node_cluster: 'ALPHA_PRIME' },
  { id: 'C-791', client: 'STARLINK_COMM', status: 'SYNCING', budget: '$840K', ctr: '1.98%', node_cluster: 'EURO_NORTH' },
  { id: 'C-905', client: 'QUANTUM_LEDGER', status: 'ACTIVE', budget: '$2.1M', ctr: '3.12%', node_cluster: 'PACIFIC_WEST' },
  { id: 'C-124', client: 'SENTRY_DEX', status: 'PAUSED', budget: '$120K', ctr: '0.84%', node_cluster: 'LATAM_HUB' },
];

const AdRevenueExplorerModal: React.FC<AdRevenueExplorerModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [totalGross, setTotalGross] = useState(842095.42);
  const [hlvBurned, setHlvBurned] = useState(14209.12);
  const [isCompiling, setIsCompiling] = useState(true);

  // Generate 24h data
  useEffect(() => {
    if (!isOpen) return;
    
    const points: PerformanceData[] = [];
    const now = Date.now();
    let baseRev = 1200;
    
    for (let i = 24; i >= 0; i--) {
      // Fix: Changed '00' to '2-digit' for the minute option in toLocaleTimeString
      const time = new Date(now - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const rev = baseRev + (Math.random() * 400 - 100);
      points.push({
        time,
        revenue: parseFloat(rev.toFixed(2)),
        burn: parseFloat((rev * 0.33).toFixed(2))
      });
      baseRev = rev;
    }
    setData(points);
    setTimeout(() => setIsCompiling(false), 1200);
  }, [isOpen]);

  // Real-time counter updates
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTotalGross(prev => prev + Math.random() * 5.2);
      setHlvBurned(prev => prev + Math.random() * 1.4);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[95vh] bg-slate-900 border border-amber-500/20 rounded-[3rem] shadow-[0_0_120px_rgba(245,158,11,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500">
           <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <BarChart3 className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Ad Revenue <span className="text-amber-500">Explorer</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em]">Protocol Economy Monitor v4.0</span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest">LIVE_ECONOMY_SYNC</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="flex-1 lg:flex-none p-1 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-2">
                <button className="px-4 py-2 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">Overview</button>
                <button className="px-4 py-2 text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all">Sectors</button>
                <button className="px-4 py-2 text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all">Audit_Logs</button>
             </div>
             <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-90">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat relative">
          <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><DollarSign className="w-16 h-16 text-emerald-500" /></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Network Gross</span>
                  <div className="text-3xl font-black font-mono text-white tracking-tighter">
                    ${totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase">
                    <TrendingUp className="w-3 h-3" /> +14.2% [24H]
                  </div>
               </div>

               <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Flame className="w-16 h-16 text-rose-500" /></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">HLV Permanently Burned</span>
                  <div className="text-3xl font-black font-mono text-rose-400 tracking-tighter">
                    {hlvBurned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase italic">
                    <ShieldCheck className="w-3 h-3" /> Verified_Deflation
                  </div>
               </div>

               <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Eye className="w-16 h-16 text-cyan-500" /></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mesh Impressions</span>
                  <div className="text-3xl font-black font-mono text-white tracking-tighter">
                    84.2M
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-cyan-400 uppercase tracking-tighter">
                    <Activity className="w-3 h-3 animate-pulse" /> Exascale Traffic
                  </div>
               </div>

               <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"><Target className="w-16 h-16 text-amber-500" /></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Avg Network eCPM</span>
                  <div className="text-3xl font-black font-mono text-amber-400 tracking-tighter">
                    $14.20
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase">
                    <Zap className="w-3 h-3 text-amber-500" /> Institutional Class
                  </div>
               </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-[3rem] p-8">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-white uppercase italic flex items-center gap-3">
                      <Activity className="w-5 h-5 text-amber-500" />
                      Revenue Velocity Matrix (24H)
                    </h3>
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Real-time settlement vs deflationary burn rates</p>
                  </div>
                  <div className="flex items-center gap-4 px-4 py-2 bg-black/40 rounded-2xl border border-white/5">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Settlement</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Burn</span>
                     </div>
                  </div>
               </div>

               <div className="h-[350px] w-full font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} minTickGap={60} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '16px', fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" name="Revenue ($)" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" animationDuration={2000} />
                      <Area type="monotone" name="Burn (HLV)" dataKey="burn" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorBurn)" animationDuration={2500} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
               {/* Campaign Feed */}
               <div className="xl:col-span-7 bg-slate-950/60 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                       <Target className="w-5 h-5 text-indigo-400" />
                       Active Global Campaigns
                    </h3>
                    <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl">
                       <Filter className="w-3.5 h-3.5 text-slate-600 ml-2" />
                       <input type="text" placeholder="Search Clients..." className="bg-transparent border-none text-[9px] outline-none text-white w-32 placeholder:text-slate-700" />
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                     {CAMPAIGNS.map((c) => (
                       <div key={c.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-amber-500/30 transition-all cursor-crosshair relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-0.5 h-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center gap-5">
                             <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-slate-500 group-hover:text-amber-500 transition-colors">
                                <Landmark className="w-4 h-4" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-white uppercase">{c.client}</span>
                                   <span className="text-[8px] font-mono text-slate-600">ID: {c.id}</span>
                                </div>
                                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">Cluster: {c.node_cluster}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-10">
                             <div className="text-right">
                                <div className="text-[8px] font-black text-slate-600 uppercase">CTR_ engagement</div>
                                <div className="text-xs font-black font-mono text-emerald-400">{c.ctr}</div>
                             </div>
                             <div className="text-right">
                                <div className="text-[8px] font-black text-slate-600 uppercase">Comm_Budget</div>
                                <div className="text-xs font-black font-mono text-white">{c.budget}</div>
                             </div>
                             <div className={`px-2 py-0.5 rounded text-[7px] font-black border ${
                               c.status === 'ACTIVE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                               c.status === 'SYNCING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                               'bg-slate-800 border-slate-700 text-slate-600'
                             }`}>
                               {c.status}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-800 flex justify-center">
                     <button className="text-[10px] text-slate-500 hover:text-amber-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
                        Open Full Campaign Ledger
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>

               {/* Sector Breakdown Sidebar */}
               <div className="xl:col-span-5 space-y-6">
                  <div className="p-8 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] flex flex-col h-full">
                     <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3 mb-8">
                       <Globe className="w-5 h-5 text-cyan-400" />
                       Planetary Sector Yield
                     </h3>
                     <div className="space-y-6 flex-1">
                        {[
                          { name: 'North Atlantic', value: 42, color: 'bg-emerald-500' },
                          { name: 'Asia Pacific', value: 35, color: 'bg-amber-500' },
                          { name: 'Euro Central', value: 18, color: 'bg-indigo-500' },
                          { name: 'Latam/Emerging', value: 5, color: 'bg-slate-700' },
                        ].map((sector, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-500">{sector.name} Mesh</span>
                                <span className="text-white">${(sector.value * 1240).toLocaleString()}</span>
                             </div>
                             <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                <div 
                                 className={`h-full ${sector.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`} 
                                 style={{ width: `${sector.value}%` }} 
                                />
                             </div>
                             <div className="flex justify-between items-center text-[7px] font-mono text-slate-600">
                                <span>Saturation: {sector.value}%</span>
                                <span>L12_CONNECTED</span>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                        <Terminal className="w-5 h-5 text-amber-500" />
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase">Automatic Yield Balancing</div>
                           <div className="text-[8px] font-mono text-amber-400 animate-pulse">{'>'} Re-allocating node credits to Asia Pacific...</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance Status</span>
                    <span className="text-xs font-mono text-emerald-400 font-black tracking-tighter uppercase italic">Fully_Audited_L12</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-4">
                 <Percent className="w-6 h-6 text-indigo-400" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Staking APR</span>
                    <span className="text-xs font-mono text-indigo-400 font-black tracking-tighter uppercase italic">14.24% ADJ</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2 active:scale-95">
                 <Download className="w-4 h-4" /> Export_Financial_v2
              </button>
              <button 
                onClick={onClose}
                className="flex-1 sm:px-12 py-4 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-2xl transition-all shadow-xl shadow-amber-900/40 uppercase tracking-widest text-[10px] active:scale-95 flex items-center justify-center gap-3"
              >
                Close Explorer
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
      `}</style>
    </div>
  );
};

export default AdRevenueExplorerModal;