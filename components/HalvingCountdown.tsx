
import React, { useState, useEffect } from 'react';
import { Timer, ExternalLink } from 'lucide-react';

const HalvingCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Arbitrary future date for simulation
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 142);
    targetDate.setHours(targetDate.getHours() + 4);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Timer className="w-32 h-32 text-indigo-400 rotate-12" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">HALVING2024</h3>
            <p className="text-indigo-300 text-sm font-medium">NEXT PROTOCOL SUBSIDY REDUCTION</p>
          </div>
          <a href="#" className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        <div className="flex gap-4">
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HRS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEC', value: timeLeft.seconds },
          ].map((unit, idx) => (
            <div key={idx} className="flex-1 bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl text-center group hover:border-indigo-500/50 transition-all">
              <div className="text-4xl font-black text-indigo-400 font-mono group-hover:scale-110 transition-transform">
                {unit.value.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-500 font-bold mt-1 tracking-widest">{unit.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-2">
            <span>CURRENT BLOCK: 840,321</span>
            <span>HALVING BLOCK: 840,000 (SIMULATED)</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-[94%]" />
          </div>
          <div className="text-center mt-3">
             <span className="text-xs text-indigo-400 font-mono animate-pulse uppercase">Est. Completion: May 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalvingCountdown;
