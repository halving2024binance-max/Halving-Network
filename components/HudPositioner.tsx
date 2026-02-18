import React from 'react';
import { X, Layout, Eye, EyeOff, ChevronUp, ChevronDown, Shield, Zap, Target, Cpu, Activity, Share2, Layers } from 'lucide-react';

export interface HudBlock {
  id: string;
  label: string;
  visible: boolean;
  icon: React.ElementType;
}

interface HudPositionerProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: HudBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<HudBlock[]>>;
}

const HudPositioner: React.FC<HudPositionerProps> = ({ isOpen, onClose, blocks, setBlocks }) => {
  if (!isOpen) return null;

  const toggleVisibility = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-10">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.15)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[85vh]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
        
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <Layout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Layer-Ad <span className="text-emerald-400">Positioner</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Interface Topology Configurator</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
           <div className="flex items-center justify-between mb-6 px-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Block Sequence</span>
              <span className="text-[9px] font-mono text-emerald-500/60 uppercase">12-Layer HUD Hierarchy</span>
           </div>

           <div className="space-y-3">
              {blocks.map((block, index) => (
                <div 
                  key={block.id}
                  className={`p-5 rounded-3xl border transition-all duration-300 flex items-center justify-between group/item ${
                    block.visible ? 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/30' : 'bg-slate-900/30 border-slate-800/50 opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-2.5 rounded-xl border transition-colors ${block.visible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
                      <block.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-widest ${block.visible ? 'text-white' : 'text-slate-600'}`}>
                        {block.label}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-mono text-slate-600">ID: L-AD_{block.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-4">
                      <button 
                        onClick={() => moveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-emerald-400 disabled:opacity-0 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-1 text-slate-500 hover:text-emerald-400 disabled:opacity-0 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => toggleVisibility(block.id)}
                      className={`p-3 rounded-2xl border transition-all ${
                        block.visible 
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                      }`}
                    >
                      {block.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-emerald-500" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Topology Status</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter uppercase">Sync_Active</span>
                   </div>
                </div>
                <div className="w-px h-8 bg-slate-800 hidden md:block" />
                <div className="flex items-center gap-3">
                   <Zap className="w-5 h-5 text-indigo-400" />
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Interface Refresh</span>
                      <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter uppercase">Adaptive_UI</span>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-[10px] active:scale-95 group/btn"
              >
                Apply Re-positioning
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

export default HudPositioner;