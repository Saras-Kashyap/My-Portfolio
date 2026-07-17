import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ExternalLink
} from 'lucide-react';
import { playSound } from './SoundEffects';

const GithubIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const YoutubeIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const RedditIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 6V3l4 1" />
    <circle cx="16" cy="4" r="1" />
    <rect x="5" y="8" width="14" height="11" rx="5" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
    <path d="M10 16c1 1 3 1 4 0" />
  </svg>
);

const LeetcodeIconSvg = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414 0-1.954l-4.77-4.673c-.74-.725-1.288-1.373-1.638-1.944.59-.07 1.185-.106 1.782-.106 2.053 0 3.99.715 5.524 2.029l4.464 3.829c.53.454 1.344.403 1.815-.113l2.05-2.22c.47-.516.42-1.312-.112-1.766L15.39.54A1.374 1.374 0 0 0 13.483 0z" />
  </svg>
);

// Map icon name to component
const getIcon = (name, className) => {
  switch (name.toLowerCase()) {
    case 'github': return <GithubIconSvg className={className} />;
    case 'linkedin': return <LinkedinIconSvg className={className} />;
    case 'x.com':
    case 'twitter': return <TwitterIconSvg className={className} />;
    case 'discord': return <ExternalLink className={className} />;
    case 'leetcode': return <LeetcodeIconSvg className={className} />;
    case 'youtube': return <YoutubeIconSvg className={className} />;
    case 'reddit': return <RedditIconSvg className={className} />;
    default: return <ExternalLink className={className} />;
  }
};

