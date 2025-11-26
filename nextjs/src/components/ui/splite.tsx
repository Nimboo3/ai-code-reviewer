'use client'

import { Suspense, lazy, useRef, useCallback, useState } from 'react'
import type { Application } from '@splinetool/runtime'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

// Animated robot placeholder that shows while Spline loads
function RobotPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Animated glow background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl animate-pulse" />
      </div>
      
      {/* Robot silhouette SVG */}
      <div className="relative z-10 animate-float">
        <svg 
          width="200" 
          height="240" 
          viewBox="0 0 200 240" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          {/* Head */}
          <rect 
            x="50" y="20" width="100" height="80" rx="20" 
            className="fill-slate-700/80 stroke-slate-500/50" 
            strokeWidth="2"
          />
          
          {/* Eyes */}
          <circle cx="75" cy="55" r="12" className="fill-cyan-400 animate-eye-glow" />
          <circle cx="125" cy="55" r="12" className="fill-cyan-400 animate-eye-glow" style={{ animationDelay: '0.5s' }} />
          
          {/* Eye pupils - animated */}
          <circle cx="77" cy="55" r="5" className="fill-slate-900 animate-look-around" />
          <circle cx="127" cy="55" r="5" className="fill-slate-900 animate-look-around" />
          
          {/* Mouth/Speaker grille */}
          <rect x="70" y="75" width="60" height="8" rx="4" className="fill-slate-600" />
          <rect x="75" y="78" width="10" height="2" rx="1" className="fill-cyan-400/60 animate-pulse" />
          <rect x="90" y="78" width="10" height="2" rx="1" className="fill-cyan-400/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <rect x="105" y="78" width="10" height="2" rx="1" className="fill-cyan-400/60 animate-pulse" style={{ animationDelay: '0.4s' }} />
          
          {/* Antenna */}
          <rect x="96" y="5" width="8" height="20" rx="4" className="fill-slate-600" />
          <circle cx="100" cy="5" r="6" className="fill-cyan-400 animate-antenna-pulse" />
          
          {/* Neck */}
          <rect x="85" y="100" width="30" height="15" className="fill-slate-600/80" />
          
          {/* Body */}
          <rect 
            x="40" y="115" width="120" height="90" rx="15" 
            className="fill-slate-700/80 stroke-slate-500/50" 
            strokeWidth="2"
          />
          
          {/* Chest light/core */}
          <circle cx="100" cy="155" r="20" className="fill-slate-800" />
          <circle cx="100" cy="155" r="15" className="fill-cyan-500/30 animate-core-pulse" />
          <circle cx="100" cy="155" r="8" className="fill-cyan-400 animate-core-pulse" />
          
          {/* Arms */}
          <rect x="15" y="120" width="20" height="60" rx="10" className="fill-slate-600/80" />
          <rect x="165" y="120" width="20" height="60" rx="10" className="fill-slate-600/80" />
          
          {/* Hands */}
          <circle cx="25" cy="185" r="12" className="fill-slate-500/80" />
          <circle cx="175" cy="185" r="12" className="fill-slate-500/80" />
          
          {/* Legs */}
          <rect x="55" y="205" width="25" height="35" rx="8" className="fill-slate-600/80" />
          <rect x="120" y="205" width="25" height="35" rx="8" className="fill-slate-600/80" />
        </svg>
        
        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-slate-400 font-medium">Initializing AI</span>
        </div>
      </div>
      
      {/* Floating code particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[20%] left-[15%] text-cyan-500/30 text-xs font-mono animate-float-particle" style={{ animationDelay: '0s' }}>&lt;/&gt;</span>
        <span className="absolute top-[30%] right-[20%] text-blue-500/30 text-xs font-mono animate-float-particle" style={{ animationDelay: '1s' }}>{ }</span>
        <span className="absolute top-[60%] left-[10%] text-cyan-500/20 text-xs font-mono animate-float-particle" style={{ animationDelay: '2s' }}>01</span>
        <span className="absolute top-[70%] right-[15%] text-blue-500/20 text-xs font-mono animate-float-particle" style={{ animationDelay: '0.5s' }}>=&gt;</span>
        <span className="absolute top-[45%] left-[25%] text-cyan-400/20 text-xs font-mono animate-float-particle" style={{ animationDelay: '1.5s' }}>**</span>
        <span className="absolute top-[50%] right-[25%] text-blue-400/20 text-xs font-mono animate-float-particle" style={{ animationDelay: '2.5s' }}>{'/'}</span>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes eye-glow {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px rgb(34 211 238 / 0.8)); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 4px rgb(34 211 238 / 0.4)); }
        }
        @keyframes look-around {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
        @keyframes antenna-pulse {
          0%, 100% { filter: drop-shadow(0 0 10px rgb(34 211 238 / 1)); }
          50% { filter: drop-shadow(0 0 20px rgb(34 211 238 / 0.6)); }
        }
        @keyframes core-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100px) rotate(10deg); opacity: 0; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-eye-glow { animation: eye-glow 2s ease-in-out infinite; }
        .animate-look-around { animation: look-around 4s ease-in-out infinite; }
        .animate-antenna-pulse { animation: antenna-pulse 1.5s ease-in-out infinite; }
        .animate-core-pulse { animation: core-pulse 2s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<Application | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const onLoad = useCallback((splineApp: Application) => {
    splineRef.current = splineApp
    // Small delay to ensure smooth transition
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (splineRef.current) {
      // Emit a mouse move event to the center-right of the scene
      // This makes the robot look "out of the screen" to the right
      splineRef.current.emitEvent('mouseHover', 'Robot')
    }
  }, [])

  return (
    <div 
      className="w-full h-full relative"
      onMouseLeave={handleMouseLeave}
    >
      {/* Show placeholder until Spline is fully loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <RobotPlaceholder />
        </div>
      )}
      
      {/* Spline scene - always render but hide until loaded */}
      <div className={`w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={null}>
          <Spline
            key={scene}
            scene={scene}
            className={className}
            onLoad={onLoad}
          />
        </Suspense>
      </div>
    </div>
  )
}