"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Check, X, Info, ChevronDown, ChevronUp, Minus, Plus,
  Search, Zap, AlertCircle, Library, Trash2, Upload, ImageIcon, GripVertical,
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
// Special built-in button types for specific template types
const SPECIAL_BTN_TYPES = [
  { id: "sao-chep",       label: "Sao chép",     cost: 0, hasUrl: false, placeholder: "Sao chép mã" },
  { id: "thanh-toan-btn", label: "Thanh toán",   cost: 0, hasUrl: false, placeholder: "Thanh toán ngay" },
  { id: "xem-chi-tiet",   label: "Xem chi tiết", cost: 0, hasUrl: false, placeholder: "Xem mã ưu đãi" },
]

const ALL_BUTTON_TYPES = [...BUTTON_TYPES.flatMap((g) => g.items), ...SPECIAL_BTN_TYPES]

// ActionButton — each button in a template
interface ActionButton {
  id: number
  type: string    // id from ALL_BUTTON_TYPES
  label: string   // display text in message
  url: string     // URL or link value
  // verified/edited derived from content match — no state needed
}

const MAX_BUTTONS = 3
const MAX_BUTTONS_BY_TYPE: Record<string, number> = {
  "xac-thuc":   3,
  "danh-gia":   2,
  "thanh-toan": 3,
  "voucher":    3,
  "tuy-chinh":  3,
}

const TECH_SETTINGS = ["Tên khách hàng (30)", "Tên sản phẩm / Thương hiệu (200)", "Số điện thoại (15)", "Mã giao dịch (50)", "Trạng thái (50)", "Ngày giờ (20)", "Số tiền (20)", "Địa chỉ (200)"]

// ── Verified Component types ───────────────────────────────────────────────────

type ComponentStatus = "ENABLE" | "PENDING" | "NEW"
type VCKind          = "logo" | "content" | "button"
type VCSource        = "predefined" | "user"
type PreviewRender   = "logo" | "voucher" | "rating" | "payment-table" | "image" | "carousel" | "text" | "title" | "table" | "button"
type LibCategory = "all" | VCKind | PreviewRender

interface ComponentTag { label: string; status: ComponentStatus }
interface VComponent {
  id: string; kind: VCKind; source: VCSource
  name: string; description: string; initials: string; bgColor: string
  tags: ComponentTag[]; previewRender: PreviewRender
  tableRows?: { label: string; value: string }[]
}

// ── Predefined library ─────────────────────────────────────────────────────────

const ALL_ENABLE: ComponentTag[] = [
  { label: "Giao dịch", status: "ENABLE" },
  { label: "Chăm sóc KH", status: "ENABLE" },
  { label: "Hậu mãi", status: "ENABLE" },
]

const PREDEFINED: VComponent[] = [
  { id: "pre-banner",          kind: "content", source: "predefined", name: "Banner hình ảnh",        description: "Ảnh banner tuỳ chỉnh",                     initials: "🖼️", bgColor: "oklch(0.92 0.06 300)", tags: ALL_ENABLE, previewRender: "image"   },
  { id: "pre-carousel",        kind: "content", source: "predefined", name: "Carousel ảnh",           description: "Bộ ảnh tự động chuyển slide",              initials: "▶",  bgColor: "oklch(0.91 0.05 240)", tags: ALL_ENABLE, previewRender: "carousel" },
  { id: "pre-title-order",     kind: "content", source: "predefined", name: "Xác nhận đơn hàng",     description: "Tiêu đề xác nhận đơn hàng",                initials: "T",  bgColor: "oklch(0.88 0.08 265)", tags: ALL_ENABLE, previewRender: "title"   },
  { id: "pre-title-payment",   kind: "content", source: "predefined", name: "Xác nhận thanh toán",   description: "Tiêu đề xác nhận thanh toán",              initials: "T",  bgColor: "oklch(0.88 0.08 200)", tags: ALL_ENABLE, previewRender: "title"   },
  { id: "pre-table-order",     kind: "content", source: "predefined", name: "Bảng xác nhận đơn hàng",   description: "Bảng chi tiết đơn hàng",           initials: "≡",  bgColor: "oklch(0.90 0.04 265)", tags: ALL_ENABLE, previewRender: "table",
    tableRows: [{ label: "Mã đơn", value: "<order_code>" }, { label: "Điện thoại", value: "<phone_number>" }, { label: "Giá tiền", value: "<price>" }, { label: "Trạng thái", value: "<status>" }, { label: "Ngày đặt hàng", value: "<date>" }] },
  { id: "pre-table-payment",   kind: "content", source: "predefined", name: "Bảng xác nhận thanh toán", description: "Bảng chi tiết thanh toán",          initials: "≡",  bgColor: "oklch(0.90 0.04 200)", tags: ALL_ENABLE, previewRender: "table",
    tableRows: [{ label: "Mã đơn", value: "<order_code>" }, { label: "Ngày đặt hàng", value: "<date>" }, { label: "Giá tiền", value: "<price>" }, { label: "Hình thức thanh toán", value: "<payment>" }] },
  { id: "pre-btn-order-view",  kind: "button",  source: "predefined", name: "Xem đơn hàng đã đặt",   description: "CTA xem chi tiết đơn hàng",                initials: "→",  bgColor: "oklch(0.88 0.08 265)", tags: ALL_ENABLE, previewRender: "button"  },
  { id: "pre-btn-order-detail",kind: "button",  source: "predefined", name: "Xem chi tiết đơn hàng", description: "CTA xem chi tiết sau xác nhận thanh toán", initials: "→",  bgColor: "oklch(0.88 0.08 200)", tags: ALL_ENABLE, previewRender: "button"  },
]

