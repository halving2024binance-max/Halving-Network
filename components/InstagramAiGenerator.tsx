import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Image as ImageIcon, Sparkles, Download, Zap, Loader2, Terminal, ShieldCheck, ArrowRight, Maximize2, RefreshCw, Layers, Frame, Share2, AlertCircle, Cpu, Key, ExternalLink, Flame, CheckCircle2, LayoutTemplate } from 'lucide-react';

const LOADING_MESSAGES = [
  "Initializing Ad-Free Neural Hub...",
  "Calibrating Exascale Visual Tensors...",
  "Optimizing for Instagram Dimensions...",
  "Synthesizing High-Fidelity Geometry...",
  "Applying 2K Neural Upscaling...",
  "Verifying Frame Integrity...",
  "Finalizing Visual Synthesis..."
];

const InstagramAiGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '9:16'>('1:1');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

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

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{
          parts: [{ text: `High-fidelity cinematic visual, ultra-photorealistic, 8k mastery, professional lighting, social media grade, exquisite detail: ${prompt}` }]
        }],
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: imageSize
          }
        }
      });

      let foundUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          foundUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (foundUrl) {
        setGeneratedImageUrl(foundUrl);
      } else {
        const blockReason = response.candidates?.[0]?.finishReason;
        setError(blockReason === 'SAFETY' ? "NEURAL_CORE_BLOCK: Heuristics triggered." : "Synthesis failure: No visual payload.");
      }
    } catch (err: any) {
      console.error("Vision Pro Failure:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasKey(false);
        setError("API Key Auth required for Pro series.");
      } else {
        setError(err.message || "Exascale link timeout.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `hlv-vision-${imageSize}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasKey === false) {
    return (
      <div className="bg-slate-900 border border-emerald-500/30 rounded-[3.5rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <Key className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Premium Access Required</h2>
            <p className="text-slate-400 text-sm leading-relaxed">Ad-Free High-Quality Vision requires an authorized API Key for the Pro neural core.</p>
          </div>
          <button onClick={handleSelectKey} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs">Authorize High-Res Compute</button>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block text-[10px] font-black text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">Sentry Billing Protocol</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-700 hover:border-cyan-500/40">
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-all">
        <ImageIcon className="w-80 h-80 text-cyan-500" />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 relative z-10">
        <div className="lg:w-1/3 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Vision <span className="text-cyan-500">Pro Hub</span></h2>
              <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-black rounded uppercase">Ad-Free</div>
            </div>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Exascale Social Architect
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Directive</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the high-fidelity asset..."
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-cyan-100 placeholder:text-slate-700 outline-none focus:border-cyan-500/40 transition-all shadow-inner resize-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><LayoutTemplate className="w-3 h-3" /> Instagram Dimensions</label>
               <div className="flex flex-wrap p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
                 {(['1:1', '3:4', '9:16'] as const).map((ratio) => (
                   <button key={ratio} onClick={() => setAspectRatio(ratio)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${aspectRatio === ratio ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>
                     {ratio === '1:1' ? 'Post' : ratio === '3:4' ? 'Portrait' : 'Story'}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Resolution Mesh</label>
               <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
                 {(['1K', '2K', '4K'] as const).map((size) => (
                   <button key={size} onClick={() => setImageSize(size)} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${imageSize === size ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-cyan-900/40 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 group">
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current group-hover:animate-bounce" />}
            {isGenerating ? 'Synthesizing...' : 'Generate High-Res Asset'}
          </button>
        </div>

        <div className="lg:w-2/3 flex flex-col min-h-[450px]">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center group/preview shadow-inner">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            {!isGenerating && !generatedImageUrl && !error && (
              <div className="text-center space-y-6 animate-in fade-in duration-1000 opacity-40">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" />
                  <ImageIcon className="w-24 h-24 text-slate-700 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Vision Standby</h3>
                  <p className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-[0.2em]">Neural hub ready for visual directive</p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="text-center space-y-8 z-10 p-10">
                <div className="relative">
                   <div className="w-40 h-40 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mx-auto" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Layers className="w-12 h-12 text-cyan-500 animate-pulse" />
                   </div>
                </div>
                <div className="space-y-4">
                  <div className="text-sm font-black text-white uppercase tracking-[0.4em] animate-pulse">{LOADING_MESSAGES[loadingMsgIdx]}</div>
                  <div className="flex gap-2 justify-center">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-4 h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center space-y-4 text-rose-400 p-10 z-10 animate-in zoom-in-95">
                <AlertCircle className="w-16 h-16 mx-auto animate-bounce" />
                <h4 className="text-lg font-black uppercase tracking-widest italic">Temporal Leak</h4>
                <p className="text-[10px] font-mono font-bold uppercase max-w-xs mx-auto leading-relaxed">{error}</p>
                <button onClick={handleGenerate} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Retry Handshake</button>
              </div>
            )}

            {generatedImageUrl && !isGenerating && (
              <div className="w-full h-full relative animate-in fade-in duration-1000 group/image">
                <img src={generatedImageUrl} alt="Neural Vision Output" className="w-full h-full object-contain p-4" />
                <div className="absolute top-6 left-6 p-3 glass rounded-xl border border-white/5 space-y-2 opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" />
                      <span className="text-[9px] font-mono text-slate-300 uppercase">VISION_VERIFIED</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Frame className="w-3 h-3 text-indigo-400" />
                      <span className="text-[9px] font-mono text-slate-300 uppercase">RES: {imageSize}_PRO</span>
                   </div>
                </div>
                <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 group-hover/image:opacity-100 transition-all translate-y-4 group-hover/image:translate-y-0">
                  <button onClick={downloadImage} className="p-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl shadow-xl active:scale-90 transition-all"><Download className="w-5 h-5" /></button>
                  <button className="p-4 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-2xl shadow-xl active:scale-90 transition-all backdrop-blur-xl border border-white/5"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4] animate-pulse" />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Ad-Free Stream: Validated</span>
                </div>
                <div className="h-3 w-px bg-slate-800" />
                <div className="flex items-center gap-2">
                   <RefreshCw className={`w-3 h-3 text-indigo-400 ${isGenerating ? 'animate-spin' : ''}`} />
                   <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Model: Gemini-3-Pro-Vision</span>
                </div>
             </div>
             <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>
      </div>
      <style>{` .glass { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); } `}</style>
    </div>
  );
};

export default InstagramAiGenerator;