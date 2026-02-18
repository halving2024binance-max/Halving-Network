import React, { useState, useEffect, useMemo } from 'react';
import { Share2, ArrowRight, Hash, Filter, User, Search, Coins, X, ExternalLink, Copy, Clock, ShieldCheck, Zap, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import NetworkSettlementModal from './NetworkSettlementModal';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  hash: string;
  sender: string;
  receiver: string;
  amount: string;
  fee: string;
  timestamp: string;
  verified: boolean;
}

interface TransactionFeedProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const generateRandomHash = () => Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
const generateRandomAddr = () => `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;

const TransactionFeed: React.FC<TransactionFeedProps> = ({ swarmMetrics }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Filter States
  const [senderFilter, setSenderFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');

  // Calculate dynamic Protocol (Neural) fee based on Swarm Metrics
  const protocolFee = useMemo(() => {
    const baseFee = 0.000010;
    const agentScaling = (swarmMetrics.activeAgents / 1000000) * 0.000005;
    const loadOverhead = (swarmMetrics.processingLoad / 100) * 0.000015;
    return parseFloat((baseFee + agentScaling + loadOverhead).toFixed(8));
  }, [swarmMetrics]);

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 8 }).map((_, i) => ({
      id: Math.random().toString(),
      hash: generateRandomHash(),
      sender: generateRandomAddr(),
      receiver: generateRandomAddr(),
      amount: (Math.random() * 5).toFixed(4),
      fee: "0.00000012", // Base Network Fee
      timestamp: new Date(Date.now() - i * 15000).toLocaleTimeString([], { hour12: false }),
      verified: true,
    }));
    setTransactions(initialData);

    const interval = setInterval(() => {
      const newTx: Transaction = {
        id: Math.random().toString(),
        hash: generateRandomHash(),
        sender: generateRandomAddr(),
        receiver: generateRandomAddr(),
        amount: (Math.random() * 5).toFixed(4),
        fee: (0.00000010 + Math.random() * 0.00000005).toFixed(8),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        verified: false, // Starts unverified for visual effect
      };

      setTransactions(prev => [newTx, ...prev.slice(0, 14)]);

      // Simulate the 12-layer verification delay
      setTimeout(() => {
        setTransactions(prev => prev.map(t => t.id === newTx.id ? { ...t, verified: true } : t));
      }, 2000);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSender = tx.sender.toLowerCase().includes(senderFilter.toLowerCase());
      const matchesReceiver = tx.receiver.toLowerCase().includes(receiverFilter.toLowerCase());
      const matchesAmount = minAmount === '' || parseFloat(tx.amount) >= parseFloat(minAmount);
      return matchesSender && matchesReceiver && matchesAmount;
    });
  }, [transactions, senderFilter, receiverFilter, minAmount]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatAddr = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group flex flex-col h-full max-h-[700px]">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" />
            Halving Protocol Transmission Feed
          </h4>
          <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-tighter italic">Validating each block for network settlement fees</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-1.5 rounded border transition-all ${isFilterOpen ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'}`}
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-[10px] font-mono text-indigo-400/80 uppercase">Processing</span>
          </div>
        </div>
      </div>

      {/* Filter Suite */}
      <div className={`overflow-hidden transition-all duration-300 ${isFilterOpen ? 'max-h-48 mb-6' : 'max-h-0'}`}>
        <div className="grid grid-cols-1 gap-3 p-3 bg-slate-950/80 border border-slate-800/50 rounded-xl">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2 py-1.5">
            <User className="w-3 h-3 text-slate-600" />
            <input 
              type="text" 
              placeholder="Filter Sender..." 
              value={senderFilter}
              onChange={(e) => setSenderFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-mono text-cyan-100 placeholder:text-slate-700 w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2 py-1.5">
            <Search className="w-3 h-3 text-slate-600" />
            <input 
              type="text" 
              placeholder="Filter Receiver..." 
              value={receiverFilter}
              onChange={(e) => setReceiverFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-mono text-cyan-100 placeholder:text-slate-700 w-full"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded px-2 py-1.5">
            <Coins className="w-3 h-3 text-slate-600" />
            <input 
              type="number" 
              placeholder="Min HLV Amount..." 
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] font-mono text-cyan-100 placeholder:text-slate-700 w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-10 opacity-40">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">No matching segments found</div>
            <div className="text-[8px] font-mono text-slate-600">Awaiting compatible transmission...</div>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => setSelectedTx(tx)}
              className="p-3.5 bg-slate-950/60 border border-slate-800/50 rounded-xl hover:bg-slate-800/40 hover:border-indigo-500/30 transition-all cursor-pointer group/tx animate-tx-in relative overflow-hidden"
            >
              {/* Verification Progress Bar for unverified ones */}
              {!tx.verified && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 animate-[verification_2s_ease-out_forwards]" />
              )}

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 group-hover/tx:text-cyan-300">
                  <Hash className="w-3 h-3 opacity-50" />
                  <span>TX-{tx.hash.substring(0, 8)}</span>
                </div>
                <div className="flex items-center gap-2">
                   <AnimatePresence mode="wait">
                     <motion.span 
                       key={tx.verified ? 'verified' : 'unverified'}
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       exit={{ scale: 0.8, opacity: 0 }}
                       className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border transition-colors flex items-center gap-1 ${tx.verified ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'}`}
                     >
                       {tx.verified && <CheckCircle className="w-2.5 h-2.5" />}
                       {tx.verified ? 'Protocol_Safe' : 'Verifying_L12'}
                     </motion.span>
                   </AnimatePresence>
                   <span className="text-[9px] text-slate-600 font-mono">{tx.timestamp}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <div className="text-[11px] font-mono text-slate-400 truncate" title={tx.sender}>{formatAddr(tx.sender)}</div>
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                  <div className="text-[11px] font-mono text-slate-400 truncate" title={tx.receiver}>{formatAddr(tx.receiver)}</div>
                </div>
                
                <div className="flex items-center gap-1 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 group-hover/tx:bg-indigo-500/20">
                  <span className="text-sm font-black text-indigo-300">{tx.amount}</span>
                  <span className="text-[9px] text-indigo-500/80 font-bold">HLV</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/50 pt-2 mt-2">
                 <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                       <Zap className={`w-2.5 h-2.5 ${tx.verified ? 'text-amber-500' : 'text-slate-600'}`} />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Base Fee:</span>
                       <span className={`text-[9px] font-mono font-bold ${tx.verified ? 'text-slate-400' : 'text-slate-600'}`}>{tx.fee} BTC</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Cpu className={`w-2.5 h-2.5 ${tx.verified ? 'text-indigo-400' : 'text-slate-600'}`} />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Fee:</span>
                       <span className={`text-[9px] font-mono font-bold ${tx.verified ? 'text-indigo-300' : 'text-slate-600'}`}>{protocolFee.toFixed(8)} BTC</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 opacity-60">
                    <ShieldCheck className={`w-3 h-3 ${tx.verified ? 'text-emerald-500' : 'text-slate-700'}`} />
                    <span className="text-[8px] font-bold text-slate-600 uppercase">12-Layer Lock</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 flex justify-center pt-2 border-t border-slate-800/50">
        <button 
          onClick={() => setIsSettlementModalOpen(true)}
          className="text-[10px] text-slate-500 hover:text-indigo-400 uppercase font-bold tracking-widest transition-colors flex items-center gap-1 group/btn"
        >
          View Network Settlement Details
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Individual Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedTx(null)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
            
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">Verified Protocol Transmission</h2>
                  <p className="text-[10px] text-slate-500 font-mono italic">Halving Network Layer-12 Sentry Verified</p>
                </div>
              </div>
              <button onClick={() => setSelectedTx(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                      <Zap className="w-3 h-3 animate-pulse" />
                      Base Network Fee
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black font-mono text-white tracking-tighter">{selectedTx.fee}</span>
                      <span className="text-[10px] font-black text-amber-500 font-mono">BTC</span>
                   </div>
                </div>

                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                      <Cpu className="w-3 h-3 animate-pulse" />
                      Protocol Surcharge
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black font-mono text-white tracking-tighter">{protocolFee.toFixed(8)}</span>
                      <span className="text-[10px] font-black text-indigo-400 font-mono">BTC</span>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Hash className="w-3 h-3" />
                  Transmission Hash
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between group">
                  <span className="text-xs font-mono text-cyan-400 break-all">{selectedTx.hash}</span>
                  <button onClick={() => copyToClipboard(selectedTx.hash, 'hash')} className="p-2 text-slate-600 hover:text-cyan-400">
                    {copiedField === 'hash' ? <div className="text-[8px] text-emerald-500 font-bold">COPIED</div> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    Timestamp
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm font-mono text-slate-300">
                    {selectedTx.timestamp} (UTC)
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Coins className="w-3 h-3" />
                    Value
                  </div>
                  <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/30 text-sm font-bold text-indigo-300">
                    {selectedTx.amount} HLV
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <User className="w-3 h-3" />
                    Sender Address
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 truncate flex-1">{selectedTx.sender}</span>
                    <button onClick={() => copyToClipboard(selectedTx.sender, 'sender')} className="ml-3 p-1.5 text-slate-600 hover:text-slate-300">
                      {copiedField === 'sender' ? <div className="text-[8px] text-emerald-500 font-bold">COPIED</div> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center -my-2 opacity-30">
                  <ArrowRight className="w-5 h-5 text-indigo-500 rotate-90" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Search className="w-3 h-3" />
                    Receiver Address
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 truncate flex-1">{selectedTx.receiver}</span>
                    <button onClick={() => copyToClipboard(selectedTx.receiver, 'receiver')} className="ml-3 p-1.5 text-slate-600 hover:text-slate-300">
                      {copiedField === 'receiver' ? <div className="text-[8px] text-emerald-500 font-bold">COPIED</div> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
              >
                Close
              </button>
              <a 
                href={`https://blockstream.info/tx/${selectedTx.hash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                Explore Block
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Network Settlement Modal */}
      <NetworkSettlementModal isOpen={isSettlementModalOpen} onClose={() => setIsSettlementModalOpen(false)} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d0d0d;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f1f1f;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a2a2a;
        }
        @keyframes tx-in {
          from { 
            opacity: 0; 
            transform: translateY(-12px) scale(0.98);
            filter: blur(4px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes verification {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-tx-in {
          animation: tx-in 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default TransactionFeed;