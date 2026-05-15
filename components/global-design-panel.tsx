"use client"

import { useEffect, useState } from "react"
import { X, ExternalLink, RefreshCw, Copy, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── Event helpers ──────────────────────────────────────────────────────────────

export function openDesignPanel() {
  window.dispatchEvent(new CustomEvent("design:open"))
}

// ── Tokens ────────────────────────────────────────────────────────────────────

const TOKEN_GROUPS = [
  {
    label: "Brand",
    tokens: [
      { var: "--primary", default: "oklch(0.488 0.243 264.376)", label: "Primary" },
      { var: "--primary-foreground", default: "oklch(0.97 0.014 254.604)", label: "Primary fg" },
      { var: "--destructive", default: "oklch(0.577 0.245 27.325)", label: "Destructive" },
    ],
  },
  {
    label: "Neutral",
    tokens: [
      { var: "--foreground", default: "oklch(0.141 0.005 285.823)", label: "Foreground" },
      { var: "--muted-foreground", default: "oklch(0.552 0.016 285.938)", label: "Muted text" },
      { var: "--border", default: "oklch(0.92 0.004 286.32)", label: "Border" },
    ],
  },
  {
    label: "Sidebar",
    tokens: [
      { var: "--sidebar-primary", default: "oklch(0.546 0.245 262.881)", label: "Active item" },
      { var: "--sidebar", default: "oklch(0.985 0 0)", label: "Background" },
    ],
  },
]

const ALL_DEFAULTS: Record<string, string> = {}
TOKEN_GROUPS.forEach((g) => g.tokens.forEach((t) => { ALL_DEFAULTS[t.var] = t.default }))

const PANEL_W = 320

function pushLayout(open: boolean) {
  const el = document.getElementById("app-content")
  if (el) el.style.paddingRight = open ? `${PANEL_W}px` : "0px"
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlobalDesignPanel() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({ ...ALL_DEFAULTS })
  const [radiusRem, setRadiusRem] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function onOpen() {
      setOpen((v) => {
        const next = !v
        pushLayout(next)
        return next
      })
    }
    window.addEventListener("design:open", onOpen)
    return () => window.removeEventListener("design:open", onOpen)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty("--radius", `${radiusRem}rem`)
  }, [radiusRem])

  function applyToken(varName: string, value: string) {
    setValues((prev) => ({ ...prev, [varName]: value }))
    document.documentElement.style.setProperty(varName, value)
  }

  function resetAll() {
    const root = document.documentElement
    TOKEN_GROUPS.forEach((g) =>
      g.tokens.forEach((t) => root.style.removeProperty(t.var))
    )
    root.style.setProperty("--radius", "0")
    setValues({ ...ALL_DEFAULTS })
    setRadiusRem(0)
  }

  function copyCss() {
    const lines = [
      ...TOKEN_GROUPS.flatMap((g) =>
        g.tokens.map((t) => `  ${t.var}: ${values[t.var] ?? t.default};`)
      ),
      `  --radius: ${radiusRem}rem;`,
    ].join("\n")
    navigator.clipboard.writeText(`:root {\n${lines}\n}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasChanges =
    radiusRem !== 0 ||
    TOKEN_GROUPS.some((g) =>
      g.tokens.some((t) => values[t.var] !== t.default)
    )

  function handleClose() {
    setOpen(false)
    pushLayout(false)
  }

  return (
    <div
      className={cn(
        "fixed top-[36px] right-0 bottom-0 z-[44] flex flex-col bg-white border-l border-border transition-all duration-300 ease-in-out overflow-hidden"
      )}
      style={{ width: open ? PANEL_W : 0, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-sm font-semibold">Design System</span>
        <div className="flex items-center gap-1.5">
          {hasChanges && (
            <>
              <button
                onClick={copyCss}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded hover:bg-muted"
                title="Copy CSS"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "CSS"}
              </button>
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-1 rounded hover:bg-muted"
                title="Reset"
              >
                <RefreshCw className="h-3 w-3" />
                Reset
              </button>
            </>
          )}
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">

        {/* Color tokens */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Colors
          </div>
          <div className="space-y-4">
            {TOKEN_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] text-muted-foreground mb-1.5 font-medium">{group.label}</div>
                <div className="space-y-1.5">
                  {group.tokens.map((token) => (
                    <div key={token.var} className="flex items-center gap-2">
                      {/* Swatch */}
                      <div
                        className="h-7 w-8 rounded border border-border shrink-0 transition-colors"
                        style={{ background: `var(${token.var})` }}
                      />
                      {/* Label + input */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-muted-foreground leading-none mb-0.5">
                          {token.label}
                        </div>
                        <input
                          className="w-full text-[10px] font-mono border border-border rounded px-1.5 py-0.5 bg-background text-foreground focus:outline-none focus:border-primary transition-colors"
                          value={values[token.var] ?? token.default}
                          onChange={(e) => applyToken(token.var, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Border radius */}
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Border Radius
          </div>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={radiusRem}
              onChange={(e) => setRadiusRem(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="font-mono text-[11px] text-foreground w-10 text-right tabular-nums">
              {radiusRem.toFixed(2)}
            </span>
          </div>
          {/* Visual scale preview */}
          <div className="flex items-end gap-1.5">
            {[
              { css: "--radius-sm", mult: 0.6 },
              { css: "--radius-md", mult: 0.8 },
              { css: "--radius", mult: 1 },
              { css: "--radius-xl", mult: 1.4 },
              { css: "--radius-2xl", mult: 1.8 },
            ].map((r) => (
              <div
                key={r.css}
                className="h-8 flex-1 bg-primary transition-all duration-200"
                style={{ borderRadius: `var(${r.css})` }}
              />
            ))}
          </div>
          <div className="flex gap-1.5 mt-0.5">
            {["sm", "md", "base", "xl", "2xl"].map((l) => (
              <div key={l} className="flex-1 text-center text-[9px] text-muted-foreground">{l}</div>
            ))}
          </div>
        </div>

        {/* Separator + link to full page */}
        <div className="border-t border-border pt-3">
          <Link
            href="/design-system"
            className="flex items-center justify-between w-full rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors group"
          >
            <span>Xem tất cả components</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  )
}
