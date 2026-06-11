'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

interface GridMotionProps {
  className?: string
  color?: string
  opacity?: number
  cellSize?: number
}

export function GridMotion({ className = '', color = '220, 160, 60', opacity = 0.08, cellSize = 40 }: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<HTMLCanvasElement>(null)
  const xRef = useRef(0)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    // Set initial dimensions on mount to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const container = containerRef.current
    const canvas = svgRef.current

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const motion = { x: 0 }

    const render = () => {
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = `rgba(${color}, ${opacity})`
      ctx.lineWidth = 1

      // Draw vertical lines
      for (let x = motion.x % cellSize; x < width; x += cellSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y < height; y += cellSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(render)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left

      gsap.to(motion, {
        x: x * 0.3,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          xRef.current = motion.x
        },
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [color, opacity, cellSize])

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Canvas for grid lines */}
      <canvas
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Gradient fade-out on right and bottom */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-background via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
    </div>
  )
}
