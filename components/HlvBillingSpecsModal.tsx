import React, { useState, useEffect } from 'react';
import { X, Receipt, Zap, Cpu, ShieldCheck, Flame, Layers, ArrowRight, Terminal, Info, DollarSign, Database, Activity, Calculator, RefreshCw, ChevronRight, Binary } from 'lucide-react';

interface HlvBillingSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HlvBillingSpecsModal: React.FC<HlvBillingSpecsModalProps> = ({ isOpen, onClose }) => {
  const [calcComplexity, setCalcComplexity] = useState(50);
  const [isCalculating, setIsCalculating] = useState(false);
  const [liveRate, setLiveRate] = useState(0.00001240);
  const [showLayerDetail, setShowLayerDetail] = useState<number | null>(null);

  const feeTiers = [
    { name: 'Standard Transaction', base: '0.000010', surcharge: '0-5%', latency: '< 2.4s', icon: Database },
    { name: 'Priority Mesh', base: '0.000025', surcharge: '5-12%', latency: '< 840ms', icon: Zap },
    { name: 'Institutional Exascale', base: '0.000100', surcharge: '15-25%', latency: '< 400ms', icon: ShieldCheck },
  ];

  const layerSurcharges = [
    { layer: 1, name: "Network Perimeter", fee: "0.000002" },
    { layer: 2, name: "Node Consensus", fee: "0.000001" },
    { layer: 3, name: "Smart Contract Audit", fee: "0.000005" },
    { layer: 4, name: "Cryptographic Hashing", fee: "0.000001" },
    { layer: 5, name: "Cold Storage Protocol", fee: "0.000008" },
    { layer: 6, name: "Multi-Sig Verification", fee: "0.000004" },
    { layer: 7, name: "Neural Threat Analysis", fee: "0.000012" },
    { layer: 8, name: "Zero-Knowledge Proofs", fee: "0.000015" },
    { layer: 9, name: "Liquidity Sentinel", fee: "0.000006" },
    { layer: 10, name: "Decentralized ID", fee: "0.000003" },
    { layer: 11, name: "Governance Bridge", fee: "0.000002" },
    { layer: 12, name: "Ai Sentinel Core", fee: "0.000025" }
  ];