const USER_APPROVED: VComponent[] = [
  { id: "user-logo-shopviet",    kind: "logo",    source: "user", name: "Logo ShopViet",
    description: "Logo thương hiệu ShopViet",
    initials: "SV", bgColor: "oklch(0.88 0.12 25)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "logo" },
  { id: "user-logo-medcare",     kind: "logo",    source: "user", name: "Logo MedCare Clinic",
    description: "Logo phòng khám MedCare",
    initials: "MC", bgColor: "oklch(0.88 0.10 165)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "PENDING" }], previewRender: "logo" },
  { id: "user-title-shipping",   kind: "content", source: "user", name: "Thông báo giao hàng",
    description: "Tiêu đề thông báo trạng thái giao hàng",
    initials: "T",  bgColor: "oklch(0.92 0.06 240)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }], previewRender: "title" },
  { id: "user-title-loyalty",    kind: "content", source: "user", name: "Thông báo điểm tích lũy",
    description: "Tiêu đề thông báo cộng điểm thành viên",
    initials: "T",  bgColor: "oklch(0.92 0.08 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "title" },
  { id: "user-title-appointment",kind: "content", source: "user", name: "Xác nhận lịch khám",
    description: "Tiêu đề xác nhận lịch khám tại phòng khám",
    initials: "T",  bgColor: "oklch(0.92 0.06 165)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "PENDING" }], previewRender: "title" },
  { id: "user-text-shipping",    kind: "content", source: "user", name: "Nội dung giao hàng",
    description: "Xin chào <name>, đơn hàng <order_code> đặt vào ngày <date> đã <status>. Cảm ơn bạn đã quan tâm đến sản phẩm của chúng tôi.",
    initials: "V",  bgColor: "oklch(0.93 0.04 240)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }], previewRender: "text" },
  { id: "user-text-loyalty",     kind: "content", source: "user", name: "Nội dung điểm tích lũy",
    description: "Cảm ơn quý khách <customer_name> đã sử dụng dịch vụ. Quý khách được ghi nhận tích lũy điểm thành viên thành công với các thông tin sau.",
    initials: "V",  bgColor: "oklch(0.93 0.05 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "text" },
  { id: "user-table-loyalty",    kind: "content", source: "user", name: "Bảng điểm tích lũy",
    description: "Bảng thông tin điểm thành viên tích lũy",
    initials: "≡",  bgColor: "oklch(0.91 0.06 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "table",
    tableRows: [{ label: "Khách hàng", value: "<customer_name>" }, { label: "Điểm hiện tại", value: "<points>" }, { label: "Điểm vừa cộng", value: "<earned_points>" }, { label: "Hạng thành viên", value: "<tier>" }] },
  { id: "user-table-appointment",kind: "content", source: "user", name: "Bảng lịch khám",
    description: "Bảng thông tin lịch hẹn khám tại phòng khám",
    initials: "≡",  bgColor: "oklch(0.91 0.06 165)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "PENDING" }], previewRender: "table",
    tableRows: [{ label: "Bệnh nhân", value: "<patient_name>" }, { label: "Ngày khám", value: "<appointment_date>" }, { label: "Giờ khám", value: "<appointment_time>" }, { label: "Bác sĩ", value: "<doctor_name>" }, { label: "Phòng khám", value: "<clinic_room>" }] },
  { id: "user-btn-cskh",         kind: "button",  source: "user", name: "Liên hệ bộ phận CSKH",
    description: "Nút liên hệ chăm sóc khách hàng",
    initials: "📞", bgColor: "oklch(0.88 0.08 265)",
    tags: [{ label: "Giao dịch", status: "ENABLE" }, { label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "button" },
  { id: "user-btn-loyalty",      kind: "button",  source: "user", name: "Theo dõi điểm",
    description: "Nút xem điểm tích lũy thành viên",
    initials: "🎯", bgColor: "oklch(0.88 0.08 50)",
    tags: [{ label: "Chăm sóc KH", status: "ENABLE" }, { label: "Hậu mãi", status: "ENABLE" }], previewRender: "button" },
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

type LastAdded = { type: "title" | "logo" | "block" | "button"; id?: number } | null

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

// Mock uploaded images (emoji + bg for prototype)
const MOCK_IMGS = [
  { emoji: "🐳", bg: "oklch(0.75 0.15 230)", label: "Zalo Banner 1" },
  { emoji: "🐱", bg: "oklch(0.80 0.12 280)", label: "Zalo Banner 2" },
  { emoji: "🍋", bg: "oklch(0.85 0.18 95)",  label: "Zalo Banner 3" },
]
type UploadedImage = { emoji: string; bg: string; label: string }
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

// ── Library card helpers ──────────────────────────────────────────────────────

const TAG_TO_LEVEL: Record<string, number> = {
  "Giao dịch": 1,
  "Chăm sóc KH": 2,
  "Hậu mãi": 3,
}

function vcTypeLabel(c: VComponent): string {
  if (c.kind === "logo") return "Logo"
  if (c.kind === "button") return "Nút"
  if (c.previewRender === "title") return "Tiêu đề"
  if (c.previewRender === "text") return "Văn bản"
  if (c.previewRender === "table") return "Bảng"
  if (c.previewRender === "image" || c.previewRender === "carousel") return "Ảnh"
  return "Component"
}

function vcApprovalLevels(c: VComponent): number[] {
  // predefined = approved for all levels
  if (c.source === "predefined") return [1, 2, 3]
  return c.tags
    .filter((t) => t.status === "ENABLE" && TAG_TO_LEVEL[t.label] !== undefined)
    .map((t) => TAG_TO_LEVEL[t.label])
    .sort()
}

// ── Template skeleton preview — component shown in context, rest is skeleton ──

const SK = ({ w = "full" }: { w?: string }) => (
  <div className={cn("h-[5px] rounded-full bg-gray-200", w === "full" ? "w-full" : w === "3/4" ? "w-3/4" : w === "4/5" ? "w-4/5" : w === "1/2" ? "w-1/2" : "w-2/3")} />
)

function TemplateSkeletonPreview({ vc }: { vc: VComponent }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (vc.previewRender !== "carousel") return
    const t = setInterval(() => setIdx((i) => (i + 1) % CAROUSEL_SLIDES.length), 1600)
    return () => clearInterval(t)
  }, [vc.previewRender])

  const isImage    = vc.previewRender === "image" || vc.previewRender === "carousel"
  const isButton   = vc.kind === "button"
  const isLogo     = vc.kind === "logo"
  const isText     = vc.previewRender === "text"
  const isTitle    = vc.previewRender === "title"
  const isTable    = vc.previewRender === "table"
  const blue       = "oklch(0.488 0.243 264.376)"

  return (
    <div className="h-28 rounded-xl border-2 border-blue-200 bg-white overflow-hidden flex flex-col">
      {/* ── Top: image banner (if image/carousel) or logo header ── */}
      {isImage ? (
        <div className="shrink-0 h-[42%] flex items-center justify-center relative overflow-hidden"
          style={{ background: blue }}>
          {vc.previewRender === "carousel" ? (
            <>
              <span className="text-xl">{CAROUSEL_SLIDES[idx].emoji}</span>
              <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
                {CAROUSEL_SLIDES.map((_, i) => (
                  <div key={i} className={cn("h-0.5 rounded-full transition-all",
                    i === idx ? "w-2.5 bg-white" : "w-1 bg-white/50")} />
                ))}
              </div>
            </>
          ) : (
            <span className="text-[9px] font-semibold text-white/90">Ảnh</span>
          )}
        </div>
      ) : (
        <div className={cn("shrink-0 px-2 py-1.5 flex items-center gap-1",
          isLogo ? "bg-orange-50" : "bg-gray-50")}>
          {isLogo ? (
            <>
              <div className="h-3.5 w-3.5 rounded text-[6px] font-bold flex items-center justify-center shrink-0"
                style={{ background: vc.bgColor }}>{vc.initials.slice(0, 2)}</div>
              <div className="h-[4px] flex-1 rounded-full bg-orange-200" />
            </>
          ) : (
            <div className="h-[4px] w-8 rounded-full bg-gray-300" />
          )}
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex-1 px-2 py-1.5 flex flex-col gap-1 min-h-0 overflow-hidden">
        {/* Title skeleton */}
        {!isLogo && <SK w="3/4" />}

        {isTitle ? (
          /* Real title — bold prominent heading + body skeletons */
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-[7px] leading-tight text-gray-900 font-bold">{vc.name}</p>
            <SK w="full" /><SK w="4/5" /><SK w="3/4" />
          </div>
        ) : isText ? (
          /* Real text content only — no title */
          <div className="flex flex-col gap-0.5 flex-1 justify-center">
            <p className="text-[6px] leading-tight text-gray-600 line-clamp-4">{vc.description}</p>
          </div>
        ) : isTable ? (
          /* Mini table — key/value rows */
          <div className="flex flex-col flex-1 justify-center divide-y divide-gray-100">
            {(vc.tableRows ?? []).slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-center justify-between py-[2px]">
                <span className="text-[5.5px] text-gray-400 shrink-0 mr-1 truncate" style={{ maxWidth: "45%" }}>{r.label}</span>
                <span className="text-[5.5px] text-gray-600 font-semibold truncate">{r.value}</span>
              </div>
            ))}
          </div>
        ) : isLogo ? (
          /* Content skeletons after real logo */
          <div className="flex flex-col gap-1 flex-1 justify-center">
            <SK w="full" /><SK w="4/5" /><SK w="3/4" />
          </div>
        ) : (
          /* Generic content skeletons */
          <div className="flex flex-col gap-1 flex-1 justify-center">
            <SK w="full" /><SK w="4/5" />
            {!isButton && <SK w="3/4" />}
          </div>
        )}

        {/* ── Button slot ── */}
        <div className="shrink-0">
          {isButton ? (
            <div className="w-full rounded py-1 flex items-center justify-center text-white text-[8px] font-semibold"
              style={{ background: blue }}>
              {vc.name}
            </div>
          ) : (
            <div className="w-full h-[14px] rounded bg-gray-200" />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Component Library Drawer ──────────────────────────────────────────────────

const LIB_CATEGORIES: { id: LibCategory | "media"; label: string }[] = [
  { id: "all",    label: "Tất cả" },
  { id: "logo",   label: "Logo" },
  { id: "title",  label: "Tiêu đề" },
  { id: "text",   label: "Văn bản" },
  { id: "table",  label: "Bảng" },
  { id: "button", label: "Nút" },
  { id: "media",  label: "Ảnh" },
]

function ComponentLibraryPanel({ open, onClose, onAdd, actionButtonCount, maxButtons }: {
  open: boolean; onClose: () => void
  onAdd: (c: VComponent) => void
  actionButtonCount: number
  maxButtons: number
}) {
  const [search, setSearch]     = useState("")
  const [category, setCategory] = useState<LibCategory | "media">("all")
  const [toast, setToast]       = useState<{ text: string; isError?: boolean } | null>(null)

  function handleAdd(c: VComponent) {
    if (c.kind === "button" && actionButtonCount >= maxButtons) {
      setToast({ text: `Tối đa ${maxButtons} nút thao tác`, isError: true })
      setTimeout(() => setToast(null), 2000)
      return
    }
    onAdd(c)
    setToast({ text: c.name })
    setTimeout(() => setToast(null), 1600)
  }

  const filtered = ALL_LIBRARY.filter((c) => {
    if (search) {
      const q = search.toLowerCase()
      const inName = c.name.toLowerCase().includes(q)
      const inDesc = c.description.toLowerCase().includes(q)
      const inRows = (c.tableRows ?? []).some(
        (r) => r.label.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)
      )
      if (!inName && !inDesc && !inRows) return false
    }
    if (category === "all") return true
    if (category === "media") return c.previewRender === "image" || c.previewRender === "carousel"
    return c.kind === category || c.previewRender === category
  })

  const availableCategories = LIB_CATEGORIES.filter((cat) => {
    if (cat.id === "all") return true
    if (cat.id === "media") return ALL_LIBRARY.some((c) => c.previewRender === "image" || c.previewRender === "carousel")
    return ALL_LIBRARY.some((c) => c.kind === cat.id || c.previewRender === cat.id)
  })

  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        // also ignore the toggle button (data-library-toggle)
        const toggle = document.querySelector("[data-library-toggle]")
        if (toggle && toggle.contains(e.target as Node)) return
        onClose()
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [open, onClose])

  return (
    /* Bottom panel — dark shelf, pushes content above upward */
    <div ref={panelRef} className={cn(
      "shrink-0 bg-white overflow-hidden transition-all duration-300 ease-out",
      open ? "h-[380px] shadow-[0_-8px_24px_rgba(0,0,0,0.10)]" : "h-0",
    )}>
      <div className="h-[380px] flex flex-col relative">
        {/* Header row — white, standard */}
        <div className="flex items-center gap-3 px-6 py-2.5 border-b border-border shrink-0">
          <span className="text-sm font-semibold shrink-0">Thư viện Component</span>
          {/* Category pills */}
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
          {/* Search */}
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm component..."
              className="pl-8 pr-3 py-1.5 text-xs border border-border rounded-md w-40 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition-colors shrink-0">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Grid — slate-50 background only here */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Không có component nào</p>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {filtered.map((c) => {
                const levels = vcApprovalLevels(c)
                return (
                  <button key={c.id} onClick={() => handleAdd(c)}
                    className="rounded-xl border-2 border-border bg-white hover:border-blue-400 hover:shadow-sm p-2 text-left transition-all active:scale-95">
                    <TemplateSkeletonPreview vc={c} />
                    <p className="text-[11px] text-blue-600 font-semibold mt-1.5 leading-tight">{vcTypeLabel(c)}</p>
                    {c.previewRender === "table" ? (
                      <p className="text-[10px] text-muted-foreground truncate leading-tight">
                        {(c.tableRows ?? []).map((r) => `${r.label} ${r.value}`).join(" · ")}
                      </p>
                    ) : (c.kind === "button" || c.previewRender === "text" || c.previewRender === "title") ? (
                      <p className="text-[10px] text-muted-foreground truncate italic leading-tight">"{c.name}"</p>
                    ) : null}
                    {levels.length > 0 && (
                      <p className="text-[10px] text-muted-foreground leading-tight">
                        Cấp độ duyệt: {levels.join(", ")}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Toast */}
        <div className={cn(
          "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg transition-all duration-200 pointer-events-none whitespace-nowrap",
          toast?.isError ? "bg-red-600" : "bg-gray-900",
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          {toast?.isError
            ? <><X className="h-3.5 w-3.5" />{toast.text}</>
            : <><Check className="h-3.5 w-3.5 text-green-400" />Đã thêm <span className="font-semibold">{toast?.text}</span></>
          }
        </div>
      </div>
    </div>
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

// ── Per-type base prices ──────────────────────────────────────────────────────

const TYPE_PRICES: Record<string, number> = {
  "tuy-chinh":  300,
  "xac-thuc":   400,
  "danh-gia":   300,
  "thanh-toan": 300,
  "voucher":    400,
}

// ── Type-specific sample preview bodies ──────────────────────────────────────

function XacThucPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-400" : "text-gray-500"
  return (
    <div className="space-y-2">
      <p className={cn("text-[13px] font-semibold leading-snug")}>Mã xác minh của bạn là</p>
      <div className={cn("text-center py-3 rounded-lg", dark ? "bg-gray-800" : "bg-blue-50")}>
        <span className="text-xl font-bold tracking-widest" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;otp&gt;</span>
      </div>
      <p className={cn("text-[11px] leading-relaxed", muted)}>
        Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai dưới bất kỳ hình thức nào. Mã xác thực có hiệu lực trong 5 phút.
      </p>
      <div className="mt-2">
        <button className="w-full py-2 rounded text-xs font-semibold text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
          Sao chép mã
        </button>
      </div>
    </div>
  )
}

function DanhGiaPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-300" : "text-gray-700"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">Đánh giá sản phẩm</p>
      <p className={cn("text-[12px] leading-relaxed", muted)}>
        Xin chào <span className="font-semibold">&lt;customer_name&gt;</span>, đơn hàng{" "}
        <span className="font-semibold">&lt;order_id&gt;</span> đã được giao thành công.
        Bạn có hài lòng về sản phẩm từ <span className="font-semibold">&lt;shop_name&gt;</span> không?
        Vui lòng để lại đánh giá cho <span className="font-semibold">&lt;shop_name&gt;</span> biết nhé!
      </p>
      <div className="flex justify-center gap-1.5 py-1">
        {[1,2,3,4,5].map((i) => (
          <span key={i} className="text-xl text-yellow-400">☆</span>
        ))}
      </div>
    </div>
  )
}

function ThanhToanPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-400" : "text-gray-500"
  const cardBg = dark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">Thông tin thanh toán</p>
      <p className={cn("text-[11px]", muted)}>OA name trân trọng thông báo đến Quý khách cước phí như sau:</p>
      <table className="w-full text-[11px]">
        <tbody>
          {[
            ["Quý khách", "<customer_name>"],
            ["Mã hợp đồng", "<contract_number>"],
            ["Số tiền", "<price>"],
            ["Ghi chú", "Quý khách vui lòng thanh toán đúng hạn."],
          ].map(([label, value], i) => (
            <tr key={i} className={cn("border-t", dark ? "border-gray-700" : "border-gray-100")}>
              <td className={cn("py-1 pr-2 font-medium", muted)}>{label}</td>
              <td className="py-1 font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn("rounded-lg border p-2.5 text-[11px]", cardBg)}>
        <p className={cn("mb-0.5", muted)}>Số tiền thanh toán</p>
        <p className="font-bold text-sm" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;transfer_amount&gt;đ</p>
        <p className={cn("text-[10px] mt-0.5", muted)}>Tài khoản: 0123456789 - CÔNG TY OA NAME</p>
      </div>
    </div>
  )
}

function VoucherPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-300" : "text-gray-700"
  const cardBg = dark ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">
        Gửi <span style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;customer_name&gt;</span> mã giảm giá 70.000đ
      </p>
      <p className={cn("text-[12px] leading-relaxed", muted)}>
        Gửi khách hàng mã thành viên <span className="font-semibold">&lt;customer_id&gt;</span>, khi đặt hàng trực tiếp tại shop,
        giảm trực tiếp lên đến 70.000đ từ nay cho đến hết <span className="font-semibold">&lt;expire&gt;</span>.
      </p>
      <div className={cn("rounded-lg border p-2.5 flex items-start gap-2.5", cardBg)}>
        <div className="shrink-0 rounded bg-orange-400 text-white text-[9px] font-bold px-1.5 py-1 leading-tight text-center">
          GIẢM<br/>70K
        </div>
        <div className="text-[10px]">
          <p className="font-semibold">Cho đơn hàng trên 200K</p>
          <p className={cn(dark ? "text-gray-400" : "text-gray-500")}>HSD: &lt;start_date&gt; - &lt;expire&gt;</p>
        </div>
      </div>
    </div>
  )
}

// ── Step 2 right panel ────────────────────────────────────────────────────────

function Step2RightPanel({ dark, setDark, title, blocks, actionButtons, templateType, verifiedComponents, logoMode, uploadedImages, lastAdded,
  otpBody, ratingLabels,
  paymentAccountName, paymentAccountNum, paymentAmount, paymentNote,
  voucherTitle, voucherCondition, voucherStartDate, voucherExpire, voucherCode,
}: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtons: ActionButton[]; templateType: string
  verifiedComponents: VComponent[]
  logoMode: "logo" | "image"
  uploadedImages: UploadedImage[]
  lastAdded: LastAdded
  otpBody: string
  ratingLabels: string[]
  paymentAccountName: string; paymentAccountNum: string; paymentAmount: string; paymentNote: string
  voucherTitle: string; voucherCondition: string; voucherStartDate: string; voucherExpire: string; voucherCode: string
}) {
  const typeInfo   = TEMPLATE_TYPES.find((t) => t.id === templateType)
  const logoVC     = verifiedComponents.find((c) => c.kind === "logo")
  const contentVCs = verifiedComponents.filter((c) => c.kind === "content")
  const buttonVCs  = verifiedComponents.filter((c) => c.kind === "button")

  useEffect(() => {
    if (!lastAdded) return
    const id =
      lastAdded.type === "title"  ? "preview-hl-title"  :
      lastAdded.type === "logo"   ? "preview-hl-logo"   :
      lastAdded.type === "block"  ? `preview-hl-block-${lastAdded.id}` :
      lastAdded.type === "button" ? `preview-hl-btn-${lastAdded.id}`   : null
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [lastAdded])

  // Pricing
  const btnCost = actionButtons.reduce((sum, b) => {
    const type = ALL_BUTTON_TYPES.find((t) => t.id === b.type)
    return sum + (type?.cost ?? 0)
  }, 0)
  const basePrice  = TYPE_PRICES[templateType] ?? 300
  const totalPrice = basePrice + btnCost

  const muted = dark ? "text-gray-400" : "text-gray-500"

  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex items-center px-5 py-2.5 border-b border-border bg-white shrink-0">
        <span className="text-xs font-semibold text-foreground">📋 Xem trước</span>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Giao diện tối</span>
            <button onClick={() => setDark(!dark)} className={cn("relative h-5 w-9 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}>
              <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", dark ? "translate-x-4" : "translate-x-0.5")} />
            </button>
          </div>

          <div className={cn("rounded-2xl border border-border overflow-hidden text-sm shadow-sm", dark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
            {logoMode === "image" && uploadedImages.length > 0 ? (
              /* Image mode — show first image as banner */
              <div id="preview-hl-logo" className={cn("relative h-28 overflow-hidden transition-all duration-500",
                lastAdded?.type === "logo" && "outline outline-[3px] outline-blue-500 outline-offset-[-3px]")}
                style={{ background: uploadedImages[0].bg }}>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">{uploadedImages[0].emoji}</div>
                {uploadedImages.length > 1 && (
                  <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
                    {uploadedImages.map((_, i) => (
                      <div key={i} className={cn("h-1 rounded-full", i === 0 ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div id="preview-hl-logo" className={cn("px-4 pt-4 pb-2 flex items-center gap-2 transition-all duration-500",
                lastAdded?.type === "logo" && "outline outline-[3px] outline-blue-500 outline-offset-[-3px]")}>
                {logoVC ? (
                  <p className="text-sm font-extrabold leading-none">
                    <span className={dark ? "text-orange-400" : "text-orange-500"}>{logoVC.name.split(" ")[0]} </span>
                    <span className={dark ? "text-white" : "text-gray-900"}>{logoVC.name.split(" ").slice(1).join(" ")}</span>
                  </p>
                ) : (
                  <p className="text-sm font-extrabold leading-none">
                    <span className={dark ? "text-orange-400" : "text-orange-500"}>ATP </span>
                    <span className={dark ? "text-white" : "text-gray-900"}>SOFTWARE</span>
                  </p>
                )}
              </div>
            )}
            <div className="px-4 py-3 space-y-2">
              {/* ── Title — all types except xac-thuc ── */}
              {templateType !== "xac-thuc" && (
                <p id="preview-hl-title" className={cn("text-[13px] font-semibold leading-snug rounded-sm transition-all duration-500",
                  lastAdded?.type === "title" && "bg-blue-100 outline outline-[3px] outline-blue-500 px-1 -mx-1")}>
                  {title || "Tiêu đề template"}
                </p>
              )}

              {/* ── Blocks — all types except xac-thuc ── */}
              {templateType !== "xac-thuc" && blocks.map((b) => {
                const hl = lastAdded?.type === "block" && lastAdded.id === b.id
                if (b.type === "text") return (
                  <p id={`preview-hl-block-${b.id}`} key={b.id}
                    className={cn("text-[12px] leading-relaxed rounded-sm transition-all duration-500",
                      dark ? "text-gray-300" : "text-gray-700",
                      hl && "bg-blue-100 outline outline-[3px] outline-blue-500 px-1 -mx-1")}>
                    {b.value || <span className="italic text-gray-400">Nội dung văn bản...</span>}
                  </p>
                )
                return (
                  <table id={`preview-hl-block-${b.id}`} key={b.id}
                    className={cn("w-full text-[11px] rounded transition-all duration-500",
                      hl && "outline outline-[3px] outline-blue-500 bg-blue-100")}>
                    <tbody>
                      {b.rows.map((r, ri) => (
                        <tr key={ri} className={cn("border-t", dark ? "border-gray-700" : "border-gray-100")}>
                          <td className={cn("py-1 pr-2 font-medium", muted)}>{r.label}</td>
                          <td className="py-1 font-semibold">{r.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              })}

              {/* ── Verified content components (tuy-chinh) ── */}
              {contentVCs.map((vc) => (
                <PreviewItem key={vc.id} vc={vc} dark={dark} />
              ))}

              {/* ── Type-specific extras ── */}
              {templateType === "xac-thuc" && (
                <>
                  <p className="text-[13px] font-semibold leading-snug">Mã xác minh của bạn là</p>
                  <div className={cn("text-center py-3 rounded-lg", dark ? "bg-gray-800" : "bg-blue-50")}>
                    <span className="text-xl font-bold tracking-widest" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;otp&gt;</span>
                  </div>
                  {otpBody && <p className={cn("text-[11px] leading-relaxed", muted)}>{otpBody}</p>}
                </>
              )}
              {templateType === "danh-gia" && (
                <div className="flex justify-center gap-2 py-2">
                  {ratingLabels.map((_, i) => (
                    <span key={i} className="text-2xl leading-none" style={{ color: "oklch(0.82 0.12 55)", WebkitTextStroke: "1.5px oklch(0.7 0.18 50)" }}>☆</span>
                  ))}
                </div>
              )}
              {templateType === "thanh-toan" && (
                <div className={cn("rounded-lg border p-2.5 text-[11px]", dark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100")}>
                  <p className={cn("mb-0.5", muted)}>Số tiền thanh toán</p>
                  <p className="font-bold text-sm" style={{ color: "oklch(0.488 0.243 264.376)" }}>{paymentAmount}đ</p>
                  <p className={cn("text-[10px] mt-0.5", muted)}>Tài khoản: {paymentAccountNum} - {paymentAccountName}</p>
                  {paymentNote && <p className={cn("text-[10px] mt-0.5", muted)}>{paymentNote}</p>}
                </div>
              )}
              {templateType === "voucher" && (
                <div className={cn("rounded-lg border p-2.5 flex items-start gap-2.5", dark ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200")}>
                  <div className="shrink-0 rounded bg-orange-400 text-white text-[9px] font-bold px-1.5 py-1 leading-tight text-center">
                    {voucherTitle || "VOUCHER"}
                  </div>
                  <div className="text-[10px]">
                    <p className="font-semibold">{voucherCondition || "Điều kiện áp dụng"}</p>
                    <p className={cn(dark ? "text-gray-400" : "text-gray-500")}>
                      Mã: {voucherCode} · HSD: {voucherStartDate} - {voucherExpire}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Action buttons ── */}
              {(buttonVCs.length > 0 || actionButtons.length > 0) && (
                <div className="mt-2 space-y-1.5">
                  {buttonVCs.map((vc) => (
                    <button key={vc.id} className="w-full py-2 rounded text-xs font-semibold text-white"
                      style={{ background: "oklch(0.488 0.243 264.376)" }}>
                      {vc.name}
                    </button>
                  ))}
                  {actionButtons.map((ab, i) => {
                    const hl = lastAdded?.type === "button" && lastAdded.id === ab.id
                    const placeholder = ALL_BUTTON_TYPES.find((t) => t.id === ab.type)?.placeholder
                    return (
                      <button id={`preview-hl-btn-${ab.id}`} key={ab.id}
                        className={cn("w-full py-2 rounded text-xs font-semibold transition-all duration-500",
                          (buttonVCs.length === 0 && i === 0) ? "text-white" : dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700",
                          hl && "outline outline-[3px] outline-blue-500"
                        )}
                        style={(buttonVCs.length === 0 && i === 0) ? { background: "oklch(0.488 0.243 264.376)" } : undefined}>
                        {ab.label || placeholder || `Nút thao tác ${i + 1}`}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded border p-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{typeInfo?.label ?? "Mẫu tuỳ chỉnh"}</span>
              <span className="font-semibold">{basePrice} VNĐ</span>
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
  btn, index, total, onChange, onRemove, isFixed,
}: {
  btn: ActionButton; index: number; total: number
  onChange: (updated: ActionButton) => void
  onRemove: () => void
  isFixed?: boolean
}) {
  const [typeOpen, setTypeOpen] = useState(false)
  const selectedType = ALL_BUTTON_TYPES.find((t) => t.id === btn.type)

  return (
    <div className="rounded-lg border border-border bg-white overflow-visible">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Nút thao tác {index + 1}</span>
          {isFixed && (
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Mặc định</span>
          )}
          {!isFixed && isLabelVerified(btn.label) && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <Check className="h-2.5 w-2.5" /> Đã duyệt
            </span>
          )}
        </div>
        {!isFixed && (
          <button onClick={onRemove} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Loại nút — static display if fixed, dropdown otherwise */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Loại nút</label>
          {isFixed ? (
            <div className="w-full flex items-center justify-between border border-border rounded-lg px-3 h-10 text-sm bg-gray-50">
              <span className="text-foreground font-medium">{selectedType?.label ?? "—"}</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-100 text-green-700">+0đ</span>
            </div>
          ) : (
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
          )}
        </div>

        {/* Nội dung nút */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nội dung nút <span className="text-red-500">*</span></label>
          <Input
            value={btn.label}
            onChange={isFixed ? undefined : (e) => onChange({ ...btn, label: e.target.value })}
            readOnly={isFixed}
            placeholder={isFixed ? (selectedType?.placeholder ?? "...") : "VD: Xem đơn hàng, Tìm hiểu thêm..."}
            className={cn("h-9 text-sm", isFixed && "bg-gray-50")}
          />
        </div>

        {/* URL (chỉ hiện khi type = custom-url) */}
        {!isFixed && selectedType?.hasUrl && (
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
  logoMode, setLogoMode, uploadedImages, setUploadedImages,
  imagesVerified, setImagesVerified, lastAdded,
  ratingLabels, setRatingLabels,
  paymentBank, setPaymentBank,
  paymentAccountName, setPaymentAccountName,
  paymentAccountNum, setPaymentAccountNum,
  paymentAmount, setPaymentAmount,
  paymentNote, setPaymentNote,
  voucherTitle, setVoucherTitle,
  voucherCondition, setVoucherCondition,
  voucherStartDate, setVoucherStartDate,
  voucherExpire, setVoucherExpire,
  voucherCode, setVoucherCode,
  otpBody, setOtpBody,
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
  logoMode: "logo" | "image"; setLogoMode: (m: "logo" | "image") => void
  uploadedImages: UploadedImage[]; setUploadedImages: (imgs: UploadedImage[]) => void
  imagesVerified: boolean; setImagesVerified: (v: boolean) => void
  lastAdded: LastAdded
  ratingLabels: string[]; setRatingLabels: (v: string[]) => void
  paymentBank: string; setPaymentBank: (v: string) => void
  paymentAccountName: string; setPaymentAccountName: (v: string) => void
  paymentAccountNum: string; setPaymentAccountNum: (v: string) => void
  paymentAmount: string; setPaymentAmount: (v: string) => void
  paymentNote: string; setPaymentNote: (v: string) => void
  voucherTitle: string; setVoucherTitle: (v: string) => void
  voucherCondition: string; setVoucherCondition: (v: string) => void
  voucherStartDate: string; setVoucherStartDate: (v: string) => void
  voucherExpire: string; setVoucherExpire: (v: string) => void
  voucherCode: string; setVoucherCode: (v: string) => void
  otpBody: string; setOtpBody: (v: string) => void
}) {
  const [logoOpen, setLogoOpen] = useState(true)
  const [btnOpen, setBtnOpen]   = useState(true)

  const maxBtns = MAX_BUTTONS_BY_TYPE[templateType] ?? MAX_BUTTONS
  const isFirstBtnFixed = ["xac-thuc", "thanh-toan", "voucher"].includes(templateType)

  // Scroll to highlighted element when lastAdded changes
  useEffect(() => {
    if (!lastAdded) return
    const id =
      lastAdded.type === "title"  ? "edit-hl-title"  :
      lastAdded.type === "logo"   ? "edit-hl-logo"   :
      lastAdded.type === "block"  ? `edit-hl-block-${lastAdded.id}` :
      lastAdded.type === "button" ? `edit-hl-btn-${lastAdded.id}`   : null
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [lastAdded])
  const [dragIdx, setDragIdx]       = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = "move"
  }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverIdx !== idx) setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return }
    const arr = [...blocks]
    const [removed] = arr.splice(dragIdx, 1)
    arr.splice(idx, 0, removed)
    setBlocks(arr)
    setDragIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() { setDragIdx(null); setDragOverIdx(null) }
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

        {/* Logo / Hình ảnh */}
        <section id="edit-hl-logo" className={cn("mb-4 rounded-lg border bg-white overflow-hidden transition-all duration-500",
          lastAdded?.type === "logo" ? "border-blue-500 ring-[3px] ring-blue-400/50 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" : "border-border")}>
          <button onClick={() => setLogoOpen(!logoOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold">
            <span>Logo, hình ảnh <span className="text-red-500">*</span></span>
            {logoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {logoOpen && (
            <div className="px-4 pb-4 border-t border-border">
              <p className="text-xs text-muted-foreground mt-3 mb-3">Chỉ được thêm tối đa 1 logo hoặc tối đa 3 hình ảnh</p>

              {logoMode === "image" ? (
                /* ── Image mode ── */
                <div className="rounded border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">Hình ảnh</span>
                      {imagesVerified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <Check className="h-2.5 w-2.5" /> Đã duyệt
                        </span>
                      )}
                    </div>
                    <button onClick={() => { setLogoMode("logo"); setUploadedImages([]); setImagesVerified(false) }}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="text-xs text-muted-foreground mb-3 space-y-0.5 list-disc list-inside">
                    <li>Tải lên tối đa 3 hình ảnh, giá 300đ.</li>
                    <li>Xem hướng dẫn các quy định xét duyệt hình ảnh <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span>.</li>
                  </ul>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => {
                      const img = uploadedImages[i]
                      return img ? (
                        <div key={i} className="relative aspect-video rounded border-2 border-border overflow-hidden group cursor-pointer"
                          style={{ background: img.bg }}>
                          <div className="absolute inset-0 flex items-center justify-center text-4xl">{img.emoji}</div>
                          <button
                            onClick={() => { setUploadedImages(uploadedImages.filter((_, idx) => idx !== i)) }}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button key={i}
                          onClick={() => {
                            const next = MOCK_IMGS[uploadedImages.length % MOCK_IMGS.length]
                            setUploadedImages([...uploadedImages, next])
                            setImagesVerified(false)
                          }}
                          className="aspect-video rounded border-2 border-dashed border-gray-300 hover:border-blue-400 flex flex-col items-center justify-center gap-1 px-2 transition-colors">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                          <span className="text-[10px] text-center text-muted-foreground leading-tight">
                            Kéo thả hoặc <span className="text-blue-600 font-medium">tải ảnh lên</span>
                          </span>
                          <span className="text-[9px] text-muted-foreground text-center leading-tight">
                            JPG, PNG · 16:9 · &lt;500KB
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                /* ── Logo mode ── */
                <div className="rounded border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Logo</span>
                    <div className="flex items-center gap-2">
                      {logoVC && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          <Check className="h-2.5 w-2.5" /> Đã duyệt
                        </span>
                      )}
                      <button className="text-red-400 hover:text-red-600 transition-colors"
                        onClick={logoVC ? () => onRemoveVC(logoVC.id) : undefined}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Logo sau khi được duyệt sẽ được tự động cập nhật cho các mẫu ZBS của OA, xem gợi ý{" "}
                    <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {["Giao diện sáng", "Giao diện tối"].map((label, i) => (
                      <div key={i}>
                        <div className="text-xs font-semibold mb-2">{label} <span className="text-red-500">*</span></div>
                        <div className={cn("h-24 rounded border-2 flex items-center justify-center cursor-pointer transition-colors",
                          logoVC
                            ? (i === 1 ? "bg-gray-900 border-gray-700" : "bg-white border-green-300")
                            : (i === 1 ? "bg-gray-900 border-gray-600 border-dashed hover:border-blue-400" : "bg-white border-gray-300 border-dashed hover:border-blue-400"))}>
                          {logoVC ? (
                            <div className={cn("text-sm font-bold tracking-wide", i === 1 ? "text-orange-300" : "text-orange-500")}>
                              {logoVC.initials}{" "}
                              <span className={i === 1 ? "text-white" : "text-gray-700"}>{logoVC.name.replace(/^Logo\s*/i, "")}</span>
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
              )}

              {/* Mode toggle */}
              <div className="mt-3 flex gap-2">
                <button onClick={() => setLogoMode("logo")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                    logoMode === "logo"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:text-blue-600")}>
                  <span className="text-[11px]">⊕</span> Logo
                </button>
                <button onClick={() => setLogoMode("image")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all",
                    logoMode === "image"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-muted-foreground border-border hover:border-blue-300 hover:text-blue-600")}>
                  <ImageIcon className="h-3 w-3" /> Hình ảnh
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Content */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold">Nội dung Template</span>
          </div>
          <div className="p-4 space-y-2">

            {/* ── Tiêu đề — hidden for xac-thuc ── */}
            {templateType !== "xac-thuc" && (
            <div id="edit-hl-title" className={cn("rounded border p-3 bg-gray-50/40 transition-all duration-500",
              lastAdded?.type === "title" ? "border-blue-500 ring-[3px] ring-blue-400/50 bg-blue-50 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" : "border-border")}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-gray-200 shrink-0" />
                  <span className="text-xs font-semibold">Tiêu đề <span className="text-red-500">*</span></span>
                </div>
                <span className="text-[10px] text-muted-foreground">Mặc định · 1 tiêu đề</span>
              </div>
              <Input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 65))}
                className="text-sm border-0 px-0 focus-visible:ring-0 h-8" placeholder="Nhập tiêu đề..." />
              <div className="text-right text-[10px] text-muted-foreground mt-1">{title.length}/65</div>
            </div>
            )}

            {/* ── OTP body — xac-thuc only ── */}
            {templateType === "xac-thuc" && (
              <div className="rounded border p-3 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Nội dung gửi kèm mã OTP <span className="text-red-500">*</span></span>
                </div>
                <textarea value={otpBody} onChange={(e) => setOtpBody(e.target.value.slice(0, 400))}
                  rows={4} className="w-full text-sm border border-border rounded-md p-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="VD: Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai dưới bất kỳ hình thức nào. Mã xác thực có hiệu lực trong 5 phút." />
                <div className="text-right text-[10px] text-muted-foreground mt-1">{otpBody.length}/400</div>
              </div>
            )}

            {/* ── Draggable blocks — hidden for xac-thuc ── */}
            {templateType !== "xac-thuc" && blocks.map((b, idx) => (
              <div key={b.id}
                id={`edit-hl-block-${b.id}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "rounded border p-3 transition-all duration-500 select-none",
                  dragOverIdx === idx && dragIdx !== idx
                    ? "border-blue-400 bg-blue-50/40 shadow-sm"
                    : lastAdded?.type === "block" && lastAdded.id === b.id
                      ? "border-blue-500 ring-[3px] ring-blue-400/50 bg-blue-50 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]"
                      : "border-border bg-white",
                  dragIdx === idx && "opacity-40 scale-[0.99]",
                )}>
                {b.type === "text" ? (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-gray-300 cursor-grab active:cursor-grabbing shrink-0" />
                        <span className="text-xs font-semibold">Văn bản <span className="text-red-500">*</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isTextVerified(b.value) && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                            <Check className="h-2.5 w-2.5" /> Đã duyệt
                          </span>
                        )}
                        <button onClick={() => removeBlock(b.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea value={b.value}
                      onMouseDown={(e) => e.stopPropagation()}
                      onChange={(e) => updateTextBlock(b.id, e.target.value.slice(0, 400))}
                      rows={3} className="w-full text-sm border-0 resize-none focus:outline-none select-text" placeholder="Nhập nội dung văn bản..." />
                    <div className="flex items-center justify-end">
                      <div className="text-[10px] text-muted-foreground">{b.value.length}/400</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-gray-300 cursor-grab active:cursor-grabbing shrink-0" />
                        <span className="text-xs font-semibold">Bảng</span>
                      </div>
                      <button onClick={() => removeBlock(b.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_24px] gap-2 text-xs font-semibold text-muted-foreground mb-2">
                      <span>Tiêu đề</span><span>Nội dung</span><span />
                    </div>
                    {b.rows.map((r, ri) => (
                      <div key={ri} className="grid grid-cols-[1fr_1fr_24px] gap-2 mb-2">
                        <Input value={r.label} onMouseDown={(e) => e.stopPropagation()} onChange={(e) => updateTableRow(b.id, ri, "label", e.target.value)} className="h-8 text-sm" placeholder="Tiêu đề hàng" />
                        <Input value={r.value} onMouseDown={(e) => e.stopPropagation()} onChange={(e) => updateTableRow(b.id, ri, "value", e.target.value)} className="h-8 text-sm" placeholder="<tham_so>" />
                        <button onClick={() => removeTableRow(b.id, ri)} className="flex items-center justify-center text-red-400 hover:text-red-600"><Minus className="h-4 w-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => addTableRow(b.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                      <Plus className="h-3 w-3" /> Thêm hàng
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* ── Add block — hidden for xac-thuc ── */}
            {templateType !== "xac-thuc" && (
            <div className="flex items-center gap-2 pt-1">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <button onClick={() => addBlock("text")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50 transition-colors"><span>☰</span> Văn bản</button>
              <button onClick={() => addBlock("table")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50 transition-colors"><span>⊞</span> Bảng</button>
            </div>
            )}
          </div>
        </section>

        {/* ── Bình chọn — danh-gia only ── */}
        {templateType === "danh-gia" && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-1">Bình chọn</h2>
            <p className="text-xs text-muted-foreground mb-3">Cấu hình thang điểm đánh giá dịch vụ</p>
            <div className="rounded-lg border border-border bg-white overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_120px] gap-0 text-xs font-semibold text-muted-foreground px-4 py-2 border-b border-border bg-gray-50">
                <span>Thang điểm</span><span>Tiêu đề <span className="text-red-500">*</span></span><span />
              </div>
              {([
                <><span className="text-yellow-400">★</span><span className="text-gray-300">★★★★</span></>,
                <><span className="text-yellow-400">★★</span><span className="text-gray-300">★★★</span></>,
                <><span className="text-yellow-400">★★★</span><span className="text-gray-300">★★</span></>,
                <><span className="text-yellow-400">★★★★</span><span className="text-gray-300">★</span></>,
                <><span className="text-yellow-400">★★★★★</span></>,
              ] as React.ReactNode[]).map((stars, i) => (
                <div key={i} className="grid grid-cols-[80px_1fr_120px] gap-3 items-center px-4 py-2.5 border-b border-border last:border-0">
                  <div className="flex gap-0.5 text-sm">{stars}</div>
                  <Input value={ratingLabels[i] ?? ""} onChange={(e) => { const arr = [...ratingLabels]; arr[i] = e.target.value; setRatingLabels(arr) }} className="h-8 text-sm" />
                  <button className="text-xs text-blue-600 hover:underline text-right">Thêm chi tiết</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Thông tin thanh toán — thanh-toan only ── */}
        {templateType === "thanh-toan" && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-3">Thông tin thanh toán <span className="text-red-500">*</span></h2>
            <div className="rounded-lg border border-border bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-blue-50 flex gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-1">
                  <p className="font-semibold">Lưu ý</p>
                  <ul className="space-y-0.5 list-disc list-inside">
                    <li>Vui lòng kiểm tra kĩ thông tin bên dưới trước khi gửi.</li>
                    <li>Tài khoản thu hưởng cần là tài khoản của doanh nghiệp sở hữu OA.</li>
                    <li>Zalo không chịu trách nhiệm nếu thông tin thanh toán không chính xác.</li>
                  </ul>
                </div>
              </div>
              <div className="divide-y divide-border">
                <div className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                  <label className="text-sm font-medium pt-1.5">Ngân hàng<span className="text-red-500 ml-0.5">*</span></label>
                  <div className="flex gap-2">
                    <button className="shrink-0 border border-border rounded px-3 h-9 text-sm bg-white hover:bg-gray-50">Chọn ngân hàng</button>
                    <select value={paymentBank} onChange={(e) => setPaymentBank(e.target.value)} className="flex-1 border border-border rounded px-3 h-9 text-sm bg-white focus:outline-none">
                      <option value="">-- Chọn Ngân Hàng --</option>
                      {["Vietcombank","Techcombank","MB Bank","BIDV","VietinBank","Agribank","TPBank","ACB","VPBank","Sacombank"].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                  <label className="text-sm font-medium pt-1.5">Tên tài khoản<span className="text-red-500 ml-0.5">*</span></label>
                  <div><Input value={paymentAccountName} onChange={(e) => setPaymentAccountName(e.target.value)} className="h-9 text-sm w-full" /></div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                  <label className="text-sm font-medium pt-1.5">Số tài khoản<span className="text-red-500 ml-0.5">*</span></label>
                  <div><Input value={paymentAccountNum} onChange={(e) => setPaymentAccountNum(e.target.value)} className="h-9 text-sm w-full" /></div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                  <label className="text-sm font-medium pt-1.5">Số tiền (VND)<span className="text-red-500 ml-0.5">*</span></label>
                  <div><Input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="h-9 text-sm w-full" placeholder="<transfer_amount>" /></div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                  <label className="text-sm font-medium pt-1.5">Nội dung chuyển khoản</label>
                  <div>
                    <Input value={paymentNote} onChange={(e) => setPaymentNote(e.target.value.slice(0,90))} className="h-9 text-sm w-full" placeholder="<bank_transfer_note>" />
                    <p className="text-[10px] text-muted-foreground text-right mt-0.5">{paymentNote.length} / 90</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Thông tin voucher — voucher only ── */}
        {templateType === "voucher" && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold mb-3">Thông tin voucher <span className="text-red-500">*</span></h2>
            <div className="rounded-lg border border-border bg-white">
              <div className="divide-y divide-border">
                {([
                  { label: "Tiêu đề", required: true, maxLen: 30, val: voucherTitle, set: setVoucherTitle },
                  { label: "Điều kiện áp dụng", required: true, maxLen: 40, val: voucherCondition, set: setVoucherCondition },
                ] as { label: string; required: boolean; maxLen: number; val: string; set: (v: string) => void }[]).map(({ label, required, maxLen, val, set }) => (
                  <div key={label} className="grid grid-cols-[180px_1fr] gap-4 items-start px-4 py-3">
                    <label className="text-sm font-medium pt-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
                    <div>
                      <Input value={val} onChange={(e) => set(e.target.value.slice(0, maxLen))} className="h-9 text-sm w-full" />
                      <p className="text-[10px] text-muted-foreground text-right mt-0.5">{val.length}/{maxLen}</p>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-[180px_1fr] gap-4 items-center px-4 py-3">
                  <label className="text-sm font-medium">Ngày bắt đầu</label>
                  <div className="flex gap-2 items-center">
                    <button className="shrink-0 border border-border rounded px-3 h-9 text-xs bg-white hover:bg-gray-50 flex items-center gap-1">Nhập tham số <span className="text-muted-foreground">⇌</span></button>
                    <Input value={voucherStartDate} onChange={(e) => setVoucherStartDate(e.target.value)} className="h-9 text-sm flex-1" placeholder="<start_date>" />
                  </div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-center px-4 py-3">
                  <label className="text-sm font-medium">Hạn sử dụng <span className="text-red-500">*</span></label>
                  <div className="flex gap-2 items-center">
                    <button className="shrink-0 border border-border rounded px-3 h-9 text-xs bg-white hover:bg-gray-50 flex items-center gap-1">Nhập tham số <span className="text-muted-foreground">⇌</span></button>
                    <Input value={voucherExpire} onChange={(e) => setVoucherExpire(e.target.value)} className="h-9 text-sm flex-1" placeholder="<expire>" />
                  </div>
                </div>
                <div className="grid grid-cols-[180px_1fr] gap-4 items-center px-4 py-3">
                  <label className="text-sm font-medium">Mã voucher <span className="text-red-500">*</span></label>
                  <Input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} className="h-9 text-sm" placeholder="<voucher_code>" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Action buttons */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setBtnOpen(!btnOpen)} className="flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition-colors">
              Nút thao tác
              <span className="text-[10px] font-normal text-muted-foreground">({actionButtons.length}/{maxBtns})</span>
              {btnOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          {btnOpen && (
            <div className="space-y-3">
              {/* Button cards — includes both manual and library VCs (shown with Đã duyệt badge) */}
              {actionButtons.map((btn, i) => (
                <div key={btn.id} id={`edit-hl-btn-${btn.id}`} className={cn("rounded-lg transition-all duration-500",
                  lastAdded?.type === "button" && lastAdded.id === btn.id && "ring-[3px] ring-blue-400/50 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]")}>
                  <ActionButtonCard
                    btn={btn}
                    index={i}
                    total={actionButtons.length}
                    onChange={(updated) => updateActionButton(btn.id, updated)}
                    onRemove={() => removeActionButton(btn.id)}
                    isFixed={isFirstBtnFixed && i === 0}
                  />
                </div>
              ))}

              {/* Add button */}
              {actionButtons.length < maxBtns && (
                <button
                  onClick={addActionButton}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-muted-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Thêm nút thao tác
                  <span className="text-[10px] text-muted-foreground">({actionButtons.length}/{maxBtns})</span>
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
        logoMode={logoMode} uploadedImages={uploadedImages}
        lastAdded={lastAdded}
        otpBody={otpBody} ratingLabels={ratingLabels}
        paymentAccountName={paymentAccountName} paymentAccountNum={paymentAccountNum}
        paymentAmount={paymentAmount} paymentNote={paymentNote}
        voucherTitle={voucherTitle} voucherCondition={voucherCondition}
        voucherStartDate={voucherStartDate} voucherExpire={voucherExpire} voucherCode={voucherCode}
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

  // Demo mode — skip step 1 when ?step=2 in URL
  const [demoMode, setDemoMode]   = useState(false)
  const [libHinted, setLibHinted] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("step") === "2") {
      setTemplateName("Demo Template ZBS")
      setSelectedApp("QC Test ZNS 4")
      setSelectedOA("Trợ lý tin doanh nghiệp")
      setStep(1)
      setDemoMode(true)
    }
  }, [])

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
  const [dark, setDark]                     = useState(false)
  const [logoMode, setLogoMode]             = useState<"logo" | "image">("logo")
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [imagesVerified, setImagesVerified] = useState(false)

  const [note, setNote]     = useState("")
  const [agreed, setAgreed] = useState(false)

  // Type-specific fields
  const [ratingLabels, setRatingLabels] = useState(["Rất không hài lòng", "Không hài lòng", "Bình thường", "Hài lòng", "Rất hài lòng"])
  const [paymentBank, setPaymentBank] = useState("")
  const [paymentAccountName, setPaymentAccountName] = useState("CÔNG TY OA NAME")
  const [paymentAccountNum, setPaymentAccountNum] = useState("0123456789")
  const [paymentAmount, setPaymentAmount] = useState("<transfer_amount>")
  const [paymentNote, setPaymentNote] = useState("<bank_transfer_note>")
  const [voucherTitle, setVoucherTitle] = useState("Giảm 70.000đ")
  const [voucherCondition, setVoucherCondition] = useState("Cho đơn hàng trên 200K")
  const [voucherStartDate, setVoucherStartDate] = useState("<start_date>")
  const [voucherExpire, setVoucherExpire] = useState("<expire>")
  const [voucherCode, setVoucherCode] = useState("<voucher_code>")
  const [otpBody, setOtpBody] = useState("Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai dưới bất kỳ hình thức nào. Mã xác thực có hiệu lực trong 5 phút.")

  const [verifiedComponents, setVerifiedComponents] = useState<VComponent[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<LastAdded>(null)

  useEffect(() => {
    if (!lastAdded) return
    const t = setTimeout(() => setLastAdded(null), 1600)
    return () => clearTimeout(t)
  }, [lastAdded])

  // Auto-reset title, blocks, action buttons when templateType changes
  useEffect(() => {
    const t = Date.now()
    type TypeDefaults = {
      title: string
      blocks: Block[]
      buttons: ActionButton[]
    }
    const defaults: Record<string, TypeDefaults> = {
      "tuy-chinh": {
        title: "Xin chào <customer_name>,",
        blocks: [
          { id: t,   type: "text", value: "Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi." },
          { id: t+1, type: "text", value: "Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng <company_name>." },
          { id: t+2, type: "table", rows: [{ label: "Mã đơn hàng", value: "<order_code>" }, { label: "Trạng thái", value: "<payment_status>" }] },
        ],
        buttons: [{ id: t+3, type: "oa-profile", label: "Đến trang thông tin OA", url: "" }],
      },
      "xac-thuc": {
        title: "",
        blocks: [],
        buttons: [{ id: t, type: "sao-chep", label: "", url: "" }],
      },
      "danh-gia": {
        title: "Đánh giá sản phẩm",
        blocks: [
          { id: t, type: "text", value: "Xin chào <customer_name>, đơn hàng <order_id> đã được giao thành công. Bạn có hài lòng về sản phẩm từ bên <shop_name> không? Bạn vui lòng để lại đánh giá cho <shop_name> biết nhé!" },
        ],
        buttons: [],
      },
      "thanh-toan": {
        title: "Thông tin thanh toán",
        blocks: [
          { id: t,   type: "text", value: "OA name trân trọng thông báo đến Quý khách cước phí như sau:" },
          { id: t+1, type: "table", rows: [
            { label: "Quý khách",    value: "<customer_name>" },
            { label: "Mã hợp đồng", value: "<contract_number>" },
            { label: "Số tiền",      value: "<price>" },
            { label: "Ghi chú",      value: "Quý khách vui lòng thanh toán đúng hạn." },
          ]},
        ],
        buttons: [{ id: t+2, type: "thanh-toan-btn", label: "", url: "" }],
      },
      "voucher": {
        title: "Gửi <customer_name> mã giảm giá 70.000đ",
        blocks: [
          { id: t, type: "text", value: "Gửi khách hàng với mã thành viên <customer_id>, khi đặt hàng trực tiếp tại shop, giảm trực tiếp lên đến 70.000đ từ nay cho đến hết <expire>." },
        ],
        buttons: [{ id: t+1, type: "xem-chi-tiet", label: "", url: "" }],
      },
    }
    const d = defaults[templateType]
    if (d) {
      setTitle(d.title)
      setBlocks(d.blocks)
      setActionButtons(d.buttons)
    }
  }, [templateType])

  function handleAddVC(c: VComponent) {
    if (c.kind === "logo") {
      setVerifiedComponents((prev) => [...prev.filter((v) => v.kind !== "logo"), c])
      setLogoMode("logo")
      setLastAdded({ type: "logo" })
    } else if (c.kind === "button") {
      const maxBtnsPage = MAX_BUTTONS_BY_TYPE[templateType] ?? MAX_BUTTONS
      if (actionButtons.length >= maxBtnsPage) return
      const newId = Date.now()
      setActionButtons((prev) => [...prev, { id: newId, type: "oa-profile", label: c.name, url: "" }])
      setLastAdded({ type: "button", id: newId })
    } else if (c.previewRender === "title") {
      setTitle(c.name)
      setLastAdded({ type: "title" })
    } else if (c.previewRender === "text") {
      const newId = Date.now()
      setBlocks((prev) => [...prev, { type: "text", id: newId, value: c.description }])
      setLastAdded({ type: "block", id: newId })
    } else if (c.previewRender === "table") {
      const newId = Date.now()
      setBlocks((prev) => [...prev, { type: "table", id: newId, rows: c.tableRows ?? [] }])
      setLastAdded({ type: "block", id: newId })
    } else if (c.previewRender === "carousel") {
      setLogoMode("image")
      setUploadedImages([...MOCK_IMGS])
      setImagesVerified(true)
      setLastAdded({ type: "logo" })
    } else if (c.previewRender === "image") {
      setLogoMode("image")
      setUploadedImages((prev) => {
        const next = prev.length < 3 ? [...prev, MOCK_IMGS[prev.length % MOCK_IMGS.length]] : prev
        return next
      })
      setImagesVerified(true)
      setLastAdded({ type: "logo" })
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
    <div className="fixed top-[36px] inset-x-0 bottom-0 z-[44] bg-white flex flex-col items-center justify-center gap-4">
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
    <div className="fixed top-[36px] inset-x-0 bottom-0 z-[44] bg-white flex flex-col">
      <StepHeader step={step} onExit={exit} saved={step > 0} />

      <div className="flex-1 min-h-0 overflow-hidden">
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
            logoMode={logoMode} setLogoMode={setLogoMode}
            uploadedImages={uploadedImages} setUploadedImages={setUploadedImages}
            imagesVerified={imagesVerified} setImagesVerified={setImagesVerified}
            lastAdded={lastAdded}
            ratingLabels={ratingLabels} setRatingLabels={setRatingLabels}
            paymentBank={paymentBank} setPaymentBank={setPaymentBank}
            paymentAccountName={paymentAccountName} setPaymentAccountName={setPaymentAccountName}
            paymentAccountNum={paymentAccountNum} setPaymentAccountNum={setPaymentAccountNum}
            paymentAmount={paymentAmount} setPaymentAmount={setPaymentAmount}
            paymentNote={paymentNote} setPaymentNote={setPaymentNote}
            voucherTitle={voucherTitle} setVoucherTitle={setVoucherTitle}
            voucherCondition={voucherCondition} setVoucherCondition={setVoucherCondition}
            voucherStartDate={voucherStartDate} setVoucherStartDate={setVoucherStartDate}
            voucherExpire={voucherExpire} setVoucherExpire={setVoucherExpire}
            voucherCode={voucherCode} setVoucherCode={setVoucherCode}
            otpBody={otpBody} setOtpBody={setOtpBody}
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
      </div>

      {step === 1 && (
        <ComponentLibraryPanel open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAddVC} actionButtonCount={actionButtons.length} maxButtons={MAX_BUTTONS_BY_TYPE[templateType] ?? MAX_BUTTONS} />
      )}

      <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-white shrink-0">
        {step === 0 ? <Button variant="outline" onClick={exit}>Hủy</Button>
          : <Button variant="outline" onClick={() => setStep(step - 1)}>Quay lại</Button>}

        {step === 1 && (
          <div className="relative">
            {/* Demo mode pulse */}
            {demoMode && !libHinted && (
              <>
                <span className="absolute -inset-1.5 rounded-lg animate-ping bg-blue-400/35 pointer-events-none" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold bg-blue-600 text-white px-2.5 py-1 rounded-full shadow-md pointer-events-none">
                  👆 Bắt đầu tại đây
                </span>
              </>
            )}
            <Button
              data-library-toggle
              variant="outline"
              className={cn(
                "gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 relative",
                demoMode && !libHinted && "border-blue-500 bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              )}
              onClick={() => { setDrawerOpen((v) => !v); setLibHinted(true) }}
            >
              <Library className="h-4 w-4" />
              Thư viện Component
              {verifiedComponents.length > 0 && (
                <span className="h-5 min-w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {verifiedComponents.length}
                </span>
              )}
            </Button>
          </div>
        )}

        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !canNext1}
            className="px-8 text-white bg-blue-600 hover:bg-blue-700">
            Tiếp tục
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            {!agreed && <span className="text-xs text-muted-foreground">Dự kiến 1–2 ngày làm việc</span>}
            <Button onClick={() => setDone(true)} disabled={!agreed}
              className="px-8 text-white bg-blue-600 hover:bg-blue-700">
              Gửi duyệt
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

