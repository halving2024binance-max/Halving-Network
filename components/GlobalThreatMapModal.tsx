import React, { useRef, useEffect, useState, useMemo } from 'react';
import { X, Globe, ShieldAlert, Zap, Activity, Terminal, Crosshair, Map, ShieldCheck, ArrowRight, Flame, Percent } from 'lucide-react';

interface CountryCoord {
  name: string;
  code: string;
  lat: number;
  lng: number;
  count: number;
  vector: string;
}

const ATTACKER_COORDS: CountryCoord[] = [
  { name: 'United States', code: 'US', lat: 37, lng: -95, count: 42109, vector: 'UDP_FLOOD' },
  { name: 'China', code: 'CN', lat: 35, lng: 104, count: 38421, vector: 'SYN_INC' },
  { name: 'Russia', code: 'RU', lat: 61, lng: 105, count: 31205, vector: 'L7_STRESS' },
  { name: 'Brazil', code: 'BR', lat: -14, lng: -51, count: 18402, vector: 'BOTNET_PING' },
  { name: 'India', code: 'IN', lat: 20, lng: 78, count: 15904, vector: 'UDP_FLOOD' },
  { name: 'Germany', code: 'DE', lat: 51, lng: 10, count: 12402, vector: 'TCP_STORM' },
  { name: 'Vietnam', code: 'VN', lat: 14, lng: 108, count: 9842, vector: 'SYN_INC' },
  { name: 'Netherlands', code: 'NL', lat: 52, lng: 5, count: 7205, vector: 'L7_STRESS' },
  { name: 'United Kingdom', code: 'GB', lat: 55, lng: -3, count: 5402, vector: 'UDP_FLOOD' },
  { name: 'France', code: 'FR', lat: 46, lng: 2, count: 4821, vector: 'BOTNET_PING' },
];

