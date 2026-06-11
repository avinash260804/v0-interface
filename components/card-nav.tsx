"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { GoArrowUpRight } from "react-icons/go"

/* ─── Card data ─────────────────────────────────────────────── */
const CARD_DATA = [
  {
    label: "Explore",
    bgColor: "#141414",
    textColor: "#fff",
    links: [
      { label: "Architecture",   ariaLabel: "Architecture community", href: "#work" },
      { label: "Interior Design",ariaLabel: "Interior design",        href: "#work" },
      { label: "Product Design", ariaLabel: "Product design",         href: "#work" },
      { label: "Urban Design",   ariaLabel: "Urban design",           href: "#work" },
      { label: "Graphic Design", ariaLabel: "Graphic design",         href: "#work" },
    ],
  },
  {
    label: "Community",
    bgColor: "#1a1614",
    textColor: "#fff",
    links: [
      { label: "Discussions",    ariaLabel: "Community discussions",  href: "#critiques" },
      { label: "Critique",       ariaLabel: "Request a critique",     href: "#critiques" },
      { label: "Showcase",       ariaLabel: "Browse showcases",       href: "#work" },
      { label: "Help Forum",     ariaLabel: "Get technical help",     href: "#principles" },
    ],
  },
  {
    label: "Resources",
    bgColor: "#111820",
    textColor: "#fff",
    links: [
      { label: "Templates",      ariaLabel: "Free design templates",  href: "#colophon" },
      { label: "Tutorials",      ariaLabel: "Video tutorials",        href: "#colophon" },
      { label: "Style Guides",   ariaLabel: "Style guides",           href: "#colophon" },
      { label: "Tool Guides",    ariaLabel: "Software tool guides",   href: "#colophon" },
    ],
  },
]

export function CardNav() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const calculateHeight = () => {
    if (!navRef.current) return 260
    const isMobile = window.matchMedia("(max-width: 640px)").matches
    if (isMobile) {
      const contentEl = navRef.current.querySelector<HTMLElement>(".cnav-content")
      if (contentEl) {
        const prev = {
          vis: contentEl.style.visibility,
          pe: contentEl.style.pointerEvents,
          pos: contentEl.style.position,
          h: contentEl.style.height,
        }
        Object.assign(contentEl.style, {
          visibility: "visible",
          pointerEvents: "auto",
          position: "static",
          height: "auto",
        })
        void contentEl.offsetHeight
        const result = 60 + contentEl.scrollHeight + 16
        Object.assign(contentEl.style, {
          visibility: prev.vis,
          pointerEvents: prev.pe,
          position: prev.pos,
          height: prev.h,
        })
        return result
      }
    }
    return 260
  }

  const buildTimeline = () => {
    const navEl = navRef.current
    if (!navEl) return null
    gsap.set(navEl, { height: 60, overflow: "hidden" })
    gsap.set(cardsRef.current, { y: 50, opacity: 0 })
    const tl = gsap.timeline({ paused: true })
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease: "power3.out" })
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.08 },
      "-=0.1",
    )
    return tl
  }

  useLayoutEffect(() => {
    const tl = buildTimeline()
    tlRef.current = tl
    return () => {
      tl?.kill()
      tlRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return
      if (isExpanded) {
        gsap.set(navRef.current, { height: calculateHeight() })
        tlRef.current.kill()
        const tl = buildTimeline()
        if (tl) {
          tl.progress(1)
          tlRef.current = tl
        }
      } else {
        tlRef.current.kill()
        const tl = buildTimeline()
        if (tl) tlRef.current = tl
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded])

  const toggleMenu = () => {
    const tl = tlRef.current
    if (!tl) return
    if (!isExpanded) {
      setIsHamburgerOpen(true)
      setIsExpanded(true)
      tl.play(0)
    } else {
      setIsHamburgerOpen(false)
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false))
      tl.reverse()
    }
  }

  return (
    /* Centred floating pill — positioned above all content */
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-3xl z-50">
      <nav
        ref={navRef}
        className={`relative overflow-hidden rounded-xl shadow-2xl ${isExpanded ? "cnav-open" : ""}`}
        style={{
          height: 60,
          backgroundColor: "oklch(0.09 0 0)",
          border: "0.5px solid rgba(255,255,255,0.1)",
        }}
        aria-label="Site navigation"
      >
        {/* ── Top bar ── */}
        <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 z-10">
          {/* Hamburger */}
          <button
            className="flex flex-col justify-center gap-[6px] cursor-pointer h-full px-1"
            onClick={toggleMenu}
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            style={{ color: "oklch(0.8 0 0)" }}
          >
            <span
              className="block w-[30px] h-[2px] bg-current origin-center"
              style={{
                transition: "transform 0.25s ease, opacity 0.2s ease",
                transform: isHamburgerOpen ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-[30px] h-[2px] bg-current origin-center"
              style={{
                transition: "transform 0.25s ease, opacity 0.2s ease",
                transform: isHamburgerOpen ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>

          {/* Logo — centred absolutely */}
          <span
            className="absolute left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: "oklch(0.7 0.2 45)" }}
          >
            Designers Hub
          </span>

          {/* CTA */}
          <button
            className="font-mono text-[10px] uppercase tracking-widest px-4 h-[36px] rounded-lg transition-colors duration-200"
            style={{
              backgroundColor: "oklch(0.7 0.2 45)",
              color: "oklch(0.08 0 0)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "oklch(0.75 0.2 45)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "oklch(0.7 0.2 45)")}
          >
            Join the Hub
          </button>
        </div>

        {/* ── Card panels ── */}
        <div
          className={`cnav-content absolute left-0 right-0 bottom-0 top-[60px] p-2 flex gap-3 items-stretch ${
            isExpanded ? "cnav-content-visible" : ""
          }`}
          aria-hidden={!isExpanded}
        >
          {CARD_DATA.map((item, idx) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el
              }}
              className="flex-1 min-w-0 rounded-[10px] flex flex-col p-4 gap-2"
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              {/* Card heading */}
              <div
                className="font-[var(--font-bebas)] text-[22px] tracking-wide leading-none"
                style={{ letterSpacing: "-0.5px" }}
              >
                {item.label}
              </div>

              {/* Links */}
              <div className="mt-auto flex flex-col gap-[3px]">
                {item.links.map((lnk) => (
                  <a
                    key={lnk.label}
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    className="inline-flex items-center gap-1.5 text-[15px] opacity-60 hover:opacity-100 transition-opacity duration-200"
                    style={{ textDecoration: "none", color: item.textColor }}
                    onClick={() => {
                      if (isExpanded) toggleMenu()
                    }}
                  >
                    <GoArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Inline styles for visibility toggling (can't use Tailwind for .cnav-content) */}
      <style>{`
        .cnav-content {
          visibility: hidden;
          pointer-events: none;
        }
        .cnav-open .cnav-content {
          visibility: visible;
          pointer-events: auto;
        }
      `}</style>
    </div>
  )
}
