"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { GoArrowUpRight } from "react-icons/go"
import {
  HiOutlineHome,
  HiOutlineGlobe,
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
  HiOutlineAdjustments,
  HiOutlineDesktopComputer,
  HiOutlineQuestionMarkCircle,
  HiOutlineBookOpen,
} from "react-icons/hi"

/* ─── Nav data ─────────────────────────────────────────────── */
const NAV_ITEMS_SIDEBAR = [
  { id: "hero",       label: "Home",          Icon: HiOutlineHome },
  { id: "explore",    label: "Explore",       Icon: HiOutlineGlobe },
  { id: "discipline", label: "Discipline Hub",Icon: HiOutlineViewGrid },
  { id: "critiques",  label: "Discussions",   Icon: HiOutlineChatAlt2 },
  { id: "critique",   label: "Critique",      Icon: HiOutlineAdjustments },
  { id: "work",       label: "Showcase",      Icon: HiOutlineDesktopComputer },
  { id: "principles", label: "Help",          Icon: HiOutlineQuestionMarkCircle },
  { id: "colophon",   label: "Resources",     Icon: HiOutlineBookOpen },
]

/* ─── Card data for expanded nav ───────────────────────────── */
const CARD_DATA = [
  {
    label: "Create",
    bgColor: "#141414",
    textColor: "#fff",
    links: [
      { label: "New Showcase",  ariaLabel: "Post a new showcase",    href: "#work" },
      { label: "Open Critique", ariaLabel: "Request a critique",     href: "#critiques" },
      { label: "Ask for Help",  ariaLabel: "Post a help question",   href: "#principles" },
    ],
  },
  {
    label: "Explore",
    bgColor: "#1a1a1a",
    textColor: "#fff",
    links: [
      { label: "Architecture",   ariaLabel: "Architecture community", href: "#" },
      { label: "Interior",       ariaLabel: "Interior design",        href: "#" },
      { label: "Product Design", ariaLabel: "Product design",         href: "#" },
      { label: "Urban Design",   ariaLabel: "Urban design",           href: "#" },
    ],
  },
  {
    label: "Resources",
    bgColor: "#1f1a14",
    textColor: "#fff",
    links: [
      { label: "Templates",    ariaLabel: "Free templates",     href: "#colophon" },
      { label: "Tutorials",    ariaLabel: "Video tutorials",    href: "#colophon" },
      { label: "Style Guides", ariaLabel: "Style guides",       href: "#colophon" },
    ],
  },
]

/* ─── CardNav ───────────────────────────────────────────────── */
export function CardNav() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const navRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  /* Track active section via IntersectionObserver */
  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { threshold: 0.3 },
    )
    NAV_ITEMS_SIDEBAR.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    // close panel after navigating
    if (isExpanded) toggleMenu()
  }

  /* ── GSAP timeline ── */
  const calculateHeight = () => {
    if (!navRef.current) return 260
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    if (isMobile) {
      const contentEl = navRef.current.querySelector<HTMLElement>(".cnav-content")
      if (contentEl) {
        const prev = { vis: contentEl.style.visibility, pe: contentEl.style.pointerEvents, pos: contentEl.style.position, h: contentEl.style.height }
        Object.assign(contentEl.style, { visibility: "visible", pointerEvents: "auto", position: "static", height: "auto" })
        void contentEl.offsetHeight
        const result = 60 + contentEl.scrollHeight + 16
        Object.assign(contentEl.style, { visibility: prev.vis, pointerEvents: prev.pe, position: prev.pos, height: prev.h })
        return result
      }
    }
    return 260
  }

  const buildTimeline = () => {
    if (!navRef.current) return null
    gsap.set(navRef.current, { height: 60, overflow: "hidden" })
    gsap.set(cardsRef.current, { y: 50, opacity: 0 })
    const tl = gsap.timeline({ paused: true })
    tl.to(navRef.current, { height: calculateHeight, duration: 0.4, ease: "power3.out" })
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.08 }, "-=0.1")
    return tl
  }

  useLayoutEffect(() => {
    const tl = buildTimeline()
    tlRef.current = tl
    return () => { tl?.kill(); tlRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return
      if (isExpanded) {
        gsap.set(navRef.current, { height: calculateHeight() })
        tlRef.current.kill()
        const tl = buildTimeline()
        if (tl) { tl.progress(1); tlRef.current = tl }
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
    <>
      {/* ── Left sidebar dot-nav (visible on md+) ── */}
      <nav
        className="fixed left-0 top-0 z-50 h-screen hidden md:flex flex-col bg-[oklch(0.06_0_0)] border-r border-white/5"
        style={{ width: "220px" }}
        aria-label="Site navigation"
      >
        {/* Logo area */}
        <div className="px-5 pt-6 pb-4 border-b border-white/5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.7_0.2_45)]">Navigation</span>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 px-3 pt-3 flex-1">
          {NAV_ITEMS_SIDEBAR.map(({ id, label, Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-left transition-all duration-200
                  ${isActive
                    ? "bg-white/8 text-foreground"
                    : "text-[oklch(0.55_0_0)] hover:text-[oklch(0.8_0_0)] hover:bg-white/5"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? "text-[oklch(0.7_0.2_45)]" : "text-current"
                  }`}
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] tracking-wide">
                  {label}
                </span>
                {isActive && (
                  <span className="ml-auto w-1 h-1 rounded-full bg-[oklch(0.7_0.2_45)]" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="px-4 py-5 border-t border-white/5">
          <button className="w-full font-mono text-[10px] uppercase tracking-widest py-2.5 bg-[oklch(0.7_0.2_45)] text-[oklch(0.08_0_0)] hover:bg-[oklch(0.75_0.2_45)] transition-colors duration-200">
            Join the Hub
          </button>
        </div>
      </nav>

      {/* ── Mobile CardNav pill ── */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl z-50 md:hidden">
        <nav
          ref={navRef}
          className={`cnav relative overflow-hidden rounded-xl border border-white/10 shadow-2xl ${isExpanded ? "cnav-open" : ""}`}
          style={{ height: 56, backgroundColor: "oklch(0.08 0 0)" }}
          aria-label="Mobile navigation"
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-10">
            {/* Hamburger */}
            <button
              className={`cnav-hamburger flex flex-col justify-center gap-[6px] cursor-pointer ${isHamburgerOpen ? "cnav-hamburger-open" : ""}`}
              onClick={toggleMenu}
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              style={{ color: "oklch(0.8 0 0)" }}
            >
              <span className="cnav-line block w-6 h-0.5 bg-current transition-transform duration-250 origin-center" />
              <span className="cnav-line block w-6 h-0.5 bg-current transition-transform duration-250 origin-center" />
            </button>

            {/* Logo */}
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[oklch(0.7_0.2_45)] absolute left-1/2 -translate-x-1/2">
              Designers Hub
            </span>

            {/* CTA */}
            <button className="font-mono text-[10px] uppercase tracking-widest px-4 py-1.5 bg-[oklch(0.7_0.2_45)] text-[oklch(0.08_0_0)] rounded-md">
              Join
            </button>
          </div>

          {/* Cards */}
          <div
            className={`cnav-content absolute left-0 right-0 bottom-0 top-14 p-2 flex gap-2 ${isExpanded ? "cnav-content-visible" : ""}`}
            aria-hidden={!isExpanded}
          >
            {CARD_DATA.map((item, idx) => (
              <div
                key={item.label}
                ref={(el) => { if (el) cardsRef.current[idx] = el }}
                className="flex-1 rounded-lg flex flex-col p-3 gap-2 min-w-0"
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
              >
                <div className="font-[var(--font-bebas)] text-xl tracking-wide">{item.label}</div>
                <div className="mt-auto flex flex-col gap-1">
                  {item.links.map((lnk) => (
                    <a
                      key={lnk.label}
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      className="text-[13px] inline-flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity duration-200"
                      onClick={() => { if (isExpanded) toggleMenu() }}
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
      </div>
    </>
  )
}
