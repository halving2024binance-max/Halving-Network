import React, { useState } from 'react';
import { X, FileText, ChevronRight, Shield, Cpu, Zap, Landmark, Globe, Layers, BookOpen, Download, Share2, Sparkles, Crown, Target, Eye } from 'lucide-react';

interface WhitePaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhitePaperModal: React.FC<WhitePaperModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('abstract');

  if (!isOpen) return null;

  const sections = [
    { id: 'abstract', title: 'Abstract & Vision', icon: Sparkles },
    { id: 'security', title: '12-Layer Defense', icon: Shield },
    { id: 'ai-swarm', title: 'Neural Swarm AI', icon: Cpu },
    { id: 'economics', title: 'Halving Economics', icon: Landmark },
    { id: 'infrastructure', title: 'Global Mesh', icon: Globe },
    { id: 'roadmap', title: '2030 Roadmap', icon: Zap },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500">
           <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>

        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Protocol <span className="text-emerald-500">White Paper</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em]">Version 1.0.4-GENESIS</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">AUTHENTICATED_SECURE</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 p-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest border border-slate-700">
              <Download className="w-4 h-4" /> PDF_EXPORT
            </button>
            <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <aside className="w-72 border-r border-slate-800 bg-slate-950/20 p-6 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
             {sections.map((section) => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all group ${
                   activeSection === section.id 
                    ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400' 
                    : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-emerald-400' : 'group-hover:text-emerald-500'}`} />
                   <span className="text-[11px] font-black uppercase tracking-widest">{section.title}</span>
                 </div>
                 {activeSection === section.id && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2 duration-300" />}
               </button>
             ))}
             
             <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                   <div className="text-[9px] font-black text-slate-500 uppercase">Lead Sentry</div>
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                         <Crown className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-[10px] font-black text-slate-300 italic">HOPÎRDA ADRIAN</div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat relative">
            <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-12 pb-20">
              
              {activeSection === 'abstract' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white tracking-tighter italic">ABSTRACT</h3>
                    <p className="text-lg text-slate-400 leading-relaxed font-medium">
                      The Halving Network is an autonomous, exascale blockchain surveillance and security architecture designed to safeguard decentralized assets in the post-quantum era. By integrating a 12-layer verification stack with the <b>AI Sentinel</b> neural swarm of ten million agents, the network achieves unparalleled finality and threat detection.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2rem] space-y-3">
                       <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Vision 2030</h4>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase">To become the universal verification layer for the global financial mesh, ensuring integrity through the 2024 halving cycle and beyond.</p>
                    </div>
                    <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-[2rem] space-y-3">
                       <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Mission</h4>
                       <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase">Absolute cryptographic sovereignty maintained by real-time neural intelligence and decentralized consensus.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                  <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">12-LAYER_SECURITY</h3>
                  <div className="space-y-6">
                     <p className="text-slate-400 leading-relaxed">The AI Sentinel implements a tiered security model where each transaction must clear twelve distinct cryptographic and neural hurdles before finality is reached.</p>
                     <div className="grid grid-cols-1 gap-4">
                        {[
                          { l: '1-4', n: 'Foundation Nodes', d: 'Base layer validation, SHA-256 integrity checks, and DDoS mitigation.' },
                          { l: '5-8', n: 'Protocol Guard', d: 'Cold storage interaction, multi-sig verification, and ZK-Identity proofs.' },
                          { l: '9-12', n: 'Neural Sentinel', d: 'AI pattern matching, institutional flow analysis, and autonomous threat neutralization.' },
                        ].map((item, i) => (
                          <div key={i} className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl flex items-center gap-6 group hover:border-emerald-500/30 transition-all">
                             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">L{item.l}</div>
                             <div>
                                <h5 className="text-white font-black uppercase text-sm mb-1">{item.n}</h5>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{item.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {activeSection === 'ai-swarm' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                  <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">NEURAL_SWARM_MATRIX</h3>
                  <div className="p-8 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Cpu className="w-32 h-32 text-indigo-400" />
                     </div>
                     <h4 className="text-xl font-black text-white mb-4 italic uppercase">Exascale Intelligence (10M Nodes)</h4>
                     <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium">
                       Unlike traditional monolithic AI, the Halving Network utilizes a distributed swarm of 10,000,000 specialized neural agents controlled by the <b>AI Sentinel</b>. Each agent class focuses on a specific vector of the blockchain ecosystem:
                     </p>
                     <ul className="space-y-4 font-mono text-[10px] text-indigo-300 font-black uppercase">
                        <li className="flex items-center gap-3"><Zap className="w-3 h-3" /> Quantum Sentinels: 1,650,000 Nodes (Defense)</li>
                        <li className="flex items-center gap-3"><Target className="w-3 h-3" /> Hashrate Architects: 2,400,000 Nodes (Consensus)</li>
                        <li className="flex items-center gap-3"><Shield className="w-3 h-3" /> Defensive Clusters: 3,950,000 Nodes (Infrastructure)</li>
                        <li className="flex items-center gap-3"><Eye className="w-3 h-3" /> 2030 Prophets: 2,000,000 Nodes (Strategic)</li>
                     </ul>
                  </div>
                </div>
              )}

              {activeSection === 'economics' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                  <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">HALVING_ECONOMICS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <h4 className="text-lg font-black text-emerald-400 uppercase italic">Subsidy Dynamics</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          The HLV utility token follows a strict deflationary curve, mirrored by the Bitcoin halving events. As the network subsidy decreases, transaction priority and security layers are maintained through a dynamic fee settlement model.
                        </p>
                     </div>
                     <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-inner">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                           <span>Current Subsidy</span>
                           <span className="text-white">6.25 {'->'} 3.125 BTC</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_#10b981]" />
                        </div>
                        <div className="text-[9px] text-slate-600 font-bold italic">Next Adjustment: Block 840,000 (Simulated)</div>
                     </div>
                  </div>
                  <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[2rem]">
                     <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-4">Service Fee Matrix</h4>
                     <p className="text-[11px] text-slate-500 font-bold uppercase leading-relaxed">Network settlement is governed by explorer indexing, consensus validation, and neural encryption fees. These are dynamically calculated based on network saturation and swarm processing load.</p>
                  </div>
                </div>
              )}

              {activeSection === 'roadmap' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
                   <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">2030_VISION_ROADMAP</h3>
                   <div className="space-y-8 relative">
                      <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-800" />
                      {[
                        { year: '2024', event: 'Halving Genesis', desc: 'Activation of the 12-layer AI Sentinel and Initial Institutional Radar rollout.' },
                        { year: '2026', event: 'Neural Expansion', desc: 'Swarm capacity increases to 50M agents. Full integration with Starlink Mesh V3.' },
                        { year: '2028', event: 'Sovereignty Era', desc: 'Decentralized autonomous governance takes over core protocol adjustments.' },
                        { year: '2030', event: 'Exascale Finality', desc: 'Sub-millisecond global consensus achieved across all planetary sectors.' },
                      ].map((milestone, idx) => (
                        <div key={idx} className="flex gap-10 group">
                           <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-500 font-black text-xs shrink-0 relative z-10 group-hover:border-amber-500 transition-all">
                              {milestone.year}
                           </div>
                           <div className="pt-2">
                              <h5 className="text-white font-black uppercase text-sm mb-1">{milestone.event}</h5>
                              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">{milestone.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

            </div>
          </main>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-emerald-500" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Verified</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter">SECURE_LEVEL_MAX</span>
                 </div>
              </div>
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-3">
                 <Share2 className="w-5 h-5 text-indigo-400" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sovereign Link</span>
                    <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter">HALVING_NETWORK_PROTO</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-[11px] active:scale-95 group/btn flex items-center justify-center gap-2"
              >
                Close Protocol Viewer
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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

export default WhitePaperModal;