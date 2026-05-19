"use client"

import { useState, useMemo, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Check, X, Info, ChevronDown, ChevronUp, Minus, Plus,
  Search, Zap, AlertCircle, Library, Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────────────────────

const APPS = ["QC Test ZNS 4", "ZNS Service", "Test ZBS App", "QC Test App New", "Andy Hotel"]
const OAS  = ["QC Test ZNS 4", "Trợ lý tin doanh nghiệp", "ZBS Account", "Zalo Business Solutions", "QC OA 1"]

const TEMPLATE_TYPES = [
  { id: "tuy-chinh",   icon: "✏️", label: "Mẫu tuỳ chỉnh",          price: "Từ 210đ/tin" },
  { id: "xac-thuc",   icon: "🔐", label: "Mẫu xác thực",            price: "Từ 280đ/tin" },
  { id: "danh-gia",   icon: "⭐", label: "Mẫu đánh giá dịch vụ",   price: "Từ 210đ/tin" },
  { id: "thanh-toan", icon: "💳", label: "Mẫu yêu cầu thanh toán", price: "Từ 210đ/tin" },
  { id: "voucher",    icon: "🎟️", label: "Mẫu Voucher",             price: "Từ 280đ/tin" },
]
const PURPOSES = [
  { id: "cap-do-1", label: "Cấp độ 1", sub: "Giao dịch" },
  { id: "cap-do-2", label: "Cấp độ 2", sub: "Chăm sóc khách hàng" },
  { id: "cap-do-3", label: "Cấp độ 3", sub: "Hậu mãi" },
]

// Button types — each has an id, display label, cost, and whether it needs a URL field
const BUTTON_TYPES = [
  { group: "ĐẾN TÀI SẢN ZALO", items: [
    { id: "oa-profile", label: "Đến trang thông tin OA",       cost: 0,   hasUrl: false, placeholder: "Chọn OA" },
    { id: "mini-app",   label: "Đến Zalo Mini App",            cost: 100, hasUrl: false, placeholder: "Chọn Mini App" },
    { id: "oa-post",    label: "Đến bài viết OA",              cost: 100, hasUrl: false, placeholder: "Chọn bài viết" },
  ]},
  { group: "LIÊN KẾT TÙY CHỈNH", items: [
    { id: "custom-url", label: "Đến URL tùy chỉnh",            cost: 100, hasUrl: true,  placeholder: "https://..." },
  ]},
]
const ALL_BUTTON_TYPES = BUTTON_TYPES.flatMap((g) => g.items)

// ActionButton — each button in a template
interface ActionButton {
  id: number
  type: string    // id from ALL_BUTTON_TYPES
  label: string   // display text in message
  url: string     // URL or link value
  // verified/edited derived from content match — no state needed
}

const MAX_BUTTONS = 3

const TECH_SETTINGS = ["Tên khách hàng (30)", "Tên sản phẩm / Thương hiệu (200)", "Số điện thoại (15)", "Mã giao dịch (50)", "Trạng thái (50)", "Ngày giờ (20)", "Số tiền (20)", "Địa chỉ (200)"]

// ── Verified Component types ───────────────────────────────────────────────────

type ComponentStatus = "ENABLE" | "PENDING" | "NEW"
type VCKind          = "logo" | "content" | "button"
type VCSource        = "predefined" | "user"
type PreviewRender   = "logo" | "voucher" | "rating" | "payment-table" | "image" | "carousel" | "text" | "button"
type LibCategory = "all" | VCKind | PreviewRender

interface ComponentTag { label: string; status: ComponentStatus }
interface VComponent {
  id: string; kind: VCKind; source: VCSource
  name: string; description: string; initials: string; bgColor: string
  tags: ComponentTag[]; previewRender: PreviewRender
}

// ── Predefined library ─────────────────────────────────────────────────────────

const ALL_ENABLE: ComponentTag[] = [
  { label: "Giao dịch", status: "ENABLE" },
  { label: "Chăm sóc KH", status: "ENABLE" },
  { label: "Hậu mãi", status: "ENABLE" },
]

const PREDEFINED: VComponent[] = [
  { id: "pre-banner",      kind: "content", source: "predefined", name: "Banner hình ảnh",  description: "Ảnh banner tuỳ chỉnh",         initials: "🖼️", bgColor: "oklch(0.92 0.06 300)", tags: ALL_ENABLE, previewRender: "image"   },
  { id: "pre-carousel",   kind: "content", source: "predefined", name: "Carousel ảnh",     description: "Bộ ảnh tự động chuyển slide",  initials: "▶",  bgColor: "oklch(0.91 0.05 240)", tags: ALL_ENABLE, previewRender: "carousel" },
  { id: "pre-btn-view",   kind: "button",  source: "predefined", name: "Nút Xem chi tiết", description: "CTA mặc định Zalo",            initials: "→",  bgColor: "oklch(0.88 0.08 265)", tags: ALL_ENABLE, previewRender: "button"  },
  { id: "pre-btn-confirm",kind: "button",  source: "predefined", name: "Nút Xác nhận",     description: "CTA xác nhận giao dịch",       initials: "✓",  bgColor: "oklch(0.88 0.08 145)", tags: ALL_ENABLE, previewRender: "button"  },
]

const USER_APPROVED: VComponent[] = [
  { id: "user-logo-atp",       kind: "logo",    source: "user", name: "Logo ATP Software",    description: "Logo thương hiệu ATP",
    initials: "AT", bgColor: "oklch(0.92 0.06 50)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "logo" },
  { id: "user-logo-zbs",       kind: "logo",    source: "user", name: "Logo ZBS Brandmark",   description: "Logo Zalo Business",
    initials: "ZB", bgColor: "oklch(0.92 0.05 265)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "PENDING" }, { label: "Hậu mãi", status: "NEW" }], previewRender: "logo" },
  { id: "user-content-welcome",kind: "content", source: "user", name: "Nội dung chào mừng",  description: "Văn bản chào thành viên mới",
    initials: "👋", bgColor: "oklch(0.94 0.04 145)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }], previewRender: "text" },
  { id: "user-btn-order",      kind: "button",  source: "user", name: "CTA Xem đơn hàng",     description: "Nút xem chi tiết đơn hàng",
    initials: "→",  bgColor: "oklch(0.88 0.08 265)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }], previewRender: "button" },
  { id: "user-btn-rating",     kind: "button",  source: "user", name: "CTA Đánh giá dịch vụ", description: "Nút đánh giá dịch vụ",
    initials: "⭐", bgColor: "oklch(0.92 0.07 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "PENDING" }], previewRender: "button" },
]

// All library items — used for content-based verified matching
const ALL_LIBRARY = [...PREDEFINED, ...USER_APPROVED]

// Derive verified status purely from content match — no state needed
function isLabelVerified(label: string): boolean {
  return ALL_LIBRARY.some((vc) => vc.kind === "button" && vc.name === label.trim())
}
function isTextVerified(value: string): boolean {
  return ALL_LIBRARY.some((vc) => vc.previewRender === "text" &&
    (vc.name === value.trim() || vc.description === value.trim()))
}

// ── Block types ───────────────────────────────────────────────────────────────

type BlockType = "text" | "table"
interface TextBlock  { type: "text";  id: number; value: string }
interface TableBlock { type: "table"; id: number; rows: { label: string; value: string }[] }
type Block = TextBlock | TableBlock

function extractParams(title: string, blocks: Block[]): string[] {
  const re = /<([^>]+)>/g
  const set = new Set<string>()
  const scan = (s: string) => { let m; while ((m = re.exec(s)) !== null) set.add(m[1]); re.lastIndex = 0 }
  scan(title)
  blocks.forEach((b) => {
    if (b.type === "text") scan(b.value)
    else b.rows.forEach((r) => { scan(r.label); scan(r.value) })
  })
  return [...set]
}

// ── Tag badge ─────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<ComponentStatus, { bg: string; text: string; dotCls: string; shortLabel: string }> = {
  ENABLE:  { bg: "bg-green-100",  text: "text-green-700",  dotCls: "bg-green-500",  shortLabel: "✓" },
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", dotCls: "bg-yellow-400", shortLabel: "Chờ duyệt" },
  NEW:     { bg: "bg-gray-100",   text: "text-gray-600",   dotCls: "bg-gray-400",   shortLabel: "Mới" },
}
function TagBadge({ tag, tiny }: { tag: ComponentTag; tiny?: boolean }) {
  const cfg = STATUS_CFG[tag.status]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full font-medium",
      tiny ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5", cfg.bg, cfg.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dotCls)} />
      {tag.label} {cfg.shortLabel}
    </span>
  )
}

// ── Carousel auto-swipe ───────────────────────────────────────────────────────

const CAROUSEL_SLIDES = [
  { emoji: "🏖️", label: "Hè rực rỡ 2024" },
  { emoji: "🎁", label: "Ưu đãi đặc biệt" },
  { emoji: "✨", label: "Khuyến mãi tháng 6" },
]
function CarouselPreview({ dark }: { dark: boolean }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % CAROUSEL_SLIDES.length), 1800)
    return () => clearInterval(t)
  }, [])
  return (
    <div className={cn("rounded-lg overflow-hidden relative h-16", dark ? "bg-gray-700" : "bg-gradient-to-br from-blue-50 to-indigo-100")}>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-xl">{CAROUSEL_SLIDES[idx].emoji}</span>
        <span className={cn("text-[10px] font-semibold", dark ? "text-gray-200" : "text-indigo-700")}>{CAROUSEL_SLIDES[idx].label}</span>
      </div>
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
        {CAROUSEL_SLIDES.map((_, i) => (
          <div key={i} className={cn("h-1 rounded-full transition-all duration-300", i === idx ? "w-4 bg-blue-500" : "w-1.5 bg-gray-400/60")} />
        ))}
      </div>
    </div>
  )
}

