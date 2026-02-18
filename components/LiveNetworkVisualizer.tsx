import React, { useRef, useEffect } from 'react';
import { Network, Activity, ShieldCheck, Zap } from 'lucide-react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

const LiveNetworkVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    const nodeCount = 45;
    const nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const connectionDistance = 150;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Draw connections
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = 1 - dist / connectionDistance;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.2})`;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // Chance to spawn a pulse on an existing connection
            if (Math.random() > 0.9995 && pulses.length < 15) {
              pulses.push({
                fromNode: i,
                toNode: j,
                progress: 0,
                speed: 0.01 + Math.random() * 0.02,
              });
            }
          }
        }
      }
      ctx.stroke();

      // Draw Pulses
      pulses.forEach((pulse, index) => {
        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];
        
        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#10b981';
        ctx.fill();
        ctx.shadowBlur = 0;

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(index, 1);
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col transition-all duration-700 hover:border-emerald-500/30 group">
      <div className="p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Network className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Global Node Mesh</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">Decentralized Pulse Visualization</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Data Flow Rate</span>
             <span className="text-xs font-mono text-emerald-400 font-black">2.4 TB/S</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
             <Zap className="w-3.5 h-3.5 text-amber-500" />
             <span className="text-[10px] font-black text-white uppercase">Active Mesh</span>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full h-[300px] bg-slate-950/50 cursor-crosshair">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Absolute Overlays for Tactical Feel */}
        <div className="absolute top-4 left-4 p-3 glass rounded-xl border border-white/5 space-y-2 pointer-events-none">
           <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span className="text-[9px] font-mono text-slate-300">CLUSTER: NORTH_ATLANTIC_PRIME</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-[9px] font-mono text-slate-300">PROTO_LINK: SECURE_V3</span>
           </div>
        </div>

        <div className="absolute bottom-4 right-4 text-right pointer-events-none">
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Scanning Active</span>
           <div className="flex gap-1 mt-1 justify-end">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
         {[
           { label: 'Latency', value: '14ms', color: 'text-cyan-400' },
           { label: 'Uptime', value: '99.99%', color: 'text-emerald-400' },
           { label: 'Hops', value: '3 Avg', color: 'text-indigo-400' },
           { label: 'Security', value: '12-Layer', color: 'text-amber-400' }
         ].map((stat, idx) => (
           <div key={idx} className="flex flex-col items-center justify-center border-r last:border-r-0 border-slate-800">
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
             <span className={`text-sm font-black font-mono ${stat.color}`}>{stat.value}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default LiveNetworkVisualizer;