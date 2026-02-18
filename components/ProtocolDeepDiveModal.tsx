import React, { useState, useEffect, useRef, useMemo } from 'react';
// Added Download to the lucide-react import list to fix 'Cannot find name Download' error
import { X, Shield, Cpu, Zap, Activity, ShieldCheck, Terminal, Layers, Globe, Database, Hash, Lock, Search, Filter, ArrowRight, Binary, Fingerprint, Eye, Scale, Radar, Download } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';

interface ProtocolDeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProtocolDeepDiveModal: React.FC<ProtocolDeepDiveModalProps> = ({ isOpen, onClose }) => {
  const [selectedLayer, setSelectedLayer] = useState(11); // Start with L12 (Core)
  const [isVerifying, setIsVerifying] = useState(false);
  const [entropy, setEntropy] = useState(99.982);
  const [consensusHeat, setConsensusHeat] = useState(new Array(64).fill(0));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation: Update live stats
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEntropy(prev => Math.min(100, Math.max(99.9, prev + (Math.random() * 0.002 - 0.001))));
      setConsensusHeat(prev => prev.map(() => Math.random() * 0.5 + 0.5));
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Heatmap Renderer
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      const w = canvas.width = 400;
      const h = canvas.height = 400;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      const cells = 8;
      const cellSize = w / cells;

      for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
          const idx = i * cells + j;
          const heat = consensusHeat[idx] || 0.8;
          const alpha = 0.2 + (heat * 0.5);
          
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.fillRect(i * cellSize + 2, j * cellSize + 2, cellSize - 4, cellSize - 4);
          
