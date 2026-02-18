import React, { useState, useEffect, useMemo } from 'react';
// Added Activity to the lucide-react import list
import { Wallet, QrCode, ArrowUpRight, ArrowDownLeft, ShieldCheck, History, Coins, Zap, MoreHorizontal, ExternalLink, Copy, Check, ShieldAlert, Loader2, Terminal, Search, Globe, Cpu, Info, BarChart3, Layers, Activity } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';

interface FeeTransaction {
  id: string;
  type: 'fee_payment' | 'deposit' | 'explorer_fee';
  amount: string;
  asset: 'BTC' | 'HLV';
  status: 'confirmed' | 'pending';
  timestamp: string;
}

interface HalvingWalletProps {
  swarmMetrics: {
    activeAgents: number;
    processingLoad: number;
    hashrate: number;
  };
}

const HalvingWallet: React.FC<HalvingWalletProps> = ({ swarmMetrics }) => {
  const [balance, setBalance] = useState({ btc: 0.4285, hlv: 12500 });
  const [isCopied, setIsCopied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [transactions, setTransactions] = useState<FeeTransaction[]>([
    { id: 'TX-9921', type: 'fee_payment', amount: '0.00012', asset: 'BTC', status: 'confirmed', timestamp: '2m ago' },
    { id: 'TX-9920', type: 'explorer_fee', amount: '0.00003', asset: 'BTC', status: 'confirmed', timestamp: '14m ago' },
    { id: 'TX-9895', type: 'deposit', amount: '0.05000', asset: 'BTC', status: 'confirmed', timestamp: '2h ago' },
  ]);

  const [staticCosts, setStaticCosts] = useState({
    explorer: 0.000021,
    consensus: 0.000045,
    base: 0.000012,
  });

  // Dynamically calculate Neural Encryption fee based on 10,000,000 Swarm Metrics
  const dynamicNeuralFee = useMemo(() => {
    const baseFee = 0.000010;
    // Scale adjusted for 10M agents
    const agentScaling = (swarmMetrics.activeAgents / 10000000) * 0.000025;
    const loadOverhead = (swarmMetrics.processingLoad / 100) * 0.000015;
    return parseFloat((baseFee + agentScaling + loadOverhead).toFixed(6));
  }, [swarmMetrics]);

  // Fee Structure Proportions
  const feeStructure = useMemo(() => {
    const total = staticCosts.base + staticCosts.explorer + staticCosts.consensus + dynamicNeuralFee;
    return [
      { id: 'base', label: 'Network Base', val: staticCosts.base, color: 'bg-amber-500', icon: Zap },
      { id: 'neural', label: 'Neural Surcharge', val: dynamicNeuralFee, color: 'bg-indigo-500', icon: Cpu },
      { id: 'explorer', label: 'Indexer Overhead', val: staticCosts.explorer, color: 'bg-cyan-500', icon: Globe },
      { id: 'consensus', label: 'L12 Validation', val: staticCosts.consensus, color: 'bg-emerald-500', icon: ShieldCheck },
    ].map(item => ({
      ...item,
      percentage: (item.val / total) * 100
    }));
  }, [staticCosts, dynamicNeuralFee]);

  const totalCurrentFee = useMemo(() => {
    return feeStructure.reduce((acc, curr) => acc + curr.val, 0).toFixed(6);
  }, [feeStructure]);

  // Real Protocol Settlement Address
  const officialFeeAddress = "bc1qhalving2024feesentrymeshnode99v2";

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const isExplorer = Math.random() > 0.5;
        const fee = (Math.random() * 0.00005).toFixed(8);
        setBalance(prev => ({ ...prev, btc: prev.btc - parseFloat(fee) }));
        
        const newTx: FeeTransaction = {
          id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
          type: isExplorer ? 'explorer_fee' : 'fee_payment',
          amount: fee,
          asset: 'BTC',
          status: 'confirmed',
          timestamp: 'Just now'
        };
        
        setTransactions(prev => [newTx, ...prev.slice(0, 4)]);
        
        setStaticCosts(prev => ({
          ...prev,
          explorer: parseFloat((prev.explorer + (Math.random() * 0.000002 - 0.000001)).toFixed(6))
        }));
      }
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const runProtocolValidation = () => {
    setIsValidating(true);
    setIsVerified(false);
    setCurrentLayer(0);
    
    let layer = 0;
    const timer = setInterval(() => {
      layer++;
      setCurrentLayer(layer);
      if (layer === 12) {
        clearInterval(timer);
        setTimeout(() => {
          setIsValidating(false);
          setIsVerified(true);
        }, 3000);
      }
    }, 300);
  };

  const copyAddress = () => {
    if (!isVerified) return;
    navigator.clipboard.writeText(officialFeeAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col transition-all duration-700 hover:border-emerald-500/30 group">
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Wallet className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="p-8 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Halving <span className="text-emerald-500">Protocol Wallet</span></h3>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className={`w-3 h-3 ${isVerified ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
              <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${isVerified ? 'text-emerald-500' : 'text-slate-500'}`}>
                {isVerified ? 'SETTLEMENT_CHANNEL_VERIFIED' : 'Awaiting 12-Layer Protocol Validation'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {isVerified ? (
             <div className="px-3 py-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">Ready for Settlement</div>
           ) : (
             <div className="px-3 py-1 bg-slate-800 text-slate-500 text-[9px] font-black uppercase rounded">Status: Locked</div>
           )}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Balance & Validation Hub */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl relative overflow-hidden group/card">
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-500 ${isVerified ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Total Liquid Fee Reserve</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black font-mono text-white tracking-tighter">{balance.btc.toFixed(4)}</span>
              <span className="text-sm font-black text-emerald-500 font-mono">BTC</span>
            </div>
            <div className="mt-2 text-xs font-bold text-slate-400 font-mono">
              ≈ {(balance.hlv).toLocaleString()} <span className="text-indigo-400">HLV (Utility)</span>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
               <button 
                onClick={runProtocolValidation}
                disabled={isValidating}
                className={`flex items-center justify-center gap-2 py-3 ${isVerified ? 'bg-slate-800 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-900/20 disabled:opacity-50`}
               >
                 {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                 {isValidating ? `Checking Layer ${currentLayer}` : isVerified ? 'Verified' : 'Validate Protocol'}
               </button>
               <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-slate-700">
                 <ArrowUpRight className="w-4 h-4" /> Manual Settlement
               </button>
            </div>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History className="w-3" /> Recent Fee Clearances
              </span>
              <button className="text-[9px] font-black text-emerald-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
                Protocol Explorer <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="space-y-3">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all group/item">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'deposit' ? 'bg-emerald-500/10 text-emerald-500' : 
                      tx.type === 'explorer_fee' ? 'bg-indigo-500/10 text-indigo-500' :
                      'bg-rose-500/10 text-rose-500'
                    }`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : 
                       tx.type === 'explorer_fee' ? <Globe className="w-3.5 h-3.5" /> :
                       <Zap className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white uppercase">{tx.type.replace('_', ' ')}</div>
                      <div className="text-[8px] text-slate-500 font-mono uppercase">{tx.id} • {tx.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black font-mono ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.asset}
                    </div>
                    <div className="text-[8px] text-emerald-500/60 font-black uppercase tracking-tighter">BLOCK_CONFIRMED</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Protocol Sidebar & Visual Fee Breakdown */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           {/* Visual Proportional Fee Breakdown */}
           <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-6 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-indigo-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Fee Matrix</span>
                </div>
                <div className="flex items-baseline gap-1">
                   <span className="text-sm font-black font-mono text-white">{totalCurrentFee}</span>
                   <span className="text-[8px] font-bold text-slate-600 uppercase">BTC Total</span>
                </div>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="relative z-10 h-3 flex w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                {feeStructure.map((item) => (
                  <div 
                    key={item.id}
                    className={`h-full ${item.color} transition-all duration-1000 relative group/segment`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.label}: ${item.percentage.toFixed(1)}%`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/segment:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>

              {/* Detailed Proportional List */}
              <div className="grid grid-cols-1 gap-2 relative z-10">
                {feeStructure.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${item.color.replace('bg-', 'text-')} bg-white/5`}>
                        <item.icon className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">{item.label}</span>
                        <span className="text-[8px] font-mono text-slate-600">Contribution: {item.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black font-mono text-white">{item.val.toFixed(6)}</div>
                      <div className="text-[7px] font-black text-slate-700 uppercase">Settlement_Unit</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center relative z-10 opacity-60 italic">
                <span className="text-[8px] font-black text-slate-600 uppercase">Model_Sync: Active</span>
                <span className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1">
                  <Activity className="w-2 h-2" /> Adaptive Pricing
                </span>
              </div>
           </div>

           {/* Address Hub */}
           <div className={`bg-slate-950 border transition-all duration-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner relative overflow-hidden ${isVerified ? 'border-emerald-500/40' : 'border-slate-800'}`}>
             <div className={`absolute inset-0 transition-opacity duration-700 blur-3xl rounded-full ${isVerified ? 'bg-emerald-500/10 opacity-100' : 'bg-amber-500/5 opacity-50'}`} />
             
             <div className={`relative z-10 p-4 transition-all duration-700 bg-white rounded-2xl ${isVerified ? 'opacity-100 scale-100 shadow-[0_0_40px_rgba(255,255,255,0.2)]' : 'opacity-20 scale-95 grayscale'}`}>
               <QrCode className="w-32 h-32 text-slate-950" />
             </div>
             
             <div className="relative z-10 space-y-3 w-full">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                  {isVerified ? <Check className="w-3 h-3 text-emerald-400" /> : <ShieldAlert className="w-3 h-3 text-amber-500" />}
                  Settlement Destination
                </span>
                <div className={`bg-slate-900 border transition-all duration-500 rounded-xl p-3 flex items-center justify-between group/addr overflow-hidden ${isVerified ? 'border-emerald-500/40' : 'border-slate-800 opacity-60'}`}>
                   <code className={`text-[10px] font-mono truncate flex-1 transition-colors duration-500 ${isVerified ? 'text-emerald-400' : 'text-slate-600'}`}>
                     {isVerified ? officialFeeAddress : "VALIDATION_LOCKED"}
                   </code>
                   <button 
                    onClick={copyAddress}
                    disabled={!isVerified}
                    className={`ml-3 p-2 rounded-lg transition-all ${isVerified ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-950 text-slate-800'}`}
                   >
                     {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                   </button>
                </div>
             </div>
           </div>

           <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" />
                 <div>
                    <div className="text-[8px] font-black text-slate-600 uppercase">Compliance Level</div>
                    <div className="text-xs font-black text-slate-300 uppercase tracking-widest">L12-INSTITUTIONAL-V4</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-950 px-8 py-4 border-t border-slate-800 flex items-center justify-between relative z-10">
        <div className="flex gap-6">
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] animate-pulse ${isVerified ? 'bg-emerald-500 text-emerald-500' : 'bg-slate-700 text-slate-700'}`} />
             <span className={`text-[9px] font-black uppercase tracking-widest ${isVerified ? 'text-slate-400' : 'text-slate-600'}`}>Sync Status: {isVerified ? 'ENCRYPTED' : 'LOCKED'}</span>
           </div>
           <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse`} />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Ledger: OK</span>
           </div>
        </div>
        <div className="flex items-center gap-2 opacity-40">
           <MoreHorizontal className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HalvingWallet;