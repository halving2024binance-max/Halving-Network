import React, { useState, useMemo } from 'react';
import { X, Search, Filter, BookOpen, Layers, Zap, ShieldCheck, Box, Compass, Cpu, Globe, ArrowUpRight, Download, Activity, Terminal, Binary, Hash } from 'lucide-react';

interface Blueprint {
  id: string;
  title: string;
  category: 'Core' | 'Node' | 'Security' | 'Orbital';
  layer: number;
  complexity: string;
  status: 'PROVISIONED' | 'DRAFT' | 'LEGACY';
  description: string;
  protocol: string;
}

const BLUEPRINTS: Blueprint[] = [
  { id: 'BL-001', title: 'Genesis Validator Prime', category: 'Node', layer: 1, complexity: 'High', status: 'PROVISIONED', description: 'The foundation node architecture for the Halving Network. Features dual-SHA256 scrubbing and cold-sync consensus.', protocol: 'HALV_V1' },
  { id: 'BL-009', title: 'Neural Relay V4', category: 'Core', layer: 9, complexity: 'Exascale', status: 'PROVISIONED', description: 'A high-throughput relay for the 10M agent swarm. Manages real-time data distribution across mesh sectors.', protocol: 'NEURAL_LINK_04' },
  { id: 'BL-012', title: 'Sentinel Decision Core', category: 'Security', layer: 12, complexity: 'Absolute', status: 'PROVISIONED', description: 'The L12 autonomous engine. Designs the primary defensive vectors based on swarm intelligence output.', protocol: 'SENTRY_PROTO_X' },
  { id: 'BL-005', title: 'Starlink Orbital Mesh Hook', category: 'Orbital', layer: 2, complexity: 'Medium', status: 'PROVISIONED', description: 'LEO satellite integration protocol for global sub-ms node synchronization and redundant uplinks.', protocol: 'STAR_LINK_MESH' },
  { id: 'BL-008', title: 'Zero-Knowledge Privacy Vault', category: 'Security', layer: 8, complexity: 'High', status: 'DRAFT', description: 'L8 privacy layer blueprints using Groth16 proofs for identity obfuscation in institutional flows.', protocol: 'ZK_VAULT_BETA' },
  { id: 'BL-004', title: 'Quantum Hashing Pillar', category: 'Core', layer: 4, complexity: 'High', status: 'PROVISIONED', description: 'Cryptographic anchor designed to resist shore-based quantum attacks on block finality.', protocol: 'Q_SHIELD_V2' },
  { id: 'BL-010', title: 'Sovereign ID Mesh', category: 'Orbital', layer: 10, complexity: 'Medium', status: 'LEGACY', description: 'Decentralized identity framework for node operators and authorized lead sentries.', protocol: 'SOV_ID_OLD' },
  { id: 'BL-003', title: 'L3 Logic Scrubber', category: 'Security', layer: 3, complexity: 'Standard', status: 'PROVISIONED', description: 'Real-time smart contract analysis engine that intercepts anomalous transaction patterns.', protocol: 'LOGIC_SCRUB_9' },
];

interface BlueprintDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlueprintDatabaseModal: React.FC<BlueprintDatabaseModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Core' | 'Node' | 'Security' | 'Orbital'>('All');

  const filteredBlueprints = useMemo(() => {
    return BLUEPRINTS.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || b.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 border border-cyan-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(6,182,212,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500">
           <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <BookOpen className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Blueprint <span className="text-cyan-500">Database</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em]">Exascale Infrastructure Registry</span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">ACCESS_AUTHORIZED_L12</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Registry..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-mono text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500/40 transition-all shadow-inner"
                />
             </div>
             <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl shrink-0">
                {['All', 'Core', 'Node', 'Security', 'Orbital'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
             </div>
             <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        {/* Database Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-repeat relative">
          <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlueprints.length === 0 ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 gap-4">
                 <Terminal className="w-16 h-16 opacity-20" />
                 <p className="font-black uppercase tracking-[0.3em] text-xs">No blueprints match current search parameters</p>
              </div>
            ) : (
              filteredBlueprints.map((b) => (
                <div key={b.id} className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] flex flex-col gap-6 group hover:border-cyan-500/40 transition-all hover:translate-y-[-4px] shadow-xl">
                   <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 group-hover:bg-cyan-500/10 transition-all`}>
                         {b.category === 'Node' && <Box className="w-6 h-6 text-cyan-400" />}
                         {b.category === 'Core' && <Cpu className="w-6 h-6 text-indigo-400" />}
                         {b.category === 'Security' && <ShieldCheck className="w-6 h-6 text-emerald-400" />}
                         {b.category === 'Orbital' && <Globe className="w-6 h-6 text-amber-400" />}
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] font-mono font-black text-slate-700">{b.id}</div>
                         <div className={`text-[8px] font-black px-2 py-0.5 rounded border mt-1 ${
                           b.status === 'PROVISIONED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                           b.status === 'DRAFT' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                           'bg-slate-800 border-slate-700 text-slate-500'
                         }`}>
                           {b.status}
                         </div>
                      </div>
                   </div>

                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">{b.title}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{b.category} Matrix</span>
                         <div className="w-1 h-1 rounded-full bg-slate-800" />
                         <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest italic">{b.protocol}</span>
                      </div>
                   </div>

                   <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {b.description}
                   </p>

                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mt-auto">
                      <div className="space-y-1">
                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Complexity</span>
                         <div className="text-xs font-black font-mono text-slate-300">{b.complexity}</div>
                      </div>
                      <div className="space-y-1 text-right">
                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">L12 Target</span>
                         <div className="text-xs font-black font-mono text-cyan-400">LAYER_{b.layer.toString().padStart(2, '0')}</div>
                      </div>
                   </div>

                   <button className="w-full py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                      Analyze Technical Specs
                      <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                   </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <Binary className="w-5 h-5 text-indigo-400" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registry Sync</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter uppercase italic">842_Active_Blueprints</span>
                 </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-3">
                 <Hash className="w-5 h-5 text-emerald-500" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Integrity Seal</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter uppercase italic">SHA256_VERIFIED</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest border border-slate-700 flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> Export_DB_V1
              </button>
              <button 
                onClick={onClose}
                className="flex-1 sm:px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-cyan-900/40 uppercase tracking-widest text-[10px] active:scale-95"
              >
                Close Registry
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

export default BlueprintDatabaseModal;