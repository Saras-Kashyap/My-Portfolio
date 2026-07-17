import { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Flame, 
  Cpu, 
  Info,
  Maximize2
} from 'lucide-react';
import SocialCard from './SocialCard';
import CursedParticles from './CursedParticles';
import { playSound, toggleMute, getMuteState } from './SoundEffects';

// Pre-compute stable per-card random jitter at module level (not inside component render)
// This is the correct React pattern for non-reactive random initial values
const CARD_COLLAPSE_JITTER = Array.from({ length: 6 }, () => ({
  x: (Math.random() - 0.5) * 40,
  rotate: (Math.random() - 0.5) * 20,
}));

const BASE = import.meta.env.BASE_URL;

const cardsData = [
  {
    id: 'github',
    name: 'GitHub',
    username: '@Saras',
    actionText: 'CLONE REPO',
    status: 'SYS: COMPILED',
    serial: 'CODE-001',
    themeColor: 'neon-cyan',
    bgPattern: 'bg-halftone-white',
    avatarImg: `${BASE}github.jpg`,
    link: 'https://github.com/Saras-Kashyap',
    quote: 'SHADOW CLONE REPO ACTIVE!'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    username: 'Saras',
    actionText: 'CONNECT NOW',
    status: 'HIRE: SEEKING',
    serial: 'PROF-002',
    themeColor: 'neon-pink',
    bgPattern: 'bg-speedlines',
    avatarImg: `${BASE}linkedin.jpg`,
    link: 'https://www.linkedin.com/in/saras-kashyap-62a0bb326?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    quote: 'MAX LEVEL NETWORKING!'
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    username: 'Saras',
    actionText: 'SOLVE PROBLEMS',
    status: 'SYS: COMPILED',
    serial: 'CODE-004',
    themeColor: 'neon-yellow',
    bgPattern: 'speedlines-diagonal',
    avatarImg: `${BASE}leetcode.jpg`,
    link: 'https://leetcode.com/u/Saras_kashyap/',
    quote: 'LIMIT BREAK ALGORITHMS!'
  },
  {
    id: 'twitter',
    name: 'X.com',
    username: '@Saras',
    actionText: 'FOLLOW FEED',
    status: 'MEME: CRITICAL',
    serial: 'POST-003',
    themeColor: 'neon-yellow',
    bgPattern: 'speedlines-diagonal',
    avatarImg: `${BASE}x.jpg`,
    link: 'https://x.com/Saras', // TODO: Replace with your real X.com profile URL
    quote: 'LIMIT BREAK THOUGHTS!'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    username: 'Saras',
    actionText: 'PLAY VIDEO',
    status: 'LIVE: RECORDING',
    serial: 'VID-005',
    themeColor: 'neon-pink',
    bgPattern: 'bg-speedlines',
    avatarImg: `${BASE}youtube.jpg`,
    link: 'https://youtube.com/@Saras', // TODO: Replace with your real YouTube channel URL
    quote: 'SUBSCRIBE FOR CLIPS!'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    username: 'u/Saras',
    actionText: 'BROWSE SUB',
    status: 'SYS: COMPILED',
    serial: 'COMM-006',
    themeColor: 'neon-yellow',
    bgPattern: 'speedlines-diagonal',
    avatarImg: `${BASE}reddit.jpg`,
    link: 'https://reddit.com/u/Saras', // TODO: Replace with your real Reddit profile URL
    quote: 'UPVOTE THE SHINOBI WAY!'
  }
];

