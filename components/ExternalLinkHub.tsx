
import React from 'react';
import { ExternalLink, Link, Globe, FileText, BarChart3, ShieldCheck, Zap } from 'lucide-react';

interface LinkResource {
  title: string;
  category: string;
  url: string;
  icon: React.ElementType;
  status: 'Verified' | 'Secure' | 'Direct';
}

const RESOURCES: LinkResource[] = [
  { 
    title: 'Blockstream Explorer', 
    category: 'Network Infrastructure', 
    url: 'https://blockstream.info/', 
    icon: Globe, 
    status: 'Verified' 
  },
  { 
    title: 'Mempool.space', 
    category: 'Transaction Analytics', 
    url: 'https://mempool.space/', 
    icon: BarChart3, 
    status: 'Secure' 
  },
  { 
    title: 'BlackRock ETF Tracker', 
    category: 'Institutional Intelligence', 
    url: 'https://www.blackrock.com/us/individual/products/333011/ishares-bitcoin-trust', 
    icon: FileText, 
    status: 'Direct' 
  },
  { 
    title: 'CoinGecko Index', 
    category: 'Global Market Data', 
    url: 'https://www.coingecko.com/en/coins/bitcoin', 
    icon: BarChart3, 
    status: 'Verified' 
  }
];

const ExternalLinkHub: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Link className="w-16 h-16 text-indigo-500" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Verified Sentinel Portal
          </h3>
          <p className="text-[10px] text-slate-600 font-mono mt-0.5 uppercase tracking-tighter">Authorized External Data Gateways</p>
        </div>
        <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-indigo-400 font-mono rounded flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          BRIDGE_ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RESOURCES.map((res, i) => (
          <a
            key={i}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all group/link relative overflow-hidden"
          >
            {/* Animated Hover Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-transparent -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover/link:text-indigo-400 group-hover/link:border-indigo-500/30 transition-colors">
                <res.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover/link:text-white transition-colors">{res.title}</div>
                <div className="text-[9px] text-slate-600 uppercase font-mono mt-0.5 tracking-wider">{res.category}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                res.status === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                res.status === 'Secure' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
                'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
              }`}>
                {res.status}
              </span>
              <ExternalLink className="w-3 h-3 text-slate-700 group-hover/link:text-white transition-all transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-center">
        <button className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
          Request Node Integration
          <Link className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ExternalLinkHub;
