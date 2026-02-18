import React, { useRef, useEffect, useState } from 'react';
import { X, Crosshair, Map, Shield, Zap, Activity, Globe, Terminal } from 'lucide-react';

interface DetailedGridMapProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailedGridMap: React.FC<DetailedGridMapProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, gridX: 'A', gridY: '0' });
  const [activeNodes, setActiveNodes] = useState(5842);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth * 0.8;
    let height = canvas.height = 600;

    const nodes: { x: number; y: number; s: number; t: number }[] = [];
    for (let i = 0; i < 500; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        s: Math.random() * 2 + 0.5,
        t: Math.random() * Math.PI * 2
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth * 0.8;
      height = canvas.height = 600;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const render = (time: number) => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw "Heat" areas
      const pulse = Math.sin(time / 1000) * 0.5 + 0.5;
      const grd = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, 400);
      grd.addColorStop(0, `rgba(16, 185, 129, ${0.05 * pulse})`);
      grd.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // Render Nodes
      nodes.forEach(n => {
        const opacity = Math.sin(time / 500 + n.t) * 0.4 + 0.6;
        ctx.fillStyle = n.s > 2 ? `rgba(245, 158, 11, ${opacity})` : `rgba(16, 185, 129, ${opacity})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.s, 0, Math.PI * 2);
        ctx.fill();

        if (n.s > 2.4 && Math.random() > 0.98) {
           ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
           ctx.beginPath();
           ctx.arc(n.x, n.y, n.s * 4, 0, Math.PI * 2);
           ctx.stroke();
        }
      });

      // Scanning Line
      const scanY = (time / 5) % height;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridX = String.fromCharCode(65 + Math.floor(x / 40));
    const gridY = Math.floor(y / 40).toString();
    setMousePos({ x, y, gridX, gridY });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
        
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <Map className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tactical <span className="text-emerald-400">Grid Mapping</span></h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest">Global Sector Alpha-9 Synchronization</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-95 border border-slate-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative group">
          <canvas 
            ref={canvasRef} 
            onMouseMove={handleMouseMove}
            className="w-full h-[600px] cursor-crosshair block"
          />
          
          {/* Tactical HUD Overlays */}
          <div className="absolute top-6 left-6 space-y-4 pointer-events-none">
            <div className="p-4 bg-slate-950/80 backdrop-blur border border-emerald-500/20 rounded-2xl space-y-2 min-w-[200px] shadow-2xl">
               <div className="flex items-center gap-2">
                 <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">COORDINATE_INPUT</span>
               </div>
               <div className="font-mono text-xl font-black text-white">
                 {mousePos.gridX}:{mousePos.gridY} <span className="text-[10px] text-slate-600">[{Math.round(mousePos.x)}, {Math.round(mousePos.y)}]</span>
               </div>
            </div>
            
            <div className="p-4 bg-slate-950/80 backdrop-blur border border-emerald-500/20 rounded-2xl space-y-3 min-w-[200px] shadow-2xl">
               <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black text-slate-500 uppercase">Node Discovery</span>
                 <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
               </div>
               <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_10px_#10b981]" />
               </div>
               <div className="text-sm font-black font-mono text-white">{activeNodes.toLocaleString()} NODES</div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 pointer-events-none text-right">
             <div className="p-4 bg-slate-950/80 backdrop-blur border border-emerald-500/20 rounded-2xl space-y-2 shadow-2xl">
                <div className="flex items-center justify-end gap-2">
                   <Activity className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Network Pulse</span>
                </div>
                <div className="flex gap-1 justify-end">
                   {[...Array(12)].map((_, i) => (
                     <div key={i} className="w-1 h-4 bg-emerald-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 100}ms`, height: `${Math.random() * 100}%` }} />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex flex-wrap items-center justify-between gap-6">
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Defense Layer</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">12-LAYER_ACTIVE</span>
                </div>
             </div>
             <div className="h-8 w-px bg-slate-800" />
             <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Exascale Feed</span>
                  <span className="text-xs font-mono text-amber-500 font-bold">STABLE_32ms</span>
                </div>
             </div>
             <div className="h-8 w-px bg-slate-800" />
             <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Reach</span>
                  <span className="text-xs font-mono text-cyan-400 font-bold">ALL_SECTORS_SYNCED</span>
                </div>
             </div>
           </div>
           
           <button 
             onClick={onClose}
             className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-xs active:scale-95"
           >
             Close Mapping Interface
           </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedGridMap;