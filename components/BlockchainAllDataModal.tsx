import React, { useState, useMemo, useEffect } from 'react';
/* Added Cpu to the lucide-react import list to fix 'Cannot find name Cpu' error */
import { X, Box, Share2, Search, Filter, ArrowRight, Download, ShieldCheck, Zap, Database, Hash, Clock, Check, Copy, ExternalLink, Activity, Terminal, Cpu } from 'lucide-react';
import LiveSurveillanceModal from './LiveSurveillanceModal';

interface Block {
  height: number;
  hash: string;
  txCount: number;
  size: string;
  time: string;
  sentrySignature: string;
  load: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  time: string;
  status: 'VERIFIED' | 'SCRUBBING' | 'LOCKED';
  layer: string;
}

interface BlockchainAllDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'blocks' | 'transactions';
}

const generateHash = () => '0000' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
const generateAddr = () => 'bc1q' + Math.random().toString(16).substring(2, 8) + '...' + Math.random().toString(16).substring(2, 6);

const BlockchainAllDataModal: React.FC<BlockchainAllDataModalProps> = ({ isOpen, onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'transactions'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSurveillanceOpen, setIsSurveillanceOpen] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const allBlocks: Block[] = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      height: 840421 - i,
      hash: generateHash(),
      txCount: Math.floor(Math.random() * 2500) + 1000,
      size: (Math.random() * 1.5 + 0.5).toFixed(2) + ' MB',
      time: i === 0 ? 'Just now' : `${i * 10}m ago`,
      sentrySignature: 'SIG_L12_MAX',
      load: (10 + Math.random() * 20).toFixed(1) + '%'
    }));
  }, []);

  const allTransactions: Transaction[] = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      hash: generateHash().substring(0, 16),
      from: generateAddr(),
      to: generateAddr(),
      amount: (Math.random() * 10).toFixed(4) + ' HLV',
      fee: (0.000124 + Math.random() * 0.0001).toFixed(6) + ' BTC',
      time: i === 0 ? 'Just now' : `${i * 2}m ago`,
      status: Math.random() > 0.15 ? 'VERIFIED' : 'SCRUBBING',
      layer: 'LAYER_12'
    }));
  }, []);

  const handleTabChange = (tab: 'blocks' | 'transactions') => {
    setIsVerifying(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsVerifying(false);
    }, 600);
  };

  const filteredBlocks = allBlocks.filter(b => b.height.toString().includes(searchQuery) || b.hash.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTxs = allTransactions.filter(tx => tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) || tx.from.toLowerCase().includes(searchQuery.toLowerCase()));

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-emerald-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500" />
        
        <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <Database className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Global <span className="text-emerald-500">Ledger Audit</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em]">Exascale Data Feed v4.0</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">LAYER_12_AUTH</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="p-1 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-1">
                <button 
                  onClick={() => handleTabChange('blocks')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blocks' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Blocks
                </button>
                <button 
                  onClick={() => handleTabChange('transactions')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transactions' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  Transactions
                </button>
             </div>
             <button onClick={onClose} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-700 active:scale-95">
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>

        <div className="px-8 py-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 z-10">
           <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400" />
              <input 
                type="text" 
                placeholder={activeTab === 'blocks' ? "Search Block Height or Hash..." : "Search TX Hash or Address..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-xs font-mono text-white placeholder:text-slate-700 outline-none focus:border-emerald-500/30 transition-all"
              />
           </div>
           <div className="flex gap-4 items-center">
              <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                 <Download className="w-4 h-4" /> Export CSV
              </button>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-slate-500" />
                 <span className="text-[10px] font-black text-slate-500 uppercase">Filters</span>
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
           {isVerifying ? (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin mb-4" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] animate-pulse">Verifying_Protocol_Integrity...</span>
             </div>
           ) : (
             <div className="h-full overflow-y-auto custom-scrollbar p-8">
               {activeTab === 'blocks' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                   {filteredBlocks.map((block) => (
                     <div key={block.height} className="p-6 bg-slate-950/60 border border-slate-800 rounded-[2rem] hover:border-indigo-500/30 transition-all group/item">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-slate-950 transition-all">
                                 <Box className="w-6 h-6" />
                              </div>
                              <div>
                                 <div className="text-xl font-black font-mono text-white">#{block.height}</div>
                                 <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{block.time}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className={`w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse ml-auto`} />
                              <div className="text-[8px] font-black text-slate-700 uppercase mt-2">Sig_Verified</div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <span className="text-[8px] font-black text-slate-700 uppercase block mb-1">TX Count</span>
                                 <span className="text-xs font-mono font-bold text-slate-300">{block.txCount}</span>
                              </div>
                              <div>
                                 <span className="text-[8px] font-black text-slate-700 uppercase block mb-1">Block Size</span>
                                 <span className="text-xs font-mono font-bold text-slate-300">{block.size}</span>
                              </div>
                           </div>
                           <div className="pt-4 border-t border-white/5">
                              <span className="text-[8px] font-black text-slate-700 uppercase block mb-1">Block Hash</span>
                              <div className="flex items-center justify-between gap-2">
                                 <span className="text-[10px] font-mono text-indigo-400 truncate">{block.hash}</span>
                                 <button onClick={() => copyToClipboard(block.hash, `b-${block.height}`)} className="text-slate-600 hover:text-white transition-colors">
                                    {copiedId === `b-${block.height}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                 </button>
                              </div>
                           </div>
                           <div className="flex justify-between items-center bg-slate-900 rounded-xl p-3 border border-white/5">
                              <div className="flex items-center gap-2">
                                 <Cpu className="w-3 h-3 text-cyan-400" />
                                 <span className="text-[8px] font-black text-slate-500 uppercase">Compute Load</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-cyan-400">{block.load}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="bg-slate-950/60 border border-slate-800 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <table className="w-full text-left font-mono border-collapse">
                       <thead className="bg-slate-900 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 sticky top-0 z-10">
                          <tr>
                             <th className="px-8 py-5">Hash</th>
                             <th className="px-8 py-5">From_Sender</th>
                             <th className="px-8 py-5">To_Receiver</th>
                             <th className="px-8 py-5">Value</th>
                             <th className="px-8 py-5">Fee</th>
                             <th className="px-8 py-5 text-right">Verification</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/[0.03]">
                          {filteredTxs.map((tx, idx) => (
                            <tr key={idx} className="group/row hover:bg-emerald-500/[0.02] transition-colors">
                               <td className="px-8 py-5">
                                  <div className="flex items-center gap-3">
                                     <span className="text-emerald-500 font-bold tracking-tight">{tx.hash}</span>
                                     <button onClick={() => copyToClipboard(tx.hash, `tx-all-${idx}`)} className="opacity-0 group-hover/row:opacity-100 transition-opacity">
                                        {copiedId === `tx-all-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-600" />}
                                     </button>
                                  </div>
                               </td>
                               <td className="px-8 py-5 text-slate-400 text-xs">{tx.from}</td>
                               <td className="px-8 py-5 text-slate-400 text-xs">{tx.to}</td>
                               <td className="px-8 py-5 font-black text-white text-xs">{tx.amount}</td>
                               <td className="px-8 py-5 text-slate-500 text-[10px]">{tx.fee}</td>
                               <td className="px-8 py-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                     <span className={`px-2 py-0.5 rounded-[4px] border text-[8px] font-black ${
                                       tx.status === 'VERIFIED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                       'bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse'
                                     }`}>
                                       {tx.status}
                                     </span>
                                     <ShieldCheck className={`w-3.5 h-3.5 ${tx.status === 'VERIFIED' ? 'text-emerald-500' : 'text-slate-700'}`} />
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               )}
             </div>
           )}
        </div>

        <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-emerald-500" />
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Handshake Status</span>
                       <span className="text-xs font-mono text-emerald-400 font-black">ENCRYPTED_AUTH_OK</span>
                    </div>
                 </div>
                 <div className="h-8 w-px bg-slate-800 hidden sm:block" />
                 <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mesh Latency</span>
                       <span className="text-xs font-mono text-indigo-400 font-black">12ms_AVERAGE</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    Showing {activeTab === 'blocks' ? filteredBlocks.length : filteredTxs.length} entries
                 </div>
                 <button 
                  onClick={() => setIsSurveillanceOpen(true)}
                  className="flex items-center gap-2 px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 group"
                 >
                    Live Surveillance
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <LiveSurveillanceModal isOpen={isSurveillanceOpen} onClose={() => setIsSurveillanceOpen(false)} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2a2a2a; }
      `}</style>
    </div>
  );
};

export default BlockchainAllDataModal;