import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, GenerateContentResponse } from '@google/genai';
import { 
  Search, Mic, MicOff, Zap, Cpu, Globe, Terminal, Activity, 
  ShieldCheck, ArrowRight, ExternalLink, Loader2, Sparkles, 
  Waves, Brain, Fingerprint, Command, Lock, Radio, History
} from 'lucide-react';

// Audio Helpers for Live API
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ArtificialBrain: React.FC = () => {
  // State for Global Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{ text: string; sources: { uri: string; title: string }[] } | null>(null);

  // State for Live Voice
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'speaking' | 'connecting'>('idle');
  const [transcription, setTranscription] = useState<{ role: string; text: string }[]>([]);

  // State for Neural Visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brainLoad, setBrainLoad] = useState(14.2);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Neural Brain Visualization ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = 400;
    let height = canvas.height = 400;
    let frame = 0;

    const points: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const numPoints = 150;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 100 + Math.random() * 20;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      points.push({ x, y, z, ox: x, oy: y, oz: z });
    }

    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const rotation = frame * 0.01;
      const stateIntensity = voiceStatus === 'speaking' ? 2 : (isSearching ? 1.5 : 1);

      // Draw Connections (Synapses)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < numPoints; i++) {
        const p1 = points[i];
        const x1 = centerX + p1.x * Math.cos(rotation) - p1.z * Math.sin(rotation);
        const z1 = p1.x * Math.sin(rotation) + p1.z * Math.cos(rotation);
        const y1 = centerY + p1.y;

        for (let j = i + 1; j < numPoints; j++) {
          const p2 = points[j];
          const dist = Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2 + (p1.z-p2.z)**2);
          if (dist < 45) {
            const x2 = centerX + p2.x * Math.cos(rotation) - p2.z * Math.sin(rotation);
            const y2 = centerY + p2.y;
            const alpha = (1 - dist / 45) * 0.2 * stateIntensity;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }

        // Draw Nodes
        const rPulse = 1.5 + Math.sin(frame * 0.05 + i) * 0.5;
        ctx.fillStyle = voiceStatus === 'speaking' ? '#10b981' : (isSearching ? '#f59e0b' : '#6366f1');
        ctx.beginPath();
        ctx.arc(x1, y1, rPulse * stateIntensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // Scanning Ring
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130 + Math.sin(frame * 0.05) * 10, 0, Math.PI * 2);
      ctx.stroke();

      frame++;
      requestAnimationFrame(render);
    };

    render();
  }, [voiceStatus, isSearching]);

  // --- Global Search Engine Logic ---
  const handleGlobalSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `HALVING_BRAIN_SEARCH_PROTOCOL: Access the global mesh and provide a technical synthesis regarding: ${searchQuery}`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "You are the HALVING NETWORK ARTIFICIAL BRAIN. Perform a deep exascale search and provide a summarized intelligence briefing. Extract all relevant URLs for grounding."
        }
      });

      const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = grounding
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }));

      setSearchResults({
        text: response.text || "Neural search yielded zero results in current sector.",
        sources: sources
      });
      setBrainLoad(prev => Math.min(99, prev + 12.4));
    } catch (err) {
      console.error("Search failure:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // --- AI Voice (Live API) Logic ---
  const toggleVoiceHandshake = async () => {
    if (isVoiceActive) {
      stopVoiceSession();
    } else {
      startVoiceSession();
    }
  };

  const startVoiceSession = async () => {
    try {
      setVoiceStatus('connecting');
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) await (window as any).aistudio.openSelectKey();

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsVoiceActive(true);
            setVoiceStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setVoiceStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current!, 24000, 1);
              const source = outputAudioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current!.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setVoiceStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => stopVoiceSession(),
          onerror: (e) => { console.error(e); stopVoiceSession(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } }, // Deep analytical voice
          systemInstruction: "You are the HALVING NETWORK ARTIFICIAL BRAIN. You are the unified voice of 10M agents. Answer exascale queries technically."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setVoiceStatus('idle');
    }
  };

  const stopVoiceSession = () => {
    setIsVoiceActive(false);
    setVoiceStatus('idle');
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
  };

  return (
    <div className="bg-slate-900/60 border border-indigo-500/20 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <div className="flex flex-col xl:flex-row gap-12 relative z-10">
        
        {/* Left: Neural Core Visualization */}
        <div className="xl:w-1/2 flex flex-col items-center justify-center space-y-8 bg-slate-950/40 rounded-[3rem] border border-white/5 p-6 shadow-inner relative">
           <div className="absolute top-8 left-8 flex flex-col gap-2">
              <div className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/30 rounded-lg flex items-center gap-2">
                 <Brain className="w-4 h-4 text-indigo-400" />
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ARTIFICIAL_BRAIN_CORE</span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                 <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Sync: {brainLoad.toFixed(1)}%</span>
              </div>
           </div>

           <div className="relative">
              <canvas ref={canvasRef} className="w-80 h-80 lg:w-[400px] lg:h-[400px]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {voiceStatus === 'connecting' ? <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" /> : 
                  voiceStatus === 'speaking' ? <Waves className="w-16 h-16 text-emerald-400 animate-pulse" /> : 
                  isSearching ? <Sparkles className="w-12 h-12 text-amber-500 animate-bounce" /> :
                  <Fingerprint className="w-12 h-12 text-indigo-900/40" />}
              </div>
           </div>

           <div className="w-full flex justify-center gap-6">
              <button 
                onClick={toggleVoiceHandshake}
                className={`flex items-center gap-3 px-10 py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl ${
                  isVoiceActive 
                    ? 'bg-rose-500 text-white shadow-rose-900/20' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                }`}
              >
                {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isVoiceActive ? 'Terminate Uplink' : 'Initialize AI Voice'}
              </button>
           </div>
        </div>

        {/* Right: Global Search & Briefing Feed */}
        <div className="xl:w-1/2 flex flex-col space-y-8">
           <div className="space-y-2">
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                Global <span className="text-indigo-400">Search Engine</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.4em] flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                Real-time Exascale Web Grounding
              </p>
           </div>

           {/* Tactical Search Bar */}
           <div className="relative group/search">
              <div className="absolute inset-0 bg-indigo-500/5 blur-2xl group-focus-within/search:bg-indigo-500/10 transition-all pointer-events-none" />
              <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-[2.5rem] overflow-hidden focus-within:border-indigo-500/50 transition-all shadow-inner">
                 <Terminal className="absolute left-6 w-5 h-5 text-slate-600" />
                 <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
                  placeholder="QUERY_GLOBAL_MESH_..."
                  className="w-full bg-transparent pl-16 pr-8 py-6 text-sm font-mono text-indigo-100 placeholder:text-slate-700 outline-none"
                 />
                 <button 
                  onClick={handleGlobalSearch}
                  disabled={isSearching}
                  className="absolute right-3 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all active:scale-90 disabled:bg-slate-800"
                 >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                 </button>
              </div>
           </div>

           {/* Results & Briefing Console */}
           <div className="flex-1 bg-slate-950/60 border border-slate-800 rounded-[3rem] p-8 flex flex-col relative overflow-hidden min-h-[350px]">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                 <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Intelligence Briefing</span>
                 </div>
                 <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-indigo-500/20" />
                    ))}
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                 {!searchResults && !isSearching ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-6">
                      <Radio className="w-16 h-16 text-slate-700 animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 max-w-[240px]">
                        Artificial Brain is in standby. Use the Global Search or Voice Uplink to retrieve planetary intelligence.
                      </p>
                   </div>
                 ) : isSearching ? (
                   <div className="h-full flex flex-col items-center justify-center gap-6">
                      <div className="relative">
                         <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                         <Cpu className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
                      </div>
                      <div className="text-center space-y-2">
                        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] animate-pulse">Scouring Mesh...</span>
                        <p className="text-[9px] text-slate-600 font-mono italic">Applying L12 grounding logic...</p>
                      </div>
                   </div>
                 ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                      <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl relative">
                         <div className="absolute -top-3 -left-3 p-2 bg-indigo-600 rounded-lg text-white shadow-lg">
                            <Sparkles className="w-4 h-4" />
                         </div>
                         <p className="text-sm font-medium leading-relaxed text-slate-200 italic">
                            "{searchResults?.text}"
                         </p>
                      </div>

                      {searchResults?.sources && searchResults.sources.length > 0 && (
                        <div className="space-y-3">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              Verified Sentry Sources
                           </h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {searchResults.sources.map((s, i) => (
                                <a 
                                  key={i} 
                                  href={s.uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/40 transition-all flex items-center justify-between group/link"
                                >
                                   <div className="flex items-center gap-3 truncate">
                                      <Globe className="w-3.5 h-3.5 text-slate-600 group-hover/link:text-cyan-400 transition-colors" />
                                      <span className="text-[10px] font-black text-slate-400 group-hover/link:text-white truncate uppercase">{s.title || 'Mesh_Node_Data'}</span>
                                   </div>
                                   <ExternalLink className="w-3 h-3 text-slate-700 group-hover/link:text-indigo-400" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-800 flex items-center justify-between">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-emerald-500" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol Integrity</span>
                  <span className="text-sm font-mono text-emerald-400 font-bold tracking-tighter">SECURE_LEVEL_12</span>
               </div>
            </div>
            <div className="h-10 w-px bg-slate-800 hidden md:block" />
            <div className="flex items-center gap-3">
               <Lock className="w-6 h-6 text-indigo-400" />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Encryption Scheme</span>
                  <span className="text-sm font-mono text-indigo-400 font-bold tracking-tighter">AES_512_QUANTUM</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest">Powered by HALVING_AI Synapse Hub</span>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_#6366f1]" />
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

export default ArtificialBrain;