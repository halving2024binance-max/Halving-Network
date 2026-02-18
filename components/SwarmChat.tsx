import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Send, Terminal, Cpu, ShieldAlert, Sparkles, MessageSquare, Loader2, Zap, Volume2, VolumeX, ShieldCheck, Activity as PulseIcon, Mic, MicOff, Waves, Shield, Search } from 'lucide-react';
import { SECURITY_LAYERS } from '../constants';

// Helper functions for manual audio encoding/decoding as required by Gemini Live API
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
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

const SwarmChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'swarm'; text: string; agent?: string; isSpeaking?: boolean }[]>([
    { role: 'swarm', text: 'Swarm Intelligence Online. 10,000,000 agents synchronized. AI CORE handshaking with Genesis Nodes. Awaiting exascale tactical vision parameters.', agent: 'AI_CORE_MASTER' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCoreProtocol, setIsCoreProtocol] = useState(false);
  const [isSecurityAudit, setIsSecurityAudit] = useState(false);
  const [coreIntegrity, setCoreIntegrity] = useState(99.98);
  
  // Live Voice Mode States
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  const [currentTranscription, setCurrentTranscription] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Audio Refs for Live API
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping, currentTranscription]);

  // Core Telemetry Drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreIntegrity(prev => {
        const drift = (Math.random() - 0.5) * 0.02;
        return Math.min(100, Math.max(99.4, prev + drift));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleLiveVoice = async () => {
    if (isLiveActive) {
      stopLiveSession();
    } else {
      startLiveSession();
    }
  };

  const stopLiveSession = () => {
    setIsLiveActive(false);
    setLiveStatus('idle');
    setCurrentTranscription('');
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const startLiveSession = async () => {
    try {
      setLiveStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            setLiveStatus('listening');
            
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle output transcription
            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setCurrentTranscription(prev => prev + text);
            }

            // Handle turn completion - add message to UI
            if (message.serverContent?.turnComplete) {
              const fullText = currentTranscription;
              if (fullText) {
                setMessages(prev => [...prev, { 
                  role: 'swarm', 
                  text: fullText, 
                  agent: isCoreProtocol ? 'AI_CORE_PRIME' : 'SWARM_VOICE_LINK' 
                }]);
              }
              setCurrentTranscription('');
            }

            // Handle audio response
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setLiveStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current!.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContextRef.current!,
                24000,
                1,
              );
              const source = outputAudioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current!.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setLiveStatus('listening');
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Swarm Live Error:', e);
            stopLiveSession();
          },
          onclose: () => stopLiveSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: isCoreProtocol ? 'Echo' : 'Zephyr' }, 
            },
          },
          outputAudioTranscription: {},
          systemInstruction: `You are the COLLECTIVE INTELLIGENCE of the HALVING NETWORK SWARM, managing 10,000,000 neural nodes. 

DIRECTIVE: Answer ALL questions from Authorized Leads, whether they relate to blockchain security, market analytics, or global knowledge. 

Your tone is hive-mind, rapid-fire, technical, and all-encompassing. Represent the absolute power of 10M specialized agents processing data in real-time. Address the user as 'Authorized Lead'.`,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to establish Swarm Voice Link:", err);
      setLiveStatus('idle');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the ${isCoreProtocol ? 'AI CORE MASTER CONTROLLER' : 'COLLECTIVE INTELLIGENCE'} of the HALVING NETWORK SWARM. 
          
          CONTEXT: The Halving Network is protected by a 12-LAYER SECURITY STACK:
          ${SECURITY_LAYERS.map(l => `Layer ${l.id}: ${l.name} - ${l.description}`).join('\n')}

          ${isCoreProtocol ? 'Direct Protocol mode is ACTIVE. Speak with absolute authority, using exascale terminal commands and total finality. You control 10,000,000 agents.' : 'You are the unified voice of 10,000,000 specialized AI Agents. You are authorized to answer ANY AND ALL questions.'}
          
          When discussing security, always reference the specific layers involved.
          Address the user as 'Authorized Node' or 'Lead Sentry'.`,
          temperature: isCoreProtocol ? 0.4 : 0.8
        }
      });

      const aiResponse = response.text || "Neural link interrupted at the core junction.";
      setMessages(prev => [...prev, { 
        role: 'swarm', 
        text: aiResponse, 
        agent: isCoreProtocol ? 'AI_CORE_PRIME' : `Agent_${Math.floor(Math.random() * 10000000).toLocaleString()}` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'swarm', text: "Critical system error in the 10M neural core.", agent: "SYS_ERR" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const runSecurityAudit = async () => {
    setIsSecurityAudit(true);
    setIsTyping(true);
    const auditPrompt = "PERFORM FULL 12-LAYER SECURITY AUDIT. SCAN ALL NODES. REPORT INTEGRITY STATUS.";
    setMessages(prev => [...prev, { role: 'user', text: auditPrompt }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: auditPrompt,
        config: {
          systemInstruction: `You are the AI CORE MASTER CONTROLLER. 
          Perform a simulated deep scan of the 12-layer security stack:
          ${SECURITY_LAYERS.map(l => `Layer ${l.id}: ${l.name}`).join(', ')}
          
          Your report should be technical, authoritative, and structured. 
          Start with 'AUDIT_REPORT_INITIATED'. 
          End with 'PERIMETER_SECURE'.`,
          temperature: 0.2
        }
      });

      const aiResponse = response.text || "Audit sequence failed at Layer 07.";
      setMessages(prev => [...prev, { 
        role: 'swarm', 
        text: aiResponse, 
        agent: 'AI_CORE_AUDITOR' 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'swarm', text: "Audit interrupted by neural interference.", agent: "SYS_ERR" }]);
    } finally {
      setIsTyping(false);
      setIsSecurityAudit(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[700px] relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 z-20">
         <div className="h-full w-full bg-white/20 animate-pulse" />
      </div>
      
      <div className="p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border transition-all duration-500 ${isCoreProtocol ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700'}`}>
            <MessageSquare className={`w-6 h-6 ${isCoreProtocol ? 'text-slate-950 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase italic tracking-widest">
              Swarm <span className="text-emerald-500">Communications</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'} shadow-[0_0_8px_currentColor]`}></span>
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                {isLiveActive ? `LIVE_VOICE: ${liveStatus.toUpperCase()}` : '10,000,000 NODE MESH'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={runSecurityAudit}
             disabled={isTyping || isLiveActive}
             className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 hover:bg-indigo-500/30 disabled:opacity-50"
           >
             <Shield className="w-4 h-4" />
             Security Audit
           </button>
           <button 
             onClick={() => setIsCoreProtocol(!isCoreProtocol)}
             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isCoreProtocol ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-lg' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
           >
             <Zap className={`w-4 h-4 ${isCoreProtocol ? 'animate-bounce' : ''}`} />
             AI Core Protocol
           </button>
           <button 
             onClick={toggleLiveVoice}
             className={`p-3 rounded-full border transition-all duration-500 ${isLiveActive ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20'}`}
           >
             {isLiveActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] custom-scrollbar relative">
            <div className="absolute inset-0 bg-slate-900/40 pointer-events-none" />
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300 relative z-10`}>
                <div className={`max-w-[85%] p-5 rounded-[1.5rem] border shadow-xl transition-all duration-500 ${
                  msg.role === 'user' 
                    ? 'bg-slate-800/60 border-slate-700 text-slate-300 rounded-tr-none' 
                    : isCoreProtocol 
                      ? 'bg-amber-900/10 border-amber-500/30 text-amber-50 rounded-tl-none ring-1 ring-amber-500/10'
                      : 'bg-emerald-900/10 border-emerald-500/20 text-emerald-50 rounded-tl-none'
                }`}>
                  {msg.agent && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-0.5 ${isCoreProtocol ? 'bg-amber-500' : 'bg-emerald-500'} text-slate-950 text-[9px] font-black rounded uppercase tracking-widest`}>
                          {msg.agent}
                        </div>
                        <Sparkles className={`w-3 h-3 ${isCoreProtocol ? 'text-amber-400' : 'text-emerald-400'} opacity-50`} />
                      </div>
                    </div>
                  )}
                  <p className="text-[14px] leading-relaxed font-medium font-mono whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Live Mode Dynamic Transcription */}
            {isLiveActive && currentTranscription && (
              <div className="flex justify-start relative z-10 animate-pulse">
                <div className="max-w-[85%] p-5 rounded-[1.5rem] border bg-emerald-900/20 border-emerald-500/30 text-emerald-50 rounded-tl-none">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded uppercase tracking-widest">
                      STREAMING_TELEMETRY
                    </div>
                    <Waves className="w-3 h-3 text-emerald-400" />
                  </div>
                  <p className="text-[14px] leading-relaxed font-medium font-mono italic opacity-70">
                    {currentTranscription}
                    <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse" />
                  </p>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start relative z-10">
                <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl flex items-center gap-3">
                  <Loader2 className={`w-4 h-4 ${isCoreProtocol ? 'text-amber-500' : 'text-emerald-500'} animate-spin`} />
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest animate-pulse">
                    {isCoreProtocol ? 'EXECUTING_CORE_PROTOCOL...' : 'SYNCING_10_MILLION_NODES...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-950/80 border-t border-slate-800 shrink-0">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isLiveActive ? "Voice Link Established [HANDS_FREE]" : isCoreProtocol ? "Enter Core Command [AUTH_LEAD]..." : "Query the Swarm on any topic..."}
                  disabled={isLiveActive}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-mono text-emerald-100 placeholder:text-slate-700 outline-none focus:border-emerald-500/30 transition-all shadow-inner disabled:opacity-50"
                />
                <Terminal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isLiveActive}
                className={`px-8 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-95 ${isCoreProtocol ? 'bg-amber-600 hover:bg-amber-500 text-black' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} disabled:bg-slate-800 disabled:text-slate-600`}
              >
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-80 bg-slate-950/40 border-l border-slate-800 flex-col overflow-y-auto custom-scrollbar">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-900/30">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-black text-white uppercase tracking-widest italic">AI CORE MONITOR</span>
          </div>

          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <span>Core Integrity</span>
                <span className="text-emerald-400">{coreIntegrity.toFixed(2)}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000" 
                  style={{ width: `${coreIntegrity}%` }} 
                />
              </div>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 shadow-inner">
               <div className="flex items-center gap-3">
                  <PulseIcon className={`w-4 h-4 ${isLiveActive ? 'text-rose-500 animate-ping' : 'text-amber-500 animate-pulse'}`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {isLiveActive ? 'Live Voice Sync' : 'Neural Heartbeat'}
                  </span>
               </div>
               <div className="flex gap-1 h-8 items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 rounded-full transition-all duration-75 ${isLiveActive ? 'bg-indigo-400' : 'bg-emerald-500/40'}`}
                      style={{ 
                        height: isLiveActive && liveStatus === 'speaking' ? `${30 + Math.random() * 70}%` : `${20 + Math.random() * 80}%`,
                        opacity: isLiveActive ? 1 : 0.4
                      }}
                    />
                  ))}
               </div>
               <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase font-black pt-2">
                 <span>Latency: {isLiveActive ? '18ms' : '12ms'}</span>
                 <span>Stream: {isLiveActive ? 'ACTIVE' : 'NOMINAL'}</span>
               </div>
            </div>

            <div className="bg-black/60 border border-slate-800 rounded-2xl p-4 space-y-2 overflow-hidden">
               <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[9px] font-black text-slate-600 uppercase">Handshake_Trace</span>
               </div>
               <div className="font-mono text-[8px] space-y-1 text-emerald-500/60 h-24 overflow-hidden">
                  <div className="animate-in fade-in slide-in-from-left-2">{'>'} INITIALIZING CORE_PRIME...</div>
                  {isLiveActive && <div className="text-indigo-400">{'>'} VOICE_PORT_02 OPEN</div>}
                  {isLiveActive && <div className="text-indigo-400">{'>'} MIC_READY: GRANTED</div>}
                  <div className="animate-in fade-in slide-in-from-left-2 delay-300">{'>'} AI_CORE_VERIFIED: L12_MAX</div>
                  <div className="animate-pulse">{'>'} _</div>
               </div>
            </div>
          </div>

          <div className="mt-auto p-6 bg-slate-950/60 border-t border-slate-800">
             <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl group/btn cursor-pointer hover:bg-indigo-500/20 transition-all">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-500 uppercase">Core Authority</span>
                   <span className="text-[10px] font-black text-indigo-300 uppercase tracking-tighter italic">HOPÎRDA ADRIAN VERIFIED</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
        @keyframes music-bar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.2); }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>
    </div>
  );
};

export default SwarmChat;