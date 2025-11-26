import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn(
      "group relative p-8 rounded-xl bg-card border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
      className
    )}>
      {/* Metallic Border Gradient */}
      <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors z-20 pointer-events-none"></div>
      
      {/* Inner Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Icon */}
      <div className="relative z-10 mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
        <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
      </div>
      
      {/* Content */}
      <h3 className="relative z-10 text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="relative z-10 text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {description}
      </p>
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
