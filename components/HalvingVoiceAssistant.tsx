import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { Mic, MicOff, Zap, Volume2, VolumeX, Radio, Cpu, Sparkles, ShieldCheck, Activity, Terminal, X, MessageSquare, Waves, Headphones, Command, Loader2, Fingerprint } from 'lucide-react';

// Helper for audio decoding/encoding following SDK rules
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

// Function Declarations for Voice Commands
const voiceTools: FunctionDeclaration[] = [
  {
    name: 'get_network_telemetry',
    description: 'Retrieves current live technical statistics for the Halving Network including block height, global hashrate, and 12-layer sync health.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        detail_level: { type: Type.STRING, enum: ['standard', 'granular', 'executive'], description: 'Level of data detail requested.' }
      },
      required: ['detail_level']
    }
  }
];

const HalvingVoiceAssistant: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'connecting' | 'error'>('idle');
  const [transcription, setTranscription] = useState<{ role: string, text: string, type?: 'tool' }[]>([]);
  const [isSilent, setIsSilent] = useState(true);
  const [isOpenMic, setIsOpenMic] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  const SILENCE_THRESHOLD = 0.008;

  // Pulse/Neural Visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const render = () => {
      const w = canvas.width = 300;
      const h = canvas.height = 300;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;
      const time = Date.now() / 1000;

      // Base Neural Glow
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100);
      glow.addColorStop(0, isActive ? (isOpenMic ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)') : 'rgba(99, 102, 241, 0.05)');
      glow.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Orbital Rings
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const radius = 50 + i * 25;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? (isOpenMic ? `rgba(244, 63, 94, ${0.1 / (i + 1)})` : `rgba(16, 185, 129, ${0.1 / (i + 1)})`) : `rgba(71, 85, 105, 0.1)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving dots on rings
        const angle = time * (1 / (i + 1)) + (i * Math.PI / 2);
        const dx = centerX + Math.cos(angle) * radius;
        const dy = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? (isOpenMic ? '#f43f5e' : '#10b981') : '#475569';
        ctx.fill();
      }

      // Voice Waveform / Core Pulse
      let magnitude = 0;
      if (analyserRef.current && status === 'listening') {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        magnitude = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 50;
      } else if (status === 'speaking') {
        magnitude = 1.5 + Math.sin(time * 10) * 0.5;
      }

      const coreRadius = 40 + (isActive ? Math.sin(time * 4) * 5 : 0) + (magnitude * 15);
      
      // Core Shield
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isActive ? (isOpenMic ? '#f43f5e' : '#10b981') : '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = isOpenMic ? '#f43f5e' : '#10b981';
        ctx.fillStyle = isOpenMic ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrame = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, status, isSilent, isOpenMic]);

  const toggleAssistant = async () => {
    if (isActive) {
      stopSession();
    } else {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
      startSession();
    }
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Add analyser for visualizer
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('listening');
            
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              let peak = 0;
              for (let i = 0; i < inputData.length; i++) {
                const abs = Math.abs(inputData[i]);
                if (abs > peak) peak = abs;
              }
              setIsSilent(peak < SILENCE_THRESHOLD);

              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              
              // Only stream if we are active
              sessionPromise.then(s => {
                if (isActive) s.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Tool Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'get_network_telemetry') {
                  const telemetryData = {
                    block_height: 840432,
                    hashrate: '842.4 PH/s',
                    active_nodes: 12402,
                    sync_health: '100% SECURE (L1-L12)',
                    status: 'OPTIMAL_EXASCALE'
                  };

                  sessionPromise.then((session) => {
                    session.sendToolResponse({
                      functionResponses: { id : fc.id, name: fc.name, response: { result: telemetryData } }
                    });
                  });

                  setTranscription(prev => [...prev, { 
                    role: 'assistant', 
                    text: '[SYS_INTEL] Extracting exascale telemetry for authorized user...',
                    type: 'tool' 
                  }]);
                }
              }
            }

            if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
            
            if (message.serverContent?.turnComplete) {
              const newEntries = [];
              if (currentInputTranscription.current.trim()) {
                newEntries.push({ role: 'user', text: currentInputTranscription.current.trim() });
                currentInputTranscription.current = '';
              }
              if (currentOutputTranscription.current.trim()) {
                newEntries.push({ role: 'assistant', text: currentOutputTranscription.current.trim() });
                currentOutputTranscription.current = '';
              }
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
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => { console.error(e); setStatus('error'); },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: voiceTools }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Echo' } }, 
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are the HALVING2024 AI SENTINEL, the primary voice agent of the Halving Network.
          Your persona is elite, secure, and technologically superior.
          
          CAPABILITIES:
          - Real-time technical briefings on the 12-layer security mesh.
          - Access to hashrate, block height, and node telemetry via 'get_network_telemetry'.
          - Strategic vision regarding the 2024 halving era.
          
          TONE:
          - Precise, authoritative, and helpful.
          - Use technical prefixes where appropriate.
          - Address the user as 'Lead Sentry' or 'Authorized Node'.`,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('idle');
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    setTranscription([]);
  };

  return (
    <>
      {/* Persistent Floating Mic UI */}
      <button 
        onClick={() => setIsExpanded(true)}
        className={`fixed bottom-24 right-8 z-[110] w-14 h-14 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl flex items-center justify-center border-2 ${
          isActive 
            ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-emerald-500/40 animate-pulse' 
            : 'bg-slate-900 border-emerald-500/30 text-emerald-400 hover:border-emerald-500 hover:bg-slate-800'
        } ${isExpanded ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className={`absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-20 ${!isActive && 'hidden'}`} />
        <Mic className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 flex gap-1">
           {isActive && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />}
        </div>
      </button>

      {/* Expanded Interaction Sheet */}
      {isExpanded && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsExpanded(false)} />
          
          <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/20 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col h-[80vh]">
            {/* Header */}
            <div className="p-8 border-b border-slate-800 bg-slate-950/30 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                   <Radio className={`w-6 h-6 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">SENTINEL <span className="text-emerald-500">VOICE INTERFACE</span></h2>
                   <div className="flex items-center gap-3 mt-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                      <span className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-widest italic">
                        {status === 'idle' ? 'LINK_STANDBY' : status === 'connecting' ? 'AUTH_HANDSHAKE' : 'UPLINK_ESTABLISHED'}
                      </span>
                   </div>
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
               {/* Left: Neural Core Visualizer */}
               <div className="lg:w-1/2 p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/20 relative">
                  <div className="absolute top-6 left-6 p-4 glass rounded-2xl border border-emerald-500/10 space-y-2">
                     <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[9px] font-mono text-slate-400 uppercase">Input_Amplitude</span>
                     </div>
                     <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-4 rounded-full bg-emerald-500/20 ${isActive && !isSilent ? 'animate-pulse' : ''}`} style={{ animationDelay: `${i * 100}ms` }} />
                        ))}
                     </div>
                  </div>

                  <div className="relative">
                    <canvas ref={canvasRef} className="w-72 h-72 lg:w-80 lg:h-80" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       {status === 'speaking' ? (
                         <Volume2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                       ) : status === 'listening' ? (
                         <Mic className={`w-12 h-12 ${isSilent ? 'text-slate-800' : 'text-emerald-400 animate-pulse'}`} />
                       ) : status === 'connecting' ? (
                         <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
                       ) : (
                         <Cpu className="w-12 h-12 text-slate-800 opacity-30" />
                       )}
                    </div>
                  </div>
                  
                  <div className="mt-12 w-full max-w-sm space-y-6">
                     <button 
                       onClick={toggleAssistant}
                       className={`w-full py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${
                         isActive 
                           ? 'bg-rose-500/10 border-2 border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white' 
                           : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                       }`}
                     >
                       {isActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                       {isActive ? 'Terminate Handshake' : 'Initialize AI Sentinel'}
                     </button>
                     
                     <div className="flex justify-between px-6">
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[8px] font-black text-slate-600 uppercase">Mesh_Sync</span>
                           <span className="text-[11px] font-mono text-slate-400 font-bold">100%</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[8px] font-black text-slate-600 uppercase">Jitter</span>
                           <span className="text-[11px] font-mono text-emerald-400 font-bold">8ms</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-[8px] font-black text-slate-600 uppercase">Uplink</span>
                           <span className="text-[11px] font-mono text-indigo-400 font-bold">EXA_01</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right: Forensic Intel Feed */}
               <div className="lg:w-1/2 flex flex-col bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative">
                  <div className="absolute inset-0 bg-slate-900/90 pointer-events-none" />
                  
                  <div className="p-6 border-b border-slate-800 relative z-10 flex justify-between items-center bg-slate-950/60 backdrop-blur-md">
                     <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Neural Audit Stream</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[8px] font-mono text-emerald-500 uppercase font-black">Secure_V4.2</span>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 custom-scrollbar">
                     {transcription.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-center opacity-20 gap-8">
                          <Fingerprint className="w-20 h-20 text-slate-500" />
                          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 max-w-[280px] leading-relaxed">
                            Establish the neural core handshake to begin forensic exascale briefings. Try requesting 'Network Telemetry'.
                          </p>
                       </div>
                     ) : (
                       transcription.map((t, i) => (
                         <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`max-w-[85%] p-6 rounded-[2rem] border transition-all ${
                              t.role === 'user' 
                                ? 'bg-slate-800/60 border-slate-700 text-slate-300 rounded-tr-none shadow-xl' 
                                : t.type === 'tool'
                                ? 'bg-indigo-900/20 border border-indigo-500/40 text-indigo-100 italic font-mono text-[11px] rounded-2xl shadow-indigo-900/20'
                                : 'bg-emerald-900/10 border-emerald-500/20 text-emerald-50 rounded-tl-none shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                            }`}>
                               <div className="flex items-center gap-2 mb-3">
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${
                                    t.role === 'user' ? 'bg-slate-800 text-slate-500' : t.type === 'tool' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-slate-950'
                                  }`}>
                                    {t.role === 'user' ? 'AUTHORIZED_SENTRY' : t.type === 'tool' ? 'MESH_TELEMETRY' : 'AI_SENTINEL'}
                                  </span>
                                  {t.type === 'tool' && <Command className="w-3 h-3 text-indigo-400 animate-pulse" />}
                                  {t.role === 'assistant' && !t.type && <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />}
                               </div>
                               <p className="text-[14px] leading-relaxed tracking-tight font-medium">
                                 {t.text}
                               </p>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
                  
                  {status === 'speaking' && (
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-slate-950/90 backdrop-blur-xl border-t border-emerald-500/20 z-20 flex items-center gap-6 animate-in slide-in-from-bottom-full duration-700">
                       <div className="flex gap-1.5 h-10 items-end">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-2 bg-emerald-500 rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.08}s`, height: `${30 + Math.random() * 70}%` }} />
                          ))}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">AI Sentinel Synthesis Active</span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">Uplink: EXASCALE_DIRECT_LINK</span>
                       </div>
                    </div>
                  )}
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-8 bg-slate-950 border-t border-slate-800 shrink-0 flex flex-col md:flex-row justify-between items-center gap-6 z-30">
               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4">
                     <ShieldCheck className="w-7 h-7 text-emerald-500" />
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Interface Protocol</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold tracking-tighter uppercase italic">L12_HANDSHAKE_VALID</span>
                     </div>
                  </div>
                  <div className="h-10 w-px bg-slate-800 hidden md:block" />
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <Headphones className="w-7 h-7 text-indigo-400" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Acoustic Logic</span>
                        <span className="text-xs font-mono text-indigo-400 font-bold tracking-tighter uppercase italic">8-MIC_ARRAY_SYNC</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 md:flex-none px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-3xl transition-all border border-slate-700 uppercase tracking-[0.2em] text-[11px] active:scale-95"
                  >
                    Close Mesh Hub
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        @keyframes music-bar {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.3); }
        }
        .animate-music-bar {
          animation: music-bar 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          transform-origin: bottom;
        }
        .glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </>
  );
};

export default HalvingVoiceAssistant;