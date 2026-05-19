"use client"

import { useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Check, X, Info, ChevronDown, ChevronUp, Minus, Plus,
  Search, Zap, AlertCircle, Library,
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
const BUTTON_OPTIONS = [
  { group: "ĐẾN TÀI SẢN CỦA DOANH NGHIỆP TRÊN HỆ SINH THÁI ZALO", options: [
    { id: "oa-profile", label: "Đến trang thông tin OA (+0đ)",               sub: "Xem trang thông tin OA trên Zalo" },
    { id: "mini-app",   label: "Đến ứng dụng Zalo Mini App của Doanh nghiệp (+0/100đ)", sub: "Truy cập Mini App" },
    { id: "oa-post",    label: "Đến bài viết của OA (+0/100đ)",              sub: "Truy cập bài viết của doanh nghiệp" },
  ]},
  { group: "ĐẾN LIÊN KẾT TÙY CHỈNH", options: [
    { id: "custom-url", label: "Đến URL (+0/100đ)", sub: "Đường dẫn tùy chỉnh" },
  ]},
]
const TECH_SETTINGS = ["Tên khách hàng (30)", "Tên sản phẩm / Thương hiệu (200)", "Số điện thoại (15)", "Mã giao dịch (50)", "Trạng thái (50)", "Ngày giờ (20)", "Số tiền (20)", "Địa chỉ (200)"]

// ── Component Library ─────────────────────────────────────────────────────────

type ComponentStatus  = "ENABLE" | "PENDING" | "NEW"
type ComponentKind    = "logo" | "image" | "button"
type DrawerFilter     = "all" | "logo" | "image" | "button" | "body"

interface ComponentTag  { label: string; status: ComponentStatus }
interface LibComponent  { id: string; kind: ComponentKind; name: string; initials: string; bgColor: string; tags: ComponentTag[] }

const COMPONENT_LIBRARY: LibComponent[] = [
  { id: "logo-1", kind: "logo", name: "Logo ATP Software",       initials: "ATP", bgColor: "oklch(0.92 0.06 50)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }] },
  { id: "logo-2", kind: "logo", name: "Logo ZBS Brandmark",      initials: "ZBS", bgColor: "oklch(0.92 0.05 265)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "PENDING" }, { label: "Hậu mãi", status: "NEW" }] },
  { id: "logo-3", kind: "logo", name: "Logo QC Test 1",          initials: "QC",  bgColor: "oklch(0.92 0.07 145)",
    tags: [{ label: "Giao dịch", status: "PENDING" }, { label: "Chăm sóc KH", status: "NEW" }] },
  { id: "image-1", kind: "image", name: "Banner khuyến mãi 2026", initials: "🎉", bgColor: "oklch(0.95 0.04 50)",
    tags: [{ label: "Hậu mãi", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }] },
  { id: "image-2", kind: "image", name: "Ảnh sản phẩm mới",       initials: "🛍️", bgColor: "oklch(0.92 0.06 300)",
    tags: [{ label: "Giao dịch", status: "PENDING" }, { label: "Hậu mãi", status: "NEW" }] },
  { id: "image-3", kind: "image", name: "Ảnh xác nhận đơn hàng",  initials: "📦", bgColor: "oklch(0.92 0.06 185)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }] },
  { id: "button-1", kind: "button", name: "CTA Xem đơn hàng",     initials: "→",  bgColor: "oklch(0.88 0.08 265)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }] },
  { id: "button-2", kind: "button", name: "CTA Đánh giá dịch vụ", initials: "⭐", bgColor: "oklch(0.92 0.07 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "PENDING" }] },
  { id: "button-3", kind: "button", name: "CTA Nhận ưu đãi",      initials: "🎁", bgColor: "oklch(0.92 0.07 145)",
    tags: [{ label: "Hậu mãi", status: "NEW" }] },
]

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
      tiny ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5",
      cfg.bg, cfg.text,
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dotCls)} />
      {tag.label} {cfg.shortLabel}
    </span>
  )
}

// ── Component Library Drawer (bottom panel) ───────────────────────────────────

const DRAWER_FILTER_LABELS: Record<DrawerFilter, string> = {
  all: "Tất cả", logo: "Logo", image: "Images", button: "Buttons", body: "Body",
}

function ComponentLibraryDrawer({
  open, onClose, filter, setFilter,
  logoComp, imageComp, buttonComp,
  onSelect,
}: {
  open: boolean; onClose: () => void
  filter: DrawerFilter; setFilter: (f: DrawerFilter) => void
  logoComp: LibComponent | null; imageComp: LibComponent | null; buttonComp: LibComponent | null
  onSelect: (c: LibComponent) => void
}) {
  const [search, setSearch] = useState("")
  const [hoverId, setHoverId] = useState<string | null>(null)

  const selectedIds = new Set([logoComp?.id, imageComp?.id, buttonComp?.id].filter(Boolean) as string[])

  const filtered = COMPONENT_LIBRARY.filter((c) => {
    if (filter === "body") return false          // body = empty for now
    if (filter !== "all" && c.kind !== filter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const isFullyEnabled = (c: LibComponent) => c.tags.every((t) => t.status === "ENABLE")

  return (
    <>
      {/* Scrim */}
      {open && (
        <div
          className="absolute inset-0 bg-black/20 z-10 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "absolute left-0 right-0 bottom-0 bg-white border-t border-border shadow-2xl z-20 flex flex-col transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
        style={{ height: "42%" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2.5 pb-1 shrink-0 cursor-grab">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header bar */}
        <div className="flex items-center gap-4 px-6 py-2.5 border-b border-border shrink-0">
          <div className="flex items-center gap-1.5">
            <Library className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold">Thư viện Component</span>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5">
            {(["all", "logo", "image", "button", "body"] as DrawerFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border font-medium transition-colors",
                  filter === f
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-border text-muted-foreground hover:border-gray-300 bg-white"
                )}
              >
                {DRAWER_FILTER_LABELS[f]}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm component..."
              className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-md w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="ml-auto">
            <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filter === "body" || filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              {filter === "body" ? "Body component — sắp ra mắt" : "Không tìm thấy component"}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-3">
              {filtered.map((c) => {
                const isSelected = selectedIds.has(c.id)
                const enabled    = isFullyEnabled(c)
                const isHovered  = hoverId === c.id

                return (
                  <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    onMouseEnter={() => setHoverId(c.id)}
                    onMouseLeave={() => setHoverId(null)}
                    title={!enabled ? "Một số tag chưa được duyệt — sẽ cần duyệt thủ công" : undefined}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left relative transition-all",
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : isHovered && enabled
                        ? "border-blue-300 bg-white shadow-sm"
                        : isHovered && !enabled
                        ? "border-yellow-300 bg-yellow-50"
                        : enabled
                        ? "border-border bg-white hover:shadow-sm"
                        : "border-border bg-white opacity-60",
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                    {/* Thumbnail */}
                    <div
                      className="h-11 rounded-lg flex items-center justify-center mb-2 text-base font-bold border border-black/5"
                      style={{ background: c.bgColor }}
                    >
                      {c.initials}
                    </div>
                    <p className="text-[11px] font-semibold truncate mb-1">{c.name}</p>
                    <div className="flex flex-wrap gap-0.5">
                      {c.tags.map((t) => <TagBadge key={t.label} tag={t} tiny />)}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Approval Check (right panel tab content) ──────────────────────────────────

function ApprovalCheckContent({
  logoComp, imageComp, buttonComp,
}: {
  logoComp: LibComponent | null
  imageComp: LibComponent | null
  buttonComp: LibComponent | null
}) {
  const sections = [
    { label: "Logo", comp: logoComp },
    { label: "Hình ảnh", comp: imageComp },
    { label: "Nút CTA", comp: buttonComp },
  ].filter((s) => s.comp !== null) as { label: string; comp: LibComponent }[]

  const allTags        = sections.flatMap((s) => s.comp.tags)
  const nonEnableCount = allTags.filter((t) => t.status !== "ENABLE").length
  const isEligible     = sections.length > 0 && nonEnableCount === 0

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <div>
        <p className="text-xs font-semibold text-foreground mb-0.5">Kiểm tra tự động duyệt</p>
        <p className="text-[10px] text-muted-foreground leading-relaxed">Cập nhật ngay khi bạn chọn component</p>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center">
          <Library className="h-6 w-6 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Chưa chọn component từ thư viện</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Mở Thư viện Component để thêm</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map(({ label, comp }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
              <div className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-7 w-7 rounded text-[10px] font-bold flex items-center justify-center shrink-0"
                    style={{ background: comp.bgColor }}
                  >
                    {comp.initials.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate">{comp.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comp.tags.map((t) => <TagBadge key={t.label} tag={t} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary — pinned to bottom of flex column */}
      {sections.length > 0 && (
        <div className={cn("rounded-lg p-3 text-xs mt-auto",
          isEligible ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
        )}>
          {isEligible ? (
            <div className="flex items-center gap-1.5 font-semibold text-green-700">
              <Zap className="h-3.5 w-3.5" />
              Đủ điều kiện tự động duyệt ⚡
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-yellow-800 mb-0.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Cần duyệt thủ công
              </div>
              <p className="text-yellow-700">{nonEnableCount} component chưa được duyệt ở đủ tag</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 2 right panel (tabbed: Xem trước / Thư viện→ApprovalCheck) ───────────

function Step2RightPanel({
  dark, setDark, title, blocks, actionButtonId, templateType,
  logoComp, imageComp, buttonComp,
}: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtonId: string; templateType: string
  logoComp: LibComponent | null
  imageComp: LibComponent | null
  buttonComp: LibComponent | null
}) {
  const [tab, setTab] = useState<"preview" | "library">("preview")
  const activeBtn = BUTTON_OPTIONS.flatMap((g) => g.options).find((o) => o.id === actionButtonId)
  const typeInfo  = TEMPLATE_TYPES.find((t) => t.id === templateType)

  const hasLibrary = logoComp || imageComp || buttonComp
  const allTags    = [logoComp, imageComp, buttonComp].flatMap((c) => c ? c.tags : [])
  const isEligible = allTags.length > 0 && allTags.every((t) => t.status === "ENABLE")

  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-white shrink-0">
        <button
          onClick={() => setTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
            tab === "preview" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          📋 Xem trước
        </button>
        <button
          onClick={() => setTab("library")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors",
            tab === "library" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {isEligible && hasLibrary
            ? <Zap className="h-3 w-3 text-green-600" />
            : hasLibrary
            ? <AlertCircle className="h-3 w-3 text-yellow-500" />
            : <Library className="h-3 w-3" />
          }
          Thư viện
          {tab !== "library" && (
            <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-blue-100 text-blue-600">NEW</span>
          )}
        </button>
      </div>

      {tab === "preview" ? (
        /* ── Preview tab (unchanged) ── */
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Giao diện tối</span>
            <button
              onClick={() => setDark(!dark)}
              className={cn("relative h-5 w-9 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}
            >
              <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", dark ? "translate-x-4" : "translate-x-0.5")} />
            </button>
          </div>
          <div className={cn("rounded-lg border border-border overflow-hidden text-sm", dark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
            <div className={cn("px-4 py-3 flex items-center", dark ? "bg-gray-800" : "bg-orange-50")}>
              <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>
                ATP <span className={dark ? "text-white" : "text-gray-800"}>SOFTWARE</span>
              </div>
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
              {activeBtn && (
                <button className="w-full mt-2 py-2 rounded text-xs font-semibold text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
                  {activeBtn.label.split(" (+")[0]}
                </button>
              )}
            </div>
          </div>
          <div className="rounded border p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{typeInfo?.label ?? "Mẫu tuỳ chỉnh"}</span>
              <span className="font-semibold">300 VNĐ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nút thao tác 1</span><span className="font-semibold">0 VNĐ</span>
            </div>
            <div className="border-t border-border pt-1.5 mt-1.5 space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1">Đơn giá dự kiến <Info className="h-3 w-3 text-muted-foreground" /></span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gửi qua SĐT</span><span className="font-semibold text-foreground">300 VNĐ/tin</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Gửi qua UID</span><span className="font-semibold text-foreground">210 VNĐ/tin</span>
              </div>
            </div>
          </div>
          <button className="w-full text-sm font-medium py-2 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors">
            Gửi thử mẫu ZBS
          </button>
        </div>
      ) : (
        /* ── Library tab → Approval Check ── */
        <ApprovalCheckContent logoComp={logoComp} imageComp={imageComp} buttonComp={buttonComp} />
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
                  done || active ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"
                )}>
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

// ── Tips panel (Step 1) ───────────────────────────────────────────────────────

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

function PreviewPanel({ dark, setDark, title, blocks, actionButtonId, templateType }: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtonId: string; templateType: string
}) {
  const activeBtn = BUTTON_OPTIONS.flatMap((g) => g.options).find((o) => o.id === actionButtonId)
  const typeInfo  = TEMPLATE_TYPES.find((t) => t.id === templateType)

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
          <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>
            ATP <span className={dark ? "text-white" : "text-gray-800"}>SOFTWARE</span>
          </div>
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
          {activeBtn && (
            <button className="w-full mt-2 py-2 rounded text-xs font-semibold text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
              {activeBtn.label.split(" (+")[0]}
            </button>
          )}
        </div>
      </div>
      <div className="rounded border p-3 text-xs space-y-1.5">
        <div className="flex justify-between"><span className="text-muted-foreground">{typeInfo?.label}</span><span className="font-semibold">300 VNĐ</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Nút thao tác 1</span><span className="font-semibold">0 VNĐ</span></div>
        <div className="border-t border-border pt-1.5 mt-1.5 space-y-1">
          <div className="flex justify-between text-muted-foreground"><span>Gửi qua SĐT</span><span className="font-semibold text-foreground">300 VNĐ/tin</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Gửi qua UID</span><span className="font-semibold text-foreground">210 VNĐ/tin</span></div>
        </div>
      </div>
      <button className="w-full text-sm font-medium py-2 rounded border border-blue-300 text-blue-600 hover:bg-blue-50">Gửi thử mẫu ZBS</button>
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
    <div className="flex flex-1 overflow-hidden">
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
  actionButtonId, setActionButtonId, dark, setDark,
  logoComp, imageComp, buttonComp,
  openDrawer,
}: {
  templateType: string; setTemplateType: (v: string) => void
  purpose: string; setPurpose: (v: string) => void
  title: string; setTitle: (v: string) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  actionButtonId: string; setActionButtonId: (v: string) => void
  dark: boolean; setDark: (v: boolean) => void
  logoComp: LibComponent | null
  imageComp: LibComponent | null
  buttonComp: LibComponent | null
  openDrawer: (filter: DrawerFilter) => void
}) {
  const [logoOpen, setLogoOpen]               = useState(true)
  const [btnOpen, setBtnOpen]                 = useState(true)
  const [showBtnDropdown, setShowBtnDropdown] = useState(false)
  const [btnSearch, setBtnSearch]             = useState("")
  const nextId = useMemo(() => Math.max(0, ...blocks.map((b) => b.id)) + 1, [blocks])

  function addBlock(type: BlockType) {
    if (type === "text") setBlocks([...blocks, { type: "text", id: nextId, value: "" }])
    else setBlocks([...blocks, { type: "table", id: nextId, rows: [{ label: "", value: "" }] }])
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

  const activeBtn = BUTTON_OPTIONS.flatMap((g) => g.options).find((o) => o.id === actionButtonId)
  const filteredBtnOptions = BUTTON_OPTIONS
    .map((g) => ({ ...g, options: g.options.filter((o) => !btnSearch || o.label.toLowerCase().includes(btnSearch.toLowerCase())) }))
    .filter((g) => g.options.length > 0)

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Main form ── */}
      <div className="flex-1 overflow-y-auto px-10 py-8">

        {/* Title row — "Chọn từ thư viện Component" replaces "Chọn từ thư viện Template" */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold mb-1">Khai báo nội dung</h1>
            <p className="text-sm text-muted-foreground mb-6">Chọn loại Template, mục đích và các thành phần cần thiết</p>
          </div>
          <Button
            variant="outline" size="sm"
            className="gap-1.5 shrink-0 mt-1 border-blue-300 text-blue-600 hover:bg-blue-50"
            onClick={() => openDrawer("all")}
          >
            <Library className="h-3.5 w-3.5" />
            Chọn từ thư viện Component
          </Button>
        </div>

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

        {/* Logo — original + "Chọn từ thư viện" shortcut */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <button onClick={() => setLogoOpen(!logoOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold">
            <span>Logo, hình ảnh <span className="text-red-500">*</span></span>
            {logoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {logoOpen && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="flex items-center justify-between mt-3 mb-3">
                <p className="text-xs text-muted-foreground">Tối đa 1 logo hoặc 3 hình ảnh</p>
                <button
                  onClick={() => openDrawer("logo")}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <Library className="h-3 w-3" /> Chọn từ thư viện
                </button>
              </div>

              {/* If a logo is selected from library, show it */}
              {logoComp && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                  <div className="h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: logoComp.bgColor }}>
                    {logoComp.initials.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{logoComp.name}</p>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {logoComp.tags.map((t) => <TagBadge key={t.label} tag={t} tiny />)}
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-500 font-medium shrink-0">Từ thư viện</span>
                </div>
              )}

              <div className="rounded border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Logo</span>
                  <button className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Logo sau khi được duyệt sẽ được tự động cập nhật cho các mẫu ZBS của OA, xem gợi ý <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span></p>
                <div className="grid grid-cols-2 gap-4">
                  {["Giao diện sáng", "Giao diện tối"].map((label, i) => (
                    <div key={i}>
                      <div className="text-xs font-semibold mb-2">{label} <span className="text-red-500">*</span></div>
                      <div className={cn("h-24 rounded border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors", i === 1 ? "bg-gray-900 border-gray-600" : "bg-white border-gray-300")}>
                        <div className={cn("text-xs font-bold tracking-wide", i === 1 ? "text-orange-400" : "text-orange-600")}>
                          ATP <span className={i === 1 ? "text-white" : "text-gray-800"}>SOFTWARE</span>
                        </div>
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
                <div className="text-xs font-semibold mb-1">Văn bản <span className="text-red-500">*</span></div>
                <textarea value={b.value} onChange={(e) => updateTextBlock(b.id, e.target.value.slice(0, 400))} rows={3}
                  className="w-full text-sm border-0 resize-none focus:outline-none" placeholder="Nhập nội dung văn bản..." />
                <div className="text-right text-[10px] text-muted-foreground">{b.value.length}/400</div>
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
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <button onClick={() => addBlock("text")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50"><span>☰</span> Văn bản</button>
              <button onClick={() => addBlock("table")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50"><span>⊞</span> Bảng</button>
            </div>
          </div>
        </section>

        {/* Action button */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <button onClick={() => setBtnOpen(!btnOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold">
            <span>Nút thao tác</span>
            {btnOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {btnOpen && (
            <div className="px-4 pb-4 border-t border-border">
              <div className="flex items-center justify-between mt-3 mb-3">
                <span />
                <button onClick={() => openDrawer("button")} className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium">
                  <Library className="h-3 w-3" /> Chọn từ thư viện
                </button>
              </div>

              {/* If a CTA button is selected from library */}
              {buttonComp && (
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                  <div className="h-6 w-6 rounded text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: buttonComp.bgColor }}>
                    {buttonComp.initials.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate">{buttonComp.name}</p>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {buttonComp.tags.map((t) => <TagBadge key={t.label} tag={t} tiny />)}
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-500 font-medium shrink-0">Từ thư viện</span>
                </div>
              )}

              <div className="rounded border border-border p-3 relative">
                <div className="text-xs font-semibold mb-2">Nút thao tác 1</div>
                <div className="text-xs text-muted-foreground mb-2">Loại nút</div>
                <div className="relative">
                  <div className={cn("flex items-center border border-border rounded px-3 h-9 text-sm cursor-pointer", showBtnDropdown && "border-blue-500 ring-1 ring-blue-500")}
                    onClick={() => setShowBtnDropdown(!showBtnDropdown)}>
                    <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    <input value={btnSearch} onChange={(e) => { setBtnSearch(e.target.value); setShowBtnDropdown(true) }}
                      placeholder={activeBtn ? activeBtn.label.split(" (+")[0] : "Đến trang thông tin OA (+0đ)"}
                      className="flex-1 text-sm focus:outline-none bg-transparent" />
                  </div>
                  {showBtnDropdown && (
                    <div className="absolute top-full left-0 right-0 z-20 border border-border bg-white rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
                      {filteredBtnOptions.map((g) => (
                        <div key={g.group}>
                          <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-50">{g.group}</div>
                          {g.options.map((o) => (
                            <button key={o.id} onClick={() => { setActionButtonId(o.id); setShowBtnDropdown(false); setBtnSearch("") }}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50">
                              <div className="text-xs font-semibold text-blue-600">{o.label}</div>
                              <div className="text-[11px] text-muted-foreground">{o.sub}</div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── Right panel: Preview + ApprovalCheck tab ── */}
      <Step2RightPanel
        dark={dark} setDark={setDark}
        title={title} blocks={blocks}
        actionButtonId={actionButtonId} templateType={templateType}
        logoComp={logoComp} imageComp={imageComp} buttonComp={buttonComp}
      />
    </div>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

function Step3({ title, blocks, note, setNote, agreed, setAgreed, dark, setDark, templateType, actionButtonId, isEligible }: {
  title: string; blocks: Block[]; note: string; setNote: (v: string) => void
  agreed: boolean; setAgreed: (v: boolean) => void; dark: boolean; setDark: (v: boolean) => void
  templateType: string; actionButtonId: string; isEligible: boolean
}) {
  const params = extractParams(title, blocks)
  const [techSettings, setTechSettings] = useState<Record<string, string>>({})
  const [sampleValues, setSampleValues] = useState<Record<string, string>>({})

  return (
    <div className="flex flex-1 overflow-hidden">
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
      <PreviewPanel dark={dark} setDark={setDark} title={title} blocks={blocks} actionButtonId={actionButtonId} templateType={templateType} />
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

  // Step 1
  const [templateName, setTemplateName] = useState("")
  const [selectedApp, setSelectedApp]   = useState("")
  const [selectedOA, setSelectedOA]     = useState("")

  // Step 2
  const [templateType, setTemplateType]     = useState("tuy-chinh")
  const [purpose, setPurpose]               = useState("cap-do-1")
  const [title, setTitle]                   = useState("Xin chào <customer_name>,")
  const [blocks, setBlocks]                 = useState<Block[]>([
    { type: "text",  id: 1, value: "Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi." },
    { type: "text",  id: 2, value: "Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng <company_name>." },
    { type: "table", id: 3, rows: [{ label: "Mã đơn hàng", value: "<order_code>" }, { label: "Trạng thái", value: "<payment_status>" }] },
  ])
  const [actionButtonId, setActionButtonId] = useState("oa-profile")
  const [dark, setDark]                     = useState(false)

  // Step 3
  const [note, setNote]     = useState("")
  const [agreed, setAgreed] = useState(false)

  // NEW — Library components (default = mixed for demo of Screen 2)
  const [logoComp, setLogoComp]     = useState<LibComponent | null>(COMPONENT_LIBRARY.find((c) => c.id === "logo-2")!)
  const [imageComp, setImageComp]   = useState<LibComponent | null>(COMPONENT_LIBRARY.find((c) => c.id === "image-2")!)
  const [buttonComp, setButtonComp] = useState<LibComponent | null>(COMPONENT_LIBRARY.find((c) => c.id === "button-2")!)

  // NEW — Bottom drawer
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [drawerFilter, setDrawerFilter] = useState<DrawerFilter>("all")

  function openDrawer(filter: DrawerFilter) {
    setDrawerFilter(filter)
    setDrawerOpen(true)
  }

  function handleLibrarySelect(c: LibComponent) {
    if (c.kind === "logo")   setLogoComp(c)
    if (c.kind === "image")  setImageComp(c)
    if (c.kind === "button") setButtonComp(c)
  }

  // Eligibility across all three library slots
  const allTags    = [logoComp, imageComp, buttonComp].flatMap((c) => c ? c.tags : [])
  const isEligible = allTags.length > 0 && allTags.every((t) => t.status === "ENABLE")

  function exit() { router.push(`${basePath}/cong-cu/gui-tin/quan-ly-template`) }

  const canNext1 = templateName.trim() && selectedApp && selectedOA
  const canDone  = agreed

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

      {/* Main content area — relative so drawer can be absolute inside */}
      <div className="flex-1 overflow-hidden relative">
        {step === 0 && (
          <Step1
            templateName={templateName} setTemplateName={setTemplateName}
            selectedApp={selectedApp} setSelectedApp={setSelectedApp}
            selectedOA={selectedOA} setSelectedOA={setSelectedOA}
          />
        )}
        {step === 1 && (
          <Step2
            templateType={templateType} setTemplateType={setTemplateType}
            purpose={purpose} setPurpose={setPurpose}
            title={title} setTitle={setTitle}
            blocks={blocks} setBlocks={setBlocks}
            actionButtonId={actionButtonId} setActionButtonId={setActionButtonId}
            dark={dark} setDark={setDark}
            logoComp={logoComp} imageComp={imageComp} buttonComp={buttonComp}
            openDrawer={openDrawer}
          />
        )}
        {step === 2 && (
          <Step3
            title={title} blocks={blocks}
            note={note} setNote={setNote}
            agreed={agreed} setAgreed={setAgreed}
            dark={dark} setDark={setDark}
            templateType={templateType} actionButtonId={actionButtonId}
            isEligible={isEligible}
          />
        )}

        {/* ── Bottom drawer (only on Step 2) ── */}
        {step === 1 && (
          <ComponentLibraryDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            filter={drawerFilter}
            setFilter={setDrawerFilter}
            logoComp={logoComp} imageComp={imageComp} buttonComp={buttonComp}
            onSelect={handleLibrarySelect}
          />
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-white shrink-0">
        {step === 0
          ? <Button variant="outline" onClick={exit}>Hủy</Button>
          : <Button variant="outline" onClick={() => setStep(step - 1)}>Quay lại</Button>
        }

        {step < 2 ? (
          /* Step 2 "Tiếp tục" — dynamic when library components present */
          <div className="flex items-center gap-3">
            {step === 1 && !isEligible && allTags.length > 0 && (
              <span className="text-xs text-muted-foreground">Dự kiến 1–2 ngày làm việc</span>
            )}
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !canNext1}
              className={cn(
                "px-8 text-white transition-all",
                step === 1 && isEligible
                  ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-200"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {step === 1 && isEligible
                ? <><Zap className="h-4 w-4 mr-1.5" />Tiếp tục · Tự động duyệt</>
                : "Tiếp tục"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {!isEligible && agreed && <span className="text-xs text-muted-foreground">Dự kiến 1–2 ngày làm việc</span>}
            <Button
              onClick={() => setDone(true)}
              disabled={!canDone}
              className={cn(
                "px-8 text-white transition-all",
                isEligible && agreed ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-200" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isEligible ? <><Zap className="h-4 w-4 mr-1.5" />Gửi duyệt · Tự động duyệt</> : "Gửi duyệt"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
