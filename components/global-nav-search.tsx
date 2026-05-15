"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Search, X, BarChart3, Wrench, Receipt, Settings,
  ChevronRight, ExternalLink, LayoutDashboard,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────────────────────

type NavNode = {
  label: string
  href: string
  section: string
  SectionIcon: React.ElementType
  indent: number          // 0 = top-level, 1 = child
  badge?: string
  external?: boolean
  isParent?: boolean      // has children → show arrow
}

// ── Route detection ───────────────────────────────────────────────────────────

const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])

function getBasePath(pathname: string) {
  const seg = pathname.split("/")[1] ?? ""
  return ROOT_SECTIONS.has(seg) ? "" : `/${seg}`
}

// ── Navigation tree ───────────────────────────────────────────────────────────

function buildTree(basePath: string): { section: string; Icon: React.ElementType; nodes: NavNode[] }[] {
  const b = basePath
  return [
    {
      section: "Chi tiêu",
      Icon: BarChart3,
      nodes: [
        { label: "Tổng quan",             href: b === "" ? "/" : b,                      section: "Chi tiêu", SectionIcon: BarChart3,   indent: 0 },
        { label: "Chi tiêu tin Template", href: `${b}/chi-tieu/tin-template`,             section: "Chi tiêu", SectionIcon: BarChart3,   indent: 0 },
        { label: "Chi tiêu OA",           href: `${b}/chi-tieu/oa`,                      section: "Chi tiêu", SectionIcon: BarChart3,   indent: 0 },
        { label: "Quản lý Ngân Sách",     href: `${b}/chi-tieu/ngan-sach`,               section: "Chi tiêu", SectionIcon: BarChart3,   indent: 0, badge: "Beta" },
      ],
    },
    {
      section: "Công cụ",
      Icon: Wrench,
      nodes: [
        { label: "Dịch vụ gửi tin",        href: `${b}/cong-cu/gui-tin`,                       section: "Công cụ", SectionIcon: Wrench, indent: 0, isParent: true },
        { label: "Quản lý Template",        href: `${b}/cong-cu/gui-tin/quan-ly-template`,      section: "Công cụ", SectionIcon: Wrench, indent: 1 },
        { label: "Tạo Template",            href: `${b}/cong-cu/gui-tin/tao-template`,          section: "Công cụ", SectionIcon: Wrench, indent: 1 },
        { label: "Chất lượng gửi tin",      href: `${b}/cong-cu/gui-tin/chat-luong-gui-tin`,    section: "Công cụ", SectionIcon: Wrench, indent: 1 },
        { label: "Quản lý Logo",            href: `${b}/cong-cu/gui-tin/quan-ly-logo`,          section: "Công cụ", SectionIcon: Wrench, indent: 1 },
        { label: "Gửi theo chiến dịch",     href: `${b}/cong-cu/gui-tin/gui-theo-chien-dich`,   section: "Công cụ", SectionIcon: Wrench, indent: 1 },
        { label: "Dịch vụ OA",             href: `${b}/cong-cu/oa`,                            section: "Công cụ", SectionIcon: Wrench, indent: 0, external: true },
      ],
    },
    {
      section: "Giao dịch",
      Icon: Receipt,
      nodes: [
        { label: "Nạp tiền",               href: `${b}/giao-dich/nap-tien`,              section: "Giao dịch", SectionIcon: Receipt, indent: 0, isParent: true },
        { label: "Hướng dẫn chuyển khoản", href: `${b}/giao-dich/nap-tien/chuyen-khoan`, section: "Giao dịch", SectionIcon: Receipt, indent: 1 },
        { label: "Lịch sử giao dịch",      href: `${b}/giao-dich/lich-su`,               section: "Giao dịch", SectionIcon: Receipt, indent: 0 },
        { label: "Quản lý hóa đơn",        href: `${b}/giao-dich/hoa-don`,               section: "Giao dịch", SectionIcon: Receipt, indent: 0 },
      ],
    },
    {
      section: "Cài đặt",
      Icon: Settings,
      nodes: [
        { label: "Thông tin tài khoản",    href: `${b}/cai-dat/tai-khoan`,               section: "Cài đặt", SectionIcon: Settings, indent: 0 },
        { label: "Quản lý tài sản",        href: `${b}/cai-dat/tai-san`,                 section: "Cài đặt", SectionIcon: Settings, indent: 0 },
        { label: "Quản lý thành viên",     href: `${b}/cai-dat/thanh-vien`,              section: "Cài đặt", SectionIcon: Settings, indent: 0 },
        { label: "Quản lý thông báo",      href: `${b}/cai-dat/thong-bao`,               section: "Cài đặt", SectionIcon: Settings, indent: 0 },
      ],
    },
  ]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")   // strip diacritics
    .replace(/đ/g, "d")
}

// ── Event helpers (used by global-header button) ──────────────────────────────

