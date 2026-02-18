import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Box, Share2, Activity, Zap, ShieldCheck, Globe, 
  Terminal, Database, Clock, Hash, ArrowRight, ArrowUpRight, 
  Cpu, Layers, Filter, Copy, Check, ExternalLink, RefreshCw, Eye
} from 'lucide-react';
import BlockchainAllDataModal from './BlockchainAllDataModal';
import LiveSurveillanceModal from './LiveSurveillanceModal';
import ProtocolDeepDiveModal from './ProtocolDeepDiveModal';

interface Block {
  height: number;
  hash: string;
  txCount: number;
  size: string;
  time: string;
  sentrySignature: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  time: string;
  status: 'VERIFIED' | 'SCRUBBING' | 'LOCKED';
}

const HlvBlockchainExplorer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isAllDataModalOpen, setIsAllDataModalOpen] = useState(false);
  const [isSurveillanceOpen, setIsSurveillanceOpen] = useState(false);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'blocks' | 'transactions'>('blocks');

  // Stats Telemetry
  const stats = useMemo(() => ({
    hashrate: '842.4 PH/s',
    blockTime: '8.4s',
    difficulty: '83.9T',
    unconfirmed: 1420,
    activeNodes: '10M+'
  }), []);

  const generateHash = () => '0000' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  const generateAddr = () => 'bc1q' + Math.random().toString(16).substring(2, 8) + '...' + Math.random().toString(16).substring(2, 6);

  useEffect(() => {
    // Initial Seed
    const initialBlocks = Array.from({ length: 6 }).map((_, i) => ({
      height: 840421 - i,
      hash: generateHash(),
      txCount: Math.floor(Math.random() * 2500) + 1000,
      size: (Math.random() * 1.5 + 0.5).toFixed(2) + ' MB',
      time: `${i * 10}m ago`,
      sentrySignature: 'SIG_L12_MAX'
    }));

    const initialTxs = Array.from({ length: 10 }).map((_, i) => ({
      hash: generateHash().substring(0, 16),
      from: generateAddr(),
      to: generateAddr(),
      amount: (Math.random() * 10).toFixed(4) + ' HLV',
      fee: (0.000124 + Math.random() * 0.0001).toFixed(6) + ' BTC',
      time: `${i * 2}m ago`,
      status: 'VERIFIED' as const
    }));

    setBlocks(initialBlocks);
    setTransactions(initialTxs);

    const interval = setInterval(() => {
      setIsRefreshing(true);
      
      if (Math.random() > 0.7) {
        const newBlock = {
          height: blocks.length > 0 ? blocks[0].height + 1 : 840422,
          hash: generateHash(),
          txCount: Math.floor(Math.random() * 2500) + 1000,
          size: (Math.random() * 1.5 + 0.5).toFixed(2) + ' MB',
          time: 'Just now',
          sentrySignature: 'SIG_L12_MAX'
        };
        setBlocks(prev => [newBlock, ...prev.slice(0, 5)]);
      }

      const newTx = {
        hash: generateHash().substring(0, 16),
        from: generateAddr(),
        to: generateAddr(),
        amount: (Math.random() * 10).toFixed(4) + ' HLV',
        fee: (0.000124 + Math.random() * 0.0001).toFixed(6) + ' BTC',
        time: 'Just now',
        status: Math.random() > 0.3 ? 'VERIFIED' : 'SCRUBBING' as const
      };
      setTransactions(prev => [newTx, ...prev.slice(0, 9)]);

      setTimeout(() => setIsRefreshing(false), 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [blocks.length]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openViewAll = (tab: 'blocks' | 'transactions') => {
    setInitialModalTab(tab);
    setIsAllDataModalOpen(true);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
        <Database className="w-80 h-80 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <Globe className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Blockchain <span className="text-emerald-500">Explorer</span>
            </h3>
          </div>
          <button 
            onClick={() => setIsSurveillanceOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-slate-950 transition-all active:scale-95"
          >
            <Eye className="w-4 h-4" />
            Live Surveillance
          </button>
        </div>

        {/* Real-time Stats HUD */}
        <div className="flex items-center gap-6 bg-slate-950/50 p-5 rounded-[2rem] border border-white/5 shadow-inner">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mesh Hashrate</span>
              <span className="text-lg font-black font-mono text-emerald-400">{stats.hashrate}</span>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Mempool Count</span>
              <span className="text-lg font-black font-mono text-amber-500">{stats.unconfirmed}</span>
           </div>
           <div className="h-10 w-px bg-slate-800" />
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Node Saturation</span>
              <span className="text-lg font-black font-mono text-indigo-400">{stats.activeNodes}</span>
           </div>
        </div>
      </div>

      {/* Omni-Search Interface */}
      <div className="relative mb-10 group/search z-10">
        <div className="absolute inset-0 bg-emerald-500/5 blur-2xl group-focus-within/search:bg-emerald-500/10 transition-all pointer-events-none" />
        <div className="relative flex items-center">
          <Search className="absolute left-6 w-5 h-5 text-slate-500 group-focus-within/search:text-emerald-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search blocks, addresses, or transactions across the 12-layer mesh..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/50 rounded-[2rem] pl-16 pr-8 py-5 text-sm font-mono text-white placeholder:text-slate-700 outline-none focus:border-emerald-500/40 transition-all shadow-inner"
          />
          <div className="absolute right-6 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-emerald-500 animate-ping' : 'bg-slate-700'}`} />
             <span className="text-[8px] font-black text-slate-600 uppercase font-mono">Syncing...</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        
        {/* Latest Blocks Stream */}
        <div className="xl:col-span-5 space-y-4">
           <div className="flex items-center justify-between px-4 mb-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Box className="w-4 h-4 text-indigo-400" />
                 Latest Mesh Blocks
              </h4>
              <button 
                onClick={() => openViewAll('blocks')}
                className="text-[9px] font-black text-indigo-400 hover:text-white uppercase transition-colors active:scale-95"
              >
                View All
              </button>
           </div>
           <div className="space-y-3">
              {blocks.map((block) => (
                <div key={block.height} className="p-5 bg-slate-950/60 border border-slate-800 rounded-3xl group/block hover:border-indigo-500/30 transition-all animate-in slide-in-from-left-4">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover/block:bg-indigo-500 group-hover/block:text-slate-950 transition-all">
                            <Box className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-lg font-black font-mono text-white">#{block.height}</div>
                            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{block.time}</div>
                         </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[9px] font-black text-slate-500 uppercase mb-1">Fee Settlement</div>
                         <div className="text-sm font-black font-mono text-emerald-400">0.0245 BTC</div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-slate-700 uppercase">Block Hash</span>
                         <span className="text-[9px] font-mono text-slate-400 truncate w-32">{block.hash}</span>
                      </div>
                      <div className="text-right flex flex-col">
                         <span className="text-[8px] font-black text-slate-700 uppercase">Sentry Sig</span>
                         <span className="text-[9px] font-mono text-indigo-400 font-bold">{block.sentrySignature}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Latest Transactions Ledger */}
        <div className="xl:col-span-7 space-y-4">
           <div className="flex items-center justify-between px-4 mb-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Share2 className="w-4 h-4 text-emerald-400" />
                 Transmission Ledger
              </h4>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500"><Filter className="w-3.5 h-3.5" /></button>
                <button 
                  onClick={() => openViewAll('transactions')}
                  className="text-[9px] font-black text-emerald-400 hover:text-white uppercase transition-colors active:scale-95"
                >
                  Audit Ledger
                </button>
              </div>
           </div>
           <div className="bg-slate-950/40 border border-slate-800 rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-left font-mono">
                    <thead className="bg-slate-900/50 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                       <tr>
                          <th className="px-6 py-4">Hash</th>
                          <th className="px-6 py-4">From / To</th>
                          <th className="px-6 py-4">Value</th>
                          <th className="px-6 py-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] text-[10px]">
                       {transactions.map((tx, idx) => (
                         <tr key={idx} className="group/row hover:bg-white/[0.02] transition-colors cursor-crosshair">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <span className="text-emerald-500 font-bold truncate w-20">{tx.hash}</span>
                                  <button onClick={() => copyToClipboard(tx.hash, `tx-${idx}`)} className="opacity-0 group-hover/row:opacity-100 transition-opacity">
                                     {copiedId === `tx-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-600" />}
                                  </button>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2 text-slate-400">
                                  <span>{tx.from}</span>
                                  <ArrowRight className="w-3 h-3 text-slate-700" />
                                  <span>{tx.to}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-col">
                                  <span className="text-white font-black">{tx.amount}</span>
                                  <span className="text-[8px] text-slate-600">Fee: {tx.fee}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <span className={`px-2 py-0.5 rounded border text-[8px] font-black ${
                                 tx.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                 'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                               }`}>
                                 {tx.status}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <div className="p-6 bg-slate-900/30 border-t border-white/5 flex justify-center">
                 <button 
                  onClick={() => setIsDeepDiveOpen(true)}
                  className="text-[10px] text-slate-500 hover:text-emerald-400 font-black uppercase tracking-widest transition-all flex items-center gap-2 group/btn"
                 >
                    Protocol Deep Dive Explorer
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <BlockchainAllDataModal 
        isOpen={isAllDataModalOpen} 
        onClose={() => setIsAllDataModalOpen(false)} 
        initialTab={initialModalTab}
      />

      <LiveSurveillanceModal 
        isOpen={isSurveillanceOpen} 
        onClose={() => setIsSurveillanceOpen(false)} 
      />

      <ProtocolDeepDiveModal
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
      />

      {/* Mesh Integrity Footer Bar */}
      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between z-10 relative">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Finality</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter uppercase">Layer_12_Locked</span>
               </div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-3">
               <Cpu className="w-5 h-5 text-indigo-400" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Load</span>
                  <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter uppercase italic">14.2% Nominal</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3 opacity-40">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Live Sentry Handshake Active</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
         </div>
      </div>
    </div>
  );
};

export default HlvBlockchainExplorer;