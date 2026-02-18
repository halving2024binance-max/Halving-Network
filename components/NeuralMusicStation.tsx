import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Music, Play, Pause, SkipForward, Volume2, Disc, Zap, Radio, Sparkles, Terminal, Activity, Layers, Headphones, VolumeX, Loader2 } from 'lucide-react';

interface TrackMetadata {
  title: string;
  artist: string;
  bpm: number;
  mood: string;
  briefing: string;
}

const GENRES = [
  { id: 'kpop', label: 'K-Pop', color: 'text-pink-400', glow: 'shadow-pink-900/20', accent: '#ec4899' },
  { id: 'pop', label: 'Pop', color: 'text-cyan-400', glow: 'shadow-cyan-900/20', accent: '#06b6d4' },
  { id: 'rnb', label: 'R&B', color: 'text-purple-400', glow: 'shadow-purple-900/20', accent: '#a855f7' }
];

// Curated high-quality placeholder streams for the specific genres requested
const GENRE_STREAMS: Record<string, string> = {
  kpop: 'https://streaming.radio.co/s57c664e43/listen',
  pop: 'https://icepool.pro/radio-pop',
  rnb: 'https://streaming.radio.co/s2f31922c2/listen'
};

const NeuralMusicStation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [isComposing, setIsComposing] = useState(false);
  const [metadata, setMetadata] = useState<TrackMetadata | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visualizerBars = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Composition effect on genre change
    handleCompose();
  }, [selectedGenre]);

  const handleCompose = async () => {
    setIsComposing(true);
    setMetadata(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Compose a track metadata for a high-fidelity ${selectedGenre} song. Provide it in JSON format with title, artist (make it sound futuristic/cool), bpm, mood, and a 1-sentence 'briefing' describing the neural soundscape.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const res = JSON.parse(response.text || '{}');
      setMetadata(res);
    } catch (err) {
      console.error("Music Synthesis Error:", err);
      setMetadata({
        title: "Neon Horizon",
        artist: "Swarm_Vibe_Node",
        bpm: 124,
        mood: "Energetic",
        briefing: "Standard fallback soundscape initiated due to core jitter."
      });
    } finally {
      setIsComposing(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  return (
    <div className="bg-slate-900 border border-purple-500/20 rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden group transition-all duration-700 hover:border-purple-500/40">
      {/* Visual background decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-all">
        <Disc className={`w-80 h-80 text-purple-500 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`} />
      </div>

      <div className="flex flex-col lg:flex-row gap-10 relative z-10">
        {/* Left: Controls & Visuals */}
        <div className="lg:w-1/3 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <Music className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Neural <span className="text-purple-500">Audio Hub</span></h2>
            </div>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              Exascale Sonic Architect
            </p>
          </div>

          {/* Audio Visualizer */}
          <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-6 h-40 flex items-center justify-center gap-1.5 shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_0%,transparent_70%)]" />
             {[...Array(20)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-2 bg-purple-500/30 rounded-full transition-all duration-150"
                 style={{ 
                   height: isPlaying ? `${20 + Math.random() * 80}%` : '15%',
                   backgroundColor: isPlaying ? (i % 2 === 0 ? '#a855f7' : '#ec4899') : '#1e293b',
                   boxShadow: isPlaying ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                 }}
               />
             ))}
             {!isPlaying && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">Audio_Link_Standby</span>
               </div>
             )}
          </div>

          {/* Genre Matrix */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Radio className="w-3 h-3" /> Synthesis Matrix</label>
            <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl gap-1">
              {GENRES.map((g) => (
                <button 
                  key={g.id} 
                  onClick={() => {
                    setSelectedGenre(g.id);
                    setIsPlaying(false); // Stop when changing genre to re-load
                  }} 
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedGenre === g.id ? `bg-purple-600 text-white ${g.glow}` : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={togglePlay}
               className="flex-1 py-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-purple-900/40 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 active:scale-95 group"
             >
               {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current group-hover:animate-pulse" />}
               {isPlaying ? 'Disconnect Stream' : 'Establish Sonic Link'}
             </button>
             <button 
              onClick={handleCompose}
              className="p-5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all border border-slate-700"
              title="Re-Synthesize Metadata"
             >
               <Sparkles className={`w-5 h-5 ${isComposing ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>

        {/* Right: Metadata & Briefing */}
        <div className="lg:w-2/3 flex flex-col min-h-[300px]">
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-center shadow-inner">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Headphones className="w-32 h-32 text-purple-900" />
             </div>

             {isComposing ? (
               <div className="text-center space-y-4 animate-in fade-in duration-500">
                  <Loader2 className="w-10 h-10 text-purple-500 animate-spin mx-auto" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Optimizing Neural Audio Mesh...</p>
               </div>
             ) : metadata ? (
               <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[8px] font-black rounded uppercase border border-purple-500/30">Now Playing</span>
                       <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{metadata.bpm} BPM // {metadata.mood.toUpperCase()}</span>
                    </div>
                    <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{metadata.title}</h3>
                    <p className="text-xl font-bold text-purple-400/80 uppercase tracking-widest">{metadata.artist}</p>
                  </div>

                  <div className="p-5 bg-purple-500/5 border border-purple-500/10 rounded-2xl space-y-3 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
                     <div className="flex items-center gap-2 relative z-10">
                        <Terminal className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Architect Briefing</span>
                     </div>
                     <p className="text-xs font-mono text-slate-300 leading-relaxed relative z-10 italic">
                        "{metadata.briefing}"
                     </p>
                  </div>
               </div>
             ) : (
               <div className="text-center opacity-30">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Uplink</span>
               </div>
             )}
          </div>

          <div className="mt-4 flex items-center justify-between px-8 py-4 bg-slate-950 border border-slate-800 rounded-3xl">
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-slate-500" />
                      <input 
                        type="range" 
                        min="0" max="1" step="0.01" 
                        value={volume} 
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-500"
                      />
                   </div>
                </div>
                <div className="h-4 w-px bg-slate-800" />
                <div className="flex items-center gap-3">
                   <button onClick={() => setIsMuted(!isMuted)} className="text-slate-500 hover:text-white transition-colors">
                     {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                   </button>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Signal: EXASCALE_CLEAR</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
             </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element for Background Play */}
      <audio 
        ref={audioRef} 
        src={GENRE_STREAMS[selectedGenre]} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        loop
      />
    </div>
  );
};

export default NeuralMusicStation;