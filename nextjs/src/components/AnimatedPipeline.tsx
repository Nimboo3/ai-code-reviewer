'use client';

import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useAnimationFrame, useMotionTemplate } from 'framer-motion';
import { GitPullRequest, GitMerge, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AnimatedPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Speed control
  const speed = 3; // Faster speed to ensure particles reach destination
  
  // Motion values for particles
  const p1 = useMotionValue(0);
  const p2 = useMotionValue(0);
  const p3 = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    // Update particles with staggered start
    const move = (val: any) => {
      let current = val.get();
      // Add speed * delta. 
      // We want 0 to 100% over some time.
      // delta is in ms. 
      // If speed is 1, and delta is 16ms, we add 0.016 * factor.
      let next = current + (speed * delta * 0.1); 
      if (next > 2500) next = 0; // Loop range matching original 400%
      val.set(next);
    };

    move(p1);
    move(p2); // They can run independently or synced
    move(p3);
  });

  // Opacity based on position (fade in/out)
  const getOpacity = (mv: any) => useTransform(mv, [0, 50, 350, 2000, 2500], [0, 1, 1, 1, 1]);

  const o1 = getOpacity(p1);
  const o2 = getOpacity(p2);
  const o3 = getOpacity(p3);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto py-20 relative"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full will-change-transform"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        
        {/* Node 1: PR Created */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-xl bg-card border border-white/10 flex items-center justify-center relative z-10 shadow-xl transition-transform group-hover:scale-110 duration-300">
            <GitPullRequest className="w-8 h-8 text-blue-400" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 whitespace-nowrap">PR Created</div>
        </div>

        {/* Connection 1 */}
        <div className="flex-1 h-[2px] bg-white/10 relative w-full md:w-auto min-h-[50px] md:min-h-0 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 md:top-1/2 md:-translate-y-1/2 h-full md:h-[2px] w-[2px] md:w-full bg-white/10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0"></div>
           <motion.div 
             className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_2px_rgba(96,165,250,0.8)] will-change-transform"
             style={{ 
               left: 0,
               x: useMotionTemplate`${p1}%`,
               opacity: o1
             }}
           />
        </div>

        {/* Node 2: AI Analysis */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-xl bg-card border border-blue-500/30 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-transform group-hover:scale-110 duration-300">
            <div className="absolute inset-0 bg-blue-500/10 animate-pulse rounded-xl"></div>
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-blue-400 font-bold whitespace-nowrap">AI Analysis</div>
        </div>

        {/* Connection 2 */}
        <div className="flex-1 h-[2px] bg-white/10 relative w-full md:w-auto min-h-[50px] md:min-h-0 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 md:top-1/2 md:-translate-y-1/2 h-full md:h-[2px] w-[2px] md:w-full bg-white/10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0"></div>
           <motion.div 
             className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_2px_rgba(96,165,250,0.8)] will-change-transform"
             style={{ 
               left: 0,
               x: useMotionTemplate`${p2}%`,
               opacity: o2
             }}
           />
        </div>

        {/* Node 3: Approved */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-xl bg-card border border-white/10 flex items-center justify-center relative z-10 shadow-xl transition-transform group-hover:scale-110 duration-300">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 whitespace-nowrap">Approved</div>
        </div>

        {/* Connection 3 */}
        <div className="flex-1 h-[2px] bg-white/10 relative w-full md:w-auto min-h-[50px] md:min-h-0 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 md:top-1/2 md:-translate-y-1/2 h-full md:h-[2px] w-[2px] md:w-full bg-white/10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0"></div>
           <motion.div 
             className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_2px_rgba(96,165,250,0.8)] will-change-transform"
             style={{ 
               left: 0,
               x: useMotionTemplate`${p3}%`,
               opacity: o3
             }}
           />
        </div>

        {/* Node 4: Merge */}
        <div className="relative group">
          <div className="w-16 h-16 rounded-xl bg-card border border-white/10 flex items-center justify-center relative z-10 shadow-xl transition-transform group-hover:scale-110 duration-300">
            <GitMerge className="w-8 h-8 text-purple-400" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-400 whitespace-nowrap">Merged</div>
        </div>

      </div>
    </div>
  );
}