export default function SocialCard({ 
  card, 
  index, 
  mousePos, 
  floatIntensity, 
  magneticStrength,
  isCollapsed,
  shockwaveForce,
  mangaTheme,
  collapseJitter
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // 3D Card Tilt - Motion values for normalized cursor coordinates on card (0 to 1)
  const tiltX = useMotionValue(0.5);
  const tiltY = useMotionValue(0.5);
  
  // Map normalized inputs to degrees of tilt
  const springConfig = { stiffness: 180, damping: 18, mass: 0.8 };
  const rotateX = useSpring(useTransform(tiltY, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(tiltX, [0, 1], [-15, 15]), springConfig);
  
  // Depth effect (parallax) for internal elements
  const parallaxX = useSpring(useTransform(tiltX, [0, 1], [-8, 8]), springConfig);
  const parallaxY = useSpring(useTransform(tiltY, [0, 1], [-8, 8]), springConfig);

  // Magnetic drift calculation:
  // We calculate card's displacement based on screen mouse coordinates.
  // We vary the direction and magnitude for each card index to make them feel uniquely weightless.
  const magneticOffsets = (() => {
    // Unique factors per card index
    const factors = [
      { fx: -45, fy: -45 }, // drifts away
      { fx: 50, fy: 40 },   // pulled in
      { fx: -35, fy: 55 },  // hybrid
      { fx: 60, fy: -35 },  // hybrid
      { fx: -50, fy: 25 },  // drifts away
      { fx: 40, fy: -55 },  // pulled in
    ];
    const { fx, fy } = factors[index % factors.length];
    
    // Scale by user's configuration strength (Low: 0.3, Medium: 1.0, High: 1.8, None: 0)
    let scalar = 1.0;
    if (magneticStrength === 'none') scalar = 0;
    else if (magneticStrength === 'low') scalar = 0.3;
    else if (magneticStrength === 'high') scalar = 1.8;

    return {
      x: mousePos.x * fx * scalar,
      y: mousePos.y * fy * scalar
    };
  })();

  // Shockwave radial kinetic force displacement
  const shockwaveOffsets = (() => {
    if (!shockwaveForce) return { x: 0, y: 0 };
    // Distribute push vectors radially so cards fly outwards in different directions
    const angle = (index / 6) * (2 * Math.PI) + (Math.PI / 6);
    return {
      x: Math.cos(angle) * shockwaveForce,
      y: Math.sin(angle) * shockwaveForce
    };
  })();

  // Continuous floating oscillation settings (asynchronous via index offsets)
  // Scale float amplitude based on settings (None: 0, Low: 0.4, Medium: 1.0, High: 2.0)
  const floatScalar = (() => {
    if (floatIntensity === 'none') return 0;
    if (floatIntensity === 'low') return 0.4;
    if (floatIntensity === 'high') return 2.0;
    return 1.0;
  })();

  const floatYCycle = [-6 * floatScalar, 6 * floatScalar];
  const floatRotCycle = [-1.5 * floatScalar, 1.5 * floatScalar];
  
  const floatTransition = {
    y: {
      duration: 2.5 + (index * 0.4) % 2.0, // Unique duration
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: index * 0.2 // Stagger start
    },
    rotate: {
      duration: 3.2 + (index * 0.3) % 2.0,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: index * 0.15
    }
  };

  const handleLocalMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    tiltX.set(clientX / width);
    tiltY.set(clientY / height);
  };

  const handleLocalMouseLeave = () => {
    setIsHovered(false);
    tiltX.set(0.5);
    tiltY.set(0.5);
  };

  const handleLocalMouseEnter = () => {
    setIsHovered(true);
    playSound('hover');
  };

  const handleClick = () => {
    playSound('click');
  };

  // Color mapper helper
  const getThemeColors = (color, isDomain) => {
    if (isDomain) {
      // Domain Expansion Overload Colors
      switch (color) {
        case 'neon-pink': // linkedin, youtube -> Crimson Red
          return {
            glow: 'rgba(255, 7, 58, 1)',
            glowHex: '#ff073a',
            accentText: 'text-neon-crimson',
            accentBorder: 'border-neon-crimson',
            badgeBg: 'bg-neon-crimson',
            stripes: 'bg-stripes-neon',
            shadowClass: 'shadow-[4px_4px_0px_#000,8px_8px_0px_#ff073a] hover:shadow-[6px_6px_0px_#000,12px_12px_0px_#ff073a]',
            tag: 'bg-[#ff073a]/15 text-neon-crimson border-[#ff073a]/40'
          };
        case 'neon-yellow': // twitter, twitch -> Neon Purple
          return {
            glow: 'rgba(188, 19, 254, 1)',
            glowHex: '#bc13fe',
            accentText: 'text-neon-purple',
            accentBorder: 'border-neon-purple',
            badgeBg: 'bg-neon-purple',
            stripes: 'bg-stripes-cyan',
            shadowClass: 'shadow-[4px_4px_0px_#000,8px_8px_0px_#bc13fe] hover:shadow-[6px_6px_0px_#000,12px_12px_0px_#bc13fe]',
            tag: 'bg-[#bc13fe]/15 text-neon-purple border-[#bc13fe]/40'
          };
        case 'neon-cyan': // github -> Toxic Green
        default:
          return {
            glow: 'rgba(57, 255, 20, 1)',
            glowHex: '#39ff14',
            accentText: 'text-neon-green',
            accentBorder: 'border-neon-green',
            badgeBg: 'bg-neon-green',
            stripes: 'bg-stripes-yellow',
            shadowClass: 'shadow-[4px_4px_0px_#000,8px_8px_0px_#39ff14] hover:shadow-[6px_6px_0px_#000,12px_12px_0px_#39ff14]',
            tag: 'bg-[#39ff14]/15 text-neon-green border-[#39ff14]/40'
          };
      }
    }

    switch (color) {
      case 'neon-pink':
        return {
          glow: 'rgba(255, 0, 127, 1)',
          glowHex: '#ff007f',
          accentText: 'text-neon-pink',
          accentBorder: 'border-neon-pink',
          badgeBg: 'bg-neon-pink',
          stripes: 'bg-stripes-neon',
          shadowClass: 'shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#ff007f]',
          tag: 'bg-[#ff007f]/10 text-neon-pink border-[#ff007f]/30'
        };
      case 'neon-yellow':
        return {
          glow: 'rgba(255, 234, 0, 1)',
          glowHex: '#ffea00',
          accentText: 'text-neon-yellow',
          accentBorder: 'border-neon-yellow',
          badgeBg: 'bg-neon-yellow',
          stripes: 'bg-stripes-yellow',
          shadowClass: 'shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#ffea00]',
          tag: 'bg-[#ffea00]/10 text-neon-yellow border-[#ffea00]/30'
        };
      case 'neon-cyan':
      default:
        return {
          glow: 'rgba(0, 240, 255, 1)',
          glowHex: '#00f0ff',
          accentText: 'text-neon-cyan',
          accentBorder: 'border-neon-cyan',
          badgeBg: 'bg-neon-cyan',
          stripes: 'bg-stripes-cyan',
          shadowClass: 'shadow-[4px_4px_0px_#000000] hover:shadow-[8px_8px_0px_#00f0ff]',
          tag: 'bg-[#00f0ff]/10 text-neon-cyan border-[#00f0ff]/30'
        };
    }
  };

  const colors = getThemeColors(card.themeColor, mangaTheme === 'domain');

  return (
    /* OUTER LAYER: Handles Magnetic Cursor Drift & Shockwave / Gravity Collapse states */
    <motion.div
      animate={
        isCollapsed 
          ? { 
              x: (index % 3 - 1) * 20 + collapseJitter.x,
              y: 320 + (index * 15), 
              rotate: 15 - index * 6 + collapseJitter.rotate,
              scale: 0.95,
              transition: { type: 'spring', stiffness: 80, damping: 12 }
            }
          : { 
              x: magneticOffsets.x + shockwaveOffsets.x,
              y: magneticOffsets.y + shockwaveOffsets.y,
              rotate: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 50, damping: 14 }
            }
      }
      className="w-full max-w-[340px] h-[460px] mx-auto select-none"
    >
      {/* MIDDLE LAYER: Handles Continuous Zero-Gravity Float (oscillating Y and Z rot) */}
      <motion.div
        animate={isCollapsed ? {} : { y: floatYCycle, rotate: floatRotCycle }}
        transition={isCollapsed ? {} : floatTransition}
        className="w-full h-full"
      >
        {/* INNER LAYER: Handles Hover, Scale, 3D Tilt rotation, comic box-shadow */}
        <motion.a
          href={card.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          onMouseMove={handleLocalMouseMove}
          onMouseEnter={handleLocalMouseEnter}
          onMouseLeave={handleLocalMouseLeave}
          ref={cardRef}
          style={{ 
            rotateX: isHovered ? rotateX : 0, 
            rotateY: isHovered ? rotateY : 0,
            transformStyle: 'preserve-3d',
            perspective: 1000
          }}
          whileHover={{ 
            scale: 1.06, 
            zIndex: 30,
            transition: { type: 'spring', stiffness: 400, damping: 20 }
          }}
          className={`
            block w-full h-full text-left bg-white text-black 
            border-[6px] border-black rounded-none transition-shadow duration-150
            relative overflow-hidden glint-effect-hover glitch-hover
            ${isHovered ? 'animate-comic-shake' : ''}
            ${colors.shadowClass}
          `}
        >
          {/* Top Panel Trim bar */}
          <div className="absolute top-0 left-0 right-0 h-9 bg-black border-b-[4px] border-black flex justify-between items-center px-3 text-[10px] font-bold tracking-widest text-white z-20">
            <span>{card.serial}</span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isHovered ? colors.badgeBg : 'bg-green-500'} animate-ping absolute`} />
              <span className={`w-2 h-2 rounded-full ${isHovered ? colors.badgeBg : 'bg-green-500'} relative`} />
              {card.status}
            </span>
          </div>

          {/* MAIN ILLUSTRATION PANEL */}
          <div className="absolute top-9 left-0 right-0 bottom-44 bg-black border-b-[5px] border-black overflow-hidden z-10">
            {/* Speed lines/Diagonal patterns inside panel */}
            <div className="absolute inset-0 bg-halftone-black opacity-30 z-10 pointer-events-none" />
            <div className={`absolute inset-0 ${colors.stripes} opacity-60 z-10 pointer-events-none`} />

            {/* Glowing neon tint overlay on hover */}
            <div 
              style={{ backgroundColor: colors.glowHex }}
              className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-200 z-15 pointer-events-none" 
            />

            {/* Anime Illustration (Copied from public/) */}
            <motion.img 
              src={card.avatarImg} 
              alt={card.name}
              style={{
                x: parallaxX,
                y: parallaxY,
                scale: 1.15
              }}
              className={`w-full h-full object-cover grayscale contrast-[1.25] brightness-[0.95] ${
                mangaTheme === 'domain' ? 'domain-avatar-hover' : ''
              }`}
            />

            {/* Spech bubble - comic style */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute top-4 right-4 z-20"
              >
                <div className="bg-white text-black font-manga text-[10px] md:text-[11px] leading-tight font-black border-4 border-black p-2 max-w-[150px] relative speech-bubble-bottom shadow-[4px_4px_0px_#000]">
                  {card.quote}
                </div>
              </motion.div>
            )}

            {/* Neon Accent Corner Badge */}
            <div className={`absolute bottom-3 left-3 z-20 border-[4px] border-black bg-white px-2 py-1 flex items-center gap-2 shadow-[3px_3px_0px_#000] font-black uppercase text-xs rotate-[-3deg]`}>
              <span className={`w-2.5 h-2.5 rounded-full ${colors.badgeBg}`} />
              {card.name}
            </div>
          </div>

          {/* LOWER INFO SECTION */}
          <div className="absolute bottom-0 left-0 right-0 h-44 bg-white p-4 flex flex-col justify-between z-10">
            {/* Speedline action pattern on cards back */}
            <div className="absolute inset-0 bg-speedlines opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-halftone-black opacity-[0.02] pointer-events-none" />

            <div className="relative z-10 mt-1">
              {/* Big Comic/Manga Text */}
              <h3 
                data-text={card.name} 
                className={`font-bungee text-3xl font-black tracking-tight leading-none text-black glitch-effect glitch-effect-hover uppercase`}
              >
                {card.name}
              </h3>
              {/* Username tag */}
              <p className="font-mono text-xs font-bold text-gray-500 mt-1 flex items-center gap-1.5">
                {card.username}
              </p>
            </div>

            {/* Action panel footer */}
            <div className="relative z-10 flex items-center justify-between mt-auto">
              <div className={`text-[10px] font-black tracking-wider uppercase border-2 border-black px-2 py-0.5 rounded-none bg-black text-white`}>
                SYS: ACTIVE
              </div>
              
              {/* Action Button Trigger */}
              <motion.div
                style={{ x: parallaxX, y: parallaxY }}
                className={`
                  border-[3px] border-black bg-white px-3 py-1.5 font-bungee text-[11px] font-bold 
                  flex items-center gap-2 pointer-events-none transition-colors duration-150
                  shadow-[3px_3px_0px_#000]
                  ${isHovered ? `${colors.badgeBg} text-white shadow-none translate-x-[3px] translate-y-[3px]` : 'bg-white text-black'}
                `}
              >
                <span>{card.actionText}</span>
                <span className={mangaTheme === 'domain' ? 'domain-avatar-hover' : ''}>
                  {getIcon(card.name, 'w-3.5 h-3.5')}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Interactive shiny glint sweep overlay */}
          <div className="glint-effect absolute inset-0 pointer-events-none z-30" />
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
