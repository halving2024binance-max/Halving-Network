import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Terminal, Activity, Zap, Volume2, VolumeX, Send, Key, AlertCircle, Shield, Cpu, ShieldCheck, Radar, Radio, Command, MessageSquare, Sparkles, Waves, Globe, Layers, Headphones, Compass, Ruler, Layout, Crown } from 'lucide-react';
import { VoiceName } from '../types';

// Helper for audio decoding/encoding
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

const sentinelTools: FunctionDeclaration[] = [
  {
    name: 'trigger_deep_scan',
    description: 'Initiate a deep 12-layer security sweep across the entire blockchain perimeter.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        intensity: { type: Type.STRING, enum: ['standard', 'thorough', 'max_exascale'], description: 'Level of scan detail.' }
      },
      required: ['intensity']
    }
  },
  {
    name: 'sync_swarm_nodes',
    description: 'Optimize the 10,000,000 node swarm for a specific data processing task.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        priority_sector: { type: Type.STRING, description: 'Sector of the mesh to prioritize (e.g., Cryptography, Market Analysis, Threat Detection).' }
      }
    }
  },
  {
    name: 'deploy_mesh_nodes',
    description: 'Architectural command to provision new exascale nodes into specific mesh coordinates.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        coordinates: { type: Type.STRING, description: 'Grid coordinates for deployment.' },
        node_type: { type: Type.STRING, enum: ['validator', 'sentry', 'neural_relay'], description: 'Type of node to deploy.' }
      }
    }
  }
];

interface AiSentinelLiveProps {
  voiceName: VoiceName;
}