          if (Math.random() > 0.98) {
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(i * cellSize + 2, j * cellSize + 2, cellSize - 4, cellSize - 4);
          }
        }
      }

      // Scanner Line
      const scanY = (frame * 2) % h;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      frame++;
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, consensusHeat]);

  const currentLayer = SECURITY_LAYERS[selectedLayer];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full h-full max-w-7xl bg-slate-900 border border-indigo-500/20 rounded-[3.5rem] shadow-[0_0_150px_rgba(99,102,241,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Top Forensic Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />
        
        {/* Header Block */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
              <Binary className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Protocol <span className="text-indigo-400">Deep Dive Audit</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em]">Forensic Mesh Analyzer v1.4</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest italic">LEVEL_12_AUTH_REQUIRED</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar: 12-Layer Nav */}
          <aside className="w-80 border-r border-slate-800 bg-slate-950/60 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
             <div className="px-4 mb-4">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Select Security Tier</span>
             </div>
             {SECURITY_LAYERS.map((layer, idx) => (
               <button
                key={layer.id}
                onClick={() => setSelectedLayer(idx)}
                className={`p-4 rounded-2xl flex items-center justify-between group transition-all ${
                  selectedLayer === idx 
                    ? 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-100 shadow-xl' 
                    : 'bg-slate-900/40 border border-slate-800/50 text-slate-500 hover:border-slate-600'
                }`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`text-[10px] font-mono font-black ${selectedLayer === idx ? 'text-indigo-400' : 'text-slate-700'}`}>
                        L{String(layer.id).padStart(2, '0')}
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-widest text-left truncate max-w-[140px]">{layer.name}</span>
                  </div>
                  {selectedLayer === idx && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
               </button>
             ))}
          </aside>

          {/* Main Investigative Content */}
          <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
             
             <div className="relative z-10 space-y-10">
                {/* Layer Overview Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
                   <div className="space-y-4 max-w-2xl">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-[10px] font-black text-indigo-400">
                            TIER_{currentLayer.id >= 9 ? 'AI_SENTINEL' : 'INFRA'}
                         </div>
                         <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">{currentLayer.name}</h3>
                      </div>
                      <p className="text-lg text-slate-400 font-medium leading-relaxed italic">
                         "{currentLayer.description}"
                      </p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                         <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Layer Security Hash</div>
                         <div className="text-xl font-black font-mono text-emerald-400">L12-VERIFIED-V4</div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                         <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                   </div>
                </div>

                {/* Analytical Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                   {/* Technical Specs Cluster */}
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                         <Database className="w-4 h-4 text-indigo-500" />
                         Technical Parameters
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {[
                           { label: 'Compute Difficulty', val: '84.2 EH/S', icon: Zap },
                           { label: 'Layer Finality', val: '12.4 MS', icon: Activity },
                           { label: 'ZK-Proof Velocity', val: '14,200/s', icon: Lock },
                           { label: 'Shard Latency', val: '0.02 MS', icon: Globe }
                         ].map((spec, i) => (
                           <div key={i} className="p-5 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-indigo-500/30 transition-all">
                              <div className="flex justify-between items-center mb-3">
                                 <spec.icon className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                 <span className="text-[8px] font-black text-slate-700 uppercase">Param_OK</span>
                              </div>
                              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{spec.label}</div>
                              <div className="text-xl font-black font-mono text-white">{spec.val}</div>
                           </div>
                         ))}
                      </div>

                      <div className="p-8 bg-slate-950/80 border border-slate-800 rounded-[2.5rem] relative overflow-hidden">
                         <div className="flex justify-between items-center mb-6">
                            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                               <Fingerprint className="w-4 h-4 text-emerald-500" />
                               Cryptographic Entropy Hub
                            </h4>
                            <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[7px] font-black">STABLE</div>
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="flex-1 space-y-4">
                               <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                                  <div className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981] transition-all duration-1000" style={{ width: `${entropy}%` }} />
                               </div>
                               <div className="flex justify-between text-[10px] font-mono text-slate-500">
                                  <span>ENTROPY_MIN: 98.4</span>
                                  <span className="text-white font-black">{entropy.toFixed(3)}%</span>
                               </div>
                            </div>
                            <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin-slow flex items-center justify-center">
                               <Zap className="w-6 h-6 text-emerald-500" />
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Global Mesh Visualization */}
                   <div className="flex flex-col gap-6">
                      <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                         <Radar className="w-4 h-4 text-cyan-500" />
                         Mesh Consensus Heatmap
                      </h4>
                      <div className="bg-slate-950/80 border border-slate-800 rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-h-[400px] relative">
                         <canvas ref={canvasRef} className="rounded-2xl shadow-2xl opacity-90 hover:opacity-100 transition-opacity" />
                         <div className="absolute top-10 right-10 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500" />
                               <span className="text-[8px] font-black text-slate-500 uppercase">Synchronized</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-indigo-500" />
                               <span className="text-[8px] font-black text-slate-500 uppercase">Validating</span>
                            </div>
                         </div>
                         <div className="mt-8 text-center space-y-2">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Node Consensus</div>
                            <div className="text-3xl font-black font-mono text-white tracking-tighter">99.98% AGREEMENT</div>
                            <div className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em]">Sector: Global_Mainnet_01</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Audit Terminal Log */}
                <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <Terminal className="w-5 h-5 text-indigo-400" />
                         <span className="text-xs font-black text-white uppercase tracking-widest">Layer_Audit_Trace</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <button className="flex items-center gap-2 text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase">
                            <Search className="w-3.5 h-3.5" /> Filter Log
                         </button>
                         <button className="flex items-center gap-2 text-[9px] font-black text-slate-600 hover:text-white transition-colors uppercase">
                            <Download className="w-3.5 h-3.5" /> Export Bin
                         </button>
                      </div>
                   </div>
                   <div className="bg-black/60 border border-white/5 rounded-2xl p-6 font-mono text-[10px] space-y-2 overflow-hidden h-40 shadow-inner">
                      <div className="flex gap-4">
                         <span className="text-slate-600">[14:42:01]</span>
                         <span className="text-indigo-400">REQ:</span>
                         <span className="text-slate-300">L{currentLayer.id}_PROTOCOL_HANDSHAKE_INIT...</span>
                      </div>
                      <div className="flex gap-4">
                         <span className="text-slate-600">[14:42:02]</span>
                         <span className="text-emerald-400">RES:</span>
                         <span className="text-slate-300">NEURAL_VERIFICATION_COMPLETE (SIG: {Math.random().toString(16).substring(2,10)})</span>
                      </div>
                      <div className="flex gap-4">
                         <span className="text-slate-600">[14:42:05]</span>
                         <span className="text-amber-400">INF:</span>
                         <span className="text-slate-300">LAYER_ADAPTIVE_LOAD_ADJUSTMENT: 14.2% {'->'} 14.4%</span>
                      </div>
                      <div className="flex gap-4">
                         <span className="text-slate-600">[14:42:08]</span>
                         <span className="text-indigo-400">REQ:</span>
                         <span className="text-slate-300">GLOBAL_CONSENSUS_SNAPSHOT_V4...</span>
                      </div>
                      <div className="flex gap-4 animate-pulse">
                         <span className="text-slate-600">[14:42:12]</span>
                         <span className="text-emerald-400">OK:</span>
                         <span className="text-slate-300">MESH_SYNCHRONIZATION_STABLE. Awaiting next epoch...</span>
                      </div>
                      <div className="flex gap-4 opacity-40">
                         <span className="text-slate-600">[14:42:15]</span>
                         <span className="text-slate-500">{'>'} _</span>
                      </div>
                   </div>
                </div>
             </div>
          </main>
        </div>

        {/* Tactical Footer Overlay */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 shrink-0 relative z-10">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                 <Shield className="w-6 h-6 text-indigo-400" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Version</span>
                    <span className="text-sm font-mono text-indigo-400 font-bold tracking-tighter uppercase italic">HALVING_GENESIS_V1.4</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-4">
                 <Scale className="w-6 h-6 text-amber-500" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Valuation Index</span>
                    <span className="text-sm font-mono text-amber-500 font-bold tracking-tighter uppercase italic">842.4 PH/S BACKED</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                 <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link: ACTIVE</span>
              </div>
              <button 
                onClick={onClose}
                className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/20 uppercase tracking-widest text-[10px] active:scale-95"
              >
                 Terminate Audit
              </button>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProtocolDeepDiveModal;