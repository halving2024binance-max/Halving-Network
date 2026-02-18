import React, { useState, useEffect, useRef } from 'react';
import { Landmark, TrendingUp, TrendingDown, Zap, ShieldAlert, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';

interface InstitutionalTrade {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  valueUsd: string;
  entity: string;
  timestamp: string;
  confidence: number;
}

const ENTITIES = ['BlackRock iShares', 'Fidelity FBTC', 'MicroStrategy', 'ARK Invest', 'Grayscale Trust', 'Tesla Treasury', 'Dubai Sovereign Fund'];

const InstitutionalRadar: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<InstitutionalTrade | null>(null);
  const [sentiment, setSentiment] = useState(64); // 0 to 100 (Sell to Buy)
  const [isMuted, setIsMuted] = useState(true);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playRadarAlert = (trade: InstitutionalTrade) => {
    if (isMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(60, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(trade.type === 'buy' ? 880 : 440, now);
      osc2.frequency.exponentialRampToValueAtTime(trade.type === 'buy' ? 1200 : 220, now + 0.2);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.8);
      osc2.start(now);
      osc2.stop(now + 0.4);

      const utterance = new SpeechSynthesisUtterance(
        `Sentry Alert. ${trade.entity} ${trade.type === 'buy' ? 'accumulation' : 'distribution'} detected. ${trade.amount} Bitcoin.`
      );
      utterance.rate = 1.1;
      utterance.pitch = 0.8;
      utterance.volume = 0.6;
      window.speechSynthesis.speak(utterance);

    } catch (e) {
      console.error('Radar audio failed', e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        const type = Math.random() > 0.4 ? 'buy' : 'sell';
        const amount = Math.floor(Math.random() * 8000) + 1500;
        const newAlert: InstitutionalTrade = {
          id: Math.random().toString(36).substring(2, 9).toUpperCase(),
          type,
          amount,
          valueUsd: (amount * 68500 / 1000000).toFixed(1) + 'M',
          entity: ENTITIES[Math.floor(Math.random() * ENTITIES.length)],
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          confidence: Math.floor(Math.random() * 15) + 85
        };

        setActiveAlert(newAlert);
        playRadarAlert(newAlert); 

        setSentiment(prev => {
          const shift = type === 'buy' ? 3 : -3;
          return Math.max(10, Math.min(90, prev + shift));
        });

        setTimeout(() => setActiveAlert(null), 8000);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isMuted]);

  return (
    <div className="bg-slate-950/80 border-2 border-slate-800 rounded-3xl p-6 relative overflow-hidden group">
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none transition-colors duration-1000 ${activeAlert?.type === 'buy' ? 'bg-emerald-500' : activeAlert?.type === 'sell' ? 'bg-rose-500' : 'bg-transparent'}`} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase italic">Institutional Radar</h3>
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-[0.2em]">ETFs & CORPS FLOWS</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg border transition-all flex items-center gap-2 ${isMuted ? 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}
            title={isMuted ? "Enable Radar Audio Notifications" : "Mute Radar Audio Notifications"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            <span className="text-[10px] font-bold uppercase hidden sm:inline">{isMuted ? 'Audio Off' : 'Radar Live'}</span>
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Market Bias</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-black ${sentiment > 50 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {sentiment > 50 ? 'ACCUMULATION' : 'DISTRIBUTION'}
              </span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-1000 ${sentiment > 50 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`}
                  style={{ width: `${sentiment}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-28 flex items-center justify-center relative z-10">
        {activeAlert ? (
          <div className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between gap-4 animate-in zoom-in-95 fade-in duration-500 ${
            activeAlert.type === 'buy' 
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
              : 'bg-rose-500/10 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${activeAlert.type === 'buy' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'}`}>
                {activeAlert.type === 'buy' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${activeAlert.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    INSTITUTIONAL {activeAlert.type.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{activeAlert.timestamp}</span>
                </div>
                <h4 className="text-xl font-black text-white leading-tight">
                  {activeAlert.amount.toLocaleString()} BTC <span className="text-slate-500 font-normal">(${activeAlert.valueUsd})</span>
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Landmark className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-300">{activeAlert.entity}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end gap-1">
               <div className="flex items-center gap-1.5">
                 <Zap className="w-3 h-3 text-amber-500" />
                 <span className="text-[10px] font-black text-amber-500 font-mono">{activeAlert.confidence}% CONFIDENCE</span>
               </div>
               <div className="flex -space-x-1">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className={`w-1.5 h-1.5 rounded-full ${activeAlert.type === 'buy' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'} animate-pulse`} style={{ animationDelay: `${i * 200}ms` }} />
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2 opacity-40">
            <div className="flex justify-center">
              <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Monitoring Institutional Entry Points...</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-widest">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> ETF INFLOW: NOMINAL
           </span>
           <span className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> CEX EXIT: HIGH
           </span>
        </div>
        <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
          FULL FLOW ANALYTICS <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default InstitutionalRadar;