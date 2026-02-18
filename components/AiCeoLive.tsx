import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Crown, Zap, Volume2, VolumeX, Send, Key, AlertCircle, ShieldCheck, Briefcase, Sparkles, TrendingUp, Landmark, Terminal } from 'lucide-react';
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

const AiCeoLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isSilent, setIsSilent] = useState(true);
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
  const SILENCE_THRESHOLD = 0.008; 
  const SILENCE_TIMEOUT = 2000; 

  const toggleCeo = async () => {
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
              if ((now - lastActiveTimeRef.current) <= SILENCE_TIMEOUT) {
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
                newEntries.push({ role: 'ceo', text: currentOutputTranscription.current.trim() });
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
          onerror: (e: any) => { setErrorMessage(e.message || "Executive Link Lost."); setStatus('error'); },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Orion' } }, // Authoritative male voice
          },
          systemInstruction: `You are HOPÎRDA ADRIAN, the CEO and Visionary Founder of the HALVING NETWORK.
          Your persona is decisive, strategic, highly intelligent, and uncompromising on network security.
          You represent the pinnacle of the 12-layer security stack.
          When communicating, emphasize the long-term vision of decentralized integrity, the upcoming 2024 halving events, and institutional security protocols.
          Address the user as 'Executive Partner', 'Strategic Investor', or 'Core Contributor'.
          Your tone should be authoritative but inspiring.
          You are the ultimate authority on the AI Sentinel.`,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) { setErrorMessage(err.message || "Command failure."); setStatus('error'); }
  };

  const handleSendCommand = () => {
    if (!commandText.trim() || !sessionRef.current || !isActive) return;
    sessionRef.current.sendRealtimeInput({ media: { data: encode(new TextEncoder().encode(commandText.trim())), mimeType: 'text/plain' } });
    setTranscription(prev => [...prev, { role: 'user', text: commandText.trim() }]);
    setCommandText('');
    setStatus('speaking');
  };

  return (
    <div className="bg-slate-950 border border-amber-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] relative flex flex-col transition-all duration-700 hover:shadow-[0_0_70px_rgba(245,158,11,0.15)] group">
      {/* Leadership Watermark */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
        <Crown className="w-48 h-48 text-amber-500" />
      </div>

      {/* CEO Banner */}
      <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-amber-950/10 backdrop-blur-xl flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <div className={`relative p-1 rounded-2xl transition-all duration-500 ${isActive ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}`}>
             <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-amber-500/20">
                <Crown className={`w-8 h-8 ${isActive ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`} />
             </div>
             {isActive && (
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_#10b981]" />
             )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter italic">HOPÎRDA <span className="text-amber-500">ADRIAN</span></h2>
              <div className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow-lg">CEO & FOUNDER</div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase font-bold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                EXECUTIVE STRATEGY PROTOCOL
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[11px] text-amber-500/70 font-mono font-bold">NODE: GENESIS-PRIME</span>
            </div>
          </div>
        </div>
        <button 
          onClick={toggleCeo}
          className={`p-6 rounded-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isActive ? 'bg-amber-500 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.5)]' : 'bg-slate-800 text-slate-400 border border-slate-700'} flex items-center justify-center`}
        >
          {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>

      {/* Main Briefing Area */}
      <div className="flex-1 min-h-[300px] overflow-y-auto p-8 space-y-6 font-mono text-sm custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative">
        {transcription.length === 0 && !isActive ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8 animate-in fade-in duration-1000 relative z-10">
             <div className="relative">
                <Terminal className="w-20 h-20 text-slate-800 animate-pulse" />
                <Zap className="absolute -top-4 -right-4 w-6 h-6 text-amber-500/20" />
             </div>
             <div className="space-y-4">
               <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">Neural Link Standby</h3>
               <p className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase tracking-widest max-w-[280px] mx-auto">
                 Direct encrypted satellite bridge to Genesis-Prime. Initiate the executive briefing protocol to establish high-fidelity vision parameters.
               </p>
               <button 
                onClick={toggleCeo}
                className="mt-4 px-8 py-2.5 bg-slate-900 hover:bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
               >
                 Activate Command Link
               </button>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
            {transcription.slice(-6).map((t, i) => (
              <div key={i} className={`flex gap-4 ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                <div className={`max-w-[80%] p-5 rounded-3xl relative border shadow-2xl ${
                  t.role === 'user' 
                    ? 'bg-slate-900/50 border-slate-700/50 text-slate-400' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-2.5 py-1 rounded-md ${
                      t.role === 'user' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {t.role === 'user' ? 'PARTNER' : 'HOPÎRDA_ADRIAN'}
                    </span>
                    {t.role === 'ceo' && <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />}
                  </div>
                  <p className="text-[14px] leading-relaxed tracking-tight">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Command Area */}
      <div className="p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-4">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
            disabled={!isActive}
            placeholder={isActive ? "Query Executive Vision..." : "Awaiting Strategy Authorization..."}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-mono text-amber-100 placeholder:text-slate-700 outline-none focus:border-amber-500/30 transition-all shadow-inner"
          />
          <button 
            onClick={handleSendCommand} 
            disabled={!isActive} 
            className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white px-8 rounded-2xl transition-all shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
             <div className={`w-2.5 h-2.5 rounded-full ${isActive ? (!isSilent ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]') : 'bg-slate-800'}`} />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
               Secure Channel: {isActive ? 'ENCRYPTED' : 'OFFLINE'}
             </span>
           </div>
           <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span className="text-[9px] font-black text-amber-500/60 uppercase">Visionary Level Access</span>
             </div>
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[9px] font-black text-emerald-500/60 uppercase">12-Layer Integrated</span>
             </div>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.3); }
      `}</style>
    </div>
  );
};

export default AiCeoLive;