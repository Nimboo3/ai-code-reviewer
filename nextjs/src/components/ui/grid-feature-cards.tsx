'use client';

import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

type FeatureType = {
	title: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	description: string;
};

type FeatureCardProps = React.ComponentProps<'div'> & {
	feature: FeatureType;
	index?: number;
};

// Predefined patterns to avoid hydration mismatch (no Math.random during render)
const PATTERNS: number[][][] = [
	[[8, 2], [9, 4], [7, 3], [10, 5], [8, 6]],
	[[7, 1], [9, 3], [8, 5], [10, 2], [7, 4]],
	[[9, 2], [8, 4], [10, 1], [7, 5], [9, 6]],
	[[8, 3], [7, 1], [9, 5], [10, 4], [8, 2]],
	[[10, 1], [8, 3], [7, 5], [9, 2], [10, 6]],
	[[7, 4], [9, 1], [8, 6], [10, 3], [7, 2]],
];

export function FeatureCard({ feature, className, index = 0, ...props }: FeatureCardProps) {
	// Use deterministic pattern based on index
	const pattern = useMemo(() => PATTERNS[index % PATTERNS.length], [index]);

	return (
		<div className={cn('relative overflow-hidden p-6 group', className)} {...props}>
			<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
				<div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
					<GridPattern
						width={20}
						height={20}
						x="-12"
						y="4"
						squares={pattern}
						className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
					/>
				</div>
			</div>
			<feature.icon className="text-foreground/75 size-6" strokeWidth={1} aria-hidden />
			<h3 className="mt-10 text-sm md:text-base font-medium text-white">{feature.title}</h3>
			<p className="text-muted-foreground relative z-20 mt-2 text-xs font-light leading-relaxed">{feature.description}</p>
		</div>
	);
}

function GridPattern({
	width,
	height,
	x,
	y,
	squares,
	...props
}: React.ComponentProps<'svg'> & { width: number; height: number; x: string; y: string; squares?: number[][] }) {
	const patternId = React.useId();

	return (
		<svg aria-hidden="true" {...props}>
			<defs>
				<pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
					<path d={`M.5 ${height}V.5H${width}`} fill="none" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
			{squares && (
				<svg x={x} y={y} className="overflow-visible">
					{squares.map(([sqX, sqY], index) => (
						<rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={sqX * width} y={sqY * height} />
					))}
				</svg>
			)}
		</svg>
	);
}



export type { FeatureType };
