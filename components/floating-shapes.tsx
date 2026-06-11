"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface Shape {
  id: number
  type: "circle" | "line"
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  depth: number
}

// Use a fixed seed to ensure server/client render consistency
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const generateShapes = (): Shape[] => {
  const shapes: Shape[] = []
  let id = 0

  // Create circles at various depths
  for (let depth = 0; depth < 3; depth++) {
    const count = 3 + depth
    for (let i = 0; i < count; i++) {
      const seed = depth * 100 + i
      shapes.push({
        id: id++,
        type: "circle",
        x: seededRandom(seed) * 100,
        y: seededRandom(seed + 1) * 100,
        size: 20 + seededRandom(seed + 2) * 80,
        duration: 8 + seededRandom(seed + 3) * 6,
        delay: seededRandom(seed + 4) * 2,
        opacity: 0.03 + seededRandom(seed + 5) * 0.05,
        depth,
      })
    }
  }

  // Create subtle lines
  for (let i = 0; i < 4; i++) {
    const seed = 500 + i
    shapes.push({
      id: id++,
      type: "line",
      x: seededRandom(seed) * 100,
      y: seededRandom(seed + 1) * 100,
      size: 60 + seededRandom(seed + 2) * 200,
      duration: 12 + seededRandom(seed + 3) * 8,
      delay: seededRandom(seed + 4) * 3,
      opacity: 0.02 + seededRandom(seed + 5) * 0.03,
      depth: Math.floor(seededRandom(seed + 6) * 3),
    })
  }

  return shapes
}

export function FloatingShapes() {
  const containerRef = useRef<SVGSVGElement>(null)
  const [shapes, setShapes] = useState<Shape[]>([])
  const animationRef = useRef<ReturnType<typeof gsap.context> | null>(null)

  // Initialize shapes once on mount to avoid hydration mismatch
  useEffect(() => {
    setShapes(generateShapes())
  }, [])

  useEffect(() => {
    if (!containerRef.current || shapes.length === 0) return

    animationRef.current = gsap.context(() => {
      shapes.forEach((shape) => {
        const element = containerRef.current?.querySelector(`[data-shape-id="${shape.id}"]`)
        if (!element) return

        const randomOffset = seededRandom(shape.id * 7)
        const endX = shape.x + (randomOffset - 0.5) * 40
        const endY = shape.y + (seededRandom(shape.id * 8) - 0.5) * 40

        // Continuous floating animation
        gsap.to(element, {
          attr: {
            cx: shape.type === "circle" ? endX : undefined,
            cy: shape.type === "circle" ? endY : undefined,
            x1: shape.type === "line" ? endX : undefined,
            y1: shape.type === "line" ? endY : undefined,
          },
          duration: shape.duration,
          delay: shape.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })

        // Subtle opacity breathing
        gsap.to(element, {
          opacity: shape.opacity * 0.5,
          duration: shape.duration * 0.8,
          delay: shape.delay,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })
    }, containerRef)

    return () => animationRef.current?.revert()
  }, [shapes])

  return (
    <svg
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="blur-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>

      {shapes.map((shape) => {
        if (shape.type === "circle") {
          return (
            <circle
              key={shape.id}
              data-shape-id={shape.id}
              cx={`${shape.x}%`}
              cy={`${shape.y}%`}
              r={shape.size / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity={shape.opacity}
              filter="url(#blur-filter)"
              className="text-accent"
            />
          )
        } else {
          // Lines
          const randomOffset = seededRandom(shape.id * 7)
          const endX = shape.x + (randomOffset - 0.5) * 30
          const endY = shape.y + (seededRandom(shape.id * 8) - 0.5) * 30
          return (
            <line
              key={shape.id}
              data-shape-id={shape.id}
              x1={`${shape.x}%`}
              y1={`${shape.y}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="currentColor"
              strokeWidth="1"
              opacity={shape.opacity}
              filter="url(#blur-filter)"
              className="text-accent"
            />
          )
        }
      })}
    </svg>
  )
}

