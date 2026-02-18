import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Zap, Lock, Menu, Settings, X, Volume2, Crown, Share2, Smartphone, Download, Cpu, Network, Landmark, FileText, Palette, Layout, Radio, ChevronUp, ChevronDown, Move, Droplet, BarChart3, Home, Radar, Activity, Terminal, Layers, ShieldCheck, Globe, Hexagon, Compass, Target, Hammer, Flag, Search, Image as ImageIcon, Music, Cpu as CpuIcon, MessageSquare } from 'lucide-react';
import SecurityStack from './components/SecurityStack';
import AiSentinelLive from './components/AiSentinelLive';
import AiCeoLive from './components/AiCeoLive';
import CeoCompactBanner from './components/CeoCompactBanner';
import AiSwarmGrid from './components/AiSwarmGrid';
import SwarmChat from './components/SwarmChat';
import BtcLiveMarquee from './components/BtcLiveMarquee';
import BitcoinPriceCard from './components/BitcoinPriceCard';
import ExchangeFlowMetrics from './components/ExchangeFlowMetrics';
import InstitutionalRadar from './components/InstitutionalRadar';
import ExternalLinkHub from './components/ExternalLinkHub';
import SentryTopTicker from './components/SentryTopTicker';
import ApkBuilder from './components/ApkBuilder';
import TransactionFeed from './components/TransactionFeed';
import WhitePaperModal from './components/WhitePaperModal';
import HlvRealTimePriceCard from './components/HlvRealTimePriceCard';
import HlvPriceChart from './components/HlvPriceChart';
import HlvSentryMonitor from './components/HlvSentryMonitor';
import ProfessionalBackground from './components/ProfessionalBackground';
import HudPositioner, { HudBlock } from './components/HudPositioner';
import HlvFeeDynamics from './components/HlvFeeDynamics';
import HlvBillingSpecsModal from './components/HlvBillingSpecsModal';
import HlvAdMeshSettlement from './components/HlvAdMeshSettlement';
import NetworkStats from './components/NetworkStats';
import { VoiceName } from './types';