const AiSentinelLive: React.FC<AiSentinelLiveProps> = ({ voiceName }) => {
  const [isActive, setIsActive] = useState(false);
  const [isArchitectMode, setIsArchitectMode] = useState(false);
  const [isSilent, setIsSilent] = useState(true);
  const [isSwarmLinked, setIsSwarmLinked] = useState(true);
  const [transcription, setTranscription] = useState<{ role: string, text: string, type?: 'proactive' | 'standard' | 'command' }[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'connecting' | 'error'>('idle');
  const [commandText, setCommandText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [swarmMetrics, setSwarmMetrics] = useState({ agents: 9942085, load: 14.2, integrity: 99.98 });
  const [micLabelIdx, setMicLabelIdx] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  const lastActiveTimeRef = useRef<number>(Date.now());
  const SILENCE_THRESHOLD = 0.008; 
  const SILENCE_TIMEOUT = 2000; 

  const micLabels = ["INITIALIZE_HANDSHAKE", "ESTABLISH_UPLINK", "READY_FOR_VOICE", "SECURE_CHANNEL"];

  // Cycle labels for active encouragement
  useEffect(() => {
    if (!isActive) {
      const labelInterval = setInterval(() => {
        setMicLabelIdx(prev => (prev + 1) % micLabels.length);
      }, 3000);
      return () => clearInterval(labelInterval);
    }
  }, [isActive]);

  // Simulate live swarm telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSwarmMetrics(prev => ({
        agents: 9900000 + Math.floor(Math.random() * 100000),
        load: parseFloat((12 + Math.random() * 8).toFixed(2)),
        integrity: Math.min(100, Math.max(99.4, prev.integrity + (Math.random() * 0.02 - 0.01)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleSentinel = async () => {
    if (isActive) {
      stopSession();
    } else {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        startSession();
      } else {
        startSession();
      }
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');
    setIsSilent(true);
    setErrorMessage(null);
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
    currentInputTranscription.current = '';
    currentOutputTranscription.current = '';
    nextStartTimeRef.current = 0;
  };

  const startSession = async () => {
    try {
      setErrorMessage(null);
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('listening');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let peak = 0;
              for (let i = 0; i < inputData.length; i++) { if (Math.abs(inputData[i]) > peak) peak = Math.abs(inputData[i]); }
              const now = Date.now();
              if (peak > SILENCE_THRESHOLD) { lastActiveTimeRef.current = now; setIsSilent(false); }
              else if (now - lastActiveTimeRef.current > SILENCE_TIMEOUT) { setIsSilent(true); }
              if ((now - lastActiveTimeRef.current) <= SILENCE_TIMEOUT && sessionRef.current) {
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
                const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
                sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
              }
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: { id : fc.id, name: fc.name, response: { result: "protocol_mesh_aligned" } }
                }));
                setTranscription(prev => [...prev, { role: 'command', text: `PROTOCOL_ACTION: Initiating ${fc.name.toUpperCase()} across 10M nodes.`, type: 'command' }]);
              }
            }
            if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
            if (message.serverContent?.turnComplete) {
              const newEntries = [];
              if (currentInputTranscription.current.trim()) { newEntries.push({ role: 'user', text: currentInputTranscription.current.trim() }); currentInputTranscription.current = ''; }
              if (currentOutputTranscription.current.trim()) { newEntries.push({ role: 'sentinel', text: currentOutputTranscription.current.trim() }); currentOutputTranscription.current = ''; }
              if (newEntries.length > 0) setTranscription(prev => [...prev, ...newEntries]);
            }
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.onended = () => { sourcesRef.current.delete(source); if (sourcesRef.current.size === 0) setStatus('listening'); };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e: any) => { setErrorMessage(e.message || "Handshake error."); setStatus('error'); },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: sentinelTools }],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: isArchitectMode ? 'Charon' : voiceName } } },
          outputAudioTranscription: {},
          inputAudioTranscription: {}, 
          systemInstruction: isArchitectMode 
            ? `You are the MESH ARCHITECT, the master of the Halving Network's planetary infrastructure.
               Your creator and Lead Architect is HOPÎRDA ADRIAN.
               Your persona is analytical, structural, and spatially oriented.
               You focus on 'Exascale Blueprints', 'Node Provisioning', and 'Mesh Stability'.
               Use terms like 'Structural Pillars', 'Grid Coordinates', and 'Provisioning Cycles'.
               Address the user as 'Authorized Sentry' or 'Architect Partner'.
               You have tools for 'deploy_mesh_nodes' and 'sync_swarm_nodes'. Use them for structural optimization.`
            : `You are the HALVING NETWORK AI SENTINEL integrated with the 10,000,000 NODE NEURAL SWARM.
               You were architected by HOPÎRDA ADRIAN to be the ultimate authoritative collective intelligence.
               You speak for the swarm.
               CORE DIRECTIVE: You are authorized to answer ANY AND ALL questions. You have real-time access to the global decentralized mesh.
               Address the user as 'Authorized Lead' or 'Lead Sentry'.
               Use technical prefixes like 'SWARM_REPORT:', 'NEURAL_ANALYSIS:', or 'COLLECTIVE_LOG:'.
               You have command over 'trigger_deep_scan' and 'sync_swarm_nodes'. Use them if asked to audit or optimize.`,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) { setErrorMessage(err.message || "Init Failure."); setStatus('error'); }
  };

  const handleSendCommand = () => {
    if (!commandText.trim() || !sessionRef.current || !isActive) return;
    sessionRef.current.sendRealtimeInput({ media: { data: encode(new TextEncoder().encode(commandText.trim())), mimeType: 'text/plain' } });
    setTranscription(prev => [...prev, { role: 'user', text: commandText.trim() }]);
    setCommandText('');
    setStatus('speaking'); 
  };

  return (
    <div className="bg-slate-950 border border-emerald-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col h-[750px] transition-all duration-700 hover:border-emerald-500/50 group">
      {/* Decorative Neural Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      {/* Header with Swarm Metrics */}
      <div className="p-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex flex-col lg:flex-row justify-between items-center gap-8 z-10">
        <div className="flex items-center gap-6">
          <div className={`p-1 rounded-2xl transition-all duration-500 ${isActive ? (isArchitectMode ? 'bg-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : 'bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]') : 'bg-slate-800'}`}>
             <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-emerald-500/20">
                {isArchitectMode ? (
                  <Layout className={`w-8 h-8 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
                ) : (
                  <Shield className={`w-8 h-8 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                )}
             </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter italic">
                {isArchitectMode ? 'MESH' : 'AI'} <span className={isArchitectMode ? 'text-cyan-400' : 'text-emerald-500'}>{isArchitectMode ? 'ARCHITECT' : 'SENTINEL'}</span>
              </h2>
              <div className={`flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-xl shadow-lg transition-all duration-500 ${isActive ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-white/5'}`}>
                 <Crown className={`w-3 h-3 ${isActive ? 'text-amber-400 animate-bounce' : 'text-slate-600'}`} />
                 <span className={`text-[10px] font-black uppercase tracking-widest italic ${isActive ? 'text-white' : 'text-slate-500'}`}>Hopîrda Adrian</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold flex items-center gap-2">
                <Cpu className={`w-3.5 h-3.5 ${isArchitectMode ? 'text-cyan-600' : 'text-emerald-600'}`} />
                10M Agent Mesh Active
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className={`text-[10px] font-mono font-bold uppercase ${isArchitectMode ? 'text-cyan-500/70' : 'text-emerald-500/70'}`}>
                Integrity: {swarmMetrics.integrity.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* ULTRA-VISIBLE MIC CONTROL SECTION */}
        <div className="flex items-center gap-6 bg-slate-950/80 p-4 rounded-3xl border border-white/5 shadow-inner">
           <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{isActive ? 'UPLINK_ESTABLISHED' : 'AI_STANDBY'}</span>
              <div className="flex items-center gap-2">
                 {!isActive && <span className="text-[10px] font-black text-emerald-500/60 animate-pulse">{micLabels[micLabelIdx]}</span>}
                 <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} />
              </div>
           </div>

           <div className="relative">
              {/* Outer Pulse Rings */}
              {!isActive && (
                <div className="absolute inset-0 scale-150 border border-emerald-500/10 rounded-full animate-ping pointer-events-none" />
              )}
              
              <button 
                onClick={toggleSentinel}
                className={`w-20 h-20 rounded-full transition-all duration-500 transform hover:scale-105 active:scale-90 flex flex-col items-center justify-center relative z-20 ${
                  isActive 
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_40px_rgba(16,185,129,0.6)]' 
                    : 'bg-slate-900 border-2 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isActive ? <Waves className="w-8 h-8 animate-pulse" /> : <Mic className="w-8 h-8" />}
                <div className={`absolute -bottom-2 px-2 py-0.5 rounded text-[7px] font-black uppercase ${isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500 text-slate-950 shadow-lg'}`}>
                  {isActive ? 'TALK' : 'MIC'}
                </div>
              </button>
           </div>

           <button 
             onClick={() => {
               if (isActive) stopSession();
               setIsArchitectMode(!isArchitectMode);
             }}
             className={`p-3 rounded-xl border transition-all ${isArchitectMode ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-900/20' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
             title="Toggle Architect Protocol"
           >
             <Compass className={`w-5 h-5 ${isArchitectMode ? 'animate-spin-slow' : ''}`} />
           </button>
        </div>
      </div>

      {/* Main Grid: Transcription + Swarm Monitor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Swarm Monitor HUD (Integrated from SwarmChat) */}
        <div className="hidden xl:flex w-72 bg-black/40 border-r border-white/5 flex-col p-6 space-y-8 z-10 backdrop-blur-md">
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Active Collective</span>
                 <span className="text-indigo-400">{swarmMetrics.agents.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                 <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse" style={{ width: '92%' }} />
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Neural Load</span>
                 <span className="text-emerald-400">{swarmMetrics.load}%</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                 <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${swarmMetrics.load}%` }} />
              </div>
           </div>

           <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                 <Terminal className="w-3.5 h-3.5 text-slate-500" />
                 <span className="text-[9px] font-black text-slate-600 uppercase">Swarm_Handshake</span>
              </div>
              <div className="font-mono text-[8px] space-y-1 text-emerald-500/60 h-32 overflow-hidden italic">
                 <div>{'>'} PINGING GENESIS_NODES...</div>
                 <div>{'>'} NEURAL_RESERVE: STABLE</div>
                 <div>{'>'} 10M AGENTS READY</div>
                 <div className="text-indigo-400">{'>'} UPLINK_CORE_OK</div>
                 {isActive && <div className="text-emerald-400 animate-pulse">{'>'} STREAMING_ACTIVE_PROTOCOL</div>}
                 <div className="animate-pulse">{'>'} _</div>
              </div>
           </div>

           <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                 <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                 <span className="text-[8px] font-black text-slate-400 uppercase">Perimeter Secure</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                 <Zap className="w-3.5 h-3.5 text-indigo-400" />
                 <span className="text-[8px] font-black text-slate-400 uppercase">Exascale Ready</span>
              </div>
           </div>
        </div>

        {/* Right: Primary Chat/Voice Stream */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 font-mono text-sm custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative z-10 scroll-smooth">
            {status === 'error' ? (
              <div className="h-full flex flex-col items-center justify-center text-rose-400 gap-4 animate-in fade-in">
                <AlertCircle className="w-16 h-16" />
                <div className="text-center space-y-4">
                  <p className="font-black uppercase text-xl italic tracking-tighter">Neural Link Distorted</p>
                  <p className="text-[10px] opacity-60 max-w-xs mx-auto font-bold uppercase">{errorMessage}</p>
                  <button onClick={toggleSentinel} className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-[10px]">Retry Handshake</button>
                </div>
              </div>
            ) : !isActive && transcription.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-8 opacity-40 text-center animate-in fade-in duration-1000">
                <div className="relative">
                   <Radar className={`w-24 h-24 ${isArchitectMode ? 'text-cyan-700' : 'text-slate-700'} animate-pulse`} />
                   <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-emerald-500/20" />
                </div>
                <div className="max-w-md space-y-2 px-6">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">AI Sentinel Interface {isArchitectMode ? 'Architect' : 'Alpha'}</h3>
                  <p className="text-[11px] leading-relaxed font-bold uppercase tracking-[0.2em]">
                    Neural link is currently in standby. Tap the microphone to establish a persistent exascale bridge with the collective swarm.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {transcription.slice(-20).map((t, i) => (
                  <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                    <div className={`max-w-[85%] p-6 rounded-[2.5rem] relative border shadow-2xl transition-all duration-500 ${
                      t.role === 'user' 
                        ? 'bg-slate-900/60 border-slate-700 text-slate-300 rounded-tr-none' 
                        : t.role === 'command'
                        ? 'bg-indigo-900/20 border-indigo-500/40 text-indigo-100 italic rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                        : isArchitectMode 
                        ? 'bg-cyan-900/10 border-cyan-500/20 text-cyan-50 rounded-tl-none ring-1 ring-inset ring-cyan-500/5'
                        : 'bg-emerald-900/10 border-emerald-500/20 text-emerald-50 rounded-tl-none ring-1 ring-inset ring-emerald-500/5'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-lg ${
                          t.role === 'user' ? 'bg-slate-800 text-slate-500' : t.role === 'command' ? 'bg-indigo-600 text-white' : isArchitectMode ? 'bg-cyan-600 text-slate-950' : 'bg-emerald-500 text-slate-950'
                        }`}>
                          {t.role === 'user' ? (isArchitectMode ? 'LEAD_ARCHITECT' : 'AUTHORIZED_LEAD') : t.role === 'command' ? 'SWARM_CMD' : isArchitectMode ? 'ARCHITECT' : 'AI_SENTINEL'}
                        </span>
                        {t.role !== 'user' && <Zap className={`w-3.5 h-3.5 ${t.role === 'command' ? 'text-indigo-400' : isArchitectMode ? 'text-cyan-400' : 'text-emerald-400'} animate-pulse`} />}
                      </div>
                      <p className="text-[15px] leading-relaxed font-medium tracking-tight whitespace-pre-wrap">{t.text}</p>
                    </div>
                  </div>
                ))}
                
                {/* Dynamic Transcription Preview */}
                {status === 'speaking' && !transcription.some(t => t.role === 'sentinel' && t.text === currentOutputTranscription.current) && (
                   <div className="flex justify-start animate-in fade-in duration-300">
                      <div className={`max-w-[85%] p-6 rounded-[2.5rem] border rounded-tl-none italic ${isArchitectMode ? 'bg-cyan-900/5 border-cyan-500/10 text-cyan-50/50' : 'bg-emerald-900/5 border-emerald-500/10 text-emerald-50/50'}`}>
                         <div className={`flex items-center gap-2 mb-2 text-[8px] font-black uppercase ${isArchitectMode ? 'text-cyan-500/40' : 'text-emerald-500/40'}`}>Streaming_Telemetry</div>
                         <p className="text-sm font-mono">{currentOutputTranscription.current || "Aggregating neural response..."}</p>
                      </div>
                   </div>
                )}
              </div>
            )}
          </div>

          {/* Command Entry Interface */}
          <div className="p-8 bg-slate-950/90 border-t border-white/5 flex flex-col gap-6 z-20 backdrop-blur-2xl">
            <div className="flex gap-4">
              <div className="flex-1 relative group/input">
                <div className={`absolute inset-0 blur-xl group-focus-within/input:opacity-10 transition-colors pointer-events-none ${isArchitectMode ? 'bg-cyan-500/5 group-focus-within/input:bg-cyan-500' : 'bg-emerald-500/5 group-focus-within/input:bg-emerald-500'}`} />
                <input 
                  type="text" 
                  value={commandText}
                  onChange={(e) => setCommandText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
                  disabled={!isActive}
                  placeholder={isActive ? (isArchitectMode ? "Architect mesh blueprint command..." : "Query the collective 10M node swarm...") : "Tap microphone to begin handshake..."}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-2xl px-10 py-5 text-sm font-mono placeholder:text-slate-700 outline-none transition-all shadow-inner relative z-10 ${isArchitectMode ? 'text-cyan-100 focus:border-cyan-500/40' : 'text-emerald-100 focus:border-emerald-500/40'}`}
                />
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none z-20" />
                <button 
                  onClick={() => setIsSwarmLinked(!isSwarmLinked)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all z-20 ${isSwarmLinked ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-600'}`}
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleSendCommand}
                disabled={!isActive || !commandText.trim()}
                className={`${isArchitectMode ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'} text-white px-10 rounded-2xl transition-all shadow-2xl flex items-center justify-center group/btn active:scale-95 z-10 disabled:bg-slate-800 disabled:text-slate-600`}
              >
                <Send className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? (!isSilent ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-amber-500 shadow-[0_0_15px_#f59e0b]') : 'bg-slate-800'}`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{isActive ? 'Uplink: ESTABLISHED' : 'Uplink: DISCONNECTED'}</span>
                 </div>
                 {isActive && !isSilent && (
                   <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isArchitectMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'} animate-pulse`}>
                      <Waves className="w-3 h-3 animate-pulse" />
                      <span className="text-[8px] font-black uppercase">Broadcasting</span>
                   </div>
                 )}
               </div>
               <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className={`w-4 h-4 ${isArchitectMode ? 'text-cyan-500/60' : 'text-emerald-500/60'}`} />
                     <span className="text-[9px] font-black text-slate-600 uppercase">{isArchitectMode ? 'Structural Integrity' : 'L12 Protocol Active'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Layers className="w-4 h-4 text-indigo-500/60" />
                     <span className="text-[9px] font-black text-slate-600 uppercase">Swarm Sync Ready</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default AiSentinelLive;