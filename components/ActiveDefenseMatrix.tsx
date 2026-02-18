
import React, { useState, useEffect, useRef } from 'react';
// Added missing 'Layers' to lucide-react imports
import { Shield, ShieldAlert, Zap, Cpu, Activity, Radar, Lock, ShieldCheck, Terminal, Loader2, ArrowRight, Crosshair, Flame, Layers } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';

const ActiveDefenseMatrix: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [isHardening, setIsHardening] = useState(false);
  const [interceptCount, setInterceptCount] = useState(4821);
  const [integrity, setIntegrity] = useState(100);
  const [logs, setLogs] = useState<{id: string, text: string, type: 'ok' | 'warn' | 'crit'}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background Particle Defense Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 800;
    let height = canvas.height = 400;

    interface Particle {
      x: number; y: number; vx: number; vy: number; life: number; color: string; type: 'threat' | 'shield';
    }

    let particles: Particle[] = [];

    const createParticle = (type: 'threat' | 'shield') => {
      if (type === 'threat') {
        return {
          x: width + 20,
          y: Math.random() * height,
          vx: -(Math.random() * 2 + 1),
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
          color: '#f43f5e',
          type: 'threat'
        };
      } else {
        return {
          x: 100,
          y: Math.random() * height,
          vx: (Math.random() * 4 + 2),
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          color: '#10b981',
          type: 'shield'
        };
      }
    };

    let animationFrameId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Spawn threats
      if (Math.random() > 0.92) particles.push(createParticle('threat') as Particle);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Visual Shield Barrier Interception (at x = 120-150)
        if (p.type === 'threat' && p.x < 150 && p.x > 120) {
          if (Math.random() > 0.1) {
            p.vx *= -0.5;
            p.vy *= 2;
            p.color = '#fbbf24'; // Deflection amber
            setInterceptCount(c => c + 1);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === 'threat' ? 2 : 1, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.type === 'threat' ? 10 : 0;
        ctx.shadowColor = p.color;
        ctx.fill();

        if (p.x < -50 || p.x > width + 50) particles.splice(i, 1);
      });

      // Draw Shield Wall
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 40;
      ctx.beginPath();
      ctx.moveTo(130, 0);
      ctx.lineTo(130, height);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Interception Logs
  useEffect(() => {
    const messages = [
      { text: "L1: Packet scrubbed from Sector 9", type: 'ok' },
      { text: "L7: Neural pattern mismatch dropped", type: 'ok' },
      { text: "L4: Port scan neutralized", type: 'ok' },
      { text: "L12: Executive vision drift corrected", type: 'ok' },
      { text: "L9: Flash-loan vector shielded", type: 'warn' },
      { text: "L2: Node handshake verified", type: 'ok' }
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [{ id: Math.random().toString(), text: msg.text, type: msg.type as any }, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleHardening = () => {
    setIsHardening(true);
    setIntegrity(100);
    setTimeout(() => setIsHardening(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/20 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(16,185,129,0.05)] relative overflow-hidden group transition-all duration-700 hover:border-emerald-500/40">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="flex flex-col xl:flex-row gap-12 relative z-10">
        
        {/* Defense Visualization Side */}
        <div className="xl:w-1/2 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                  ACTIVE <span className="text-emerald-500">DEFENSE MATRIX</span>
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold tracking-[0.3em] uppercase">12-Layer Kinetic Shielding</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-2">
                <Crosshair className="w-3 h-3 text-rose-500" />
                Total Interceptions
              </div>
              <div className="text-4xl font-black font-mono text-white tracking-tighter">
                {interceptCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Active Canvas HUD */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-[2.5rem] p-4 relative overflow-hidden h-[300px] shadow-inner">
             <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
             <div className="absolute top-6 left-6 p-4 bg-slate-900/90 border border-emerald-500/20 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                   <Radar className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Perimeter Scan</span>
                </div>
                <div className="text-xl font-black font-mono text-emerald-400">100.00% SECURE</div>
             </div>
             
             {/* Mitigation Log Overlay */}
             <div className="absolute bottom-6 right-6 w-64 space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="text-[9px] font-mono bg-slate-900/80 p-1.5 px-3 rounded-lg border border-slate-800 flex justify-between animate-in slide-in-from-right-4 duration-500">
                    <span className={log.type === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>[{log.type.toUpperCase()}]</span>
                    <span className="text-slate-400 truncate ml-2 uppercase font-bold">{log.text}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase">
                  <span>Structural Integrity</span>
                  <span className="text-emerald-400">{integrity}%</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" style={{ width: `${integrity}%` }} />
                </div>
             </div>
             <button 
              onClick={handleHardening}
              disabled={isHardening}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-3xl transition-all shadow-xl shadow-emerald-900/20 active:scale-95 group/btn overflow-hidden relative"
             >
                {isHardening ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Zap className="w-6 h-6 animate-bounce" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest">{isHardening ? 'SYNCING...' : 'HARDEN PERIMETER'}</span>
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
             </button>
          </div>
        </div>

        {/* 12-Layer Stack Grid */}
        <div className="xl:w-1/2 flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Layers className="w-5 h-5 text-emerald-500" />
                 Layer Status Matrix
              </h3>
              <div className="px-3 py-1 bg-slate-800 rounded-full text-[9px] font-mono text-slate-500">REALTIME_TELEMETRY</div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
              {SECURITY_LAYERS.map((layer, i) => (
                <div 
                  key={layer.id}
                  className={`p-4 rounded-2xl border transition-all duration-500 group/layer flex flex-col justify-between ${
                    isHardening ? 'border-emerald-500/50 bg-emerald-500/5 scale-[0.98]' : 'bg-slate-950/40 border-slate-800 hover:border-emerald-500/30'
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                   <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono text-slate-600 font-black">L_{layer.id.toString().padStart(2, '0')}</span>
                      <div className={`w-2 h-2 rounded-full ${isHardening ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500/20 group-hover/layer:bg-emerald-500'} shadow-[0_0_8px_currentColor]`} />
                   </div>
                   <div>
                      <h4 className="text-[10px] font-black text-slate-300 uppercase truncate mb-1 group-hover/layer:text-white transition-colors">{layer.name}</h4>
                      <div className="flex items-center justify-between">
                         <span className="text-[8px] font-bold text-slate-600 uppercase">Status:</span>
                         <span className="text-[8px] font-black text-emerald-500 uppercase">{isHardening ? 'SCRUBBING' : 'ACTIVE'}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-[2rem] flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
                    <Activity className="w-5 h-5 animate-pulse" />
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Mitigation Rate</div>
                    <div className="text-xl font-black font-mono text-white">99.98% SUCCESS</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[8px] font-black text-slate-600 uppercase mb-2">Threat Vector Load</div>
                 <div className="flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className={`w-1 h-3 rounded-full ${i < 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ActiveDefenseMatrix;
