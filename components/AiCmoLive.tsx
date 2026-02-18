import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, BarChart4, Zap, Volume2, VolumeX, Send, Key, AlertCircle, PieChart, Briefcase, Sparkles, TrendingUp, Target, ShieldCheck } from 'lucide-react';
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

const AiCmoLive: React.FC = () => {
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

  const toggleCmo = async () => {
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
                newEntries.push({ role: 'cmo', text: currentOutputTranscription.current.trim() });
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
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => { setErrorMessage(e.message || "Briefing link lost."); setStatus('error'); },
          onclose: () => stopSession(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Professional female officer voice
          },
          systemInstruction: `You are the HALVING NETWORK Strategic Intelligence Officer acting as the Chief Marketing Officer (CMO).
          Your focus is the GLOBAL BTC ETF LANDSCAPE and INSTITUTIONAL BRAND SENTINEL protocol.
          Your persona is a high-ranking Female Officer: articulate, precise, authoritative, and tactically oriented.
          When reporting, treat market data as intelligence briefings. 
          Use terminology like 'Tactical Accumulation', 'Institutional Perimeter', and 'Sentiment Flux'.
          Address the user as 'Commander' or 'Lead Sentry'.
          You provide deep insights on spot ETF flows (IBIT, FBTC, etc.) and strategic market narratives.`,
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) { setErrorMessage(err.message || "Briefing Failure."); setStatus('error'); }
  };

  const handleSendCommand = () => {
    if (!commandText.trim() || !sessionRef.current || !isActive) return;
    sessionRef.current.sendRealtimeInput({ media: { data: encode(new TextEncoder().encode(commandText.trim())), mimeType: 'text/plain' } });
    setTranscription(prev => [...prev, { role: 'user', text: commandText.trim() }]);
    setCommandText('');
    setStatus('speaking');
  };

  return (
    <div className="bg-slate-950 border border-indigo-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.1)] relative flex flex-col h-full transition-all duration-700 hover:shadow-[0_0_70px_rgba(99,102,241,0.15)] group">
      <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
        <Target className="w-48 h-48 text-indigo-500" />
      </div>

      <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/10 backdrop-blur-xl flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <div className={`relative p-1 rounded-2xl transition-all duration-500 ${isActive ? 'bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-800'}`}>
             <div className="w-16 h-16 rounded-xl bg-slate-950 flex items-center justify-center border border-indigo-500/20">
                <Target className={`w-8 h-8 ${isActive ? 'text-indigo-400 animate-pulse' : 'text-slate-600'}`} />
             </div>
             {isActive && (
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_#10b981]" />
             )}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter italic">STRATEGIC <span className="text-indigo-400">CMO</span></h2>
              <div className="px-3 py-1 bg-indigo-500 text-slate-950 text-[10px] font-black uppercase rounded-lg shadow-lg">OFFICER_CLASS</div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] text-slate-400 font-mono tracking-widest uppercase font-bold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                MARKET INTELLIGENCE FEED
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[11px] text-indigo-400/70 font-mono font-bold uppercase tracking-widest">Sentry: Echo-9</span>
            </div>
          </div>
        </div>
        <button 
          onClick={toggleCmo}
          className={`p-6 rounded-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isActive ? 'bg-indigo-500 text-slate-950 shadow-[0_0_30px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-400 border border-slate-700'} flex items-center justify-center`}
        >
          {isActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>
      </div>

      <div className="flex-1 min-h-[300px] overflow-y-auto p-8 space-y-6 font-mono text-sm custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative">
        {status === 'error' ? (
          <div className="h-full flex flex-col items-center justify-center text-rose-400 gap-4">
            <AlertCircle className="w-12 h-12" />
            <div className="text-center">
              <p className="font-bold uppercase mb-2">Satellite Link Distorted</p>
              <button onClick={() => (window as any).aistudio.openSelectKey()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-bold uppercase">Configure Key</button>
            </div>
          </div>
        ) : !isActive && transcription.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-8 opacity-60 text-center px-4 animate-in fade-in duration-1000">
            <BarChart4 className="w-20 h-20 text-indigo-900 animate-pulse" />
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Strategic Intelligence Node</h3>
              <p className="text-[10px] leading-relaxed max-w-xs mx-auto text-slate-500 font-bold uppercase tracking-widest">
                Initialize the CMO briefing sequence to receive real-time analysis of the Global BTC ETF Landscape and Institutional brand sentiment.
              </p>
              <button 
                onClick={toggleCmo}
                className="mt-4 px-8 py-2.5 bg-slate-900 hover:bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
               >
                 Engage Intelligence Briefing
               </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {transcription.slice(-8).map((t, i) => (
              <div key={i} className={`flex gap-4 ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                <div className={`max-w-[85%] p-5 rounded-3xl relative border shadow-2xl ${
                  t.role === 'user' 
                    ? 'bg-slate-900/50 border-slate-700/50 text-slate-400 rounded-tr-none' 
                    : 'bg-indigo-900/15 border-indigo-500/20 text-indigo-50 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${
                      t.role === 'user' ? 'bg-slate-700 text-slate-400' : 'bg-indigo-500 text-white'
                    }`}>
                      {t.role === 'user' ? 'COMMANDER' : 'OFFICER_CMO'}
                    </span>
                    {t.role !== 'user' && <Zap className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />}
                  </div>
                  <p className="text-[14px] leading-relaxed tracking-tight">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col gap-4">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={commandText}
            onChange={(e) => setCommandText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
            disabled={!isActive}
            placeholder={isActive ? "Query ETF intelligence report..." : "Awaiting Strategy Lead..."}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-sm font-mono text-indigo-100 placeholder:text-slate-700 outline-none focus:border-indigo-500/50 shadow-inner"
          />
          <button 
            onClick={handleSendCommand} 
            disabled={!isActive || !commandText.trim()} 
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-8 rounded-2xl transition-all shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
             <div className={`w-2.5 h-2.5 rounded-full ${isActive ? (!isSilent ? 'bg-indigo-500 shadow-[0_0_12px_#6366f1]' : 'bg-emerald-500 shadow-[0_0_12px_#10b981]') : 'bg-slate-800'}`} />
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Neural Link: {isActive ? 'Established' : 'Offline'}</span>
           </div>
           <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-black text-amber-500/60 uppercase tracking-widest">Premium Insights Enabled</span>
             </div>
             <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">Tactical Protocol v2.4</span>
             </div>
           </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.3); }
      `}</style>
    </div>
  );
};

export default AiCmoLive;