// ── Preview item renderer ─────────────────────────────────────────────────────

function PreviewItem({ vc, dark }: { vc: VComponent; dark: boolean }) {
  switch (vc.previewRender) {
    case "voucher":
      return (
        <div className={cn("rounded-lg border-2 border-dashed p-3 text-center", dark ? "border-orange-700 bg-orange-950/30" : "border-orange-300 bg-orange-50")}>
          <div className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", dark ? "text-orange-400" : "text-orange-600")}>VOUCHER</div>
          <div className={cn("text-lg font-black", dark ? "text-white" : "text-gray-900")}>-20%</div>
          <div className={cn("text-[9px] font-mono mt-1 px-2 py-0.5 rounded border border-dashed inline-block", dark ? "border-orange-700 text-orange-300" : "border-orange-300 text-orange-700")}>SUMMER20</div>
        </div>
      )
    case "rating":
      return (
        <div className={cn("rounded-lg p-3 text-center", dark ? "bg-gray-800" : "bg-gray-50")}>
          <div className={cn("text-[10px] mb-1.5", dark ? "text-gray-400" : "text-gray-500")}>Bạn có hài lòng với dịch vụ?</div>
          <div className="flex justify-center gap-1 text-base">⭐⭐⭐⭐⭐</div>
        </div>
      )
    case "payment-table":
      return (
        <div className="text-[10px]">
          {[["Mã đơn", "#DH20240531"], ["Tổng tiền", "500.000đ"], ["Trạng thái", "Đã thanh toán"]].map(([k, v]) => (
            <div key={k} className={cn("flex justify-between py-1 border-b last:border-0", dark ? "border-gray-700" : "border-gray-100")}>
              <span className={dark ? "text-gray-400" : "text-gray-500"}>{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
      )
    case "image":
      return <div className={cn("h-14 rounded-lg flex items-center justify-center text-2xl", dark ? "bg-gray-700" : "bg-gray-100")}>🖼️</div>
    case "carousel":
      return <CarouselPreview dark={dark} />
    case "text":
      return <p className={cn("text-[11px] leading-relaxed", dark ? "text-gray-400" : "text-gray-600")}>Chào mừng bạn đã trở thành thành viên! Khám phá ngay các ưu đãi độc quyền.</p>
    default:
      return null
  }
}

// ── Component Library Drawer ──────────────────────────────────────────────────

const LIB_CATEGORIES: { id: LibCategory; label: string }[] = [
  { id: "all",           label: "Tất cả" },
  { id: "logo",          label: "Logo" },
  { id: "button",        label: "Nút" },
  { id: "text",          label: "Văn bản" },
  { id: "voucher",       label: "Voucher" },
  { id: "payment-table", label: "Thanh toán" },
  { id: "rating",        label: "Đánh giá" },
  { id: "image",         label: "Hình ảnh" },
  { id: "carousel",      label: "Carousel" },
]

function ComponentLibraryDrawer({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void
  onAdd: (c: VComponent) => void
}) {
  const [search, setSearch]     = useState("")
  const [category, setCategory] = useState<LibCategory>("all")
  const [toast, setToast]       = useState<string | null>(null)

  function handleAdd(c: VComponent) {
    onAdd(c)
    setToast(c.name)
    setTimeout(() => setToast(null), 1600)
  }

  const filtered = ALL_LIBRARY.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (category === "all") return true
    return c.kind === category || c.previewRender === category
  })

  // Only show category pills that have at least 1 item
  const availableCategories = LIB_CATEGORIES.filter((cat) =>
    cat.id === "all" || ALL_LIBRARY.some((c) => c.kind === cat.id || c.previewRender === cat.id)
  )

  return (
    <>
      {open && <div className="absolute inset-0 bg-black/20 z-10" onClick={onClose} />}
      <div className={cn(
        "absolute left-0 right-0 bottom-0 bg-white border-t border-border shadow-2xl z-20 flex flex-col transition-transform duration-300 ease-out",
        open ? "translate-y-0" : "translate-y-full",
      )} style={{ height: "44%" }}>
        {/* Handle */}
        <div className="flex justify-center pt-2.5 pb-1 shrink-0">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-2.5 border-b border-border shrink-0">
          <span className="text-sm font-semibold shrink-0">Thư viện Component</span>
          <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none">
            {availableCategories.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={cn("shrink-0 px-3 py-1 text-xs font-medium rounded-full border transition-all whitespace-nowrap",
                  category === cat.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:text-blue-600")}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm component..."
              className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Không có component nào</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filtered.map((c) => (
                <button key={c.id} onClick={() => handleAdd(c)}
                  className="rounded-xl border-2 border-border bg-white hover:border-blue-400 hover:shadow-sm p-3 text-left transition-all active:scale-95">
                  <div className="h-11 rounded-lg flex items-center justify-center mb-2 text-base font-bold border border-black/5" style={{ background: c.bgColor }}>
                    {c.initials}
                  </div>
                  <p className="text-[11px] font-semibold truncate mb-0.5">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate mb-1.5">{c.description}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {c.tags.map((t, i) => (
                      <span key={t.label}>
                        <span className={t.status === "ENABLE" ? "text-green-700" : t.status === "PENDING" ? "text-yellow-700" : "text-gray-500"}>
                          {t.label}{t.status === "PENDING" ? " ⚠" : t.status === "NEW" ? " –" : ""}
                        </span>
                        {i < c.tags.length - 1 && <span className="text-gray-300">, </span>}
                      </span>
                    ))}
                  </p>
                  <div className="mt-2 text-center text-[10px] font-semibold text-blue-500">
                    + Thêm vào template
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toast confirmation */}
        <div className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg transition-all duration-200 pointer-events-none",
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <Check className="h-3.5 w-3.5 text-green-400" />
          Đã thêm <span className="font-semibold">{toast}</span>
        </div>
      </div>
    </>
  )
}

// ── Approval check ────────────────────────────────────────────────────────────

function ApprovalCheckContent({ verifiedComponents }: { verifiedComponents: VComponent[] }) {
  const allTags        = verifiedComponents.flatMap((c) => c.tags)
  const nonEnableCount = allTags.filter((t) => t.status !== "ENABLE").length
  const isEligible     = verifiedComponents.length > 0 && nonEnableCount === 0
  const byKind: Record<VCKind, VComponent[]> = {
    logo:    verifiedComponents.filter((c) => c.kind === "logo"),
    content: verifiedComponents.filter((c) => c.kind === "content"),
    button:  verifiedComponents.filter((c) => c.kind === "button"),
  }
  const kindLabel: Record<VCKind, string> = { logo: "Logo", content: "Nội dung", button: "Nút CTA" }

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold mb-0.5">Kiểm tra tự động duyệt</p>
        <p className="text-[10px] text-muted-foreground">Cập nhật theo component đã thêm</p>
      </div>
      {verifiedComponents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center">
          <Library className="h-6 w-6 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Chưa có component nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(["logo", "content", "button"] as VCKind[]).map((kind) => {
            const items = byKind[kind]
            if (!items.length) return null
            return (
              <div key={kind}>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{kindLabel[kind]}</p>
                <div className="space-y-1.5">
                  {items.map((vc) => (
                    <div key={vc.id} className="rounded-lg border border-border bg-white p-2.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: vc.bgColor }}>
                          {vc.initials.slice(0, 2)}
                        </div>
                        <p className="text-xs font-semibold truncate flex-1">{vc.name}</p>
                        <span className="text-[9px] text-muted-foreground shrink-0">{vc.source === "predefined" ? "Mẫu" : "Của bạn"}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vc.tags.map((t) => <TagBadge key={t.label} tag={t} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {verifiedComponents.length > 0 && (
        <div className={cn("rounded-lg p-3 text-xs mt-auto",
          isEligible ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200")}>
          {isEligible ? (
            <div className="flex items-center gap-1.5 font-semibold text-green-700">
              <Zap className="h-3.5 w-3.5" /> Đủ điều kiện tự động duyệt ⚡
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-yellow-800 mb-0.5">
                <AlertCircle className="h-3.5 w-3.5" /> Cần duyệt thủ công
              </div>
              <p className="text-yellow-700">{nonEnableCount} tag chưa được duyệt</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── VC chip ───────────────────────────────────────────────────────────────────

function VCChip({ vc, onRemove, showMove, onMoveUp, onMoveDown, isFirst, isLast }: {
  vc: VComponent; onRemove: () => void
  showMove?: boolean; onMoveUp?: () => void; onMoveDown?: () => void
  isFirst?: boolean; isLast?: boolean
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
      <div className="h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: vc.bgColor }}>
        {vc.initials.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{vc.name}</p>
        <p className="text-[10px] text-muted-foreground">{vc.source === "predefined" ? "Mẫu nền tảng" : "Của bạn"}</p>
      </div>
      {showMove && (
        <div className="flex flex-col gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 rounded hover:bg-blue-100 disabled:opacity-30"><ChevronUp className="h-3 w-3" /></button>
          <button onClick={onMoveDown} disabled={isLast} className="p-0.5 rounded hover:bg-blue-100 disabled:opacity-30"><ChevronDown className="h-3 w-3" /></button>
        </div>
      )}
      <button onClick={onRemove} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ── Step 2 right panel ────────────────────────────────────────────────────────

function Step2RightPanel({ dark, setDark, title, blocks, actionButtons, templateType, verifiedComponents }: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtons: ActionButton[]; templateType: string
  verifiedComponents: VComponent[]
}) {
  const [tab, setTab] = useState<"preview" | "library">("preview")
  const typeInfo   = TEMPLATE_TYPES.find((t) => t.id === templateType)
  const allTags    = verifiedComponents.flatMap((c) => c.tags)
  const isEligible = allTags.length > 0 && allTags.every((t) => t.status === "ENABLE")
  const logoVC     = verifiedComponents.find((c) => c.kind === "logo")
  const contentVCs = verifiedComponents.filter((c) => c.kind === "content")
  const buttonVCs  = verifiedComponents.filter((c) => c.kind === "button")

  // Pricing
  const btnCost = actionButtons.reduce((sum, b) => {
    const type = ALL_BUTTON_TYPES.find((t) => t.id === b.type)
    return sum + (type?.cost ?? 0)
  }, 0)
  const basePrice = 300
  const totalPrice = basePrice + btnCost

  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex border-b border-border bg-white shrink-0">
        <button onClick={() => setTab("preview")}
          className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
            tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground")}>
          📋 Xem trước
        </button>
        <button onClick={() => setTab("library")}
          className={cn("flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
            tab === "library" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground")}>
          {isEligible && verifiedComponents.length > 0 ? <Zap className="h-3 w-3 text-green-600" />
            : verifiedComponents.length > 0 ? <AlertCircle className="h-3 w-3 text-yellow-500" />
            : <Library className="h-3 w-3" />}
          Thư viện
          {verifiedComponents.length > 0 && tab !== "library" && (
            <span className="ml-0.5 h-4 w-4 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold flex items-center justify-center">
              {verifiedComponents.length}
            </span>
          )}
        </button>
      </div>

      {tab === "preview" ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Giao diện tối</span>
            <button onClick={() => setDark(!dark)} className={cn("relative h-5 w-9 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}>
              <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", dark ? "translate-x-4" : "translate-x-0.5")} />
            </button>
          </div>

          <div className={cn("rounded-lg border border-border overflow-hidden text-sm", dark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
            <div className={cn("px-4 py-3 flex items-center gap-2", dark ? "bg-gray-800" : "bg-orange-50")}>
              {logoVC ? (
                <>
                  <div className="h-6 w-6 rounded text-[9px] font-bold flex items-center justify-center shrink-0" style={{ background: logoVC.bgColor }}>
                    {logoVC.initials.slice(0, 2)}
                  </div>
                  <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>{logoVC.name}</div>
                </>
              ) : (
                <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>
                  ATP <span className={dark ? "text-white" : "text-gray-800"}>SOFTWARE</span>
                </div>
              )}
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-[13px] font-semibold leading-snug">{title || "Tiêu đề template"}</p>
              {blocks.map((b) => {
                if (b.type === "text") return (
                  <p key={b.id} className={cn("text-[12px] leading-relaxed", dark ? "text-gray-300" : "text-gray-700")}>
                    {b.value || <span className="italic text-gray-400">Nội dung văn bản...</span>}
                  </p>
                )
                return (
                  <table key={b.id} className="w-full text-[11px]">
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} className={cn("border-t", dark ? "border-gray-700" : "border-gray-100")}>
                          <td className={cn("py-1 pr-2 font-medium", dark ? "text-gray-400" : "text-gray-500")}>{r.label}</td>
                          <td className="py-1 font-semibold">{r.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              })}
              {contentVCs.map((vc) => (
                <PreviewItem key={vc.id} vc={vc} dark={dark} />
              ))}
              {/* Buttons — library VCs + manual action buttons combined */}
              {(buttonVCs.length > 0 || actionButtons.length > 0) ? (
                <div className="mt-2 space-y-1.5">
                  {buttonVCs.map((vc, i) => (
                    <button key={vc.id} className={cn("w-full py-2 rounded text-xs font-semibold text-white")}
                      style={{ background: "oklch(0.488 0.243 264.376)" }}>
                      {vc.name}
                    </button>
                  ))}
                  {actionButtons.map((ab, i) => (
                    <button key={ab.id} className={cn("w-full py-2 rounded text-xs font-semibold transition-colors",
                      (buttonVCs.length === 0 && i === 0) ? "text-white" : dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
                    )} style={(buttonVCs.length === 0 && i === 0) ? { background: "oklch(0.488 0.243 264.376)" } : undefined}>
                      {ab.label || `Nút thao tác ${i + 1}`}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded border p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{typeInfo?.label ?? "Mẫu tuỳ chỉnh"}</span>
              <span className="font-semibold">300 VNĐ</span>
            </div>
            {actionButtons.map((ab, i) => {
              const type = ALL_BUTTON_TYPES.find((t) => t.id === ab.type)
              return (
                <div key={ab.id} className="flex justify-between">
                  <span className="text-muted-foreground">Nút thao tác {i + 1}</span>
                  <span className="font-semibold">{type?.cost ?? 0} VNĐ</span>
                </div>
              )
            })}
            <div className="border-t border-border pt-1.5 mt-1.5 space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">Đơn giá dự kiến <Info className="h-3 w-3" /></span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gửi qua SĐT</span><span className="font-semibold text-foreground">{totalPrice} VNĐ/tin</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gửi qua UID</span><span className="font-semibold text-foreground">{totalPrice - 50} VNĐ/tin</span>
              </div>
            </div>
          </div>
          <button className="w-full text-sm font-medium py-2 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors">
            Gửi thử mẫu ZBS
          </button>
        </div>
      ) : (
        <ApprovalCheckContent verifiedComponents={verifiedComponents} />
      )}
    </div>
  )
}

// ── Step header ───────────────────────────────────────────────────────────────

const STEP_LABELS = ["Thông tin chung", "Khai báo nội dung", "Gửi duyệt"]
function StepHeader({ step, onExit, saved }: { step: number; onExit: () => void; saved: boolean }) {
  return (
    <div className="flex items-center h-14 px-8 border-b border-border shrink-0 bg-white">
      <div className="flex items-center gap-0 flex-1">
        {STEP_LABELS.map((label, i) => {
          const done = i < step; const active = i === step
          return (
            <div key={i} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0",
                  done || active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400")}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium", active || done ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={cn("w-16 h-px mx-4", done ? "bg-blue-600" : "bg-gray-200")} />}
            </div>
          )
        })}
      </div>
      <button onClick={onExit} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
        {saved ? "Lưu và thoát" : "Thoát"}
      </button>
    </div>
  )
}

// ── Tips panel ────────────────────────────────────────────────────────────────

function TipsPanel() {
  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 p-5 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-base">💡</div>
        <span className="text-sm font-semibold">Gợi ý khi tạo Template</span>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {[
          <>Bạn sẽ cần liên kết ứng dụng và OA để bắt đầu gửi tin qua SĐT. Đọc hướng dẫn <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span>.</>,
          <>Trong trường hợp không chọn được OA, vui lòng đọc thêm <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span>.</>,
          <>Đặt tên mẫu Template giúp bạn quản lý các mẫu đã tạo thuận tiện hơn.</>,
        ].map((tip, i) => (
          <li key={i} className="flex gap-2">
            <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Preview panel (Step 3) ────────────────────────────────────────────────────

function PreviewPanel({ dark, setDark, title, blocks, actionButtons, templateType }: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtons: ActionButton[]; templateType: string
}) {
  const typeInfo = TEMPLATE_TYPES.find((t) => t.id === templateType)
  const btnCost  = actionButtons.reduce((sum, b) => sum + (ALL_BUTTON_TYPES.find((t) => t.id === b.type)?.cost ?? 0), 0)
  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 overflow-y-auto p-5 space-y-4">
      <span className="text-sm font-semibold block">Xem trước Template</span>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Giao diện tối</span>
        <button onClick={() => setDark(!dark)} className={cn("relative h-5 w-9 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}>
          <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", dark ? "translate-x-4" : "translate-x-0.5")} />
        </button>
      </div>
      <div className={cn("rounded-lg border border-border overflow-hidden text-sm", dark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
        <div className={cn("px-4 py-3", dark ? "bg-gray-800" : "bg-orange-50")}>
          <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>ATP <span className={dark ? "text-white" : "text-gray-800"}>SOFTWARE</span></div>
        </div>
        <div className="px-4 py-3 space-y-2">
          <p className="text-[13px] font-semibold leading-snug">{title || "Tiêu đề template"}</p>
          {blocks.map((b) => b.type === "text" ? (
            <p key={b.id} className={cn("text-[12px] leading-relaxed", dark ? "text-gray-300" : "text-gray-700")}>{b.value || <span className="italic text-gray-400">...</span>}</p>
          ) : (
            <table key={b.id} className="w-full text-[11px]">
              <tbody>{b.rows.map((r, ri) => (
                <tr key={ri} className={cn("border-t", dark ? "border-gray-700" : "border-gray-100")}>
                  <td className={cn("py-1 pr-2 font-medium", dark ? "text-gray-400" : "text-gray-500")}>{r.label}</td>
                  <td className="py-1 font-semibold">{r.value}</td>
                </tr>
              ))}</tbody>
            </table>
          ))}
          {actionButtons.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {actionButtons.map((ab, i) => (
                <button key={ab.id} className={cn("w-full py-2 rounded text-xs font-semibold",
                  i === 0 ? "text-white" : dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
                )} style={i === 0 ? { background: "oklch(0.488 0.243 264.376)" } : undefined}>
                  {ab.label || `Nút thao tác ${i + 1}`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="rounded border p-3 text-xs space-y-1.5">
        <div className="flex justify-between"><span className="text-muted-foreground">{typeInfo?.label}</span><span className="font-semibold">300 VNĐ</span></div>
        {actionButtons.map((ab, i) => {
          const type = ALL_BUTTON_TYPES.find((t) => t.id === ab.type)
          return <div key={ab.id} className="flex justify-between"><span className="text-muted-foreground">Nút thao tác {i + 1}</span><span className="font-semibold">{type?.cost ?? 0} VNĐ</span></div>
        })}
        <div className="border-t border-border pt-1.5 mt-1.5 space-y-1">
          <div className="flex justify-between text-muted-foreground"><span>Gửi qua SĐT</span><span className="font-semibold text-foreground">{300 + btnCost} VNĐ/tin</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Gửi qua UID</span><span className="font-semibold text-foreground">{250 + btnCost} VNĐ/tin</span></div>
        </div>
      </div>
      <button className="w-full text-sm font-medium py-2 rounded border border-blue-300 text-blue-600 hover:bg-blue-50">Gửi thử mẫu ZBS</button>
    </div>
  )
}

// ── Action Button Card (one per button in the form) ───────────────────────────

function ActionButtonCard({
  btn, index, total, onChange, onRemove,
}: {
  btn: ActionButton; index: number; total: number
  onChange: (updated: ActionButton) => void
  onRemove: () => void
}) {
  const [typeOpen, setTypeOpen] = useState(false)
  const selectedType = ALL_BUTTON_TYPES.find((t) => t.id === btn.type)

  return (
    <div className="rounded-lg border border-border bg-white overflow-visible">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Nút thao tác {index + 1}</span>
          {isLabelVerified(btn.label) && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <Check className="h-2.5 w-2.5" /> Đã duyệt
            </span>
          )}
        </div>
        <button onClick={onRemove} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Loại nút — custom dropdown */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Loại nút</label>
          <div className="relative">
            <button
              onClick={() => setTypeOpen(!typeOpen)}
              className={cn("w-full flex items-center justify-between border border-border rounded-lg px-3 h-10 text-sm bg-white hover:border-blue-400 transition-colors", typeOpen && "border-blue-500 ring-1 ring-blue-500")}
            >
              <span className={selectedType ? "text-foreground font-medium" : "text-muted-foreground"}>
                {selectedType ? selectedType.label : "Chọn loại nút..."}
              </span>
              <div className="flex items-center gap-2">
                {selectedType && (
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    selectedType.cost === 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  )}>+{selectedType.cost}đ</span>
                )}
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", typeOpen && "rotate-180")} />
              </div>
            </button>
            {typeOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                {BUTTON_TYPES.map((group) => (
                  <div key={group.group}>
                    <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-50 border-b border-border">{group.group}</div>
                    {group.items.map((item) => (
                      <button key={item.id}
                        onClick={() => { onChange({ ...btn, type: item.id }); setTypeOpen(false) }}
                        className={cn("w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 transition-colors text-left",
                          btn.type === item.id && "bg-blue-50"
                        )}
                      >
                        <div>
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-[11px] text-muted-foreground">{item.placeholder}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded",
                            item.cost === 0 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          )}>+{item.cost}đ</span>
                          {btn.type === item.id && <Check className="h-3.5 w-3.5 text-blue-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nội dung nút */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nội dung nút <span className="text-red-500">*</span></label>
          <Input
            value={btn.label}
            onChange={(e) => onChange({ ...btn, label: e.target.value })}
            placeholder="VD: Xem đơn hàng, Tìm hiểu thêm..."
            className="h-9 text-sm"
          />
        </div>

        {/* URL (chỉ hiện khi type = custom-url) */}
        {selectedType?.hasUrl && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Đường dẫn liên kết <span className="text-red-500">*</span></label>
            <Input
              value={btn.url}
              onChange={(e) => onChange({ ...btn, url: e.target.value })}
              placeholder="https://..."
              className="h-9 text-sm"
            />
          </div>
        )}

        {btn.label.trim() && !isLabelVerified(btn.label) && (
          <p className="text-[10px] text-amber-600 pt-1">
            ⚠ Nội dung chỉnh sửa sẽ không được tự động duyệt
          </p>
        )}
      </div>
    </div>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

function Step1({ templateName, setTemplateName, selectedApp, setSelectedApp, selectedOA, setSelectedOA }: {
  templateName: string; setTemplateName: (v: string) => void
  selectedApp: string; setSelectedApp: (v: string) => void
  selectedOA: string; setSelectedOA: (v: string) => void
}) {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="text-2xl font-bold mb-1">Thông tin chung</h1>
        <p className="text-sm text-muted-foreground mb-8">Khai báo các thông tin bên dưới để tạo Template</p>
        <div className="space-y-6 max-w-[600px]">
          <div>
            <label className="text-sm font-semibold mb-2 block">Tên mẫu Template <span className="text-red-500">*</span></label>
            <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="VD: Xác nhận đơn hàng thành công" className="h-10" />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-1.5">Chọn App <Info className="h-4 w-4 text-muted-foreground" /> <span className="text-red-500">*</span></label>
            <div className="relative">
              <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="w-full appearance-none border border-border rounded-md px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-10">
                <option value="">-- Chọn App --</option>
                {APPS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Chọn OA <span className="text-red-500">*</span></label>
            <div className="relative">
              <select value={selectedOA} onChange={(e) => setSelectedOA(e.target.value)} className="w-full appearance-none border border-border rounded-md px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-10">
                <option value="">-- Chọn OA --</option>
                {OAS.map((o) => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      <TipsPanel />
    </div>
  )
}

// ── Step 2 ────────────────────────────────────────────────────────────────────

function Step2({
  templateType, setTemplateType, purpose, setPurpose,
  title, setTitle, blocks, setBlocks,
  actionButtons, setActionButtons, dark, setDark,
  verifiedComponents, onRemoveVC, onMoveVC,
}: {
  templateType: string; setTemplateType: (v: string) => void
  purpose: string; setPurpose: (v: string) => void
  title: string; setTitle: (v: string) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  actionButtons: ActionButton[]; setActionButtons: (b: ActionButton[]) => void
  dark: boolean; setDark: (v: boolean) => void
  verifiedComponents: VComponent[]
  onRemoveVC: (id: string) => void
  onMoveVC: (index: number, dir: -1 | 1) => void
}) {
  const [logoOpen, setLogoOpen] = useState(true)
  const [btnOpen, setBtnOpen]   = useState(true)
  const nextBtnId = useMemo(() => Math.max(0, ...actionButtons.map((b) => b.id)) + 1, [actionButtons])
  const nextBlockId = useMemo(() => Math.max(0, ...blocks.map((b) => b.id)) + 1, [blocks])

  const logoVC     = verifiedComponents.find((c) => c.kind === "logo")
  const contentVCs = verifiedComponents.filter((c) => c.kind === "content")
  const buttonVCs  = verifiedComponents.filter((c) => c.kind === "button")

  function addBlock(type: BlockType) {
    if (type === "text") setBlocks([...blocks, { type: "text", id: nextBlockId, value: "" }])
    else setBlocks([...blocks, { type: "table", id: nextBlockId, rows: [{ label: "", value: "" }] }])
  }
  function updateTextBlock(id: number, value: string) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "text" ? { ...b, value } : b))
  }
  function updateTableRow(id: number, ri: number, field: "label" | "value", val: string) {
    setBlocks(blocks.map((b) => b.id !== id || b.type !== "table" ? b : { ...b, rows: b.rows.map((r, i) => i === ri ? { ...r, [field]: val } : r) }))
  }
  function addTableRow(id: number) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "table" ? { ...b, rows: [...b.rows, { label: "", value: "" }] } : b))
  }
  function removeTableRow(id: number, ri: number) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "table" ? { ...b, rows: b.rows.filter((_, i) => i !== ri) } : b))
  }
  function removeBlock(id: number) {
    setBlocks(blocks.filter((b) => b.id !== id))
  }
  function addActionButton() {
    setActionButtons([...actionButtons, { id: nextBtnId, type: "oa-profile", label: "", url: "" }])
  }
  function updateActionButton(id: number, updated: ActionButton) {
    setActionButtons(actionButtons.map((b) => b.id === id ? updated : b))
  }
  function removeActionButton(id: number) {
    setActionButtons(actionButtons.filter((b) => b.id !== id))
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="text-2xl font-bold mb-1">Khai báo nội dung</h1>
        <p className="text-sm text-muted-foreground mb-6">Chọn loại Template, mục đích và các thành phần cần thiết</p>

        {/* Template type */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Chọn loại Template</h2>
          <div className="grid grid-cols-4 gap-3">
            {TEMPLATE_TYPES.slice(0, 4).map((t) => (
              <button key={t.id} onClick={() => setTemplateType(t.id)}
                className={cn("rounded-lg border-2 p-3 text-left transition-all relative", templateType === t.id ? "border-blue-600 bg-blue-50" : "border-border bg-white hover:border-gray-300")}>
                {templateType === t.id && <Check className="absolute top-2 right-2 h-4 w-4 text-blue-600" />}
                <div className="text-xl mb-2">{t.icon}</div>
                <div className="text-xs font-semibold leading-tight mb-0.5">{t.label}</div>
                <div className="text-[11px] text-blue-600">{t.price}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {TEMPLATE_TYPES.slice(4).map((t) => (
              <button key={t.id} onClick={() => setTemplateType(t.id)}
                className={cn("rounded-lg border-2 p-3 text-left transition-all relative", templateType === t.id ? "border-blue-600 bg-blue-50" : "border-border bg-white hover:border-gray-300")}>
                {templateType === t.id && <Check className="absolute top-2 right-2 h-4 w-4 text-blue-600" />}
                <div className="text-xl mb-2">{t.icon}</div>
                <div className="text-xs font-semibold leading-tight mb-0.5">{t.label}</div>
                <div className="text-[11px] text-blue-600">{t.price}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Purpose */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            Chọn mục đích gửi tin ZBS <Info className="h-4 w-4 text-muted-foreground" />
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PURPOSES.map((p) => (
              <button key={p.id} onClick={() => setPurpose(p.id)}
                className={cn("rounded-lg border-2 p-4 text-left transition-all relative", purpose === p.id ? "border-blue-600 bg-blue-50" : "border-border bg-white hover:border-gray-300")}>
                {purpose === p.id && <Check className="absolute top-2.5 right-2.5 h-4 w-4 text-blue-600" />}
                <Info className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <div className="mt-4 text-sm font-semibold">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Logo */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <button onClick={() => setLogoOpen(!logoOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold">
            <span>Logo, hình ảnh <span className="text-red-500">*</span></span>
            {logoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {logoOpen && (
            <div className="px-4 pb-4 border-t border-border">
              <p className="text-xs text-muted-foreground mt-3 mb-3">Tối đa 1 logo hoặc 3 hình ảnh</p>
              <div className="rounded border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Logo</span>
                  <div className="flex items-center gap-2">
                    {logoVC && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <Check className="h-2.5 w-2.5" /> Đã duyệt
                      </span>
                    )}
                    <button
                      className="text-red-400 hover:text-red-600"
                      onClick={logoVC ? () => onRemoveVC(logoVC.id) : undefined}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Logo sau khi được duyệt sẽ được tự động cập nhật cho các mẫu ZBS của OA, xem gợi ý <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span></p>
                <div className="grid grid-cols-2 gap-4">
                  {["Giao diện sáng", "Giao diện tối"].map((label, i) => (
                    <div key={i}>
                      <div className="text-xs font-semibold mb-2">{label} <span className="text-red-500">*</span></div>
                      <div className={cn("h-24 rounded border-2 flex items-center justify-center cursor-pointer transition-colors",
                        logoVC ? (i === 1 ? "bg-gray-900 border-gray-700" : "bg-white border-green-300")
                               : (i === 1 ? "bg-gray-900 border-gray-600 border-dashed hover:border-blue-400" : "bg-white border-gray-300 border-dashed hover:border-blue-400"))}>
                        {logoVC ? (
                          <div className={cn("text-sm font-bold tracking-wide", i === 1 ? "text-orange-300" : "text-orange-500")}>
                            {logoVC.initials} <span className={i === 1 ? "text-white" : "text-gray-700"}>{logoVC.name.replace(/^Logo\s*/i, "")}</span>
                          </div>
                        ) : (
                          <div className={cn("text-xs font-bold tracking-wide", i === 1 ? "text-orange-400" : "text-orange-600")}>
                            ATP <span className={i === 1 ? "text-white" : "text-gray-800"}>SOFTWARE</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Content */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold">Nội dung Template</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded border border-border p-3">
              <div className="text-xs font-semibold mb-1 flex items-center justify-between">
                <span>Tiêu đề <span className="text-red-500">*</span></span>
                <span className="text-muted-foreground font-normal">Mỗi tin chỉ chứa 1 tiêu đề</span>
              </div>
              <Input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 65))} className="text-sm border-0 px-0 focus-visible:ring-0 h-8" placeholder="Nhập tiêu đề..." />
              <div className="text-right text-[10px] text-muted-foreground mt-1">{title.length}/65</div>
            </div>
            {blocks.map((b) => b.type === "text" ? (
              <div key={b.id} className="rounded border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold">Văn bản <span className="text-red-500">*</span></div>
                  <div className="flex items-center gap-2">
                    {isTextVerified(b.value) ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <Check className="h-2.5 w-2.5" /> Đã duyệt
                      </span>
                    ) : null}
                    <button onClick={() => removeBlock(b.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <textarea value={b.value}
                  onChange={(e) => updateTextBlock(b.id, e.target.value.slice(0, 400))}
                  rows={3} className="w-full text-sm border-0 resize-none focus:outline-none" placeholder="Nhập nội dung văn bản..." />
                <div className="flex items-center justify-between">
                  {!isTextVerified(b.value) && b.value.trim()
                    ? <p className="text-[10px] text-amber-600">⚠ Nội dung chỉnh sửa sẽ không được tự động duyệt</p>
                    : <span />}
                  <div className="text-[10px] text-muted-foreground">{b.value.length}/400</div>
                </div>
              </div>
            ) : (
              <div key={b.id} className="rounded border border-border p-3">
                <div className="text-xs font-semibold mb-3">Bảng</div>
                <div className="grid grid-cols-[1fr_1fr_24px] gap-2 text-xs font-semibold text-muted-foreground mb-2">
                  <span>Tiêu đề</span><span>Nội dung</span><span />
                </div>
                {b.rows.map((r, ri) => (
                  <div key={ri} className="grid grid-cols-[1fr_1fr_24px] gap-2 mb-2">
                    <Input value={r.label} onChange={(e) => updateTableRow(b.id, ri, "label", e.target.value)} className="h-8 text-sm" placeholder="Tiêu đề hàng" />
                    <Input value={r.value} onChange={(e) => updateTableRow(b.id, ri, "value", e.target.value)} className="h-8 text-sm" placeholder="<tham_so>" />
                    <button onClick={() => removeTableRow(b.id, ri)} className="flex items-center justify-center text-red-400 hover:text-red-600"><Minus className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => addTableRow(b.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                  <Plus className="h-3 w-3" /> Thêm hàng
                </button>
              </div>
            ))}
            {contentVCs.length > 0 && (
              <div className="space-y-2">
                {contentVCs.map((vc) => {
                  const globalIdx = verifiedComponents.findIndex((v) => v.id === vc.id)
                  const localIdx  = contentVCs.findIndex((v) => v.id === vc.id)
                  return (
                    <VCChip key={vc.id} vc={vc} onRemove={() => onRemoveVC(vc.id)} showMove
                      onMoveUp={() => onMoveVC(globalIdx, -1)} onMoveDown={() => onMoveVC(globalIdx, 1)}
                      isFirst={localIdx === 0} isLast={localIdx === contentVCs.length - 1}
                    />
                  )
                })}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <button onClick={() => addBlock("text")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50"><span>☰</span> Văn bản</button>
              <button onClick={() => addBlock("table")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50"><span>⊞</span> Bảng</button>
            </div>
          </div>
        </section>

        {/* Action buttons */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setBtnOpen(!btnOpen)} className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition-colors">
              Nút thao tác
              <span className="text-[10px] font-normal text-muted-foreground">({actionButtons.length}/{MAX_BUTTONS})</span>
              {btnOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {btnOpen && (
            <div className="space-y-3">
              {/* Button cards — includes both manual and library VCs (shown with Đã duyệt badge) */}
              {actionButtons.map((btn, i) => (
                <ActionButtonCard
                  key={btn.id}
                  btn={btn}
                  index={i}
                  total={actionButtons.length}
                  onChange={(updated) => updateActionButton(btn.id, updated)}
                  onRemove={() => removeActionButton(btn.id)}
                />
              ))}

              {/* Add button */}
              {actionButtons.length < MAX_BUTTONS && (
                <button
                  onClick={addActionButton}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Thêm nút thao tác
                  <span className="text-[10px] text-muted-foreground">({actionButtons.length}/{MAX_BUTTONS})</span>
                </button>
              )}

              {actionButtons.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">Chưa có nút nào — nhấn để thêm hoặc chọn từ Thư viện</p>
              )}
            </div>
          )}
        </section>
      </div>

      <Step2RightPanel
        dark={dark} setDark={setDark}
        title={title} blocks={blocks}
        actionButtons={actionButtons} templateType={templateType}
        verifiedComponents={verifiedComponents}
      />
    </div>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

function Step3({ title, blocks, note, setNote, agreed, setAgreed, dark, setDark, templateType, actionButtons, isEligible }: {
  title: string; blocks: Block[]; note: string; setNote: (v: string) => void
  agreed: boolean; setAgreed: (v: boolean) => void; dark: boolean; setDark: (v: boolean) => void
  templateType: string; actionButtons: ActionButton[]; isEligible: boolean
}) {
  const params = extractParams(title, blocks)
  const [techSettings, setTechSettings] = useState<Record<string, string>>({})
  const [sampleValues, setSampleValues] = useState<Record<string, string>>({})

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="text-2xl font-bold mb-1">Gửi duyệt</h1>
        <p className="text-sm text-muted-foreground mb-8">Chọn cài đặt tham số tương ứng và điền ghi chú nhằm hỗ trợ kiểm duyệt chính xác</p>

        {isEligible ? (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 mb-6">
            <Zap className="h-4 w-4 shrink-0" />
            <p><span className="font-semibold">Tự động duyệt ⚡</span> — Tất cả Verified Component đã ENABLE. Template sẽ được duyệt tự động ngay khi gửi.</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 mb-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p><span className="font-semibold">Duyệt thủ công</span> — Một số component chưa ENABLE đủ tag. Dự kiến <span className="font-semibold">1–2 ngày làm việc</span>.</p>
          </div>
        )}

        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-1.5">Tham số <Info className="h-4 w-4 text-muted-foreground" /></h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[200px_1fr_1fr_32px] gap-0 bg-gray-50 border-b border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              <span>Tên tham số</span><span>Cài đặt kỹ thuật</span><span>Nội dung tham số <span className="text-red-500">*</span></span><span />
            </div>
            {params.length === 0 && <div className="px-4 py-6 text-sm text-muted-foreground text-center">Chưa có tham số nào</div>}
            {params.map((p, i) => (
              <div key={p} className={cn("grid grid-cols-[200px_1fr_1fr_32px] gap-3 px-4 py-3 items-center", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                <div className="text-sm text-muted-foreground font-mono">{p}</div>
                <div className="relative">
                  <select value={techSettings[p] ?? ""} onChange={(e) => setTechSettings({ ...techSettings, [p]: e.target.value })}
                    className="w-full appearance-none border border-border rounded px-2.5 py-1.5 text-xs pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="">-- Chọn --</option>
                    {TECH_SETTINGS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
                <Input value={sampleValues[p] ?? ""} onChange={(e) => setSampleValues({ ...sampleValues, [p]: e.target.value })} placeholder="VD: Nguyễn Lê Minh Khoa" className="h-8 text-xs" />
                <button className="text-muted-foreground hover:text-foreground flex items-center justify-center"><span className="text-base">🏷️</span></button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Ghi chú cho kiểm duyệt</h2>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Thêm ghi chú để hỗ trợ kiểm duyệt..." />
        </section>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border accent-blue-600" />
          <span className="text-sm text-muted-foreground">
            Tôi đã đọc và đồng ý với <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản và Chính sách sử dụng</span> của Zalo Business Solutions.
          </span>
        </label>
      </div>
      <PreviewPanel dark={dark} setDark={setDark} title={title} blocks={blocks} actionButtons={actionButtons} templateType={templateType} />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TaoTemplatePage() {
  const pathname = usePathname()
  const router   = useRouter()
  const ROOT_SECTIONS = new Set(["cong-cu", "chi-tieu", "cai-dat", "giao-dich", "bao-cao", ""])
  const seg      = pathname.split("/")[1] ?? ""
  const basePath = ROOT_SECTIONS.has(seg) ? "" : `/${seg}`

  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  const [templateName, setTemplateName] = useState("")
  const [selectedApp, setSelectedApp]   = useState("")
  const [selectedOA, setSelectedOA]     = useState("")

  const [templateType, setTemplateType] = useState("tuy-chinh")
  const [purpose, setPurpose]           = useState("cap-do-1")
  const [title, setTitle]               = useState("Xin chào <customer_name>,")
  const [blocks, setBlocks]             = useState<Block[]>([
    { type: "text",  id: 1, value: "Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi." },
    { type: "text",  id: 2, value: "Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng <company_name>." },
    { type: "table", id: 3, rows: [{ label: "Mã đơn hàng", value: "<order_code>" }, { label: "Trạng thái", value: "<payment_status>" }] },
  ])
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([
    { id: 1, type: "oa-profile", label: "Đến trang thông tin OA", url: "" },
  ])
  const [dark, setDark] = useState(false)

  const [note, setNote]     = useState("")
  const [agreed, setAgreed] = useState(false)

  const [verifiedComponents, setVerifiedComponents] = useState<VComponent[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleAddVC(c: VComponent) {
    if (c.kind === "logo") {
      setVerifiedComponents((prev) => [...prev.filter((v) => v.kind !== "logo"), c])
    } else if (c.kind === "button") {
      if (actionButtons.length >= MAX_BUTTONS) return
      setActionButtons((prev) => [...prev, { id: Date.now(), type: "oa-profile", label: c.name, url: "" }])
    } else if (c.previewRender === "text") {
      setBlocks((prev) => [...prev, { type: "text", id: Date.now(), value: c.name }])
    } else {
      setVerifiedComponents((prev) => prev.find((v) => v.id === c.id) ? prev : [...prev, c])
    }
  }
  function handleRemoveVC(id: string) { setVerifiedComponents((prev) => prev.filter((c) => c.id !== id)) }
  function handleMoveVC(index: number, dir: -1 | 1) {
    setVerifiedComponents((prev) => {
      const arr = [...prev]; const ni = index + dir
      if (ni < 0 || ni >= arr.length) return arr
      ;[arr[index], arr[ni]] = [arr[ni], arr[index]]
      return arr
    })
  }

  // addedIds only needed for logo VCs (button/text verified is derived from content)
  const addedIds = new Set(verifiedComponents.map((c) => c.id))
  const allTags    = verifiedComponents.flatMap((c) => c.tags)
  const isEligible = allTags.length > 0 && allTags.every((t) => t.status === "ENABLE")

  function exit() { router.push(`${basePath}/cong-cu/gui-tin/quan-ly-template`) }
  const canNext1 = templateName.trim() && selectedApp && selectedOA

  if (done) return (
    <div className="fixed top-[36px] inset-x-0 bottom-0 z-[90] bg-white flex flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold">Gửi duyệt thành công!</h2>
      <p className="text-sm text-muted-foreground max-w-sm text-center">
        {isEligible
          ? "Template đủ điều kiện tự động duyệt ⚡ — có hiệu lực ngay sau khi hệ thống xử lý."
          : "Template đã được gửi đến Zalo để xét duyệt. Thời gian duyệt thường từ 1–3 ngày làm việc."}
      </p>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={() => { setStep(0); setDone(false); setTemplateName(""); setSelectedApp(""); setSelectedOA(""); setNote(""); setAgreed(false) }}>Tạo template khác</Button>
        <Button onClick={exit} className="bg-blue-600 hover:bg-blue-700 text-white">Xem Quản lý Template</Button>
      </div>
    </div>
  )

  return (
    <div className="fixed top-[36px] inset-x-0 bottom-0 z-[90] bg-white flex flex-col">
      <StepHeader step={step} onExit={exit} saved={step > 0} />

      <div className="flex-1 overflow-hidden relative flex flex-col">
        {step === 0 && (
          <Step1 templateName={templateName} setTemplateName={setTemplateName}
            selectedApp={selectedApp} setSelectedApp={setSelectedApp}
            selectedOA={selectedOA} setSelectedOA={setSelectedOA} />
        )}
        {step === 1 && (
          <Step2
            templateType={templateType} setTemplateType={setTemplateType}
            purpose={purpose} setPurpose={setPurpose}
            title={title} setTitle={setTitle}
            blocks={blocks} setBlocks={setBlocks}
            actionButtons={actionButtons} setActionButtons={setActionButtons}
            dark={dark} setDark={setDark}
            verifiedComponents={verifiedComponents}
            onRemoveVC={handleRemoveVC} onMoveVC={handleMoveVC}
          />
        )}
        {step === 2 && (
          <Step3 title={title} blocks={blocks}
            note={note} setNote={setNote}
            agreed={agreed} setAgreed={setAgreed}
            dark={dark} setDark={setDark}
            templateType={templateType} actionButtons={actionButtons}
            isEligible={isEligible} />
        )}

        {step === 1 && (
          <ComponentLibraryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
            onAdd={handleAddVC} />
        )}
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-white shrink-0">
        {step === 0 ? <Button variant="outline" onClick={exit}>Hủy</Button>
          : <Button variant="outline" onClick={() => setStep(step - 1)}>Quay lại</Button>}

        {step === 1 && (
          <Button variant="outline" className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400" onClick={() => setDrawerOpen(true)}>
            <Library className="h-4 w-4" />
            Thư viện Component
            {verifiedComponents.length > 0 && (
              <span className="h-5 min-w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {verifiedComponents.length}
              </span>
            )}
          </Button>
        )}

        {step < 2 ? (
          <div className="flex items-center gap-3">
            {step === 1 && !isEligible && allTags.length > 0 && (
              <span className="text-xs text-muted-foreground">Dự kiến 1–2 ngày làm việc</span>
            )}
            <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !canNext1}
              className={cn("px-8 text-white transition-all",
                step === 1 && isEligible ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-200" : "bg-blue-600 hover:bg-blue-700")}>
              {step === 1 && isEligible ? <><Zap className="h-4 w-4 mr-1.5" />Tiếp tục · Tự động duyệt</> : "Tiếp tục"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {!isEligible && agreed && <span className="text-xs text-muted-foreground">Dự kiến 1–2 ngày làm việc</span>}
            <Button onClick={() => setDone(true)} disabled={!agreed}
              className={cn("px-8 text-white transition-all",
                isEligible && agreed ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-200" : "bg-blue-600 hover:bg-blue-700")}>
              {isEligible ? <><Zap className="h-4 w-4 mr-1.5" />Gửi duyệt · Tự động duyệt</> : "Gửi duyệt"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
