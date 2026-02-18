import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ShieldAlert, Zap, Loader2, Terminal, AlertTriangle, CheckCircle2, Shield, Radar, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import { Vulnerability } from '../types';

const SecurityConsole: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev, `> ${msg}`].slice(-50));
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scanLogs]);

  const runVulnerabilityScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setVulnerabilities([]);
    setError(null);

    const simulationSteps = [
      "Initializing 12-Layer Sentry Scan...",
      "Scrubbing Network Perimeter (L1-L4)...",
      "Authenticating Node Consensus Handshakes...",
      "Neural Threat Pattern Matching Engaged...",
      "Zero-Knowledge Proof Validity Check (L8)...",
      "Analyzing Institutional Liquidity Corridors...",
      "Detecting Anomalous Hashrate Jitter...",
      "Compiling Neural Audit Report via HALVING2024 AI..."
    ];

    // Artificial progress and logging
    for (let i = 0; i < simulationSteps.length; i++) {
      addLog(simulationSteps[i]);
      setScanProgress((prev) => prev + (100 / simulationSteps.length));
      await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    }

    try {
      addLog("Transmitting data to HALVING2024 AI Sentinel for deep analysis...");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "You are the HALVING2024 AI Sentinel Core. Perform a deep network vulnerability scan on a 12-layer decentralized blockchain mesh. Identify 4 realistic but simulated vulnerabilities across the layers. Be technical, using terminology appropriate for exascale security.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                layer: { type: Type.INTEGER, description: "The security layer index (1-12)" },
                severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
                category: { type: Type.STRING, enum: ["Cryptographic", "Infrastructure", "Neural", "Consensus"] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                mitigation: { type: Type.STRING, description: "Technical mitigation protocol" }
              },
              required: ["layer", "severity", "category", "title", "description", "mitigation"]
            }
          }
        }
      });

      const results = JSON.parse(response.text || "[]");
      setVulnerabilities(results);
      addLog("Audit complete. Vulnerabilities categorized and ranked.");
    } catch (err: any) {
      console.error("Scan failed:", err);
      setError("Ai Sentinel Link Timeout. Check credentials.");
      addLog("CRITICAL ERROR: Neural handshake interrupted.");
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
        <Shield className="w-64 h-64 text-emerald-500" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/30">
              <Radar className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              HALVING2024 <span className="text-rose-500">Audit Console</span>
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Exascale Vulnerability Detection Mesh
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!isScanning && vulnerabilities.length === 0 ? (
            <button 
              onClick={runVulnerabilityScan}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-900/40 uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95"
            >
              <Activity className="w-4 h-4" />
              Initialize Global Scan
            </button>
          ) : !isScanning ? (
            <button 
              onClick={runVulnerabilityScan}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-2xl transition-all uppercase tracking-widest text-xs border border-slate-700 active:scale-95"
            >
              Re-Scan Perimeter
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Terminal and Scanning View */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black/60 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col shadow-inner font-mono">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sentry_Live_Log</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-rose-500/20" />
                <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 text-[10px]">
              {scanLogs.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-700 italic">
                  Awaiting scan initialization sequence...
                </div>
              )}
              {scanLogs.map((log, i) => (
                <div key={i} className="text-emerald-500/80 animate-in fade-in slide-in-from-left-2 duration-300">
                  {log}
                </div>
              ))}
              {isScanning && (
                <div className="flex items-center gap-2 text-amber-500 animate-pulse mt-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>DEEP_NEURAL_PROCESSING_IN_PROGRESS...</span>
                </div>
              )}
              <div ref={logEndRef} />
            </div>

            {isScanning && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                  <span>Audit Progress</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_10px_#10b981]" 
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results View */}
        <div className="lg:col-span-7 flex flex-col">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-rose-500/5 border border-rose-500/20 rounded-[2rem]">
              <AlertTriangle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
              <h4 className="text-xl font-black text-white uppercase mb-2">Neural Link Interrupted</h4>
              <p className="text-slate-400 text-sm max-w-sm">{error}</p>
            </div>
          ) : !isScanning && vulnerabilities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-slate-950/40 border border-slate-800 rounded-[2rem] opacity-50">
              <ShieldAlert className="w-16 h-16 text-slate-700 mb-6" />
              <div className="space-y-2">
                <h4 className="text-lg font-black text-slate-300 uppercase tracking-widest">No Active Audit Data</h4>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Execute a perimeter scan to generate vulnerability metrics.</p>
              </div>
            </div>
          ) : isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
               <div className="relative">
                  <div className="w-32 h-32 rounded-full border-2 border-emerald-500/20 animate-ping absolute inset-0" />
                  <Loader2 className="w-32 h-32 text-emerald-500/40 animate-spin" strokeWidth={1} />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Fingerprint className="w-12 h-12 text-emerald-500 animate-pulse" />
                  </div>
               </div>
               <h4 className="mt-8 text-sm font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Aggregating AI Findings...</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-1000">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-black text-white uppercase tracking-widest">Audit Findings (Generated by Sentinel AI)</span>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {vulnerabilities.map((vuln, i) => (
                  <div 
                    key={i} 
                    className={`p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
                      vuln.severity === 'Critical' ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.1)]' :
                      vuln.severity === 'High' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-slate-800/40 border-slate-700/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          vuln.severity === 'Critical' ? 'border-rose-500 text-rose-500 bg-rose-500/10' :
                          vuln.severity === 'High' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                          'border-slate-500 text-slate-500 bg-slate-500/10'
                        }`}>
                          {vuln.severity}
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Layer {vuln.layer} • {vuln.category}</span>
                      </div>
                      <AlertTriangle className={`w-4 h-4 ${vuln.severity === 'Critical' ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
                    </div>
                    <h5 className="text-white font-black text-lg mb-2 italic tracking-tight">{vuln.title}</h5>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">{vuln.description}</p>
                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[8px] font-black text-emerald-500/60 uppercase block mb-0.5 tracking-widest">Mitigation Protocol</span>
                        <p className="text-[10px] font-mono text-emerald-300 leading-tight">{vuln.mitigation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between z-10 relative">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Integrity: {isScanning ? 'Auditing' : 'Verified'}</span>
            </div>
            <div className="flex items-center gap-2">
               <Activity className="w-3.5 h-3.5 text-indigo-400" />
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Audit Version: Sentinel_V4_ULTRA</span>
            </div>
         </div>
         <div className="flex items-center gap-2 text-slate-600 group-hover:text-slate-400 transition-colors">
            <span className="text-[9px] font-black uppercase tracking-widest">Powered by HALVING2024 AI Core</span>
            <ChevronRight className="w-3 h-3" />
         </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SecurityConsole;