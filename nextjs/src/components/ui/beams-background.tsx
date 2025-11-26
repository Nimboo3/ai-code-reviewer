"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

// Generate beam configurations for a rich, animated-looking static display
const beamConfigs = [
    // Far left beams
    { left: '2%', width: 45, hue: 195, opacityMult: 0.6, angle: -38, blur: 35 },
    { left: '5%', width: 70, hue: 200, opacityMult: 0.8, angle: -32, blur: 45 },
    { left: '8%', width: 55, hue: 188, opacityMult: 0.5, angle: -36, blur: 40 },
    // Left side beams
    { left: '12%', width: 85, hue: 205, opacityMult: 0.9, angle: -30, blur: 50 },
    { left: '16%', width: 50, hue: 192, opacityMult: 0.65, angle: -35, blur: 38 },
    { left: '20%', width: 75, hue: 210, opacityMult: 0.75, angle: -28, blur: 45 },
    { left: '24%', width: 60, hue: 185, opacityMult: 0.55, angle: -40, blur: 42 },
    // Left-center beams  
    { left: '28%', width: 90, hue: 198, opacityMult: 1, angle: -33, blur: 55 },
    { left: '32%', width: 55, hue: 215, opacityMult: 0.7, angle: -29, blur: 40 },
    { left: '36%', width: 80, hue: 190, opacityMult: 0.85, angle: -37, blur: 48 },
    // Center beams - brightest
    { left: '40%', width: 65, hue: 202, opacityMult: 0.9, angle: -31, blur: 45 },
    { left: '44%', width: 100, hue: 195, opacityMult: 1, angle: -34, blur: 60 },
    { left: '48%', width: 70, hue: 208, opacityMult: 0.95, angle: -28, blur: 50 },
    { left: '52%', width: 95, hue: 188, opacityMult: 1, angle: -36, blur: 55 },
    { left: '56%', width: 60, hue: 212, opacityMult: 0.8, angle: -32, blur: 45 },
    // Right-center beams
    { left: '60%', width: 85, hue: 195, opacityMult: 0.9, angle: -30, blur: 52 },
    { left: '64%', width: 50, hue: 220, opacityMult: 0.65, angle: -38, blur: 40 },
    { left: '68%', width: 75, hue: 200, opacityMult: 0.8, angle: -27, blur: 48 },
    // Right side beams
    { left: '72%', width: 90, hue: 185, opacityMult: 0.85, angle: -35, blur: 50 },
    { left: '76%', width: 55, hue: 210, opacityMult: 0.6, angle: -33, blur: 42 },
    { left: '80%', width: 70, hue: 192, opacityMult: 0.75, angle: -29, blur: 45 },
    { left: '84%', width: 60, hue: 205, opacityMult: 0.7, angle: -37, blur: 40 },
    // Far right beams
    { left: '88%', width: 80, hue: 198, opacityMult: 0.55, angle: -31, blur: 48 },
    { left: '92%', width: 45, hue: 215, opacityMult: 0.5, angle: -34, blur: 35 },
    { left: '96%', width: 65, hue: 190, opacityMult: 0.45, angle: -40, blur: 42 },
];

export function BeamsBackground({
    className,
    children,
    intensity = "medium",
}: AnimatedGradientBackgroundProps) {
    const opacityMap = {
        subtle: 0.14,
        medium: 0.2,
        strong: 0.28,
    };
    
    const baseOpacity = opacityMap[intensity];

    return (
        <div className={cn("relative w-full overflow-hidden bg-background", className)}>
            {/* Static beam gradients - many beams to simulate smooth animated look */}
            <div className="absolute inset-0 overflow-hidden">
                {beamConfigs.map((beam, index) => {
                    const beamOpacity = baseOpacity * beam.opacityMult;
                    return (
                        <div
                            key={index}
                            className="absolute h-[250%] -top-[75%]"
                            style={{
                                left: beam.left,
                                width: `${beam.width}px`,
                                background: `linear-gradient(180deg, 
                                    transparent 0%, 
                                    hsla(${beam.hue}, 85%, 65%, ${beamOpacity * 0.3}) 15%,
                                    hsla(${beam.hue}, 85%, 65%, ${beamOpacity}) 35%, 
                                    hsla(${beam.hue}, 85%, 65%, ${beamOpacity}) 65%, 
                                    hsla(${beam.hue}, 85%, 65%, ${beamOpacity * 0.3}) 85%,
                                    transparent 100%)`,
                                transform: `rotate(${beam.angle}deg)`,
                                filter: `blur(${beam.blur}px)`,
                            }}
                        />
                    );
                })}
            </div>

            {/* Soft overlay to blend and add depth */}
            <div 
                className="absolute inset-0 bg-background/5"
                style={{ backdropFilter: "blur(80px)" }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
