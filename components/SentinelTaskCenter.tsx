import React, { useState, useEffect } from 'react';
import { Shield, Target, Plus, ChevronRight, Activity, Terminal, Trash2, CheckCircle2, Clock, Zap, ShieldCheck } from 'lucide-react';
import { SentinelTask } from '../types';
import AddTaskModal from './AddTaskModal';

const SentinelTaskCenter: React.FC = () => {
  const [tasks, setTasks] = useState<SentinelTask[]>([
    { id: 'T-842', title: 'Verify IBIT ETF Inflow Signature', layer: 9, priority: 'High', status: 'SECURED', timestamp: '14:20' },
    { id: 'T-905', title: 'Audit L4 Hashing Integrity Jitter', layer: 4, priority: 'Critical', status: 'EXECUTING', timestamp: '15:10' },
    { id: 'T-124', title: 'Scan Node 12.42 Latency Drift', layer: 12, priority: 'Standard', status: 'PENDING', timestamp: '15:42' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adStats, setAdStats] = useState({
    verified: 14209,
    mitigation: 0.024
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate task statuses
      setTasks(prev => prev.map(task => {
        if (task.status === 'PENDING' && Math.random() > 0.9) {
          return { ...task, status: 'EXECUTING' };
        }
        if (task.status === 'EXECUTING' && Math.random() > 0.95) {
          return { ...task, status: 'SECURED' };
        }
        return task;
      }));

      // Fluctuate Ad Stats
      setAdStats(prev => ({
        verified: Math.floor(14000 + Math.random() * 500),
        mitigation: parseFloat((0.02 + Math.random() * 0.01).toFixed(3))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = (task: SentinelTask) => {
    setTasks(prev => [task, ...prev]);
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Target className="w-80 h-80 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Sentinel <span className="text-emerald-500">Task Center</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            Neural Mission Control & Directive Log
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 group/btn active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Active Directives Feed */}
        <div className="xl:col-span-8 space-y-4">
           {tasks.length === 0 ? (
             <div className="h-64 flex flex-col items-center justify-center text-slate-600 gap-4 bg-slate-950/40 rounded-[2rem] border border-slate-800">
               <Terminal className="w-12 h-12 opacity-20" />
               <p className="text-xs font-black uppercase tracking-[0.2em]">No active directives in queue</p>
             </div>
           ) : (
             <div className="space-y-3">
               {tasks.map((task) => (
                 <div key={task.id} className="p-5 bg-slate-950/80 border border-slate-800 rounded-3xl group/task hover:border-emerald-500/30 transition-all flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className={`p-2.5 rounded-xl border ${
                        task.priority === 'Critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                        task.priority === 'High' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                        'bg-slate-900 border-white/5 text-slate-500'
                      }`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                           <h4 className="text-sm font-black text-white uppercase tracking-wide group-hover/task:text-emerald-400 transition-colors">{task.title}</h4>
                           <span className="text-[8px] font-mono text-slate-600">ID: {task.id}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Layer {task.layer.toString().padStart(2, '0')}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-800" />
                           <span className={`text-[9px] font-black uppercase ${
                             task.priority === 'Critical' ? 'text-rose-500' :
                             task.priority === 'High' ? 'text-amber-500' :
                             'text-slate-600'
                           }`}>{task.priority} Priority</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-end">
                        <span className={`text-[9px] font-black uppercase tracking-tighter italic ${
                          task.status === 'SECURED' ? 'text-emerald-500' :
                          task.status === 'EXECUTING' ? 'text-amber-500 animate-pulse' :
                          'text-slate-600'
                        }`}>{task.status}</span>
                        <span className="text-[8px] font-mono text-slate-700 uppercase mt-0.5">{task.timestamp} UTC</span>
                      </div>
                      <button 
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-slate-700 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Sidebar Analytics & Ad Engine */}
        <div className="xl:col-span-4 space-y-6">
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] space-y-6 shadow-inner">
              <div className="flex justify-between items-center">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Directive Load
                 </h3>
                 <span className="text-[9px] font-mono text-emerald-400 font-black">99.4% NOMINAL</span>
              </div>
              
              <div className="space-y-4">
                 {[
                   { label: 'Completion Rate', val: 92, color: 'bg-emerald-500' },
                   { label: 'Neural Accuracy', val: 99.8, color: 'bg-indigo-500' },
                   { label: 'Response Jitter', val: 12, color: 'bg-amber-500' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                         <span>{stat.label}</span>
                         <span className="text-slate-400">{stat.val}%</span>
                      </div>
                      <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.color} shadow-[0_0_8px_currentColor]`} style={{ width: `${stat.val}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Ad Verification Engine Module */}
           <div className="p-6 bg-slate-950 border border-emerald-500/20 rounded-[2.5rem] space-y-4 shadow-inner relative overflow-hidden group/ad">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover/ad:opacity-[0.1] transition-opacity">
                 <ShieldCheck className="w-16 h-16 text-emerald-500" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                 <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Ad Verification Engine</h4>
                    <span className="text-[8px] font-mono text-emerald-500/60 uppercase">Mesh_Audit_Active</span>
                 </div>
              </div>
              <div className="space-y-3 relative z-10">
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                    <span className="text-slate-500">Impressions Verified</span>
                    <span className="text-emerald-400 font-mono">{adStats.verified.toLocaleString()} / SEC</span>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase">
                    <span className="text-slate-500">Fraud Mitigation</span>
                    <span className="text-rose-400 font-mono">{adStats.mitigation}% DROPPED</span>
                 </div>
              </div>
              <div className="pt-3 flex gap-1 justify-center relative z-10">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className="w-1 h-3 rounded-full bg-emerald-500/20 overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                   </div>
                 ))}
              </div>
              <div className="flex justify-between items-center text-[7px] font-black text-slate-700 uppercase tracking-widest relative z-10 border-t border-white/5 pt-2">
                 <span>BIP-AD-04_SYNC</span>
                 <span>L12_AUDIT_OK</span>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
             <Clock className="w-4 h-4 text-slate-600" />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Last Refresh: Just Now</span>
           </div>
           <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">L12 Authority Valid</span>
           </div>
        </div>
        <button className="text-[10px] text-slate-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
          Full Command Logs
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask} 
      />
    </div>
  );
};

export default SentinelTaskCenter;