export function openNavSearch() {
  window.dispatchEvent(new CustomEvent("nav-search:open"))
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GlobalNavSearch() {
  const [open, setOpen]     = useState(false)
  const [query, setQuery]   = useState("")
  const [cursor, setCursor] = useState(0)
  const inputRef  = useRef<HTMLInputElement>(null)
  const listRef   = useRef<HTMLDivElement>(null)
  const router    = useRouter()
  const pathname  = usePathname()
  const basePath  = getBasePath(pathname)
  const tree      = buildTree(basePath)

  // Flat list for search / keyboard nav
  const allNodes: NavNode[] = tree.flatMap(s => s.nodes)

  const filtered: NavNode[] = query.trim() === ""
    ? allNodes
    : allNodes.filter(n => normalize(n.label).includes(normalize(query)) || normalize(n.section).includes(normalize(query)))

  // Open/close
  const close = useCallback(() => { setOpen(false); setQuery(""); setCursor(0) }, [])

  useEffect(() => {
    function onOpen() { setOpen(v => !v) }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(v => !v) }
    }
    window.addEventListener("nav-search:open", onOpen)
    window.addEventListener("keydown", onKey)
    return () => { window.removeEventListener("nav-search:open", onOpen); window.removeEventListener("keydown", onKey) }
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 50); setCursor(0) }
  }, [open])

  // Keyboard navigation inside modal
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === "Enter" && filtered[cursor]) { navigate(filtered[cursor]) }
    if (e.key === "Escape") { close() }
  }

  // Scroll cursor into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: "nearest" })
  }, [cursor])

  function navigate(node: NavNode) {
    close()
    if (node.external) window.open(node.href, "_blank")
    else router.push(node.href)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[80px] px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={close}
    >
      <div
        className="w-full max-w-[560px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: "oklch(0.16 0.04 265)" }}
        onClick={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="h-4 w-4 text-white/40 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setCursor(0) }}
            placeholder="Tìm trang..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setCursor(0); inputRef.current?.focus() }} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="text-[10px] text-white/20 border border-white/10 rounded px-1.5 py-0.5 font-mono shrink-0">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[420px] overflow-y-auto py-2">
          {query.trim() === "" ? (
            // Tree view when no search
            tree.map(section => (
              <div key={section.section} className="mb-1">
                {/* Section header */}
                <div className="flex items-center gap-2 px-4 py-1.5">
                  <section.Icon className="h-3 w-3 text-white/30" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">{section.section}</span>
                </div>
                {/* Items */}
                {section.nodes.map((node) => {
                  const globalIdx = allNodes.indexOf(node)
                  return (
                    <NodeRow
                      key={node.href}
                      idx={globalIdx}
                      node={node}
                      active={cursor === globalIdx}
                      onHover={() => setCursor(globalIdx)}
                      onClick={() => navigate(node)}
                    />
                  )
                })}
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-white/30">Không tìm thấy trang nào</div>
          ) : (
            // Flat filtered list
            filtered.map((node, i) => (
              <NodeRow
                key={node.href}
                idx={i}
                node={node}
                active={cursor === i}
                onHover={() => setCursor(i)}
                onClick={() => navigate(node)}
                showSection
              />
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/10 text-[10px] text-white/20">
          <span><kbd className="border border-white/10 rounded px-1 font-mono">↑↓</kbd> điều hướng</span>
          <span><kbd className="border border-white/10 rounded px-1 font-mono">↵</kbd> mở trang</span>
          <span><kbd className="border border-white/10 rounded px-1 font-mono">⌘K</kbd> đóng</span>
        </div>
      </div>
    </div>
  )
}

// ── Node row ──────────────────────────────────────────────────────────────────

function NodeRow({
  node, idx, active, onHover, onClick, showSection,
}: {
  node: NavNode
  idx: number
  active: boolean
  onHover: () => void
  onClick: () => void
  showSection?: boolean
}) {
  return (
    <button
      data-idx={idx}
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors text-sm",
        active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white/80"
      )}
      style={{ paddingLeft: node.indent === 1 ? "2.5rem" : "1rem" }}
    >
      {/* Tree connector for children */}
      {node.indent === 1 && (
        <span className="text-white/20 shrink-0 text-xs leading-none">└</span>
      )}

      <span className="flex-1 truncate">{node.label}</span>

      {/* Section breadcrumb when in search mode */}
      {showSection && (
        <span className="text-[10px] text-white/25 shrink-0 flex items-center gap-1">
          <node.SectionIcon className="h-2.5 w-2.5" />
          {node.section}
        </span>
      )}

      {node.badge && (
        <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/15 text-white/40 shrink-0">{node.badge}</span>
      )}
      {node.external && (
        <ExternalLink className="h-3 w-3 text-white/25 shrink-0" />
      )}
      {node.isParent && !showSection && (
        <ChevronRight className="h-3 w-3 text-white/20 shrink-0" />
      )}

      {active && !node.external && (
        <kbd className="text-[9px] border border-white/15 rounded px-1 font-mono text-white/30 shrink-0">↵</kbd>
      )}
    </button>
  )
}