  const refreshRate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setLiveRate(0.00001000 + Math.random() * 0.00000500);
      setIsCalculating(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const calculatedTotal = (liveRate * (calcComplexity / 50)).toFixed(8);

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/50 rounded-[3rem] shadow-[0_0_100px_rgba(245,158,11,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
        {/* Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500">
           <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Receipt className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Protocol <span className="text-amber-500">Billing Specs</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em]">Settlement Matrix v1.4.2</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">REALTIME_ADJUST_ENABLED</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-95">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
           
           {/* Section: Live Cost Calculator */}
           <div className="bg-slate-950/60 border border-amber-500/20 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Calculator className="w-64 h-64 text-amber-500" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                 <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                       <Calculator className="w-5 h-5 text-amber-500" />
                       Live Protocol Cost Calculator
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Estimate settlement costs based on exascale complexity</p>
                 </div>
                 <button 
                  onClick={refreshRate}
                  disabled={isCalculating}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase transition-all"
                 >
                    {isCalculating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    Sync Neural Rates
                 </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 <div className="space-y-6">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Transmission Complexity</span>
                          <span className="text-amber-500">{calcComplexity}% Weight</span>
                       </div>
                       <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={calcComplexity} 
                        onChange={(e) => setCalcComplexity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                       />
                       <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase">
                          <span>Standard_Segwit</span>
                          <span>Multi_Neural_Sig</span>
                       </div>
                    </div>

                    <div className="p-4 bg-black/40 border border-slate-800 rounded-2xl space-y-3">
                       <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <Binary className="w-3.5 h-3.5" />
                          Neural Load Scaling
                       </div>
                       <div className="flex gap-1 h-4 items-end">
                          {[...Array(20)].map((_, i) => (
                            <div key={i} className={`flex-1 rounded-sm ${i < (calcComplexity / 5) ? 'bg-amber-500/40' : 'bg-slate-800'}`} style={{ height: `${20 + Math.random() * 80}%` }} />
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex flex-col justify-center items-center text-center space-y-4 shadow-inner">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Estimated Protocol Fee</div>
                    <div className="flex items-baseline gap-2">
                       <span className={`text-5xl font-black font-mono tracking-tighter transition-all ${isCalculating ? 'opacity-20 blur-sm' : 'text-white'}`}>
                          {calculatedTotal}
                       </span>
                       <span className="text-lg font-black text-amber-500 font-mono">BTC</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                       <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                       <span className="text-[9px] font-black text-amber-500 uppercase">Settlement Guaranteed_L12</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Tier Matrix */}
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Database className="w-4 h-4 text-emerald-500" />
                 Protocol Tier Matrix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {feeTiers.map((tier, idx) => (
                   <div key={idx} className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] space-y-6 group hover:border-amber-500/30 transition-all">
                      <div className="flex justify-between items-start">
                         <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                            <tier.icon className="w-6 h-6 text-amber-400" />
                         </div>
                         <div className="text-right">
                            <div className="text-[8px] font-black text-slate-600 uppercase">Tier_{idx + 1}</div>
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Active</div>
                         </div>
                      </div>
                      <div>
                         <h4 className="text-white font-black uppercase text-sm mb-1">{tier.name}</h4>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Base Fee Protocol</p>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">Base:</span>
                            <span className="text-sm font-black font-mono text-white">{tier.base} <span className="text-[8px] text-slate-500">BTC</span></span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">Neural:</span>
                            <span className="text-sm font-black font-mono text-amber-500">+{tier.surcharge}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400">Latency:</span>
                            <span className="text-sm font-black font-mono text-indigo-400">{tier.latency}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Section: 12-Layer Surcharge Breakdown */}
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
                 <Layers className="w-4 h-4 text-indigo-500" />
                 L12 Surcharge Breakdown
              </h3>
              <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-800">
                    {layerSurcharges.map((item, i) => (
                      <div 
                        key={i} 
                        className={`p-6 bg-slate-950 transition-all cursor-help relative group/layer ${showLayerDetail === i ? 'bg-indigo-500/5' : 'hover:bg-slate-900'}`}
                        onMouseEnter={() => setShowLayerDetail(i)}
                        onMouseLeave={() => setShowLayerDetail(null)}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[8px] font-mono font-black text-slate-600">LAYER_{item.layer.toString().padStart(2, '0')}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${showLayerDetail === i ? 'bg-indigo-400 shadow-[0_0_8px_#818cf8]' : 'bg-slate-800'}`} />
                         </div>
                         <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 group-hover/layer:text-white transition-colors">{item.name}</h5>
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-500">Surcharge:</span>
                            <span className="text-[10px] font-black font-mono text-indigo-400">{item.fee} BTC</span>
                         </div>
                         {showLayerDetail === i && (
                           <div className="absolute inset-0 flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-sm animate-in fade-in duration-200">
                              <p className="text-[8px] font-black text-indigo-200 leading-relaxed uppercase text-center tracking-widest">
                                Critical security validation required for exascale settlement finality. 
                              </p>
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Section: Revenue Distribution & Burn */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-[2.5rem] space-y-6">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    Protocol Revenue Distribution
                 </h3>
                 <div className="space-y-6">
                    {[
                      { label: 'Deflationary Burn', val: 33.3, color: 'bg-rose-500' },
                      { label: 'Neural Swarm OPS', val: 35.0, color: 'bg-indigo-500' },
                      { label: 'Staking & Nodes', val: 31.7, color: 'bg-emerald-500' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-white">{item.val}%</span>
                         </div>
                         <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                            <div className={`h-full ${item.color} rounded-full shadow-[0_0_8px_currentColor]`} style={{ width: `${item.val}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                    <p className="text-[9px] text-rose-400/80 font-bold uppercase leading-relaxed italic">
                      * 33.3% of all settlement fees are permanently removed from circulation to maintain protocol scarcity through the 2024 cycle.
                    </p>
                 </div>
              </div>

              <div className="p-8 bg-slate-950/60 border border-slate-800 rounded-[2.5rem] flex flex-col">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    Neural Surcharge Factors
                 </h3>
                 <div className="flex-1 space-y-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-help transition-all hover:border-indigo-500/30">
                       <div className="flex items-center gap-4">
                          <Activity className="w-5 h-5 text-indigo-400" />
                          <span className="text-[10px] font-black text-slate-300 uppercase">Swarm Mesh Load</span>
                       </div>
                       <span className="text-xs font-black font-mono text-white">0.0 - 15.0%</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-help transition-all hover:border-cyan-500/30">
                       <div className="flex items-center gap-4">
                          <Layers className="w-5 h-5 text-cyan-400" />
                          <span className="text-[10px] font-black text-slate-300 uppercase">L12 Compute Depth</span>
                       </div>
                       <span className="text-xs font-black font-mono text-white">FIXED_MOD</span>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-help transition-all hover:border-emerald-500/30">
                       <div className="flex items-center gap-4">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <span className="text-[10px] font-black text-slate-300 uppercase">Signature Complexity</span>
                          <span className="text-[8px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black ml-2">ZK_PROOF</span>
                       </div>
                       <span className="text-xs font-black font-mono text-white">ADAPTIVE</span>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                       <Terminal className="w-4 h-4 text-amber-500" />
                       <span className="text-[9px] font-mono text-slate-600 uppercase font-black animate-pulse">{'>'} CALCULATING_OPTIMAL_GAS_...</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <ShieldCheck className="w-6 h-6 text-emerald-500" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compliance Level</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter uppercase">Fully_Audited_L12</span>
                   </div>
                </div>
                <div className="h-10 w-px bg-slate-800 hidden md:block" />
                <div className="flex items-center gap-3">
                   <DollarSign className="w-6 h-6 text-indigo-400" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Settlement Asset</span>
                      <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter uppercase">HLV_NATIVE_UTILITY</span>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-3xl transition-all shadow-xl shadow-amber-900/20 uppercase tracking-[0.2em] text-[11px] active:scale-95 group/btn flex items-center justify-center gap-3"
              >
                Close Settlement Specs
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default HlvBillingSpecsModal;