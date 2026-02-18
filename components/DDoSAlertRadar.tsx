import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, Activity, ShieldCheck, Terminal, Crosshair, AlertTriangle, Layers } from 'lucide-react';

interface Threat {
  id: string;
  angle: number;
  distance: number;
  severity: 'low' | 'medium' | 'high';
  type: string;
  magnitude: string;
  timestamp: string;
}

const DDoSAlertRadar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [activeMitigation, setActiveMitigation] = useState(false);
  const [load, setLoad] = useState(0.4); // Gbps

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 400;
    let height = canvas.height = 400;
    let angle = 0;

    const render = () => {
      // Clear with fading effect for trails
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = width / 2 - 20;

      // Draw Concentric Rings
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Crosshair lines
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Draw Sweep
      const sweepAngle = (angle * Math.PI) / 180;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.2)');

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle - 0.2, sweepAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Scanning Line
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * radius,
        centerY + Math.sin(sweepAngle) * radius
      );
      ctx.stroke();

      // Draw Threats
      setThreats(prev => {
        prev.forEach(t => {
          const tx = centerX + Math.cos((t.angle * Math.PI) / 180) * t.distance;
          const ty = centerY + Math.sin((t.angle * Math.PI) / 180) * t.distance;
          
          // Only show threat if sweep is near or it's recently detected
          const angleDiff = Math.abs((t.angle % 360) - (angle % 360));
          if (angleDiff < 10 || Math.random() > 0.95) {
            ctx.beginPath();
            ctx.arc(tx, ty, t.severity === 'high' ? 4 : 2, 0, Math.PI * 2);
            ctx.fillStyle = t.severity === 'high' ? '#f43f5e' : t.severity === 'medium' ? '#f59e0b' : '#10b981';
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle as string;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
        return prev;
      });

      angle = (angle + 1.5) % 360;
      requestAnimationFrame(render);
    };

    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const severityArr: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
        const typeArr = ['UDP_FLOOD', 'SYN_INCURSION', 'L7_STRESS', 'BOTNET_PING', 'INVALID_HANDSHAKE'];
        const sev = severityArr[Math.floor(Math.random() * 3)];
        
        const newThreat: Threat = {
          id: Math.random().toString(36).substring(2, 5).toUpperCase(),
          angle: Math.random() * 360,
          distance: 40 + Math.random() * 140,
          severity: sev,
          type: typeArr[Math.floor(Math.random() * typeArr.length)],
          magnitude: (sev === 'high' ? (Math.random() * 10 + 5).toFixed(1) : (Math.random() * 2).toFixed(1)) + ' Gbps',
          timestamp: new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })
        };

        if (sev === 'high') {
          setActiveMitigation(true);
          setLoad(prev => prev + parseFloat(newThreat.magnitude));
          setTimeout(() => {
             setActiveMitigation(false);
             setLoad(0.4 + Math.random() * 0.2);
          }, 5000);
        }

        setThreats(prev => [newThreat, ...prev].slice(0, 8));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <ShieldAlert className="w-64 h-64 text-rose-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/30">
              <Crosshair className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">DDoS <span className="text-rose-500">Sentry Radar</span></h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            Active Perimeter Scrubbing Protocol
          </p>
        </div>

        <div className="flex items-center gap-8">
           <div className="text-right">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Traffic Load</div>
              <div className={`text-4xl font-black font-mono flex items-baseline gap-1 transition-colors duration-500 ${activeMitigation ? 'text-rose-500' : 'text-white'}`}>
                {load.toFixed(2)}
                <span className="text-xs text-slate-500">GBPS</span>
              </div>
           </div>
           <div className="h-12 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Defense Status</div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border font-black text-[10px] uppercase tracking-widest ${activeMitigation ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse' : 'bg-emerald-500/10 border-emerald-500 text-emerald-500'}`}>
                {activeMitigation ? 'Mitigating_Incursion' : 'Perimeter_Secure'}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Radar Visualization */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-3xl p-4 flex items-center justify-center relative overflow-hidden min-h-[350px]">
           <canvas ref={canvasRef} className="w-full h-full max-w-[320px] max-h-[320px]" />
           {activeMitigation && (
             <div className="absolute inset-0 border-2 border-rose-500/20 animate-pulse rounded-3xl pointer-events-none" />
           )}
           <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
             <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">Scanning Sector 01-Shield</span>
           </div>
        </div>

        {/* Telemetry Feed */}
        <div className="lg:col-span-7 flex flex-col gap-4">
           <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Threat Telemetry Feed</span>
                 </div>
                 <span className="text-[8px] font-mono text-slate-600">ENCRYPTED_LOG_V2.6</span>
              </div>
              
              <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1 font-mono">
                 {threats.length === 0 ? (
                   <div className="h-full flex items-center justify-center text-[10px] text-slate-700 italic">Perimeter quiet. No anomalies detected.</div>
                 ) : (
                   threats.map((threat) => (
                     <div key={threat.id} className={`p-3 rounded-xl border transition-all animate-in slide-in-from-right-2 ${threat.severity === 'high' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                        <div className="flex justify-between items-center mb-1">
                           <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${threat.severity === 'high' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`} />
                              <span className="text-[10px] font-black text-white">{threat.type}</span>
                           </div>
                           <span className="text-[9px] text-slate-600">{threat.timestamp}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-bold">
                           <span className="text-slate-500 uppercase tracking-tighter">Vector: {threat.angle.toFixed(1)}° • Mag: <span className={threat.severity === 'high' ? 'text-rose-400' : 'text-amber-400'}>{threat.magnitude}</span></span>
                           <span className={`uppercase tracking-widest ${threat.severity === 'high' ? 'text-rose-500' : 'text-slate-500'}`}>{threat.severity === 'high' ? 'SCRUBBING' : 'DROPPED'}</span>
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 <div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mitigation Rate</div>
                    <div className="text-lg font-black text-white font-mono">100%</div>
                 </div>
              </div>
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                 <Layers className="w-6 h-6 text-indigo-500" />
                 <div>
                    <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Layers</div>
                    <div className="text-lg font-black text-white font-mono">L1-L4</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Zap className="w-3.5 h-3.5 text-amber-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global IP Reputation Hub: SYNCED</span>
            </div>
            <div className="flex items-center gap-2">
               <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Anomalous Spike Warning: ARMED</span>
            </div>
         </div>
         <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-slate-700">
           Flush Mitigation Cache
         </button>
      </div>
    </div>
  );
};

export default DDoSAlertRadar;