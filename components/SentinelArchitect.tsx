import React, { useState, useEffect, useRef } from 'react';
import { Target, Cpu, Layers, Zap, ShieldCheck, Terminal, Compass, Layout, Box, Ruler, Grid3X3, ArrowRight, Activity } from 'lucide-react';
import BlueprintDatabaseModal from './BlueprintDatabaseModal';

const SentinelArchitect: React.FC = () => {
  const [provisioningLevel, setProvisioningLevel] = useState(84.2);
  const [activeNodes, setActiveNodes] = useState(8420951);
  const [meshStability, setMeshStability] = useState(99.98);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProvisioningLevel(prev => Math.min(100, prev + (Math.random() * 0.05)));
      setActiveNodes(prev => prev + Math.floor(Math.random() * 10));
      setMeshStability(prev => Math.min(100, Math.max(99.4, prev + (Math.random() * 0.02 - 0.01))));
      
      const blueprints = ["ALPHA-9_BLUEPRINT", "GENESIS_NODE_V3", "QUANTUM_MESH_LINK", "EXASCALE_PILLAR"];
      if (Math.random() > 0.8) {
        setLogs(prev => [`> Provisioning: ${blueprints[Math.floor(Math.random() * blueprints.length)]}...`, ...prev].slice(0, 5));
      }
    }, 3000);

    // Grid Animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let frame = 0;
        const render = () => {
          const w = canvas.width = 600;
          const h = canvas.height = 300;
          ctx.clearRect(0, 0, w, h);
          
          // Draw Blueprint Grid
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
          ctx.lineWidth = 1;
          const spacing = 30;
          for (let x = 0; x < w; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
          }
          for (let y = 0; y < h; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          }

          // Draw Nodes (Simulation)
          for (let i = 0; i < 20; i++) {
            const x = (Math.sin(i + frame * 0.01) * 0.4 + 0.5) * w;
            const y = (Math.cos(i * 1.5 + frame * 0.02) * 0.3 + 0.5) * h;
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#06b6d4';
            ctx.fill();

            // Connections
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
            ctx.moveTo(x, y);
            ctx.lineTo(w / 2, h / 2);
            ctx.stroke();
          }

          // Scanning Line
          const scanX = (frame * 2) % w;
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
          ctx.beginPath(); ctx.moveTo(scanX, 0); ctx.lineTo(scanX, h); ctx.stroke();

          frame++;
          requestAnimationFrame(render);
        };
        render();
      }
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Compass className="w-80 h-80 text-cyan-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
              <Layout className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Mesh <span className="text-cyan-500">Architect Interface</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <Ruler className="w-3.5 h-3.5 text-indigo-500" />
            Exascale Infrastructure Blueprints
          </p>
        </div>

        <div className="flex items-center gap-8 bg-slate-950/50 p-6 rounded-[2rem] border border-slate-800 shadow-inner">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Provisioning Progress</div>
              <div className="text-3xl font-black font-mono text-white tracking-tighter">
                {provisioningLevel.toFixed(2)}%
              </div>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Mesh Nodes</div>
              <div className="text-xl font-black font-mono text-indigo-400">
                {activeNodes.toLocaleString()}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Blueprint Viewer */}
        <div className="xl:col-span-8 bg-slate-950/60 border border-slate-800 rounded-[2rem] p-4 relative overflow-hidden h-[300px]">
           <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
           <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center gap-2">
                 <Box className="w-3 h-3 text-cyan-400" />
                 <span className="text-[9px] font-black text-cyan-400 uppercase">Sector: Alpha_Node_Prime</span>
              </div>
              <div className="px-3 py-1 bg-slate-900/80 border border-slate-700 rounded-lg">
                 <span className="text-[8px] font-mono text-slate-400">COORDS: 42.8N / 12.5E</span>
              </div>
           </div>
        </div>

        {/* Structural Log */}
        <div className="xl:col-span-4 flex flex-col gap-4">
           <div className="bg-black/60 border border-slate-800 rounded-3xl p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                 <Terminal className="w-4 h-4 text-cyan-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Construction Log</span>
              </div>
              <div className="flex-1 font-mono text-[9px] text-cyan-500/60 space-y-2 overflow-hidden">
                 {logs.map((log, i) => (
                   <div key={i} className="animate-in fade-in slide-in-from-left-2">{log}</div>
                 ))}
                 <div className="animate-pulse">{'>'} Awaiting node provisioning command...</div>
              </div>
           </div>

           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Mesh Stability</span>
                 <span className="text-emerald-400">{meshStability.toFixed(2)}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5">
                 <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: `${meshStability}%` }} />
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Grid3X3 className="w-4 h-4 text-indigo-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Grid Density: 10M Nodes</span>
            </div>
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">L12 Structural Lock</span>
            </div>
         </div>
         <button 
          onClick={() => setIsDatabaseOpen(true)}
          className="text-[10px] text-cyan-400 hover:text-white uppercase font-black tracking-widest transition-all flex items-center gap-2 group/btn active:scale-95"
         >
            Full Blueprint Database
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>

      <BlueprintDatabaseModal isOpen={isDatabaseOpen} onClose={() => setIsDatabaseOpen(false)} />
    </div>
  );
};

export default SentinelArchitect;