export default function App() {
  // Config state
  const [floatIntensity, setFloatIntensity] = useState('medium'); // none, low, medium, high
  const [magneticStrength, setMagneticStrength] = useState('none'); // none, low, medium, high
  const [isMuted, setIsMuted] = useState(() => getMuteState());
  const [mangaTheme, setMangaTheme] = useState('dark'); // dark, paper, domain
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [shockwaveForce, setShockwaveForce] = useState(0);
  const [hudMessage, setHudMessage] = useState('SYSTEM IN STANDBY. GRAVITY FIELD: ACTIVE.');
  
  // Domain expansion circular clip wipe transition states
  const [transitionTheme, setTransitionTheme] = useState(null);
  const [transitionCoords, setTransitionCoords] = useState({ x: 0, y: 0 });

  // Mouse tracking (normalized to -0.5 to 0.5)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Get normalized screen coordinates
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Gravity Collapse
  const triggerCollapse = () => {
    if (isCollapsed) {
      // Restore
      setIsCollapsed(false);
      playSound('restore');
      setHudMessage('RESTORING ANTI-GRAVITY ENGINES... SHIELD LEVEL STABLE.');
    } else {
      // Collapse
      setIsCollapsed(true);
      playSound('collapse');
      setHudMessage('WARNING: GRAVITY CORE COLLAPSED! CARDS ARE EXPERIENCING EARTH GRAVITY!');
      
      // Trigger a light screen shake on collapse
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    }
  };

  // Trigger Shockwave Explosion
  const triggerShockwave = () => {
    if (isCollapsed) {
      setHudMessage('SYSTEM OFFLINE: CANNOT FIRE SHOCKWAVE WHILE GRAVITY CORE IS DOWN.');
      return;
    }
    
    // Play explosion sound
    playSound('collapse');
    
    // Trigger screen shake
    setScreenShake(true);
    setShockwaveForce(180);
    setHudMessage('BOOM! SHOCKWAVE DETONATED. KINETIC FORCE DISTRIBUTED.');
    
    setTimeout(() => {
      setScreenShake(false);
    }, 400);

    setTimeout(() => {
      setShockwaveForce(0);
    }, 600);
  };

  const toggleSound = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (!muted) {
      playSound('click');
    }
  };

  const handleThemeToggleWithWipe = (newTheme, e) => {
    if (transitionTheme || newTheme === mangaTheme) return;

    if (newTheme === 'domain') {
      playSound('domain');
    } else {
      playSound('restore');
    }

    // Set origin center coordinates for circular wipe expansion
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    if (e && e.clientX && e.clientY) {
      x = e.clientX;
      y = e.clientY;
    } else {
      const btn = document.getElementById(`btn-theme-${newTheme}`);
      if (btn) {
        const rect = btn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    setTransitionCoords({ x, y });
    setTransitionTheme(newTheme);

    // Swap theme state at midpoint of circle animation (when screen is fully covered)
    setTimeout(() => {
      setMangaTheme(newTheme);
      if (newTheme === 'domain') {
        setHudMessage('DOMAIN EXPANSION UNLEASHED: PITCH BLACK ENERGY FLOW ACTIVE.');
      } else if (newTheme === 'dark') {
        setHudMessage('REALITY RESTORED: THEME SET TO SHADOW PANEL.');
      } else {
        setHudMessage('REALITY RESTORED: THEME SET TO RECYCLED PAPER VIBE.');
      }
    }, 500);

    // Finalize transition
    setTimeout(() => {
      setTransitionTheme(null);
    }, 1200);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      mangaTheme === 'domain' 
        ? 'bg-black text-[#f5f4ef]' 
        : mangaTheme === 'dark' 
          ? 'bg-[#0c0c10] text-white' 
          : 'bg-[#f5f4ef] text-black'
    }`}>
      
      {/* BACKGROUND GRAPHIC ELEMENTS */}
      {/* 1. Global Dot Matrix Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none select-none z-0" />
      
      {/* 2. CRT Scanlines effect */}
      <div className="absolute inset-0 scanlines-animated opacity-20 pointer-events-none select-none z-0" />
      
      {/* 3. Comic Speedlines spiraling or radiating from corners (opacity adjusted by theme) */}
      <div className={`absolute inset-0 bg-speedlines pointer-events-none select-none z-0 ${
        mangaTheme === 'domain'
          ? 'opacity-[0.04]'
          : mangaTheme === 'dark' 
            ? 'opacity-[0.06]' 
            : 'opacity-[0.03]'
      }`} />
      <div className={`absolute inset-0 speedlines-diagonal pointer-events-none select-none z-0 ${
        mangaTheme === 'domain'
          ? 'opacity-[0.05]'
          : mangaTheme === 'dark' 
            ? 'opacity-[0.08]' 
            : 'opacity-[0.04]'
      }`} />

      {/* 4. Giant Halftone background details */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0 ${
        mangaTheme === 'domain'
          ? 'bg-halftone-graphite opacity-30'
          : 'bg-halftone-white ' + (mangaTheme === 'dark' ? 'opacity-[0.04]' : 'opacity-[0.1]')
      }`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-0 ${
        mangaTheme === 'domain'
          ? 'bg-halftone-graphite opacity-30'
          : 'bg-halftone-white ' + (mangaTheme === 'dark' ? 'opacity-[0.03]' : 'opacity-[0.1]')
      }`} />

      {/* MAIN SCREEN SHAKING CONTAINER */}
      <div className={`w-full min-h-screen relative z-10 flex flex-col ${
        screenShake ? 'animate-comic-shake' : ''
      }`}>
        
        {/* HEADER BAR */}
        <header className={`border-b-[6px] border-black bg-white text-black p-4 sticky top-0 z-50 shadow-[0_4px_0px_#000]`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="bg-black text-white p-2 border-2 border-black rotate-[-2deg] font-bungee text-xl tracking-tight shadow-[3px_3px_0px_#ff007f]">
                0G // NET
              </div>
              <div>
                <h1 
                  data-text="AI ENGINEER"
                  className={`font-bungee text-2xl font-black tracking-tight leading-none rotate-[0.5deg] ${
                    mangaTheme === 'domain' ? 'animate-chromatic' : ''
                  }`}
                >
                  AI ENGINEER
                </h1>
                <p className="font-mono text-[10px] font-bold text-gray-500 tracking-wider">
                  ANTI-GRAVITY SOCIAL TERMINAL v2.5
                </p>
              </div>
            </div>

            {/* Live Console Message Overlay */}
            <div className="flex-1 max-w-md w-full bg-black text-neon-cyan border-[3px] border-black px-3 py-1.5 font-mono text-xs overflow-hidden h-8 flex items-center justify-between shadow-[inset_0_0_8px_#00f0ff22]">
              <span className="truncate">{hudMessage}</span>
              <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse flex-shrink-0 ml-2" />
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`
                border-[3px] border-black p-2 rounded-none transition-all flex items-center gap-2 font-bungee text-xs
                ${isMuted 
                  ? 'bg-red-500 text-white shadow-[2px_2px_0px_#000]' 
                  : 'bg-neon-yellow text-black shadow-[3px_3px_0px_#000]'
                }
                active:translate-x-1 active:translate-y-1 active:shadow-none
              `}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* COCKPIT PANEL (SIDEBAR CONTROLS) */}
          <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
            
            {/* 1. CHARACTER STATS PANEL */}
            <div className={`border-[6px] border-black p-5 relative overflow-hidden shadow-[4px_4px_0px_#000] ${
              mangaTheme === 'domain'
                ? 'bg-black border-neon-purple shadow-[4px_4px_0px_#bc13fe]'
                : mangaTheme === 'dark' 
                  ? 'bg-[#121216]' 
                  : 'bg-white'
            }`}>
              {/* Comic dot background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-manga-dots text-[#00f0ff]/10 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 border-b-4 border-black pb-3 mb-4">
                  <div className={`w-12 h-12 border-3 border-black rounded-none overflow-hidden flex-shrink-0 flex items-center justify-center ${
                    mangaTheme === 'domain' ? 'bg-neon-purple' : 'bg-neon-pink'
                  }`}>
                    <img src={`${BASE}me.jpg`} alt="Saras Kumar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4
                      data-text="SARAS"
                      className={`font-bungee text-lg leading-none ${
                        mangaTheme === 'domain' ? 'animate-chromatic text-neon-green' : ''
                      }`}
                    >
                      SARAS
                    </h4>
                    <span className="font-mono text-[10px] md:text-xs font-bold text-gray-500">CLASS: ML ENGINEER</span>
                  </div>
                </div>

                {/* RPG Style Metric Bars — based on real resume skills */}
                <div className="space-y-3 font-mono text-xs font-bold">

                  {/* LLM / AI bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>LLM POWER</span>
                      <span>92 / 100</span>
                    </div>
                    <div className="h-4 border-[3px] border-black bg-black p-[2px]">
                      <div className="h-full bg-neon-pink" style={{ width: '92%' }} />
                    </div>
                  </div>

                  {/* Python bar */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>PYTHON XP</span>
                      <span>88 / 100</span>
                    </div>
                    <div className="h-4 border-[3px] border-black bg-black p-[2px]">
                      <div className="h-full bg-neon-cyan" style={{ width: '88%' }} />
                    </div>
                  </div>

                  {/* Skills tags — from resume */}
                  <div className="pt-3 border-t-2 border-black/20">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">⚔ Languages:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase">
                      <span className="px-1.5 py-0.5 border border-black bg-neon-yellow text-black rotate-[-1deg]">Python</span>
                      <span className="px-1.5 py-0.5 border border-black bg-white text-black rotate-[2deg]">C++</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-cyan text-black rotate-[-1deg]">JavaScript</span>
                      <span className="px-1.5 py-0.5 border border-black bg-white text-black rotate-[1deg]">C</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">🤖 AI / ML:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase">
                      <span className="px-1.5 py-0.5 border border-black bg-neon-pink text-white rotate-[-2deg]">LLMs</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-purple text-white rotate-[1deg]">RAG</span>
                      <span className="px-1.5 py-0.5 border border-black bg-black text-neon-green">OpenCV</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-yellow text-black rotate-[-1deg]">ML</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-cyan text-black rotate-[2deg]">LM Studio</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">🌐 Web / Tools:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase">
                      <span className="px-1.5 py-0.5 border border-black bg-neon-cyan text-black rotate-[2deg]">React</span>
                      <span className="px-1.5 py-0.5 border border-black bg-white text-black rotate-[-1deg]">Next.js</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-pink text-white rotate-[1deg]">MongoDB</span>
                      <span className="px-1.5 py-0.5 border border-black bg-black text-white">Git</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-yellow text-black rotate-[-2deg]">Linux</span>
                      <span className="px-1.5 py-0.5 border border-black bg-white text-black rotate-[1deg]">Supabase</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-pink text-white rotate-[-1deg]">Adobe</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">🤖 Hardware:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase">
                      <span className="px-1.5 py-0.5 border border-black bg-neon-green text-black rotate-[-1deg]">Robotics</span>
                      <span className="px-1.5 py-0.5 border border-black bg-white text-black rotate-[2deg]">3D Print</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-yellow text-black">Unity</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-cyan text-black rotate-[-2deg]">Blender</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-purple text-white rotate-[1deg]">Amuse</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-pink text-white rotate-[-1deg]">Stable Diffusion</span>
                    </div>
                  </div>

                  {/* Spoken Languages */}
                  <div className="pt-1">
                    <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider">🗣 Languages:</div>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-black uppercase">
                      <span className="px-1.5 py-0.5 border border-black bg-neon-cyan text-black rotate-[-1deg]">English</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-yellow text-black rotate-[2deg]">Hindi</span>
                      <span className="px-1.5 py-0.5 border border-black bg-neon-pink text-white rotate-[-2deg]">German</span>
                    </div>
                  </div>

                  {/* Resume Download CTA */}
                  <div className="pt-3 border-t-2 border-black/20">
                    <a
                      href={`${BASE}Saras_Kumar_Golu_Resume.docx`}
                      download
                      className={`
                        flex items-center justify-center gap-2 w-full py-2 border-[3px] border-black
                        font-bungee text-[11px] uppercase font-black transition-all
                        shadow-[3px_3px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                        ${
                          mangaTheme === 'domain'
                            ? 'bg-neon-green text-black hover:bg-neon-yellow'
                            : 'bg-neon-yellow text-black hover:bg-neon-cyan'
                        }
                      `}
                    >
                      ⬇ DOWNLOAD RESUME
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ENGINE CONTROLS PANEL */}
            <div className={`border-[6px] border-black p-5 relative overflow-hidden shadow-[4px_4px_0px_#000] ${
              mangaTheme === 'domain'
                ? 'bg-black border-neon-purple shadow-[4px_4px_0px_#bc13fe]'
                : mangaTheme === 'dark' 
                  ? 'bg-[#121216]' 
                  : 'bg-white'
            }`}>
              <h3 className="font-bungee text-lg border-b-4 border-black pb-2 mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-neon-cyan" />
                ENGINE CONTROLS
              </h3>

              <div className="space-y-4">
                {/* Float Intensity Control */}
                <div>
                  <label className="font-bungee text-[11px] block mb-2 text-gray-400">FLOAT AMPLITUDE</label>
                  <div className="grid grid-cols-4 border-3 border-black bg-black p-1 gap-1">
                    {['none', 'low', 'medium', 'high'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => { setFloatIntensity(lvl); playSound('hover'); }}
                        className={`text-[9px] font-black uppercase py-1 border-2 border-transparent transition-all ${
                          floatIntensity === lvl 
                            ? 'bg-neon-cyan text-black font-black' 
                            : 'bg-transparent text-white hover:bg-white/10'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Magnetic Pull Control */}
                <div>
                  <label className="font-bungee text-[11px] block mb-2 text-gray-400">CURSOR MAGNET STRENGTH</label>
                  <div className="grid grid-cols-4 border-3 border-black bg-black p-1 gap-1">
                    {['none', 'low', 'medium', 'high'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => { setMagneticStrength(lvl); playSound('hover'); }}
                        className={`text-[9px] font-black uppercase py-1 border-2 border-transparent transition-all ${
                          magneticStrength === lvl 
                            ? 'bg-neon-pink text-white font-black' 
                            : 'bg-transparent text-white hover:bg-white/10'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Theme Selector */}
                <div>
                  <label className="font-bungee text-[11px] block mb-2 text-gray-400">REALITY FIELD (THEME)</label>
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="btn-theme-paper"
                        onClick={(e) => handleThemeToggleWithWipe('paper', e)}
                        className={`
                          border-3 border-black py-2 font-bungee text-xs text-center transition-all shadow-[2px_2px_0px_#000]
                          ${mangaTheme === 'paper' 
                            ? 'bg-[#f4f3ec] text-black font-black' 
                            : 'bg-white text-black hover:bg-black/5'
                          }
                          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                        `}
                      >
                        PAPER
                      </button>
                      <button
                        id="btn-theme-dark"
                        onClick={(e) => handleThemeToggleWithWipe('dark', e)}
                        className={`
                          border-3 border-black py-2 font-bungee text-xs text-center transition-all shadow-[2px_2px_0px_#000]
                          ${mangaTheme === 'dark' 
                            ? 'bg-black text-white font-black' 
                            : 'bg-white text-black hover:bg-black/5'
                          }
                          active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                        `}
                      >
                        SHADOW
                      </button>
                    </div>

                    <button
                      id="btn-theme-domain"
                      onClick={(e) => handleThemeToggleWithWipe('domain', e)}
                      className={`
                        border-3 py-2 font-bungee text-xs text-center transition-all uppercase relative overflow-hidden
                        ${mangaTheme === 'domain' 
                          ? 'bg-black text-neon-green animate-chromatic border-neon-purple shadow-[4px_4px_0px_#bc13fe]' 
                          : 'bg-black text-white hover:text-neon-pink shadow-[3px_3px_0px_#000] border-black'
                        }
                        active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                      `}
                    >
                      {mangaTheme === 'domain' ? '⚡ DOMAIN UNLEASHED ⚡' : 'Domain Expansion'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DANGER ZONE / FORCE TRIGGER PANEL */}
            <div className="border-[6px] border-black p-5 bg-black text-white shadow-[4px_4px_0px_#000] flex flex-col gap-4">
              <h3 className="font-bungee text-lg text-neon-yellow border-b-4 border-neon-yellow pb-2 flex items-center gap-2">
                <Flame className="w-5 h-5 text-neon-yellow animate-bounce" />
                FORCE ACTUATORS
              </h3>

              <div className="flex flex-col gap-3">
                {/* Gravity collapse trigger */}
                <button
                  onClick={triggerCollapse}
                  className={`
                    border-[3px] border-black font-bungee text-sm font-black p-3 uppercase transition-all shadow-[4px_4px_0px_rgba(255,255,255,0.2)]
                    ${isCollapsed
                      ? 'bg-neon-cyan text-black hover:bg-white shadow-[3px_3px_0px_#00f0ff]'
                      : 'bg-red-600 text-white hover:bg-red-500 shadow-[3px_3px_0px_#ff007f]'
                    }
                    active:translate-x-1 active:translate-y-1 active:shadow-none
                  `}
                >
                  {isCollapsed ? 'RESTORE GRAVITY (0G)' : 'COLLAPSE GRAVITY (1G)'}
                </button>

                {/* Shockwave detonation trigger */}
                <button
                  onClick={triggerShockwave}
                  disabled={isCollapsed}
                  className={`
                    border-[3px] border-black font-bungee text-sm font-black p-3 uppercase transition-all
                    ${isCollapsed
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-900 shadow-none'
                      : 'bg-neon-yellow text-black hover:bg-white shadow-[3px_3px_0px_#ffea00] active:translate-x-1 active:translate-y-1 active:shadow-none'
                    }
                  `}
                >
                  DETONATE SHOCKWAVE!
                </button>
              </div>
              
              <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest text-center mt-1">
                WARNING: HIGH VOLTAGE INTERACTION
              </div>
            </div>

          </aside>

          {/* SOCIAL MEDIA CARDS LAYOUT CONTAINER */}
          <section 
            onClick={triggerShockwave}
            className={`
              flex-1 border-[6px] p-6 relative overflow-hidden min-h-[600px] flex flex-col justify-center
              ${mangaTheme === 'domain' 
                ? 'bg-[#030006] border-neon-purple shadow-[8px_8px_0px_#bc13fe]' 
                : mangaTheme === 'dark' 
                  ? 'bg-[#0f0f13] border-black shadow-[8px_8px_0px_#000]' 
                  : 'bg-[#e2e1d7] border-black shadow-[8px_8px_0px_#000]'
              }
              cursor-crosshair transition-all duration-300
            `}
          >
            {/* Hover help tip banner */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center text-[10px] font-bold font-mono tracking-widest pointer-events-none">
              <span className={`px-2 py-0.5 border-2 border-black bg-white text-black flex items-center gap-1`}>
                <Info className="w-3 h-3 text-neon-pink" />
                HOVER TO BREAK GRAVITY
              </span>
              <span className={`px-2 py-0.5 border-2 border-black bg-black text-white flex items-center gap-1`}>
                <Maximize2 className="w-3 h-3 text-neon-cyan" />
                CLICK SCREEN FOR SHOCKWAVE
              </span>
            </div>

            {/* Inner frame borders simulating a comic page slice */}
            <div className="absolute inset-2 border-[3px] border-black/15 pointer-events-none z-10" />

            {/* Canvas-based Cursed particles floating in Domain Mode */}
            <CursedParticles active={mangaTheme === 'domain'} shockwaveForce={shockwaveForce} />

            {/* Responsive grid of cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 justify-center items-center py-6 relative z-20">
              {cardsData.map((card, idx) => (
                <SocialCard
                  key={card.id}
                  card={card}
                  index={idx}
                  mousePos={mousePos}
                  floatIntensity={floatIntensity}
                  magneticStrength={magneticStrength}
                  isCollapsed={isCollapsed}
                  shockwaveForce={shockwaveForce}
                  mangaTheme={mangaTheme}
                  collapseJitter={CARD_COLLAPSE_JITTER[idx]}
                />
              ))}
            </div>
          </section>

        </main>

        {/* FOOTER */}
        <footer className={`border-t-[6px] border-black bg-black text-white py-6 mt-12`}>
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neon-pink animate-pulse" />
              <span>SYSTEM COMPILED BY SARAS // ALL CHANNELS ACTIVE.</span>
            </div>
            <div className="flex gap-4">
              <a href="#github" className="hover:text-neon-cyan transition-colors">Vite</a>
              <span>•</span>
              <a href="#react" className="hover:text-neon-pink transition-colors">React</a>
              <span>•</span>
              <a href="#framer" className="hover:text-neon-yellow transition-colors">Framer Motion</a>
              <span>•</span>
              <a href="#tailwind" className="hover:text-neon-cyan transition-colors">Tailwind CSS</a>
            </div>
            <div className="text-gray-500">
              © {new Date().getFullYear()} SARAS. CREATED UNDER ZERO GRAVITY.
            </div>
          </div>
        </footer>

      </div>

      {/* CIRCULAR DOMAIN EXPANSION CLIPPED OVERLAY WIPE */}
      {transitionTheme && (
        <div 
          style={{
            '--x': transitionCoords.x + 'px',
            '--y': transitionCoords.y + 'px',
          }}
          className={`fixed inset-0 z-[9999] pointer-events-none animate-wipe-expand ${
            transitionTheme === 'domain' 
              ? 'bg-black text-neon-green' 
              : transitionTheme === 'dark' 
                ? 'bg-[#0c0c10] text-white' 
                : 'bg-[#f5f4ef] text-black'
          }`}
        >
          <div className="absolute inset-0 bg-speedlines opacity-35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`font-bungee text-2xl md:text-5xl text-white font-black tracking-widest border-[6px] border-white bg-black px-8 py-4 rotate-[-4deg] shadow-[8px_8px_0px_#000] uppercase ${
              transitionTheme === 'domain' 
                ? 'text-neon-green border-neon-purple shadow-[8px_8px_0px_#bc13fe] animate-chromatic' 
                : ''
            }`}>
              {transitionTheme === 'domain' ? 'Domain Expansion!!' : 'Restoring Reality...'}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
