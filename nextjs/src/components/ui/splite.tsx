'use client'

import { Suspense, lazy, useRef, useCallback } from 'react'
import type { Application, SPEObject } from '@splinetool/runtime'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<Application | null>(null)

  const onLoad = useCallback((splineApp: Application) => {
    splineRef.current = splineApp
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
      className="w-full h-full"
      onMouseLeave={handleMouseLeave}
    >
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          key={scene}
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  )
}