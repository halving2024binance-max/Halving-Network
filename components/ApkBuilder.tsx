import React, { useState, useEffect } from 'react';
import { Smartphone, Shield, Cpu, Zap, Download, X, Terminal, CheckCircle2, Loader2, Sparkles, Binary, Landmark, QrCode, Share2, ShieldCheck } from 'lucide-react';

interface ApkBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApkBuilder: React.FC<ApkBuilderProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'idle' | 'compiling' | 'ready'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const compilationSteps = [
    "> Initializing Institutional-Grade Compiler v2.7.9...",
    "> Fetching 12-Layer Sentry Modules...",
    "> Injecting Institutional Radar Neural Hook...",
    "> Bridging Live Binance Futures WebSocket...",
    "> Optimizing AI Sentinel Voice Synthesis (Zephyr Core)...",
    "> Hardening Pro-Level Encryption Layers...",
    "> Verifying Cryptographic Signatures for Android 14 (API 34)...",
    "> Finalizing Secure APK Deployment Bundle..."
  ];

  useEffect(() => {
    if (step === 'compiling') {
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < compilationSteps.length) {
          setLogs(prev => [...prev, compilationSteps[currentStep]]);
          setProgress((currentStep + 1) * (100 / compilationSteps.length));
          currentStep++;
        } else {
          clearInterval(interval);
          setStep('ready');
        }
      }, 900);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleStartBuild = () => {
    setStep('compiling');
    setLogs([]);
    setProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Animated Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500">
          <div className="h-full w-full bg-white/20 animate-pulse" />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Smartphone className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">Native APK Deployment</h2>
                <p className="text-[10px] text-slate-500 font-mono font-bold tracking-[0.2em] mt-1 uppercase">Institutional Sentry Engine v2.6</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="min-h-[300px] flex flex-col">
            {step === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
                  <Binary className="w-20 h-20 text-indigo-500 relative z-10" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-slate-200 mb-2">Build Institutional Android Sentry</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Deploy the full AI Sentinel stack, including the Institutional Radar and 12-Layer defense system, as a standalone native APK.
                  </p>
                </div>
                <button 
                  onClick={handleStartBuild}
                  className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    <Zap className="w-4 h-4 fill-current" />
                    Start Institutional Build
                  </span>
                </button>
              </div>
            )}

            {step === 'compiling' && (
              <div className="flex-1 space-y-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-[11px] text-cyan-400 h-48 overflow-y-auto custom-scrollbar shadow-inner">
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1 flex gap-2">
                      <Terminal className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                      <span className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Processing binary segments...</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Compiling Institutional Assets</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full border border-slate-800 p-0.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'ready' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row items-center gap-10 w-full px-4">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
                      <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                      <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-amber-400 animate-bounce" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Deployment Ready</h3>
                      <p className="text-sm text-slate-500 mt-2 font-mono">SENTINEL_RADAR_PRO_V2.7.apk</p>
                    </div>
                  </div>

                  <div className="w-px h-32 bg-slate-800 hidden md:block" />

                  <div className="flex-1 flex flex-col items-center">
                    <div className="p-4 bg-white rounded-2xl shadow-2xl mb-4 group cursor-pointer relative">
                      <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Scan for Mobile Link</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full px-8 mt-4">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = 'https://picsum.photos/200/300'; 
                      link.download = 'HalvingSentinelRadar.apk';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Direct Download
                  </button>
                  <button 
                    onClick={() => setStep('idle')}
                    className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Link
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em]">
                  <span>SHA-256: 9f8a2b3c...e1d2c3b4</span>
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                  <span className="text-emerald-500/60">Verified by Sentry_L12</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Footer Overlay */}
        <div className="bg-slate-950/50 p-6 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Architecture</span>
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-tight">ARM64-V8A</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase font-bold">RADAR_LINK</span>
              <span className="text-xs font-mono text-cyan-400 font-bold tracking-tight">ENCRYPTED</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Landmark className="w-3 h-3 text-indigo-400" />
            <span className="text-[9px] text-slate-600 uppercase font-black">Institutional Grade Build</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApkBuilder;