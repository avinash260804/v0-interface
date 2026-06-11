'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface GridMotionProps {
  className?: string
  /** Number of tile columns per row */
  columns?: number
  /** Number of rows */
  rows?: number
  /** Base speed in px/s for the slowest row */
  speed?: number
  /** Tile gap in px */
  gap?: number
  /** Accent color rgb string for the radial glow inside tiles */
  glowColor?: string
}

export function GridMotion({
  className = '',
  columns = 3,
  rows = 4,
  speed = 18,
  gap = 8,
  glowColor = '220, 160, 60',
}: GridMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rowEls = Array.from(container.querySelectorAll<HTMLDivElement>('[data-grid-row]'))
    const tweens: gsap.core.Tween[] = []

    rowEls.forEach((row, i) => {
      const trackEl = row.querySelector<HTMLDivElement>('[data-grid-track]')
      if (!trackEl) return

      // Alternate direction per row
      const dir = i % 2 === 0 ? -1 : 1
      // Vary speed slightly per row
      const rowSpeed = speed * (0.8 + i * 0.12)

      // Clone tiles so the marquee is seamless
      const tiles = Array.from(trackEl.children) as HTMLElement[]
      tiles.forEach((tile) => {
        const clone = tile.cloneNode(true) as HTMLElement
        trackEl.appendChild(clone)
      })

      const trackWidth = trackEl.scrollWidth / 2

      // Set initial x for RTL rows so they start mid-scroll
      if (dir === 1) {
        gsap.set(trackEl, { x: -trackWidth })
      }

      const tween = gsap.to(trackEl, {
        x: dir === -1 ? -trackWidth : 0,
        duration: trackWidth / rowSpeed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (x) => {
            const val = parseFloat(x)
            if (dir === -1) {
              return `${((val % -trackWidth) - (val % -trackWidth > 0 ? trackWidth : 0))}px`
            } else {
              const m = val % trackWidth
              return `${m >= 0 ? m - trackWidth : m}px`
            }
          },
        },
      })

      tweens.push(tween)
    })

    return () => {
      tweens.forEach((t) => t.kill())
    }
  }, [speed, columns, rows])

  // Build tile items — each tile has a dark bg with a subtle radial oval glow
  const tiles = Array.from({ length: columns })

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex flex-col overflow-hidden pointer-events-none ${className}`}
      style={{ gap }}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          data-grid-row
          className="flex-1 overflow-hidden"
        >
          <div
            data-grid-track
            className="flex h-full will-change-transform"
            style={{ gap }}
          >
            {tiles.map((_, colIdx) => (
              <div
                key={colIdx}
                className="relative flex-shrink-0 rounded-[4px] overflow-hidden"
                style={{
                  width: `calc((100% - ${(columns - 1) * gap}px) / ${columns})`,
                  background: 'rgba(255,255,255,0.022)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {/* Radial gradient waveform — matches reference oval glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(${glowColor}, 0.13) 0%, rgba(${glowColor}, 0.04) 40%, transparent 70%)`,
                  }}
                />
                {/* Concentric ring texture */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-[0.07]"
                  viewBox="0 0 100 80"
                  preserveAspectRatio="xMidYMid slice"
                >
                  {[8, 16, 24, 32, 40, 48].map((r) => (
                    <ellipse
                      key={r}
                      cx="50"
                      cy="40"
                      rx={r * 1.3}
                      ry={r}
                      fill="none"
                      stroke={`rgba(${glowColor}, 1)`}
                      strokeWidth="0.5"
                    />
                  ))}
                </svg>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Left fade — softens where grid meets the content on the left */}
      <div
        className="absolute inset-y-0 left-0 w-1/3 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, var(--color-background) 0%, transparent 100%)',
        }}
      />
      {/* Right fade — softens toward viewport right edge */}
      <div
        className="absolute inset-y-0 right-0 w-1/4 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, var(--color-background) 0%, transparent 100%)',
        }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--color-background) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}
