import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Database, Cpu, Globe, Waves, ArrowRight, Anchor, TrendingDown, TrendingUp, Landmark, ArrowUpRight, ArrowDownLeft, Volume2, VolumeX, Crown, Info, ShieldAlert, Zap, Terminal, Search, X } from 'lucide-react';
import { SecurityAlert, AlertFilters } from '../types';

interface BlockchainMonitorProps {
  filters: AlertFilters;
}

const generateRandomAddr = () => `bc1q${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
const EXCHANGES = ['Binance', 'Coinbase', 'Kraken', 'Bitfinex', 'Bybit', 'OKX'];
const INSTITUTIONAL_ENTITIES = ['BlackRock', 'Fidelity', 'ARK Invest', 'MicroStrategy', 'Sovereign Fund (UAE)'];

const BlockchainMonitor: React.FC<BlockchainMonitorProps> = ({ filters }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isMuted, setIsMuted] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playAlertSound = (type: 'buy' | 'sell' | 'critical' | 'institutional') => {
    if (isMuted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'buy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'sell') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'institutional') {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc2.frequency.setValueAtTime(440, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 1.2);
        osc2.stop(now + 1.2);
      } else if (type === 'critical') {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc.type = 'square';
        osc2.type = 'square';
        osc.frequency.setValueAtTime(660, now);
        osc2.frequency.setValueAtTime(440, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.05, now + 0.02);
        gain2.gain.linearRampToValueAtTime(0, now + 0.1);
        gain2.gain.linearRampToValueAtTime(0.05, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.3);
        osc2.stop(now + 0.3);
      }
    } catch (e) {
      console.error('Audio synthesis failed', e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      
      const isInstitutional = rand > 0.95;
      const isCexAlert = rand > 0.88 && !isInstitutional; 
      const isBuyAlert = rand > 0.78 && !isInstitutional && !isCexAlert; 
      const isSellAlert = rand > 0.68 && !isInstitutional && !isCexAlert && !isBuyAlert;

      const amount = (Math.random() * 15000 + 1000).toFixed(0);
      const instAmount = (Math.floor(Math.random() * 10000) + 5000).toString();
      const exchange = EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)];
      const entity = INSTITUTIONAL_ENTITIES[Math.floor(Math.random() * INSTITUTIONAL_ENTITIES.length)];
      
      let newAlert: SecurityAlert;

      if (isInstitutional) {
        const isBuy = Math.random() > 0.5;
        newAlert = {
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          severity: 'institutional',
          message: `INSTITUTIONAL GRADE ${isBuy ? 'BUY' : 'SELL'}: ${entity} verified for ${instAmount} BTC movement. Massive market impact incoming.`,
          layer: 'AI Sentinel',
          type: isBuy ? 'institutional_buy' : 'institutional_sell',
          from: isBuy ? `${exchange} OTC Desk` : `${entity} Cold Storage`,
          to: isBuy ? `${entity} Private Vault` : `${exchange} Liquidity Cluster`,
          amount: instAmount
        };
        playAlertSound('institutional');
      } else if (isCexAlert) {
        const isInflux = Math.random() > 0.5;
        newAlert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          severity: 'high',
          message: `CRITICAL CEX FLOW: ${amount} BTC ${isInflux ? 'deposited to' : 'withdrawn from'} ${exchange}. Institutional level volatility expected.`,
          layer: 'Liquidity Sentinel',
          type: 'cex_alert',
          from: isInflux ? generateRandomAddr() : `${exchange} Vault`,
          to: isInflux ? `${exchange} Hot Wallet` : generateRandomAddr(),
          amount: amount
        };
        playAlertSound('critical');
      } else if (isBuyAlert) {
        newAlert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          severity: 'high',
          message: `SIGNIFICANT BUY ALERT: ${amount} BTC purchased on ${exchange}. Accumulation signature detected.`,
          layer: 'Liquidity Sentinel',
          type: 'buy',
          from: `${exchange} Liquidity Pool`,
          to: generateRandomAddr(),
          amount: amount
        };
        playAlertSound('buy');
      } else if (isSellAlert) {
        newAlert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          severity: 'high',
          message: `CRITICAL SELL ALERT: ${amount} BTC deposit detected to ${exchange}. Potential market pressure.`,
          layer: 'Liquidity Sentinel',
          type: 'sell',
          from: generateRandomAddr(),
          to: `${exchange} Hot Wallet`,
          amount: amount
        };
        playAlertSound('sell');
      } else {
        newAlert = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
          severity: 'medium',
          message: `Large Movement: ${amount} BTC transferred across protocols.`,
          layer: 'Liquidity Sentinel',
          type: 'movement',
          from: generateRandomAddr(),
          to: generateRandomAddr(),
          amount: amount
        };
      }

      setAlerts(prev => [newAlert, ...prev.slice(0, 15)]);
    }, 4500);
    return () => clearInterval(interval);
  }, [isMuted]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Apply severity filters
      if (alert.severity === 'institutional' && !filters.institutional) return false;
      if (!filters[alert.severity as keyof AlertFilters]) return false;
      
      // Apply search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return alert.message.toLowerCase().includes(q) || 
               alert.from?.toLowerCase().includes(q) || 
               alert.to?.toLowerCase().includes(q) ||
               alert.type?.toLowerCase().includes(q);
      }

      return true;
    });
  }, [alerts, filters, searchQuery]);

  const summaryPoints = useMemo(() => {
    if (alerts.length < 3) return ["Awaiting neural synchronization...", "Scanning L1-L12 perimeters..."];
    
    const summaries: string[] = [];
    
    const lastInst = alerts.find(a => a.severity === 'institutional');
    if (lastInst) {
      summaries.push(`Institutional: ${lastInst.type?.includes('buy') ? 'Accumulation' : 'Distribution'} detected from tier-1 entity.`);
    }

    const highVolCount = alerts.filter(a => a.severity === 'high').length;
    if (highVolCount > 2) {
      summaries.push(`Alert: High volatility detected. Volumetric stress increasing on CEX corridors.`);
    } else {
      summaries.push(`Stability: Global mesh maintaining nominal hash-rate equilibrium.`);
    }

    let score = 0;
    alerts.forEach(a => {
      if (a.type === 'buy' || a.type === 'institutional_buy') score++;
      if (a.type === 'sell' || a.type === 'institutional_sell') score--;
    });
    
    if (score > 2) summaries.push("Surveillance: Strong accumulation pattern forming at current price strata.");
    else if (score < -2) summaries.push("Surveillance: Distribution bias observed. CEX reserves increasing.");
    else summaries.push("Market: Liquidity neutral. Sideways compression at 12-layer core.");

    return summaries.slice(0, 3);
  }, [alerts]);

  const sentiment = useMemo(() => {
    if (alerts.length === 0) return 50;
    let score = 0;
    alerts.forEach(a => {
      const weight = a.severity === 'institutional' ? 3 : 1;
      if (a.type === 'buy' || a.type === 'institutional_buy') score += weight;
      if (a.type === 'sell' || a.type === 'institutional_sell') score -= weight;
    });
    const normalized = 50 + (score * 2.5);
    return Math.max(5, Math.min(95, normalized));
  }, [alerts]);

  const sentimentLabel = useMemo(() => {
    if (sentiment > 70) return 'Bullish Accumulation';
    if (sentiment > 55) return 'Slightly Bullish';
    if (sentiment < 30) return 'Bearish Distribution';
    if (sentiment < 45) return 'Slightly Bearish';
    return 'Market Neutral';
  }, [sentiment]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl h-[700px] flex flex-col transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
          THREAT INTERCEPTS & SURVEILLANCE
        </h3>
        
        <div className="flex items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative group/search">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${searchQuery ? 'text-emerald-400' : 'text-slate-500'}`} />
            <input 
              type="text" 
              placeholder="SEARCH_FLOW..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/60 border border-slate-700 rounded-xl pl-9 pr-8 py-1.5 text-[10px] font-mono text-emerald-100 placeholder:text-slate-600 outline-none focus:border-emerald-500/40 w-40 md:w-56 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-600 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-lg border transition-all ${isMuted ? 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'}`}
            title={isMuted ? "Enable Audio Notifications" : "Mute Audio Notifications"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>
          <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono rounded">RADAR: ACTIVE</div>
        </div>
      </div>

      {/* Summarized Findings Section */}
      <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-[0.05]">
          <Terminal className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 mb-3">
           <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Neural Intelligence Summary</span>
        </div>
        <ul className="space-y-2">
          {summaryPoints.map((point, idx) => (
            <li key={idx} className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 200}ms` }}>
              <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_5px_#10b981]" />
              <p className="text-[11px] font-bold text-slate-300 leading-tight uppercase italic">{point}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 mb-4">
        {filteredAlerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono italic gap-2 text-center opacity-40">
            {searchQuery ? <Search className="w-8 h-8 mb-2" /> : <Database className="w-8 h-8 mb-2" />}
            {searchQuery ? `No alerts match "${searchQuery}"` : "Scanning for global liquidity movements..."}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3 rounded-lg border flex gap-4 items-start transition-all animate-in slide-in-from-right-4 duration-500 ${
                alert.severity === 'institutional'
                  ? 'bg-emerald-600/15 border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-1 ring-emerald-400/30'
                  : alert.severity === 'high'
                  ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <div className={`mt-1 p-1.5 rounded-full ${
                alert.severity === 'institutional' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                alert.type === 'cex_alert' ? 'bg-amber-500/30 text-amber-400' :
                alert.type === 'sell' ? 'bg-rose-500/30 text-rose-400' :
                alert.type === 'buy' ? 'bg-emerald-500/30 text-emerald-400' :
                'bg-slate-700 text-slate-400'
              }`}>
                {alert.severity === 'institutional' ? <Crown className="w-4 h-4" /> :
                 alert.type === 'cex_alert' ? <Landmark className="w-4 h-4 animate-pulse" /> :
                 alert.type === 'sell' ? <TrendingDown className="w-4 h-4" /> :
                 alert.type === 'buy' ? <TrendingUp className="w-4 h-4" /> :
                 <Waves className="w-4 h-4" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_5px_currentColor] ${
                      alert.severity === 'institutional' ? 'text-emerald-400 bg-emerald-400' :
                      alert.severity === 'high' ? 'text-rose-500 bg-rose-500' :
                      alert.severity === 'medium' ? 'text-amber-500 bg-amber-500' :
                      'text-slate-500 bg-slate-500'
                    }`} />
                    <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                    <span className={`text-[8px] font-black uppercase px-1 rounded border ${
                      alert.severity === 'institutional' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                      alert.severity === 'high' ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' :
                      'border-slate-700 text-slate-500 bg-slate-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${alert.severity === 'institutional' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {alert.severity === 'institutional' ? 'AI Sentinel Intel' : 'Network Flow'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  alert.severity === 'institutional' ? 'text-white font-black italic' :
                  alert.type === 'cex_alert' ? 'text-amber-50 font-black' :
                  alert.severity === 'high' ? 'text-rose-100 font-bold' :
                  alert.type === 'buy' ? 'text-emerald-100 font-bold' :
                  'text-slate-300 font-medium'
                }`}>
                  {alert.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-1 py-4 border-t border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregate Sentiment</span>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-tighter italic ${sentiment > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {sentimentLabel}
          </span>
        </div>
        <div className="relative h-2.5 bg-slate-950 rounded-full border border-slate-800/50 overflow-hidden flex shadow-inner">
           <div className="absolute inset-0 flex">
             <div className="flex-1 bg-gradient-to-r from-rose-600/20 to-transparent" />
             <div className="w-8 bg-slate-800/20" />
             <div className="flex-1 bg-gradient-to-l from-emerald-600/20 to-transparent" />
           </div>
           <div 
             className={`h-full transition-all duration-1000 ease-out flex items-center justify-end rounded-full shadow-[0_0_10px_currentColor] ${
               sentiment > 50 ? 'bg-emerald-500 text-emerald-400' : 'bg-rose-500 text-rose-400'
             }`}
             style={{ width: `${sentiment}%` }}
           >
             <div className="w-1.5 h-full bg-white/40 animate-pulse" />
           </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8 text-slate-600" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">AI_SENTINEL_LOAD</div>
            <div className="text-sm font-mono text-emerald-400">14.2% CPU</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-slate-600" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">UPLINK_DATA</div>
            <div className="text-sm font-mono text-emerald-400">ENCRYPTED</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainMonitor;