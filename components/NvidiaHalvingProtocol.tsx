import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Zap, Activity, Layers, ShieldCheck, Cpu as Chip, Globe, Terminal, Loader2, Sparkles, TrendingUp } from 'lucide-react';

const NvidiaHalvingProtocol: React.FC = () => {
  const [metrics, setMetrics] = useState({
    computePower: 142.8,
    vramSaturation: 74.2,
    activeCores: 84200,
    synergyIndex: 98.4,
    temp: 58
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        computePower: parseFloat((prev.computePower + (Math.random() * 2 - 1)).toFixed(1)),
        vramSaturation: Math.max(60, Math.min(95, prev.vramSaturation + (Math.random() * 4 - 2))),
        activeCores: prev.activeCores + Math.floor(Math.random() * 10 - 5),
        synergyIndex: parseFloat((98 + Math.random() * 1.5).toFixed(1)),
        temp: 55 + Math.floor(Math.random() * 10)
      }));
    }, 3000);

    // Dynamic GPU Core Grid Visualization
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let frame = 0;
        const draw = () => {
          const w = canvas.width = 600;
          const h = canvas.height = 200;
          ctx.clearRect(0, 0, w, h);
          
          const cols = 30;
          const rows = 10;
          const spacing = 18;
          const startX = (w - (cols * spacing)) / 2;
          const startY = (h - (rows * spacing)) / 2;

          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              const x = startX + i * spacing;
              const y = startY + j * spacing;
              
              // Calculate state based on "compute waves"
              const wave = Math.sin((i * 0.2) + (frame * 0.1)) * Math.cos((j * 0.2) + (frame * 0.05));
              const isActive = wave > 0.3;
              
              ctx.beginPath();
              ctx.roundRect(x, y, 12, 12, 2);
              if (isActive) {
                ctx.fillStyle = '#76b900'; // NVIDIA Green
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#76b900';
              } else {
                ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
                ctx.shadowBlur = 0;
              }
              ctx.fill();
            }
          }
          frame++;
          requestAnimationFrame(draw);
        };
        draw();
      }
    }
    return () => clearInterval(interval);
  }, []);

  const runSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 3000);
  };

  return (
    <div className="bg-[#040702] border border-[#76b900]/20 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(118,185,0,0.05)] relative overflow-hidden group">
      {/* Background NVIDIA-style circuit lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Chip className="w-80 h-80 text-[#76b900]" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#76b900]/10 rounded-3xl border border-[#76b900]/30 shadow-[0_0_30px_rgba(118,185,0,0.2)]">
              <Cpu className="w-10 h-10 text-[#76b900]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                   NVIDIA <span className="text-[#76b900]">HALVING PROTOCOL</span>
                 </h2>
                 <div className="px-3 py-1 bg-[#76b900] text-black text-[10px] font-black uppercase rounded-lg shadow-[0_0_15px_rgba(118,185,0,0.5)]">PRO_LINK</div>
              </div>
              <p className="text-[11px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] mt-2 flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#76b900] animate-spin-slow" />
                Exascale GPU Neural Mesh Optimization
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 shadow-inner">
           <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Compute Output</div>
              <div className="text-4xl font-black font-mono text-white flex items-baseline gap-2">
                {metrics.computePower.toFixed(1)}
                <span className="text-sm text-[#76b900] font-black">EH/s</span>
              </div>
           </div>
           <div className="h-14 w-px bg-white/10" />
           <div className="flex flex-col items-end">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Synergy Integrity</div>
              <div className="text-2xl font-black font-mono text-[#76b900]">{metrics.synergyIndex}% NOMINAL</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Core Visualization Cluster */}
        <div className="lg:col-span-8 bg-black/60 border border-[#76b900]/10 rounded-[2.5rem] p-8 flex flex-col relative group/viz">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                 <Activity className="w-5 h-5 text-[#76b900] animate-pulse" />
                 <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Live TensorCore Utilization</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#76b900]/5 border border-[#76b900]/20 rounded-full">
                 <span className="text-[9px] font-black text-[#76b900] uppercase">Cluster: HGX-V8</span>
              </div>
           </div>
           
           <div className="flex-1 flex items-center justify-center min-h-[200px]">
              <canvas ref={canvasRef} className="w-full max-h-[200px]" />
           </div>

           <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/5">
              <div>
                 <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Thermal Index</div>
                 <div className="text-xl font-black font-mono text-white">{metrics.temp}°C</div>
                 <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#76b900]" style={{ width: `${(metrics.temp / 100) * 100}%` }} />
                 </div>
              </div>
              <div>
                 <div className="text-[9px] font-black text-slate-600 uppercase mb-2">VRAM Saturation</div>
                 <div className="text-xl font-black font-mono text-[#76b900]">{metrics.vramSaturation.toFixed(1)}%</div>
                 <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${metrics.vramSaturation}%` }} />
                 </div>
              </div>
              <div>
                 <div className="text-[9px] font-black text-slate-600 uppercase mb-2">Active Cuda-Nodes</div>
                 <div className="text-xl font-black font-mono text-white">{metrics.activeCores.toLocaleString()}</div>
                 <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: '85%' }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Tactical Control Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-gradient-to-br from-black to-[#0a1103] border border-[#76b900]/15 rounded-[2.5rem] p-8 flex-1 space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#76b900]" />
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Compute Controller</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                   Synchronize NVIDIA Blackwell architecture with the Halving Genesis Block. Real-time difficulty adjustment via neural inference.
                 </p>
              </div>

              <div className="space-y-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group/btn cursor-pointer hover:border-[#76b900]/40 transition-all">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase">Neural Tuning</span>
                       <Sparkles className="w-3 h-3 text-amber-500" />
                    </div>
                    <div className="text-xs font-black text-white">AUTO-OPTIMIZE_CUDA</div>
                 </div>

                 <button 
                  onClick={runSync}
                  disabled={isSyncing}
                  className="w-full py-5 bg-[#76b900] hover:bg-[#86d200] disabled:bg-slate-800 text-black font-black rounded-3xl transition-all shadow-[0_15px_30px_rgba(118,185,0,0.2)] uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group/sync"
                 >
                   {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current group-sync:animate-bounce" />}
                   {isSyncing ? 'Synchronizing Cluster...' : 'Sync Halving Mesh'}
                 </button>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-500 uppercase">GPU_ID: QUAD_TITAN_ULTRA</span>
                    <ShieldCheck className="w-4 h-4 text-[#76b900]" />
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#76b900] animate-pulse" />
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest font-bold">Encrypted_CUDA_Stream_Active</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <Layers className="w-6 h-6 text-[#76b900]" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synergy Protocol</span>
                  <span className="text-xs font-mono text-[#76b900] font-bold">NVIDIA_HALVING_V1.2</span>
               </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
               <TrendingUp className="w-6 h-6 text-emerald-400" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Multiplier</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">14.2x EXASCALE</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest">Validated by AI Sentinel Core</span>
            <div className="w-2 h-2 rounded-full bg-[#76b900] shadow-[0_0_10px_#76b900]" />
         </div>
      </div>
    </div>
  );
};

export default NvidiaHalvingProtocol;