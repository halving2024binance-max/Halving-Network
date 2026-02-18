
import React, { useRef, useEffect, useState } from 'react';
/* Added ArrowRight to the lucide-react import list */
import { Cpu, Hammer, Zap, Layers, Box, Terminal, Activity, ShieldCheck, Globe, Move, ArrowRight } from 'lucide-react';

interface AiSystemBuilderVisProps {
  metrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const AiSystemBuilderVis: React.FC<AiSystemBuilderVisProps> = ({ metrics }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLayerName, setActiveLayerName] = useState("L12_NEURAL_CORE");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = container.offsetWidth;
    let height = canvas.height = 400;

    const handleResize = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = 400;
    };
    window.addEventListener('resize', handleResize);

    // Isometric projection helpers
    const isoX = (x: number, y: number, z: number) => (x - y) * Math.cos(Math.PI / 6);
    const isoY = (x: number, y: number, z: number) => (x + y) * Math.sin(Math.PI / 6) - z;

    interface BuilderAgent {
      x: number; y: number; z: number;
      targetX: number; targetY: number; targetZ: number;
      color: string;
      speed: number;
    }

    interface SystemModule {
      x: number; y: number; z: number;
      size: number;
      opacity: number;
      label: string;
      built: boolean;
    }

    const agents: BuilderAgent[] = [];
    const numAgents = Math.min(200, Math.floor(metrics.activeAgents / 50000));
    
    for (let i = 0; i < numAgents; i++) {
      agents.push({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        z: 0,
        targetX: Math.random() * 200 - 100,
        targetY: Math.random() * 200 - 100,
        targetZ: 0,
        color: i % 2 === 0 ? '#10b981' : '#6366f1',
        speed: 0.5 + Math.random() * 1.5
      });
    }

    const modules: SystemModule[] = [
      { x: -50, y: -50, z: 0, size: 40, opacity: 0, label: 'L1_PERIMETER', built: false },
      { x: 50, y: -50, z: 0, size: 40, opacity: 0, label: 'L4_HASHING', built: false },
      { x: -50, y: 50, z: 0, size: 40, opacity: 0, label: 'L9_LIQUIDITY', built: false },
      { x: 50, y: 50, z: 0, size: 40, opacity: 0, label: 'L12_SENTINEL', built: false },
      { x: 0, y: 0, z: 50, size: 60, opacity: 0, label: 'AD_VERIFY_MESH', built: false },
    ];

    let animationFrame: number;
    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + 50;

      // Draw Grid Base
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.lineWidth = 1;
      for (let i = -150; i <= 150; i += 30) {
        ctx.beginPath();
        ctx.moveTo(centerX + isoX(i, -150, 0), centerY + isoY(i, -150, 0));
        ctx.lineTo(centerX + isoX(i, 150, 0), centerY + isoY(i, 150, 0));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX + isoX(-150, i, 0), centerY + isoY(-150, i, 0));
        ctx.lineTo(centerX + isoX(150, i, 0), centerY + isoY(150, i, 0));
        ctx.stroke();
      }

      // Update and draw Agents
      agents.forEach(agent => {
        const dx = agent.targetX - agent.x;
        const dy = agent.targetY - agent.y;
        const dz = agent.targetZ - agent.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 1) {
          const mod = modules[Math.floor(Math.random() * modules.length)];
          agent.targetX = mod.x + (Math.random() * 20 - 10);
          agent.targetY = mod.y + (Math.random() * 20 - 10);
          agent.targetZ = mod.z + (Math.random() * 20 - 10);
          mod.opacity = Math.min(1, mod.opacity + 0.005);
          if (Math.random() > 0.99) setActiveLayerName(mod.label);
        } else {
          const s = agent.speed * (metrics.processingLoad / 20);
          agent.x += (dx / dist) * s;
          agent.y += (dy / dist) * s;
          agent.z += (dz / dist) * s;
        }

        const ax = centerX + isoX(agent.x, agent.y, agent.z);
        const ay = centerY + isoY(agent.x, agent.y, agent.z);

        ctx.beginPath();
        ctx.arc(ax, ay, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = agent.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = agent.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Modules
      modules.forEach(mod => {
        const mx = centerX + isoX(mod.x, mod.y, mod.z);
        const my = centerY + isoY(mod.x, mod.y, mod.z);

        // Draw wireframe box
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + mod.opacity * 0.4})`;
        ctx.lineWidth = 1;
        
        const drawBox = (ox: number, oy: number, sz: number) => {
          const hsz = sz / 2;
          ctx.beginPath();
          // Top face
          ctx.moveTo(ox + isoX(-hsz, -hsz, hsz), oy + isoY(-hsz, -hsz, hsz));
          ctx.lineTo(ox + isoX(hsz, -hsz, hsz), oy + isoY(hsz, -hsz, hsz));
          ctx.lineTo(ox + isoX(hsz, hsz, hsz), oy + isoY(hsz, hsz, hsz));
          ctx.lineTo(ox + isoX(-hsz, hsz, hsz), oy + isoY(-hsz, hsz, hsz));
          ctx.closePath();
          ctx.stroke();
          // Vertical lines
          for (let tx of [-hsz, hsz]) {
            for (let ty of [-hsz, hsz]) {
              ctx.beginPath();
              ctx.moveTo(ox + isoX(tx, ty, -hsz), oy + isoY(tx, ty, -hsz));
              ctx.lineTo(ox + isoX(tx, ty, hsz), oy + isoY(tx, ty, hsz));
              ctx.stroke();
            }
          }
        };

        drawBox(mx, my, mod.size);
        
        if (mod.opacity > 0.5) {
          ctx.fillStyle = `rgba(16, 185, 129, ${mod.opacity * 0.1})`;
          ctx.fill();
        }

        // Module Label
        ctx.fillStyle = `rgba(255, 255, 255, ${mod.opacity})`;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(mod.label, mx, my - mod.size);
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [metrics]);

  return (
    <div className="bg-slate-900/60 border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Hammer className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              AI <span className="text-emerald-500">System Builder</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-500" />
            Autonomous Mesh Construction Protocol
          </p>
        </div>

        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Fabricators</span>
              <span className="text-xl font-black font-mono text-emerald-400">{(metrics.activeAgents / 1000).toFixed(1)}k</span>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Layer</span>
              <span className="text-xl font-black font-mono text-indigo-400">{activeLayerName}</span>
           </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full h-[400px] bg-slate-950/40 rounded-[2rem] border border-white/5 overflow-hidden shadow-inner">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Architectural HUD Overlay */}
        <div className="absolute top-6 left-6 p-4 glass rounded-2xl border border-white/5 space-y-3 pointer-events-none">
           <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-mono text-slate-300">BUILDER_LOG_V2.7</span>
           </div>
           <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-500/80">
                 <div className="w-1 h-1 rounded-full bg-emerald-500" />
                 {'>'} PROVISIONING_MESH_NODES...
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-indigo-400/80">
                 <div className="w-1 h-1 rounded-full bg-indigo-500" />
                 {'>'} NEURAL_HANDSHAKE: OK
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500">
                 <div className="w-1 h-1 rounded-full bg-slate-700 animate-pulse" />
                 {'>'} SYNCING_L12_FINALITY...
              </div>
           </div>
        </div>

        <div className="absolute bottom-6 right-6 text-right pointer-events-none">
           <div className="px-3 py-1.5 bg-emerald-600/10 border border-emerald-500/20 rounded-lg backdrop-blur-md">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5" />
                 Mesh Integrity: Nominal
              </span>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Globe className="w-4 h-4 text-cyan-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Construction Mesh: Global</span>
            </div>
            <div className="flex items-center gap-2">
               <Zap className="w-4 h-4 text-amber-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Assembly Velocity: {metrics.processingLoad}x</span>
            </div>
         </div>
         <button className="text-[10px] text-slate-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
            Detailed Blueprints
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default AiSystemBuilderVis;
