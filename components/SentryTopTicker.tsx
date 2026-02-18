
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Crown, TrendingUp, TrendingDown, Landmark, Zap } from 'lucide-react';

interface TickerAlert {
  id: string;
  text: string;
  type: 'institutional' | 'whale' | 'cex';
  severity: 'high' | 'medium';
}

const SentryTopTicker: React.FC = () => {
  const [tickerAlerts, setTickerAlerts] = useState<TickerAlert[]>([
    { id: '1', text: 'INITIALIZING SENTINEL NEURAL LINK...', type: 'cex', severity: 'medium' },
    { id: '2', text: 'SCANNING INSTITUTIONAL OTC DESKS...', type: 'institutional', severity: 'high' }
  ]);

  useEffect(() => {
    const messages = [
      "WHALE ALERT: 4,200 BTC moved from Unknown Wallet to Binance",
      "INSTITUTIONAL: BlackRock ETF Inflow +1,240 BTC detected",
      "SENTINEL: Neural pattern match found for MicroStrategy accumulation",
      "CEX ALERT: Massive outflow from Coinbase Vault detected",
      "INSTITUTIONAL: Fidelity FBTC liquidity cluster increasing",
      "WHALE ALERT: 1,500 BTC liquidated on Bybit Futures",
      "SENTINEL: Layer 12 Core Integrity Verified",
      "INSTITUTIONAL: Sovereign Fund (UAE) portfolio rebalancing detected"
    ];

    const interval = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const type = msg.includes('INSTITUTIONAL') ? 'institutional' : msg.includes('WHALE') ? 'whale' : 'cex';
      
      const newAlert: TickerAlert = {
        id: Math.random().toString(36).substr(2, 9),
        text: msg.toUpperCase(),
        type,
        severity: type === 'institutional' ? 'high' : 'medium'
      };

      setTickerAlerts(prev => [...prev.slice(-4), newAlert]);
    }, 15000); // Slower update frequency (15s instead of 6s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-indigo-950/40 border-b border-indigo-500/30 h-8 flex items-center overflow-hidden relative z-[60] backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 bg-indigo-600 h-full text-white font-black text-[10px] uppercase tracking-tighter italic z-10 shadow-[5px_0_10px_rgba(0,0,0,0.3)] shrink-0">
        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
        Live Sentry Feed
      </div>
      
      <div className="flex-1 flex items-center overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee-slow items-center gap-12 pl-4">
          {tickerAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3">
              <div className={`p-0.5 rounded ${
                alert.type === 'institutional' ? 'bg-amber-500/20 text-amber-400' :
                alert.type === 'whale' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {alert.type === 'institutional' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              </div>
              <span className={`text-[10px] font-mono font-bold tracking-widest ${
                alert.type === 'institutional' ? 'text-amber-400' : 'text-slate-200'
              }`}>
                {alert.text}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {tickerAlerts.map((alert) => (
            <div key={alert.id + '_dup'} className="flex items-center gap-3">
              <div className={`p-0.5 rounded ${
                alert.type === 'institutional' ? 'bg-amber-500/20 text-amber-400' :
                alert.type === 'whale' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {alert.type === 'institutional' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
              </div>
              <span className={`text-[10px] font-mono font-bold tracking-widest ${
                alert.type === 'institutional' ? 'text-amber-400' : 'text-slate-200'
              }`}>
                {alert.text}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee-slow 120s linear infinite; /* Significantly slowed from 30s to 120s */
        }
      `}</style>
    </div>
  );
};

export default SentryTopTicker;
