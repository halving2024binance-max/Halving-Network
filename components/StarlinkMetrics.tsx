import React, { useState, useEffect, useRef } from 'react';
import { Satellite, Signal, Globe, Zap, Wifi, Navigation, Activity, ShieldCheck, Terminal, Radio, Info } from 'lucide-react';

const StarlinkMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    latency: 28,
    downlink: 242.4,
    uplink: 32.1,
    satellites: 5842,
    stability: 99.98,
    signalStrength: -68 // dBm
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        latency: Math.max(20, Math.min(45, prev.latency + (Math.random() * 4 - 2))),
        downlink: parseFloat((prev.downlink + (Math.random() * 10 - 5)).toFixed(1)),
        uplink: parseFloat((prev.uplink + (Math.random() * 4 - 2)).toFixed(1)),
        satellites: prev.satellites + (Math.random() > 0.9 ? 1 : 0),
        stability: parseFloat((99.9 + Math.random() * 0.09).toFixed(2)),
        signalStrength: Math.max(-90, Math.min(-50, prev.signalStrength + (Math.random() * 2 - 1)))
      }));
    }, 2000);

    // Orbital Animation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let frame = 0;
        const draw = () => {
          const w = canvas.width = 300;
          const h = canvas.height = 300;
          ctx.clearRect(0, 0, w, h);
          
          // Draw Planet Core
          ctx.beginPath();
          ctx.arc(w/2, h/2, 40, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw Orbital Rings
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(w/2, h/2, 60 + i*20, 30 + i*10, (frame / 100) + (i * Math.PI / 3), 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
            ctx.stroke();
            
            // Draw Satellites on rings
            const angle = (frame / (50 + i * 20)) % (Math.PI * 2);
            const x = w/2 + Math.cos(angle) * (60 + i*20);
            const y = h/2 + Math.sin(angle) * (30 + i*10);
            
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#10b981';
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          frame++;
          requestAnimationFrame(draw);
        };
        draw();
      }
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/40 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background HUD Graphics */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        <Satellite className="w-64 h-64 text-cyan-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
              <Satellite className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Starlink <span className="text-cyan-400">Orbital Metrix</span></h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-600 animate-spin-slow" />
            Low Earth Orbit Connectivity Mesh
          </p>
        </div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Link Stability</div>
            <div className="text-4xl font-black font-mono text-white flex items-baseline gap-1">
              {metrics.stability}%
              <span className="text-xs text-emerald-400">NOMINAL</span>
            </div>
          </div>
          <div className="h-12 w-px bg-slate-800 hidden md:block" />
          <div className="hidden md:flex flex-col items-end">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Sat-Count</div>
            <div className="text-xl font-black font-mono text-indigo-400 uppercase tracking-tighter italic">
              {metrics.satellites.toLocaleString()} ACTIVE
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Orbital Mesh Visualization */}
        <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[300px]">
          <canvas ref={canvasRef} className="w-full h-full max-w-[250px] max-h-[250px]" />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">Scanning LEO Sectors...</span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl group/metric hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latency Matrix</span>
              </div>
              <Activity className="w-4 h-4 text-slate-700 group-hover/metric:text-cyan-500 transition-colors" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black font-mono text-white tracking-tighter">{metrics.latency.toFixed(0)}</div>
              <span className="text-xs font-bold text-slate-600">ms</span>
            </div>
            <div className="mt-4 h-1 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" style={{ width: `${(metrics.latency / 100) * 100}%` }} />
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl group/metric hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Wifi className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Downlink Throughput</span>
              </div>
              <Activity className="w-4 h-4 text-slate-700 group-hover/metric:text-emerald-500 transition-colors" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black font-mono text-white tracking-tighter">{metrics.downlink.toFixed(0)}</div>
              <span className="text-xs font-bold text-slate-600">Mbps</span>
            </div>
            <div className="mt-4 h-1 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${(metrics.downlink / 500) * 100}%` }} />
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl group/metric hover:border-indigo-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <Navigation className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uplink Telemetry</span>
              </div>
              <Activity className="w-4 h-4 text-slate-700 group-hover/metric:text-indigo-500 transition-colors" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black font-mono text-white tracking-tighter">{metrics.uplink.toFixed(0)}</div>
              <span className="text-xs font-bold text-slate-600">Mbps</span>
            </div>
            <div className="mt-4 h-1 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{ width: `${(metrics.uplink / 100) * 100}%` }} />
            </div>
          </div>

          <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-amber-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal (dBm)</span>
              </div>
              <span className="text-sm font-mono font-bold text-amber-400">{metrics.signalStrength} dBm</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Jitter Matrix</span>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-400">~2ms</span>
            </div>
            <div className="flex items-center gap-3 px-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-[8px] font-black text-cyan-400/60 uppercase tracking-widest">End-to-End Cryptographic Link</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <Signal className="w-5 h-5 text-emerald-500 animate-pulse" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Link Quality</span>
                <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter italic">ULTRA_STABLE</span>
             </div>
          </div>
          <div className="w-px h-8 bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-3">
             <Globe className="w-5 h-5 text-cyan-400" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ground Gateway</span>
                <span className="text-xs font-mono text-cyan-400 font-bold tracking-tighter">PRIME_CONNECTED</span>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-700">
            Link Diagnostics
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-cyan-900/20 transition-all active:scale-95 group/btn">
            Detailed Sat-Map
            <Navigation className="w-3.5 h-3.5 group-hover/btn:translate-y-[-2px] group-hover/btn:translate-x-[2px] transition-transform" />
          </button>
        </div>
      </div>
      <style>{`
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

export default StarlinkMetrics;