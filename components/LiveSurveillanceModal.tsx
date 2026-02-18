import React, { useRef, useEffect, useState, useMemo } from 'react';
/* Added ShieldCheck to the lucide-react import list to fix 'Cannot find name ShieldCheck' error */
import { X, Shield, Activity, Zap, Terminal, Cpu, Globe, Layers, ShieldAlert, Wifi, Search, Fingerprint, Lock, Radio, Crosshair, ShieldCheck } from 'lucide-react';

interface Packet {
  id: string;
  layer: number;
  status: 'VALIDATING' | 'SCRUBBED' | 'FINALIZED';
  x: number;
  y: number;
  targetY: number;
  color: string;
}

interface LiveSurveillanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveSurveillanceModal: React.FC<LiveSurveillanceModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    throughput: 142.4,
    entropy: 99.98,
    handshakes: 12402,
    threatsIsolated: 482
  });

  // Animation Engine
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

    let frame = 0;
    const layerHeight = height / 13;
    const activePackets: Packet[] = [];

    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw 12 Layers
      for (let i = 1; i <= 12; i++) {
        const y = i * layerHeight;
        ctx.strokeStyle = i === 12 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)';
        ctx.setLineDash(i === 12 ? [] : [5, 15]);
        ctx.beginPath();
        ctx.moveTo(100, y);
        ctx.lineTo(width - 100, y);
        ctx.stroke();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '8px monospace';
        ctx.fillText(`LAYER_${i.toString().padStart(2, '0')}`, 40, y + 3);
      }
      ctx.setLineDash([]);

      // Spawn Packets
      if (frame % 20 === 0) {
        activePackets.push({
          id: Math.random().toString(36).substring(2, 5),
          layer: 1,
          status: 'VALIDATING',
          x: 100 + Math.random() * (width - 200),
          y: layerHeight,
          targetY: 2 * layerHeight,
          color: Math.random() > 0.95 ? '#f43f5e' : '#10b981'
        });
      }

      // Update Packets
      activePackets.forEach((p, idx) => {
        if (p.status === 'FINALIZED') return;

        const dy = p.targetY - p.y;
        if (dy > 0.5) {
          p.y += 2;
        } else {
          if (p.layer < 12) {
            // Check for scrubbing
            if (p.color === '#f43f5e' && p.layer === 4) {
              p.status = 'SCRUBBED';
              setMetrics(m => ({ ...m, threatsIsolated: m.threatsIsolated + 1 }));
            } else {
              p.layer += 1;
              p.targetY = p.layer * layerHeight;
            }
          } else {
            p.status = 'FINALIZED';
          }
        }

        // Draw Packet
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.status === 'SCRUBBED' ? 4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = p.status === 'SCRUBBED' ? '#f43f5e' : p.color;
        ctx.shadowBlur = p.status === 'SCRUBBED' ? 15 : 5;
        ctx.shadowColor = ctx.fillStyle as string;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (p.status === 'SCRUBBED') {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Cleanup
      if (activePackets.length > 100) activePackets.shift();

      frame++;
      requestAnimationFrame(render);
    };

    render();
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Forensic Log Generator
  useEffect(() => {
    if (!isOpen) return;
    const messages = [
      "> INBOUND_PACKET_ID: 0x4f2a... VERIFYING_L1",
      "> NEURAL_CONFIDENCE: 99.82%... OK",
      "> ZK_PROOF_BATCH_SIGNED... L8_LOCK",
      "> ANOMALY_DETECTED: PKT_842... ISOLATING",
      "> SCRUBBING_COMPLETED... REPUTATION_INDEX++",
      "> BLOCK_FINALITY_PRE-CHECK: 0.12ms",
      "> SWARM_CONSENSUS_STABLE: 10M_NODES"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [messages[i % messages.length], ...prev].slice(0, 15));
      setMetrics(m => ({
        ...m,
        throughput: parseFloat((140 + Math.random() * 5).toFixed(1)),
        entropy: parseFloat((99.9 + Math.random() * 0.09).toFixed(2))
      }));
      i++;
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full h-full bg-slate-900 border border-emerald-500/20 rounded-[3rem] shadow-[0_0_150px_rgba(16,185,129,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        {/* Tactical Header */}
        <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 relative">
              <div className="absolute inset-0 bg-emerald-500/20 animate-ping rounded-2xl opacity-20" />
              <Activity className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Live <span className="text-emerald-500">AI Sentinel Surveillance</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em]">Exascale Forensic Stream v2.9</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest italic">REALTIME_MESH_AUDIT</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-10">
                <div className="text-right">
                   <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Scrubbing Velocity</div>
                   <div className="text-2xl font-black font-mono text-white">{metrics.throughput} <span className="text-xs text-slate-600">GB/S</span></div>
                </div>
                <div className="text-right">
                   <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Neural Entropy</div>
                   <div className="text-2xl font-black font-mono text-emerald-400">{metrics.entropy}%</div>
                </div>
             </div>
             <button onClick={onClose} className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-90">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Visualizer */}
          <div className="flex-1 relative bg-slate-950/80">
             <canvas ref={canvasRef} className="w-full h-full block" />
             
             {/* Map HUD Components */}
             <div className="absolute top-8 left-8 space-y-4 pointer-events-none">
                <div className="p-6 glass rounded-3xl border border-white/5 space-y-4 min-w-[260px] shadow-2xl">
                   <div className="flex items-center gap-3">
                      <Crosshair className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Surveillance Node_01</span>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[8px] text-slate-500 uppercase font-black">Status</div>
                      <div className="text-xl font-black font-mono text-emerald-400">NOMINAL_EXASCALE</div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                         <div className="text-[8px] text-slate-600 uppercase font-black">Handshakes</div>
                         <div className="text-[10px] font-black text-white">{metrics.handshakes.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                         <div className="text-[8px] text-slate-600 uppercase font-black">Isolated</div>
                         <div className="text-[10px] font-black text-rose-500">+{metrics.threatsIsolated}</div>
                      </div>
                   </div>
                </div>

                <div className="p-5 glass rounded-2xl border border-rose-500/10 space-y-3">
                   <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Active_Interceptions</span>
                   </div>
                   <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" style={{ width: '12%' }} />
                   </div>
                </div>
             </div>

             <div className="absolute bottom-8 right-8 pointer-events-none text-right">
                <div className="p-4 glass rounded-xl border border-emerald-500/10">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 block">Protocol Heartbeat</span>
                   <div className="flex gap-1 justify-end">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-4 bg-emerald-500/20 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 100}ms`, height: `${30 + Math.random() * 70}%` }} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Right Sidebar: Forensic Terminal */}
          <aside className="w-96 border-l border-slate-800 bg-slate-950/60 p-8 flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      Neural Audit Log
                   </h3>
                   <p className="text-[9px] text-slate-600 font-bold uppercase italic">Real-time packet metadata</p>
                </div>
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[7px] font-black">ENCRYPTED</div>
             </div>

             <div className="flex-1 bg-black/40 border border-slate-800 rounded-3xl p-6 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar shadow-inner">
                {logs.map((log, i) => (
                  <div key={i} className={`animate-in slide-in-from-left-2 duration-300 ${log.includes('ANOMALY') ? 'text-rose-400' : log.includes('ZK_PROOF') ? 'text-indigo-400' : 'text-emerald-500/70'}`}>
                    {log}
                  </div>
                ))}
                <div className="animate-pulse flex items-center gap-2 mt-4 text-slate-700">
                   <div className="w-1.5 h-3 bg-slate-700" />
                   <span>Awaiting neural inference...</span>
                </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                         <Lock className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encryption Level</div>
                         <div className="text-xs font-black text-white">SHA3-512_AES_256</div>
                      </div>
                   </div>
                   <Fingerprint className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-emerald-500/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                         <Radio className="w-4 h-4" />
                      </div>
                      <div>
                         <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Uplink Gateway</div>
                         <div className="text-xs font-black text-white">SATELLITE_LINK_B</div>
                      </div>
                   </div>
                   <Wifi className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                </div>
             </div>
          </aside>
        </div>

        {/* Footer Integrity Bar */}
        <div className="p-8 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 shrink-0">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-emerald-500" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Surveillance Integrity</span>
                    <span className="text-sm font-mono text-emerald-400 font-bold tracking-tighter uppercase italic">Layer_12_Verified_Max</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-4">
                 <Cpu className="w-6 h-6 text-indigo-400" />
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Load Index</span>
                    <span className="text-sm font-mono text-indigo-400 font-bold tracking-tighter uppercase italic">14.2%_Nominal</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4">
                 <Globe className="w-4 h-4 text-cyan-500 animate-spin-slow" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Sector Alpha-9 Sync Active</span>
              </div>
              <button onClick={onClose} className="flex-1 md:flex-none px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/20 uppercase tracking-widest text-[10px] active:scale-95">
                 Terminate Feed
              </button>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
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

export default LiveSurveillanceModal;