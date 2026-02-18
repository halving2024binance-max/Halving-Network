import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Video, Film, Play, Download, Zap, Loader2, 
  Terminal, ShieldCheck, ArrowRight, Maximize2, RefreshCw, 
  Layers, Clapperboard, Share2, AlertCircle, Cpu, Key, ExternalLink
} from 'lucide-react';

const LOADING_MESSAGES = [
  "Initializing Temporal Mesh...",
  "Synthesizing Neural Keyframes...",
  "Aligning 10M Swarm Motion Vectors...",
  "Verifying Layer-12 Frame Integrity...",
  "Rendering Exascale Motion Dynamics...",
  "Finalizing Sentry Video Uplink...",
  "Encoding Protocol Metadata..."
];

const AiVideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  // Check for selected API Key
  useEffect(() => {
    const checkKey = async () => {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(selected);
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setHasKey(true);
  };

  // Rotate loading messages
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio
        }
      });

      // Poll for operation completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        setError("Neural core failed to generate motion sequence. Check prompt complexity.");
      }
    } catch (err: any) {
      console.error("Video Generation Failure:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key verification failed. Please re-select a paid key.");
      } else {
        setError(err.message || "Exascale temporal link timed out.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasKey === false) {
    return (
      <div className="bg-slate-900 border border-indigo-500/30 rounded-[3.5rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
            <Key className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">API Key Required</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Video generation requires an authorized paid API key from a Google Cloud Project with billing enabled.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleSelectKey}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs"
            >
              Select Authorized API Key
            </button>
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Gemini Billing Documentation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-indigo-500/20 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Video className="w-64 h-64 text-indigo-500" />
      </div>

      <div className="flex flex-col xl:flex-row gap-10 relative z-10">
        
        {/* Left: Input Controls */}
        <div className="xl:w-1/3 flex flex-col space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Film className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                AI <span className="text-indigo-400">Video Nexus</span>
              </h2>
            </div>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Exascale 2K Motion Engine
            </p>
          </div>

          {/* Prompt Terminal */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Temporal Directive
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe cinematic motion (e.g. 'A close-up of a 12-layer blockchain core spinning, glowing with indigo data streams, cinematic lighting')..."
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-indigo-100 placeholder:text-slate-700 outline-none focus:border-indigo-500/40 transition-all shadow-inner resize-none"
            />
          </div>

          {/* Config Matrix */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aspect Ratio Matrix</label>
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                {(['16:9', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      aspectRatio === ratio 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  >
                    {ratio === '16:9' ? 'Landscape' : 'Portrait'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 group"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current group-hover:animate-bounce" />}
            {isGenerating ? 'Synthesizing...' : 'Initialize Video Synthesis'}
          </button>
        </div>

        {/* Right: Preview Canvas */}
        <div className="xl:w-2/3 flex flex-col min-h-[500px]">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center group/preview shadow-inner">
            
            {/* Overlay Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {!isGenerating && !videoUrl && !error && (
              <div className="text-center space-y-6 animate-in fade-in duration-1000 opacity-40">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                  <Clapperboard className="w-24 h-24 text-slate-700 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Motion Standby</h3>
                  <p className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-[0.2em]">Enter directive to begin neural rendering</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="text-center space-y-10 z-10 p-10">
                <div className="relative">
                   <div className="w-40 h-40 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Layers className="w-12 h-12 text-indigo-500 animate-pulse" />
                   </div>
                </div>
                <div className="space-y-6">
                  <div className="text-sm font-black text-white uppercase tracking-[0.4em] animate-pulse">
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </div>
                  <div className="flex gap-2 justify-center">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-4 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Wait time: ~120-180 seconds</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center space-y-4 text-rose-400 p-10 z-10 animate-in zoom-in-95">
                <AlertCircle className="w-16 h-16 mx-auto animate-bounce" />
                <h4 className="text-lg font-black uppercase tracking-widest italic">Temporal Leak</h4>
                <p className="text-[10px] font-mono font-bold uppercase max-w-xs mx-auto leading-relaxed">{error}</p>
                <button onClick={handleGenerate} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Retry Uplink</button>
              </div>
            )}

            {videoUrl && !isGenerating && (
              <div className="w-full h-full relative animate-in fade-in duration-1000 group/video">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  className={`w-full h-full object-contain p-2 ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'}`}
                />
                
                {/* Meta Overlays */}
                <div className="absolute top-8 left-8 p-3 glass rounded-xl border border-white/5 space-y-2 opacity-0 group-hover/video:opacity-100 transition-opacity pointer-events-none">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-indigo-400" />
                      <span className="text-[9px] font-mono text-slate-300 uppercase">PROTO: VEO-3.1</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Maximize2 className="w-3 h-3 text-cyan-400" />
                      <span className="text-[9px] font-mono text-slate-300 uppercase">RES: 1080P_EXASCALE</span>
                   </div>
                </div>

                <div className="absolute bottom-8 right-8 flex items-center gap-3 opacity-0 group-hover/video:opacity-100 transition-all translate-y-4 group-hover/video:translate-y-0">
                  <a 
                    href={videoUrl}
                    download={`sentry-motion-${Date.now()}.mp4`}
                    className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-xl active:scale-90 transition-all"
                    title="Download Protocol Asset"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {/* Sentry Seal Bar */}
          <div className="mt-4 flex items-center justify-between px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Motion Pipeline: OK</span>
                </div>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                   <RefreshCw className={`w-3 h-3 text-cyan-400 ${isGenerating ? 'animate-spin' : ''}`} />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Model: Veo-3.1-Gen</span>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <Share2 className="w-3.5 h-3.5 text-slate-600 hover:text-indigo-400 transition-colors cursor-pointer" />
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
             </div>
          </div>
        </div>

      </div>

      <style>{`
        .glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};

export default AiVideoGenerator;