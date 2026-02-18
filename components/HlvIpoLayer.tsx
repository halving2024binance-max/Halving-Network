import React, { useState, useEffect } from 'react';
import { Landmark, Zap, ShieldCheck, Timer, Users, ArrowUpRight, Globe, Sparkles, Binary, Activity, Hexagon, Fingerprint, X, CheckCircle2, Loader2, DollarSign, ChevronRight, TrendingUp, MoreVertical, Plus } from 'lucide-react';

interface Participant {
  name: string;
  stake: string;
  time: string;
  status: string;
}

const HlvIpoLayer: React.FC = () => {
  const [valuation, setValuation] = useState(14820421000000);
  const [subscription, setSubscription] = useState(114.42);
  const [signatures, setSignatures] = useState(842);
  const [direction, setDirection] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [participants, setParticipants] = useState<Participant[]>([
    { name: 'Sovereign_Wealth_UAE', stake: '1.2B', time: '2m', status: 'VERIFIED' },
    { name: 'BlackRock_IBIT', stake: '840M', time: '14m', status: 'LOCKED' },
    { name: 'Fidelity_Mesh', stake: '620M', time: '22m', status: 'VERIFIED' },
    { name: 'MicroStrategy_09', stake: '400M', time: '1h', status: 'VERIFIED' },
  ]);

  // Subscription State
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [subStep, setSubStep] = useState<'input' | 'verify' | 'success'>('input');
  const [subAmount, setSubAmount] = useState('5000');
  const [selectedTier, setSelectedTier] = useState<'retail' | 'institutional' | 'sovereign'>('retail');
  const [verifyProgress, setVerifyProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const shift = Math.random() * 5000000;
      setValuation(prev => prev + shift);
      setDirection('up');
      setSubscription(prev => Math.min(150, prev + 0.001));
      
      if (Math.random() > 0.7) setSignatures(prev => prev + 1);

      if (Math.random() > 0.96) {
        const names = ['Ark_Invest_Global', 'Nvidia_Compute', 'Samsung_Neural', 'Google_DeepMesh'];
        const newPart = {
          name: names[Math.floor(Math.random() * names.length)],
          stake: (Math.random() * 500 + 100).toFixed(1) + 'M',
          time: 'Just now',
          status: 'VERIFIED'
        };
        setParticipants(prev => [newPart, ...prev.slice(0, 3)]);
      }

      const timeout = setTimeout(() => setDirection('neutral'), 400);
      return () => clearTimeout(timeout);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async () => {
    setSubStep('verify');
    setVerifyProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      setVerifyProgress(i);
      await new Promise(r => setTimeout(r, 150));
    }
    const formattedAmount = parseInt(subAmount) >= 1000000 ? (parseInt(subAmount)/1000000).toFixed(1) + 'M' : (parseInt(subAmount)/1000).toFixed(1) + 'K';
    setParticipants(prev => [{ name: 'User_Node_Authorized', stake: formattedAmount, time: 'Just now', status: 'VERIFIED' }, ...prev.slice(0, 3)]);
    setSubStep('success');
  };

  const closePortal = () => {
    setIsPortalOpen(false);
    setTimeout(() => {
      setSubStep('input');
      setVerifyProgress(0);
    }, 500);
  };

  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col transition-all duration-700 hover:shadow-indigo-900/10">
      
      {/* Android Style Header */}
      <div className="p-6 bg-slate-950/40 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight italic">IPO Protocol</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Valuation Matrix</span>
            </div>
          </div>
        </div>
        <button className="p-2 text-slate-500 hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Scoreboard */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Aggregate Network Value</span>
            <div className={`text-6xl lg:text-7xl font-black font-mono tracking-tighter transition-all duration-500 flex items-baseline gap-4 ${direction === 'up' ? 'text-emerald-400 translate-y-[-2px]' : 'text-white'}`}>
              ${(valuation / 1000000000000).toFixed(2)}T
              <TrendingUp className={`w-8 h-8 transition-opacity duration-300 ${direction === 'up' ? 'opacity-100' : 'opacity-20'}`} />
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 bg-slate-950/40 border border-white/5 rounded-3xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Oversubscription Index</span>
                 <div className="flex items-center gap-2">
                    <Binary className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xl font-black font-mono text-white">{subscription.toFixed(2)}%</span>
                 </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Genesis Block Open</span>
              </div>
            </div>
            <div className="h-4 bg-slate-900 rounded-full p-1 border border-white/5 overflow-hidden">
               <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${(subscription / 150) * 100}%` }} 
               />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Authorized Nodes', value: signatures, icon: Fingerprint, color: 'text-indigo-400' },
              { label: 'Network Class', value: 'Sovereign', icon: Globe, color: 'text-cyan-400' },
              { label: 'Protocol Tier', value: 'L-12', icon: ShieldCheck, color: 'text-emerald-400' },
              { label: 'Sync Status', value: 'Stable', icon: Activity, color: 'text-amber-400' }
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-slate-950/30 border border-white/5 rounded-2xl flex flex-col gap-2 hover:bg-slate-950/50 transition-colors">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div>
                  <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-sm font-black text-white uppercase">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Feed Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Sparkles className="w-3.5 h-3.5 text-amber-500" />
               Signature Feed
            </span>
            <button className="text-[9px] font-black text-indigo-400 uppercase hover:text-white transition-colors">Audit All</button>
          </div>
          <div className="space-y-3">
             {participants.map((p, i) => (
               <div key={i} className="p-4 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-indigo-500/30 transition-all animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                       <Landmark className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white uppercase italic truncate max-w-[100px]">{p.name}</div>
                       <div className="text-[8px] font-mono text-slate-600 uppercase">{p.time} ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-400 font-mono">+${p.stake}</div>
                    <div className="text-[7px] text-slate-600 font-black uppercase tracking-tighter">{p.status}</div>
                  </div>
               </div>
             ))}
          </div>
          
          {/* Android Style Floating Action Button within card context */}
          <button 
            onClick={() => setIsPortalOpen(true)}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-all shadow-xl shadow-emerald-900/20 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Engage Subscription
          </button>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="p-4 bg-slate-950 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Protocol Integrity: 100% Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-3 h-3 text-amber-500" />
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Epoch: 03 (Genesis Transition)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-40">
           <Zap className="w-2.5 h-2.5 text-indigo-400" />
           <span className="text-[8px] font-black text-slate-600 uppercase">Exascale Analytics Active</span>
        </div>
      </div>

      {/* Android Style Bottom Sheet Portal */}
      {isPortalOpen && (
        <div className="fixed inset-0 z-[300] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={closePortal} />
          
          <div className="relative w-full max-w-2xl mx-auto bg-slate-900 border-t border-x border-white/10 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-full duration-500 overflow-hidden flex flex-col">
            
            {/* MD3 Handle */}
            <div className="w-full flex justify-center py-4">
              <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
            </div>

            <div className="px-8 pb-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Genesis Portal</h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Block Allocation Interface</p>
                  </div>
                </div>
                <button onClick={closePortal} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {subStep === 'input' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  
                  {/* Segmented Tier Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Allocation Tier</label>
                    <div className="flex p-1 bg-slate-950 border border-white/5 rounded-2xl">
                      {[
                        { id: 'retail', label: 'Retail', color: 'emerald' },
                        { id: 'institutional', label: 'Inst.', color: 'indigo' },
                        { id: 'sovereign', label: 'Sov.', color: 'amber' }
                      ].map((tier) => (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTier(tier.id as any)}
                          className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            selectedTier === tier.id 
                              ? 'bg-emerald-600 text-white shadow-lg' 
                              : 'text-slate-600 hover:text-slate-300'
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Field with contextual icons */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Capital Commitment (USD)</label>
                    <div className="relative group">
                       <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-focus-within:bg-emerald-500/10 transition-colors" />
                       <input 
                        type="number" 
                        value={subAmount}
                        onChange={(e) => setSubAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-3xl px-12 py-6 text-3xl font-black font-mono text-white outline-none focus:border-emerald-500/40 transition-all relative z-10 shadow-inner"
                       />
                       <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 z-20" />
                    </div>
                  </div>

                  {/* MD3 Info Card */}
                  <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                           <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-500 uppercase">Projected HLV Flow</span>
                           <span className="text-lg font-black font-mono text-indigo-400">{(parseInt(subAmount || '0') / 14.82).toFixed(2)} HLV</span>
                        </div>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-700" />
                  </div>

                  <button 
                    onClick={handleSubscribe}
                    className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-[2.5rem] transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 active:scale-95"
                  >
                    Confirm Block Allocation
                  </button>
                </div>
              )}

              {subStep === 'verify' && (
                <div className="flex flex-col items-center justify-center py-12 space-y-12 animate-in zoom-in-95 duration-500">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full border-4 border-emerald-500/10 animate-ping absolute inset-0" />
                    <div className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center relative bg-slate-950 shadow-2xl overflow-hidden">
                       <Loader2 className="w-24 h-24 text-emerald-500 animate-spin" strokeWidth={1.5} />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Fingerprint className="w-12 h-12 text-emerald-400 animate-pulse" />
                       </div>
                    </div>
                  </div>
                  <div className="text-center space-y-4 w-full">
                    <div className="flex justify-between items-center mb-2 px-2">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Handshake</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase font-mono">{verifyProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                       <div className="h-full bg-emerald-500 shadow-[0_0_20px_#10b981] transition-all duration-300" style={{ width: `${verifyProgress}%` }} />
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em] italic">Executing 12-Layer Verification...</p>
                  </div>
                </div>
              )}

              {subStep === 'success' && (
                <div className="flex flex-col items-center justify-center py-10 space-y-10 animate-in zoom-in-95 duration-500">
                  <div className="relative">
                     <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                     <div className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] relative z-10 border-4 border-white/20">
                        <CheckCircle2 className="w-16 h-16 text-white" />
                     </div>
                     <Sparkles className="absolute -top-6 -right-6 w-12 h-12 text-amber-400 animate-bounce" />
                  </div>
                  <div className="text-center space-y-2">
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Success</h3>
                     <p className="text-xs text-slate-500 font-mono font-black uppercase tracking-widest">Allocation Node Established</p>
                  </div>
                  <div className="w-full bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 space-y-4 shadow-inner">
                     <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Account Status</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">Active_L12</span>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase">HLV Reserved</span>
                        <span className="text-2xl font-black font-mono text-white">{(parseInt(subAmount)/14.82).toFixed(2)}</span>
                     </div>
                  </div>
                  <button 
                    onClick={closePortal}
                    className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-[2.5rem] transition-all uppercase tracking-[0.2em] text-xs active:scale-95"
                  >
                    Finish Briefing
                  </button>
                </div>
              )}
            </div>
            
            {/* Native Android Navbar Sim */}
            <div className="h-20 bg-slate-950 border-t border-white/5 flex items-center justify-center px-10">
               <div className="flex gap-12 text-slate-700 items-center">
                  <div className="w-3 h-3 bg-slate-800 rounded-sm" />
                  <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
                  <div className="w-3 h-3 border-2 border-slate-800 rounded-full" />
               </div>
            </div>

          </div>
        </div>
      )}

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

export default HlvIpoLayer;