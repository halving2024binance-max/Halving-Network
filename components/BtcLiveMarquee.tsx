
import React, { useState, useEffect, useRef } from 'react';
import { Activity, Zap, ArrowUpRight, ArrowDownLeft, Cpu, Globe } from 'lucide-react';

const BtcLiveMarquee: React.FC = () => {
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [lastDirection, setLastDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const priceRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Binance Futures WebSocket for real-time ticker data
    const connectWS = () => {
      const ws = new WebSocket('wss://fstream.binance.com/ws/btcusdt@ticker');
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newPrice = parseFloat(data.c); // Last price
        const newChange = parseFloat(data.P); // Price change percent

        if (priceRef.current !== 0) {
          if (newPrice > priceRef.current) setLastDirection('up');
          else if (newPrice < priceRef.current) setLastDirection('down');
        }

        priceRef.current = newPrice;
        setPrice(newPrice);
        setChange(newChange);
      };

      ws.onclose = () => {
        console.log('Binance WS closed, reconnecting...');
        setTimeout(connectWS, 3000);
      };

      ws.onerror = (err) => {
        console.error('Binance WS Error:', err);
        ws.close();
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full bg-slate-950 border-y border-slate-800/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between font-mono">
        {/* Left Stats: Global Sync */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-cyan-500 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">Global Consensus</span>
            <span className="text-[10px] text-cyan-400 font-bold">SYNC_ACTIVE</span>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3 text-indigo-400" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">Threat Level</span>
            <span className="text-[10px] text-emerald-400 font-bold">LOW_MINIMAL</span>
          </div>
        </div>

        {/* Center: Live BTC Price */}
        <div className="flex items-center gap-4 group cursor-crosshair">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md shadow-inner">
            <span className="text-[10px] text-amber-500 font-black">BTCUSDT_PERP</span>
            <div className={`text-sm font-black transition-colors duration-200 ${
              lastDirection === 'up' ? 'text-emerald-400' : lastDirection === 'down' ? 'text-rose-400' : 'text-white'
            }`}>
              {price === 0 ? 'LOADING...' : `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            {lastDirection === 'up' ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownLeft className="w-3 h-3 text-rose-500" />}
          </div>
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="text-[9px] text-slate-600 font-bold uppercase">24H_CHG</div>
            <span className={`text-[10px] font-black ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right Stats: Neural Activity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-amber-500 animate-pulse" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">Volatility</span>
            <span className="text-[10px] text-amber-400 font-bold">BINANCE_FUTURES</span>
          </div>
          <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[8px] text-indigo-400 font-black uppercase tracking-tighter animate-pulse">
            SENTINEL_LIVE
          </div>
        </div>
      </div>
      
      {/* Decorative scanning line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -translate-x-full animate-[marquee_3s_linear_infinite]" />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default BtcLiveMarquee;
