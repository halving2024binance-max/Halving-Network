import React, { useState, useEffect } from 'react';
import { Hexagon, Zap, Globe, Activity, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import DetailedGridMap from './DetailedGridMap';

interface Sector {
  id: string;
  name: string;
  saturation: number;
  status: 'OPTIMAL' | 'PEAK' | 'SYNCING';
}

const MeshSaturationMonitor: React.FC = () => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([
    { id: '1', name: 'NORTH_ATLANTIC_PRIME', saturation: 92, status: 'OPTIMAL' },
    { id: '2', name: 'EURO_CENTRAL_HUB', saturation: 88, status: 'OPTIMAL' },
    { id: '3', name: 'PACIFIC_NEURAL_LINK', saturation: 96, status: 'PEAK' },
    { id: '4', name: 'SOUTH_ASIA_CLUSTER', saturation: 74, status: 'SYNCING' },
    { id: '5', name: 'EMERGING_AFRICA_NODE', saturation: 65, status: 'SYNCING' },
    { id: '6', name: 'LATAM_RESERVE_MESH', saturation: 81, status: 'OPTIMAL' },
  ]);

  const [globalSaturation, setGlobalSaturation] = useState(84.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSectors(prev => prev.map(sector => ({
        ...sector,
        saturation: Math.max(40, Math.min(100, sector.saturation + (Math.random() * 4 - 2))),
        status: sector.saturation > 94 ? 'PEAK' : sector.saturation < 75 ? 'SYNCING' : 'OPTIMAL'
      })));
      setGlobalSaturation(prev => parseFloat((prev + (Math.random() * 0.2 - 0.1)).toFixed(2)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <Hexagon className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Live Mesh Saturation</h3>
            </div>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-600" />
              Real-time Node Density Analysis Matrix
            </p>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Saturation Index</div>
              <div className="text-4xl font-black font-mono text-white flex items-baseline gap-1">
                {globalSaturation}%
                <span className="text-xs text-emerald-400 animate-pulse">▲</span>
              </div>
            </div>
            <div className="h-12 w-px bg-slate-800 hidden md:block" />
            <div className="hidden md:flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Network Capacity</div>
              <div className="text-xl font-black font-mono text-cyan-400 uppercase tracking-tighter italic">Exascale_Active</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {sectors.map((sector) => (
            <div 
              key={sector.id} 
              className="p-5 bg-slate-950/60 border border-slate-800 rounded-3xl hover:border-emerald-500/30 transition-all duration-500 group/sector"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    sector.status === 'PEAK' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' :
                    sector.status === 'SYNCING' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' :
                    'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  } animate-pulse`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                    {sector.name}
                  </span>
                </div>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                  sector.status === 'PEAK' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                  sector.status === 'SYNCING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {sector.status}
                </span>
              </div>

              <div className="flex items-end justify-between mb-2">
                 <div className="text-2xl font-black font-mono text-white group-hover/sector:text-emerald-400 transition-colors">
                   {sector.saturation.toFixed(1)}%
                 </div>
                 <Activity className={`w-4 h-4 ${sector.status === 'PEAK' ? 'text-rose-500' : 'text-slate-700'}`} />
              </div>

              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${
                    sector.status === 'PEAK' ? 'bg-rose-500' :
                    sector.status === 'SYNCING' ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${sector.saturation}%` }}
                />
              </div>

              <div className="mt-4 flex justify-between items-center text-[8px] font-mono text-slate-600 uppercase font-black">
                <span>Syncing 12-Layers</span>
                <div className="flex gap-0.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-1 h-2 rounded-full ${sector.saturation > (i * 15 + 10) ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Integrity</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter">SECURE_LEVEL_12</span>
               </div>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-3">
               <Cpu className="w-5 h-5 text-indigo-400" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Load</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter">14.2%_NOMINAL</span>
               </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMapOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 group/btn"
          >
            Detailed Grid Mapping
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <DetailedGridMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </>
  );
};

export default MeshSaturationMonitor;