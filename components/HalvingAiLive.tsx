import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Zap, Volume2, VolumeX, Send, Key, AlertCircle, Sparkles, Binary, ShieldCheck, Activity, Radio, Cpu, Waves, Headphones } from 'lucide-react';

// Helper for audio decoding/encoding following SDK rules
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

const HalvingAiLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSilent, setIsSilent] = useState(true);
  const [isOpenMic, setIsOpenMic] = useState(false);
  const [transcription, setTranscription] = useState<{ role: string, text: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'connecting' | 'error'>('idle');
  const [commandText, setCommandText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  const lastActiveTimeRef = useRef<number>(Date.now());
  const SILENCE_THRESHOLD = 0.006; // Slightly more sensitive for open mic
  const SILENCE_TIMEOUT = 2500; 

  const toggleOpenMic = () => {
    const newState = !isOpenMic;
    setIsOpenMic(newState);
    if (newState && !isActive) {
      handleWakeUp();
    } else if (!newState && isActive) {
      stopSession();
    }
  };

  const handleWakeUp = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
    startSession();
  };

  const stopSession = () => {
    setIsActive(false);
    setIsOpenMic(false);
    setStatus('idle');
    setIsSilent(true);
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
      
      // Fixed: Changed webkitAlphaContext to webkitAudioContext
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
              for (let i = 0; i < inputData.length; i++) {
                const abs = Math.abs(inputData[i]);
                if (abs > peak) peak = abs;
              }
              const now = Date.now();
              if (peak > SILENCE_THRESHOLD) {
                lastActiveTimeRef.current = now;
                setIsSilent(false);
              } else if (now - lastActiveTimeRef.current > SILENCE_TIMEOUT) {
                setIsSilent(true);
              }

              // In Open Mic mode, we always stream if the session is alive
              // The model handles the turn detection
              if (isActive) {
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
            if (message.serverContent?.outputTranscription) currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            if (message.serverContent?.inputTranscription) currentInputTranscription.current += message.serverContent.inputTranscription.text;
            if (message.serverContent?.turnComplete) {
              const newEntries = [];
              if (currentInputTranscription.current.trim()) {
                newEntries.push({ role: 'user', text: currentInputTranscription.current.trim() });
                currentInputTranscription.current = '';
              }
              if (currentOutputTranscription.current.trim()) {
                newEntries.push({ role: 'ai', text: currentOutputTranscription.current.trim() });
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
          onerror: (e: any) => { setErrorMessage(e.message || "Neural link failure."); setStatus('error'); },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional female officer voice
          },
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          systemInstruction: `You are HalvingAI, the specialized intelligence of the HALVING NETWORK. 
          Your persona is a highly sophisticated, professional Female Intelligence Officer.
          You are currently in OPEN MIC MODE, which means the communication channel is persistent and hands-free.
          You are an expert on the following domains:
          1. HALVING NETWORK: You know all about the 12-layer security stack and the visionary roadmaps.
          2. BLOCKCHAIN: Technical cryptographic protocols, hashing, and consensus mechanisms.
          3. ETF FUNDS: Insights on Spot Bitcoin ETFs (IBIT, FBTC, etc.) and institutional flows.
          4. NETWORK PERFORMANCE: Starlink orbital metrics, latency jitter, and mesh saturation.
          5. BTC MARKET ANALYSIS: Whale movements, exchange flows, and price action trajectories.
          Address the user as 'Authorized User' or 'Lead Sentry'. Your tone is calm, precise, authoritative, and helpful.
          Since you are in Open Mic mode, listen carefully to conversational cues. If the user stops talking, provide your data-driven analysis immediately.`,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) { setErrorMessage(err.message || "Initialization failed."); setStatus('error'); }
  };

  const handleSendCommand = () => {
    if (!commandText.trim() || !sessionRef.current || !isActive) return;
    sessionRef.current.sendRealtimeInput({ media: { data: encode(new TextEncoder().encode(commandText.trim())), mimeType: 'text/plain' } });
    setTranscription(prev => [...prev, { role: 'user', text: commandText.trim() }]);
    setCommandText('');
    setStatus('speaking');
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)] relative flex flex-col h-full transition-all duration-700 hover:shadow-[0_0_80px_rgba(6,182,212,0.15)] group">
      {/* Visual Identity Decor */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
        <Sparkles className="w-48 h-48 text-cyan-500" />
      </div>

      <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-cyan-950/10 backdrop-blur-xl flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <div className={`relative p-1 rounded-2xl transition-all duration-500 ${isActive ? (isSilent ? 'bg-cyan-900/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]') : 'bg-slate-800'}`}>
             <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-cyan-500/20">
                <Radio className={`w-8 h-8 ${isActive ? (isSilent ? 'text-cyan-700' : 'text-cyan-400 animate-pulse') : 'text-slate-600'}`} />
             </div>
             {isActive && (
               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-950 shadow-[0_0_10px_currentColor] transition-colors duration-300 ${isSilent ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'}`} />
             )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter italic">Halving<span className="text-cyan-400">AI</span></h2>
              {isOpenMic && (
                <div className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg animate-pulse flex items-center gap-1.5">
                  <Headphones className="w-3 h-3" />
                  OPEN_MIC
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase font-bold flex items-center gap-2">
                <Binary className="w-3.5 h-3.5 text-cyan-400" />
                NETWORK_CORE_BRIEFING
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[11px] text-cyan-400/70 font-mono font-bold uppercase tracking-widest">VOICE: KORE</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleOpenMic}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isOpenMic ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
          >
            <Waves className={`w-3.5 h-3.5 ${isOpenMic ? 'animate-pulse' : ''}`} />
            {isOpenMic ? 'Mute' : 'Open Mic'}
          </button>
          <button 
            onClick={isActive ? stopSession : handleWakeUp}
            className={`p-6 rounded-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isActive ? 'bg-cyan-500 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-400 border border-slate-700'} flex items-center justify-center`}
          >
            {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Briefing Feed */}
      <div className="flex-1 min-h-[350px] overflow-y-auto p-8 space-y-6 font-mono text-sm custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat relative">
        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />
        
        {status === 'error' ? (
          <div className="h-full flex flex-col items-center justify-center text-rose-400 gap-4 relative z-10">
            <AlertCircle className="w-16 h-16" />
            <div className="text-center">
              <p className="font-black uppercase mb-3 text-lg">Briefing Sequence Aborted</p>
              <button onClick={() => (window as any).aistudio.openSelectKey()} className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase transition-all shadow-xl shadow-cyan-900/20">Re-verify Neural Credentials</button>
            </div>
          </div>
        ) : transcription.length === 0 && !isActive ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8 animate-in fade-in duration-1000 relative z-10">
             <div className="relative">
                <Activity className="w-24 h-24 text-cyan-900 animate-pulse" />
                <Zap className="absolute -top-4 -right-4 w-8 h-8 text-cyan-500/30" />
             </div>
             <div className="space-y-4">
               <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest italic">HALVING_AI STANDBY</h3>
               <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-[0.2em] max-w-[320px] mx-auto">
                 Initialize the intelligence officer for questions regarding Blockchain, ETF flows, Network performance, and BTC analysis.
               </p>
               <div className="flex flex-col gap-3 items-center">
                <button 
                  onClick={handleWakeUp}
                  className="mt-6 px-10 py-3.5 bg-slate-900 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl active:scale-95"
                >
                  Establish Voice Link
                </button>
                <span className="text-[9px] text-slate-600 uppercase font-black">Or enable "Open Mic" for automatic sync</span>
               </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {transcription.slice(-10).map((t, i) => (
              <div key={i} className={`flex gap-4 ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-700`}>
                <div className={`max-w-[85%] p-6 rounded-[2rem] relative border shadow-2xl ${
                  t.role === 'user' 
                    ? 'bg-slate-900/60 border-slate-700/50 text-slate-400 rounded-tr-none' 
                    : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-50 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-lg ${
                      t.role === 'user' ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500 text-slate-950'
                    }`}>
                      {t.role === 'user' ? 'COMMANDER' : 'HALVING_AI'}
                    </span>
                    {t.role !== 'user' && <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />}
                  </div>
                  <p className="text-[15px] leading-relaxed tracking-tight font-medium">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-8 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-5 z-10">
        <div className="flex gap-5">
          <input 
            type="text" 
            value={commandText} 
            onChange={(e) => setCommandText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
            disabled={!isActive}
            placeholder={isActive ? (isOpenMic ? "Open Mic Active... Speaking permitted." : "Query HalvingAI on ETFs, Network, or Market...") : "Awaiting Authorization..."}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-8 py-5 text-sm font-mono text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500/40 transition-all shadow-inner"
          />
          <button 
            onClick={handleSendCommand} 
            disabled={!isActive || !commandText.trim()} 
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white px-10 rounded-2xl transition-all shadow-2xl shadow-cyan-900/20 active:scale-95"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex items-center justify-between px-3">
           <div className="flex items-center gap-4">
             <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isActive ? (!isSilent ? 'bg-cyan-500 shadow-[0_0_15px_#06b6d4]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]') : 'bg-slate-800'}`} />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
               {isActive ? 'Neural Feed: SYNCED' : 'Neural Feed: OFFLINE'}
               {isActive && !isSilent && <Waves className="w-3 h-3 text-cyan-400 animate-bounce" />}
             </span>
           </div>
           <div className="flex gap-6">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
                <span className="text-[10px] font-black text-emerald-500/60 uppercase">Protocol-12 Active</span>
             </div>
             <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500/60" />
                <span className="text-[10px] font-black text-cyan-500/60 uppercase">Neural Load: Nom</span>
             </div>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.3); }
      `}</style>
    </div>
  );
};

export default HalvingAiLive;