interface GlobalThreatMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalThreatMapModal: React.FC<GlobalThreatMapModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLog, setActiveLog] = useState<string[]>([]);
  const [mitigationActive, setMitigationActive] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const mapProjection = (lat: number, lng: number) => {
      const x = (lng + 180) * (width / 360);
      const y = (90 - lat) * (height / 180);
      return { x, y };
    };

    const targetPos = mapProjection(20, 0); // Halving Network Hub (arbitrary center)

    let frame = 0;
    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid Background
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw World Points (Pseudo Map)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      for (let i = 0; i < 2000; i++) {
        // Deterministic pseudo-random points for static look
        const x = (i * 137.5) % width;
        const y = (i * 1.618 * (height / width) * 100) % height;
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Attacker Vectors
      ATTACKER_COORDS.forEach((c, idx) => {
        const origin = mapProjection(c.lat, c.lng);
        const pulse = Math.sin(frame * 0.05 + idx) * 0.5 + 0.5;

        // Origin Glow
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 4 + pulse * 4, 0, Math.PI * 2);
        ctx.fillStyle = mitigationActive === c.code ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = mitigationActive === c.code ? '#10b981' : '#f43f5e';
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '8px monospace';
        ctx.fillText(c.code, origin.x + 8, origin.y + 3);

        // Vector Beam
        if (mitigationActive !== c.code) {
          ctx.beginPath();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(244, 63, 94, ${0.1 + pulse * 0.2})`;
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -frame * 0.5;
          
          ctx.moveTo(origin.x, origin.y);
          // Curve towards center
          const cpX = (origin.x + targetPos.x) / 2;
          const cpY = (origin.y + targetPos.y) / 2 - 100;
          ctx.quadraticCurveTo(cpX, cpY, targetPos.x, targetPos.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Target Hub
      ctx.beginPath();
      ctx.arc(targetPos.x, targetPos.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fill();
      
      const hubPulse = Math.sin(frame * 0.1) * 5;
      ctx.beginPath();
      ctx.arc(targetPos.x, targetPos.y, 15 + hubPulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.stroke();

      frame++;
      requestAnimationFrame(render);
    };

    render();
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, mitigationActive]);

  useEffect(() => {
    if (isOpen) {
      const messages = [
        "> ANALYZING_INCURSION_TRAJECTORY...",
        "> IP_REPUTATION_MESH: UPDATED",
        "> SCRUBBING_L12_PERIMETER...",
        "> BOTNET_SIGNATURE_IDENTIFIED: MIRAI_V4",
        "> GLOBAL_SENTRY_NODES: STABLE"
      ];
      let i = 0;
      const interval = setInterval(() => {
        setActiveLog(prev => [messages[i % messages.length], ...prev].slice(0, 10));
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full h-[90vh] bg-slate-900 border border-rose-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(244,63,94,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />
        
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30 shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Globe className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Detailed <span className="text-rose-500">Threat Map</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.2em]">Forensic Global Overlay v2.7</span>
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] text-rose-400 font-mono uppercase tracking-widest">LIVE_INCURSION_STREAM</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-95">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Map Viewer */}
          <div className="flex-1 relative bg-slate-950/50">
             <canvas ref={canvasRef} className="w-full h-full block" />
             
             {/* Map HUD Overlay */}
             <div className="absolute top-8 left-8 space-y-6 pointer-events-none">
                <div className="p-6 glass rounded-3xl border border-white/5 space-y-4 min-w-[240px]">
                   <div className="flex items-center gap-3">
                      <Crosshair className="w-4 h-4 text-rose-500" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Target Core Hub</span>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[9px] text-slate-500 uppercase font-bold">Node Identity</div>
                      <div className="text-xl font-black font-mono text-emerald-400">HALV_SENTINEL_01</div>
                   </div>
                   <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                      <div>
                         <div className="text-[8px] text-slate-600 uppercase font-black">Status</div>
                         <div className="text-[10px] font-black text-white">HARDENED</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[8px] text-slate-600 uppercase font-black">Shield</div>
                         <div className="text-[10px] font-black text-emerald-500">L12_MAX</div>
                      </div>
                   </div>
                </div>

                <div className="p-5 glass rounded-2xl border border-white/5 space-y-3">
                   <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[9px] font-mono text-slate-400">FORENSIC_STREAM_...</span>
                   </div>
                   <div className="space-y-1 font-mono text-[8px] text-rose-400/80">
                      {activeLog.map((log, i) => (
                        <div key={i} className="animate-in slide-in-from-left-2 duration-300">{log}</div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="absolute bottom-8 left-8 pointer-events-none">
                <div className="px-4 py-2 glass rounded-xl border border-rose-500/20 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Incursion Level: SEVERE</span>
                </div>
             </div>
          </div>

          {/* Right Sidebar: Active Origins */}
          <aside className="w-96 border-l border-slate-800 bg-slate-950/40 p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
             <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-rose-500" />
                   Active Origin Feed
                </h3>
                <p className="text-[9px] text-slate-600 font-bold uppercase italic">Real-time source mitigation</p>
             </div>

             <div className="space-y-3 flex-1">
                {ATTACKER_COORDS.map((c, i) => (
                  <div key={c.code} className={`p-4 rounded-2xl border transition-all duration-300 ${mitigationActive === c.code ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800 hover:border-rose-500/30 group/item'}`}>
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center font-black text-[10px] text-slate-500">
                              {c.code}
                           </div>
                           <div>
                              <div className="text-[10px] font-black text-white uppercase">{c.name}</div>
                              <div className="text-[8px] font-mono text-slate-600 uppercase">{c.vector}</div>
                           </div>
                        </div>
                        <span className={`text-[10px] font-black font-mono ${mitigationActive === c.code ? 'text-emerald-500' : 'text-rose-400'}`}>
                           {c.count.toLocaleString()}
                        </span>
                     </div>
                     
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setMitigationActive(mitigationActive === c.code ? null : c.code)}
                          className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            mitigationActive === c.code 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white'
                          }`}
                        >
                           {mitigationActive === c.code ? 'MITIGATED' : 'KILL_SWITCH'}
                        </button>
                        <div className="w-10 h-8 bg-slate-950 rounded-lg flex items-center justify-center border border-white/5">
                           <Activity className={`w-3.5 h-3.5 ${mitigationActive === c.code ? 'text-emerald-500' : 'text-rose-500 animate-pulse'}`} />
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="pt-6 border-t border-slate-800 space-y-4">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
                   <Zap className="w-6 h-6 text-indigo-400" />
                   <div>
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Sync Status</div>
                      <div className="text-sm font-black text-white font-mono">ALL_NODES_HARDENED</div>
                   </div>
                </div>
                <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                   Download Incursion Report <ArrowRight className="w-3.5 h-3.5" />
                </button>
             </div>
          </aside>
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

export default GlobalThreatMapModal;