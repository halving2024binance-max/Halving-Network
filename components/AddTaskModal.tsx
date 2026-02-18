import React, { useState } from 'react';
import { X, Plus, Shield, Zap, Target, Layers, ArrowRight, Binary, CheckCircle2 } from 'lucide-react';
import { SentinelTask } from '../types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: SentinelTask) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [layer, setLayer] = useState(1);
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Medium' | 'Standard'>('Standard');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: SentinelTask = {
      id: Math.random().toString(36).substring(2, 7).toUpperCase(),
      title,
      layer,
      priority,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAdd(newTask);
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl mx-auto bg-slate-900 border-t border-emerald-500/20 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-full duration-500 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="w-full flex justify-center py-4">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                <Plus className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Add Sentinel Task</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Layer-12 Directive Entry</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Task Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Target className="w-3 h-3" /> Task Narrative
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Enter directive title (e.g., Audit CEX Flow)..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-emerald-100 placeholder:text-slate-800 outline-none focus:border-emerald-500/40 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layer Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Layers className="w-3 h-3" /> Target Layer
                </label>
                <select 
                  value={layer}
                  onChange={(e) => setLayer(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-white outline-none focus:border-emerald-500/40 appearance-none"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1} className="bg-slate-900">Layer {(i+1).toString().padStart(2, '0')}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Priority Level
                </label>
                <div className="flex p-1 bg-slate-950 border border-white/5 rounded-2xl">
                  {['Standard', 'Medium', 'High', 'Critical'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p as any)}
                      className={`flex-1 py-3 px-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${
                        priority === p 
                          ? 'bg-emerald-600 text-white shadow-lg' 
                          : 'text-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tactical Info Card */}
            <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Binary className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Directive Metadata</span>
                  <span className="text-[11px] font-mono text-indigo-300">PROTO_AUTH: SENTRY_ALPHA</span>
                </div>
              </div>
              <Shield className="w-5 h-5 text-slate-700" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2.5rem] transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 active:scale-95"
          >
            Deploy New Directive
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="h-12 bg-slate-950 border-t border-white/5 flex items-center justify-center px-10">
          <div className="flex gap-8 text-slate-800 items-center">
            <div className="w-2 h-2 bg-slate-800 rounded-sm" />
            <div className="w-10 h-1 bg-slate-800 rounded-full" />
            <div className="w-2 h-2 border border-slate-800 rounded-full" />
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AddTaskModal;