type Theme = 'sentinel' | 'blackwell' | 'quantum' | 'frost' | 'cyberpunk' | 'crimson' | 'monochrome' | 'forest';
type AppTab = 'home' | 'security' | 'protocol' | 'ai' | 'network' | 'settings';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('sentinel');
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isApkBuilderOpen, setIsApkBuilderOpen] = useState(false);
  const [isWhitePaperOpen, setIsWhitePaperOpen] = useState(false);
  const [isBillingSpecsOpen, setIsBillingSpecsOpen] = useState(false);
  const [isHudConfigOpen, setIsHudConfigOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Zephyr');

  // Dashboard Block Configuration
  const [hudBlocks, setHudBlocks] = useState<HudBlock[]>([
    { id: 'hlvPrice', label: 'HLV Token Price Index', visible: true, icon: BarChart3 },
    { id: 'price', label: 'Bitcoin Market Metrics', visible: true, icon: Zap },
    { id: 'radar', label: 'Institutional Radar', visible: true, icon: Landmark },
    { id: 'sentinel', label: 'AI Sentinel Neural Hub (Unified Swarm)', visible: true, icon: Shield },
    { id: 'surveillance', label: 'Sentry Defense Monitor', visible: true, icon: Radar },
    { id: 'ceo', label: 'Executive CEO Briefing', visible: true, icon: Crown },
    { id: 'swarm', label: 'Neural Swarm Grid', visible: true, icon: Cpu },
    { id: 'flow', label: 'Exchange & Transmission Feed', visible: true, icon: Share2 },
    { id: 'stack', label: 'Security Stack Audit', visible: true, icon: Layers as any },
  ]);

  const [swarmMetrics, setSwarmMetrics] = useState({
    activeAgents: 9942085,
    processingLoad: 14.2,
    hashrate: 1.2
  });

  useEffect(() => {
    const swarmInterval = setInterval(() => {
      setSwarmMetrics(prev => ({
        activeAgents: 9900000 + Math.floor(Math.random() * 100000),
        processingLoad: parseFloat((12 + Math.random() * 8).toFixed(2)),
        hashrate: parseFloat((1.2 + Math.random() * 0.1).toFixed(2))
      }));
    }, 3000);
    return () => clearInterval(swarmInterval);
  }, []);

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...hudBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setHudBlocks(newBlocks);
    }
  };

  const THEMES: { id: Theme; label: string; primary: string; secondary: string; dark: boolean }[] = [
    { id: 'sentinel', label: 'Sentinel Core', primary: '#10b981', secondary: '#6366f1', dark: true },
    { id: 'blackwell', label: 'Blackwell GPU', primary: '#76b900', secondary: '#1a1a1a', dark: true },
    { id: 'cyberpunk', label: 'Neon Cyber', primary: '#ff00ff', secondary: '#00ffff', dark: true },
    { id: 'quantum', label: 'Quantum Shift', primary: '#f59e0b', secondary: '#7c3aed', dark: true },
    { id: 'crimson', label: 'Crimson Sentry', primary: '#e11d48', secondary: '#0d0101', dark: true },
    { id: 'monochrome', label: 'Monochrome', primary: '#ffffff', secondary: '#333333', dark: true },
    { id: 'forest', label: 'Deep Forest', primary: '#22c55e', secondary: '#050a05', dark: true },
    { id: 'frost', label: 'Frost Mesh', primary: '#06b6d4', secondary: '#3b82f6', dark: false },
  ];

  const renderDashboardBlock = (id: string) => {
    switch (id) {
      case 'hlvPrice': return <HlvRealTimePriceCard />;
      case 'price': return <BitcoinPriceCard />;
      case 'radar': return <InstitutionalRadar />;
      case 'sentinel': return (
        <div className="w-full">
           <AiSentinelLive voiceName={selectedVoice} />
        </div>
      );
      case 'surveillance': return <HlvSentryMonitor />;
      case 'ceo': return <AiCeoLive />;
      case 'swarm': return <AiSwarmGrid metrics={swarmMetrics} />;
      case 'flow': return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-10">
            <ExchangeFlowMetrics />
            <TransactionFeed swarmMetrics={swarmMetrics} />
          </div>
          <div className="lg:col-span-4 space-y-10">
            <ExternalLinkHub />
            <div className="premium-card bg-gradient-to-br from-slate-900 to-emerald-950/30 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity"><Shield className="w-32 h-32 text-emerald-500" /></div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4"><ShieldAlert className="w-5 h-5 text-emerald-400 animate-pulse" />Defense Summary</h4>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] font-mono"><span className="text-slate-500">Perimeter Integrity</span><span className="text-white">100.0% SECURE</span></div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5"><div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_12px_#10b981]" /></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] font-mono"><span className="text-slate-500">Neural Latency</span><span className="text-emerald-400">12ms ACTIVE</span></div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5"><div className="h-full bg-emerald-500 w-[20%] rounded-full shadow-[0_0_12px_#10b981]" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 'stack': return <div className="premium-card p-12 mt-12 bg-slate-900/40"><SecurityStack /></div>;
      default: return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {hudBlocks.filter(b => b.visible).map((block, index) => (
              <div key={block.id} className={`relative transition-all duration-500 ${isEditMode ? 'p-4 border-2 border-dashed border-cyan-500/40 rounded-[3.5rem] bg-cyan-500/5' : ''}`}>
                {isEditMode && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 border border-cyan-500/50 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] z-[20]">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mr-2">{block.label}</span>
                    <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                    <div className="w-px h-3 bg-slate-800 mx-1" />
                    <button onClick={() => moveBlock(index, 'down')} disabled={index === hudBlocks.length - 1} className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                )}
                {renderDashboardBlock(block.id)}
              </div>
            ))}
          </div>
        );
      case 'security':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <HlvSentryMonitor />
            <SecurityStack />
          </div>
        );
      case 'protocol':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <HlvRealTimePriceCard />
            <HlvPriceChart swarmMetrics={swarmMetrics} />
            <HlvAdMeshSettlement swarmMetrics={swarmMetrics} />
            <HlvFeeDynamics swarmMetrics={swarmMetrics} onOpenSpecs={() => setIsBillingSpecsOpen(true)} />
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 gap-8">
              <AiSentinelLive voiceName={selectedVoice} />
              <AiCeoLive />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
               <SwarmChat />
            </div>
            <AiSwarmGrid metrics={swarmMetrics} />
          </div>
        );
      case 'network':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
            <NetworkStats />
            <TransactionFeed swarmMetrics={swarmMetrics} />
          </div>
        );
      case 'settings':
        return (
           <div className="max-w-3xl mx-auto p-8 bg-slate-950/60 border border-slate-800 rounded-[3rem] animate-in fade-in slide-in-from-bottom-10 duration-500">
              <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4 italic uppercase"><Settings className="w-8 h-8 text-emerald-500" /> Sentry Protocol Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Neural Voice Core</h3>
                    <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value as VoiceName)} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-3 text-sm outline-none focus:border-emerald-500">
                      <option value="Zephyr">Zephyr (Authoritative)</option>
                      <option value="Charon">Charon (Architect Analytical)</option>
                      <option value="Orion">Orion (Deep Command)</option>
                      <option value="Kore">Kore (Analytical)</option>
                      <option value="Fenrir">Fenrir (Heavy)</option>
                    </select>
                  </div>
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">UI Matrix</h3>
                    <button onClick={() => setIsHudConfigOpen(true)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all">Configure HUD Topology</button>
                  </div>
              </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen cyber-grid pb-32 transition-all duration-700 ease-in-out relative`}>
      <ProfessionalBackground />
      <SentryTopTicker />
      
      <ApkBuilder isOpen={isApkBuilderOpen} onClose={() => setIsApkBuilderOpen(false)} />
      <WhitePaperModal isOpen={isWhitePaperOpen} onClose={() => setIsWhitePaperOpen(false)} />
      <HlvBillingSpecsModal isOpen={isBillingSpecsOpen} onClose={() => setIsBillingSpecsOpen(false)} />
      <HudPositioner isOpen={isHudConfigOpen} onClose={() => setIsHudConfigOpen(false)} blocks={hudBlocks} setBlocks={setHudBlocks} />
      
      {/* Fixed App Header */}
      <nav className="sticky top-0 z-[100] glass border-b border-white/5 px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-transform hover:scale-110 cursor-pointer">
            <Shield className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black tracking-tighter text-white uppercase italic leading-tight">
              Halving<span className="text-emerald-500">Sentinel</span>
            </h1>
            <div className="flex items-center gap-2 -mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">Sovereign Link Active</span>
            </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          {/* Main AI SENTINEL Command Button */}
          <button 
            onClick={() => setActiveTab('ai')}
            className="relative px-6 py-2.5 bg-slate-950 border border-emerald-500/30 rounded-2xl group/sentinel overflow-hidden transition-all hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
          >
             <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover/sentinel:opacity-100 transition-opacity" />
             <div className="relative flex items-center gap-3">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg group-hover/sentinel:bg-emerald-500 group-hover/sentinel:text-slate-950 transition-all">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start leading-none">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">AI SENTINEL</span>
                   <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter group-hover/sentinel:text-emerald-400 transition-colors">By Hopîrda Adrian</span>
                </div>
             </div>
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-500/20 group-hover/sentinel:bg-emerald-500 transition-colors" />
          </button>

          <button onClick={() => setIsWhitePaperOpen(true)} className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 transition-all uppercase tracking-[0.3em] relative group flex items-center gap-2">
            <FileText className="w-4 h-4" /> Protocol Paper
          </button>
          <button onClick={() => setIsApkBuilderOpen(true)} className="text-[11px] font-black text-indigo-400 hover:text-indigo-300 transition-all uppercase tracking-[0.3em] relative group flex items-center gap-2">
            <Download className="w-4 h-4" /> Official APK
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsEditMode(!isEditMode)} className={`p-2.5 rounded-xl border transition-all ${isEditMode ? 'bg-cyan-600 border-cyan-400 text-white shadow-cyan-900/30' : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-cyan-500/30'}`}>
            <Move className="w-5 h-5" />
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2.5 text-slate-400 hover:text-white transition-all rounded-xl hover:bg-slate-800 border border-slate-800 bg-slate-900/50">
            <Palette className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <CeoCompactBanner />
      <BtcLiveMarquee />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 relative z-10">
        {renderTabContent()}
      </main>

      {/* Integrated Bottom Navigation Bar - Absolute Lower & Compact */}
      <div className="fixed bottom-0 left-0 right-0 w-full z-[110]">
        <div className="bg-slate-950/95 backdrop-blur-3xl border-t border-white/10 rounded-t-2xl px-8 pt-1.5 pb-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.7)]">
          {[
            { id: 'home', icon: Activity, label: 'Dash' },
            { id: 'security', icon: ShieldCheck, label: 'Safe' },
            { id: 'protocol', icon: Hexagon, label: 'HLV' },
            { id: 'ai', icon: Zap, label: 'Core' },
            { id: 'network', icon: Search, label: 'Audit' },
            { id: 'settings', icon: Terminal, label: 'Logs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AppTab)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-2xl transition-all duration-300 relative group flex-1 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-transparent'}`}>
                <tab.icon className={`w-5 h-5 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-0 h-0 scale-90 group-hover:opacity-100 group-hover:h-auto group-hover:scale-100'}`}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar Trigger */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-sm bg-slate-900 border-l border-slate-700/50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-500">
             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3"><Palette className="w-6 h-6 text-emerald-500" /> Interface Protocols</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-6 h-6" /></button>
             </div>
             <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map((t) => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={`p-4 rounded-3xl border text-left transition-all ${theme === t.id ? 'border-emerald-500 bg-white/5' : 'border-slate-800 bg-slate-950/40'}`}>
                      <div className="flex gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.secondary }} />
                      </div>
                      <span className="text-[10px] font-black uppercase">{t.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] space-y-4">
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Global Sentry Actions</h3>
                  <button onClick={() => setIsWhitePaperOpen(true)} className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase">Protocol Paper</button>
                  <button onClick={() => setIsApkBuilderOpen(true)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase">Deploy Official APK</button>
                </div>
             </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 py-1.5 px-8 flex justify-between items-center text-[7px] text-slate-700 font-mono font-bold z-[120] pointer-events-none bg-transparent backdrop-blur-none border-none">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-3">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            V-2.7.9 • CEO HOPÎRDA ADRIAN
          </span>
          <span className="hidden xl:inline uppercase tracking-[0.2em] opacity-40">UPLINK: SATELLITE-BETA</span>
        </div>
        <div className="flex items-center gap-2">
           <Smartphone className="w-2 h-2" />
           <span className="uppercase tracking-widest opacity-40">Sovereign Domain Verified</span>
        </div>
      </footer>

      <button 
        onClick={() => setActiveTab('ai')}
        className="fixed bottom-24 right-8 z-[100] p-4 bg-emerald-600 text-white rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-110 transition-all active:scale-95 group"
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Neural Swarm Link</span>
        </div>
      </button>
    </div>
  );
};

export default App;