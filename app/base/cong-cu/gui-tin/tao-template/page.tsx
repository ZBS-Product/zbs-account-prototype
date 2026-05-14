"use client"

import { useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Check, X, Info, ChevronDown, ChevronUp, Minus, Plus, Search, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// ── Constants ─────────────────────────────────────────────────────────────────

const APPS = ["QC Test ZNS 4", "ZNS Service", "Test ZBS App", "QC Test App New", "Andy Hotel"]
const OAS  = ["QC Test ZNS 4", "Trợ lý tin doanh nghiệp", "ZBS Account", "Zalo Business Solutions", "QC OA 1"]

const TEMPLATE_TYPES = [
  { id: "tuy-chinh",      icon: "✏️", label: "Mẫu tuỳ chỉnh",          price: "Từ 210đ/tin" },
  { id: "xac-thuc",       icon: "🔐", label: "Mẫu xác thực",            price: "Từ 280đ/tin" },
  { id: "danh-gia",       icon: "⭐", label: "Mẫu đánh giá dịch vụ",   price: "Từ 210đ/tin" },
  { id: "thanh-toan",     icon: "💳", label: "Mẫu yêu cầu thanh toán", price: "Từ 210đ/tin" },
  { id: "voucher",        icon: "🎟️", label: "Mẫu Voucher",             price: "Từ 280đ/tin" },
]

const PURPOSES = [
  { id: "cap-do-1", label: "Cấp độ 1", sub: "Giao dịch" },
  { id: "cap-do-2", label: "Cấp độ 2", sub: "Chăm sóc khách hàng" },
  { id: "cap-do-3", label: "Cấp độ 3", sub: "Hậu mãi" },
]

const BUTTON_OPTIONS = [
  { group: "ĐẾN TÀI SẢN CỦA DOANH NGHIỆP TRÊN HỆ SINH THÁI ZALO", options: [
    { id: "oa-profile",  label: "Đến trang thông tin OA (+0đ)",              sub: "Xem trang thông tin OA trên Zalo" },
    { id: "mini-app",    label: "Đến ứng dụng Zalo Mini App của Doanh nghiệp (+0/100đ)", sub: "Truy cập Mini App của doanh nghiệp trên Zalo" },
    { id: "oa-post",     label: "Đến bài viết của OA (+0/100đ)",             sub: "Truy cập bài viết của doanh nghiệp" },
  ]},
  { group: "ĐẾN LIÊN KẾT TÙY CHỈNH", options: [
    { id: "custom-url",  label: "Đến URL (+0/100đ)",                         sub: "Đường dẫn tùy chỉnh" },
  ]},
]

const TECH_SETTINGS = ["Tên khách hàng (30)", "Tên sản phẩm / Thương hiệu (200)", "Số điện thoại (15)", "Mã giao dịch (50)", "Trạng thái (50)", "Ngày giờ (20)", "Số tiền (20)", "Địa chỉ (200)"]

// ── Types ─────────────────────────────────────────────────────────────────────

type BlockType = "text" | "table"
interface TextBlock { type: "text"; id: number; value: string }
interface TableBlock { type: "table"; id: number; rows: { label: string; value: string }[] }
type Block = TextBlock | TableBlock

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Step header ───────────────────────────────────────────────────────────────

const STEP_LABELS = ["Thông tin chung", "Khai báo nội dung", "Gửi duyệt"]

function StepHeader({ step, onExit, saved }: { step: number; onExit: () => void; saved: boolean }) {
  return (
    <div className="flex items-center h-14 px-8 border-b border-border shrink-0 bg-white">
      <div className="flex items-center gap-0 flex-1">
        {STEP_LABELS.map((label, i) => {
          const done   = i < step
          const active = i === step
          return (
            <div key={i} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-sm font-semibold border-2 shrink-0",
                  done   ? "bg-blue-600 border-blue-600 text-white"
                         : active ? "bg-blue-600 border-blue-600 text-white"
                         : "bg-white border-gray-300 text-gray-400"
                )}>
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn("text-sm font-medium", active ? "text-foreground" : done ? "text-foreground" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={cn("w-16 h-px mx-4", done ? "bg-blue-600" : "bg-gray-200")} />
              )}
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

// ── Right panel ───────────────────────────────────────────────────────────────

function TipsPanel() {
  return (
    <div className="w-[280px] shrink-0 border-l border-border bg-gray-50 p-5 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-base">💡</div>
        <span className="text-sm font-semibold">Gợi ý khi tạo Template</span>
      </div>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {[
          <>Bạn sẽ cần liên kết ứng dụng và OA của doanh nghiệp để bắt đầu gửi tin qua SĐT. Đọc và làm theo hướng dẫn <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span>.</>,
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

function PreviewPanel({
  dark, setDark, title, blocks, actionButtonId, templateType,
}: {
  dark: boolean; setDark: (v: boolean) => void
  title: string; blocks: Block[]; actionButtonId: string; templateType: string
}) {
  const activeBtn = BUTTON_OPTIONS.flatMap((g) => g.options).find((o) => o.id === actionButtonId)
  const typeInfo = TEMPLATE_TYPES.find((t) => t.id === templateType)

  return (
    <div className="w-[300px] shrink-0 border-l border-border bg-gray-50 overflow-y-auto">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Xem trước Template</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Giao diện tối</span>
          <button
            onClick={() => setDark(!dark)}
            className={cn("relative h-5 w-9 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}
          >
            <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", dark ? "translate-x-4" : "translate-x-0.5")} />
          </button>
        </div>

        {/* Preview card */}
        <div className={cn("rounded-lg border border-border overflow-hidden text-sm", dark ? "bg-gray-900 text-white" : "bg-white text-gray-900")}>
          {/* Logo */}
          <div className={cn("px-4 py-3 flex items-center", dark ? "bg-gray-800" : "bg-orange-50")}>
            <div className={cn("text-xs font-bold", dark ? "text-orange-400" : "text-orange-600")}>
              ATP <span className={dark ? "text-white" : "text-gray-800"}>SOFTWARE</span>
            </div>
          </div>
          {/* Content */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-[13px] font-semibold leading-snug">{title || "Tiêu đề template"}</p>
            {blocks.map((b) => {
              if (b.type === "text") return (
                <p key={b.id} className={cn("text-[12px] leading-relaxed", dark ? "text-gray-300" : "text-gray-700")}>{b.value || <span className="italic text-gray-400">Nội dung văn bản...</span>}</p>
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

        {/* Pricing */}
        <div className={cn("rounded border p-3 space-y-1.5 text-xs", dark ? "" : "")}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{typeInfo?.label ?? "Mẫu tuỳ chỉnh"}</span>
            <span className="font-semibold">300 VNĐ</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nút thao tác 1</span>
            <span className="font-semibold">0 VNĐ</span>
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
    </div>
  )
}

// ── Step 1 ────────────────────────────────────────────────────────────────────

function Step1({
  templateName, setTemplateName,
  selectedApp, setSelectedApp,
  selectedOA, setSelectedOA,
}: {
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
          {/* Template name */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Tên mẫu Template <span className="text-red-500">*</span>
            </label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="VD: Xác nhận đơn hàng thành công"
              className="h-10"
            />
          </div>

          {/* App */}
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              Chọn App bạn muốn dùng để tạo Template
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="w-full appearance-none border border-border rounded-md px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
              >
                <option value="">-- Chọn App --</option>
                {APPS.map((a) => <option key={a}>{a}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* OA */}
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Chọn OA bạn muốn dùng để gửi tin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedOA}
                onChange={(e) => setSelectedOA(e.target.value)}
                className="w-full appearance-none border border-border rounded-md px-3 py-2 text-sm pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
              >
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
  templateType, setTemplateType,
  purpose, setPurpose,
  title, setTitle,
  blocks, setBlocks,
  actionButtonId, setActionButtonId,
  dark, setDark,
}: {
  templateType: string; setTemplateType: (v: string) => void
  purpose: string; setPurpose: (v: string) => void
  title: string; setTitle: (v: string) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  actionButtonId: string; setActionButtonId: (v: string) => void
  dark: boolean; setDark: (v: boolean) => void
}) {
  const [logoOpen, setLogoOpen] = useState(true)
  const [btnOpen, setBtnOpen]   = useState(true)
  const [showBtnDropdown, setShowBtnDropdown] = useState(false)
  const [btnSearch, setBtnSearch] = useState("")
  const nextId = useMemo(() => Math.max(0, ...blocks.map((b) => b.id)) + 1, [blocks])

  function addBlock(type: BlockType) {
    if (type === "text") setBlocks([...blocks, { type: "text", id: nextId, value: "" }])
    else setBlocks([...blocks, { type: "table", id: nextId, rows: [{ label: "", value: "" }] }])
  }

  function updateTextBlock(id: number, value: string) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "text" ? { ...b, value } : b))
  }

  function updateTableRow(id: number, ri: number, field: "label" | "value", val: string) {
    setBlocks(blocks.map((b) => {
      if (b.id !== id || b.type !== "table") return b
      const rows = b.rows.map((r, i) => i === ri ? { ...r, [field]: val } : r)
      return { ...b, rows }
    }))
  }

  function addTableRow(id: number) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "table" ? { ...b, rows: [...b.rows, { label: "", value: "" }] } : b))
  }

  function removeTableRow(id: number, ri: number) {
    setBlocks(blocks.map((b) => b.id === id && b.type === "table" ? { ...b, rows: b.rows.filter((_, i) => i !== ri) } : b))
  }

  const activeBtn = BUTTON_OPTIONS.flatMap((g) => g.options).find((o) => o.id === actionButtonId)
  const filteredBtnOptions = BUTTON_OPTIONS.map((g) => ({
    ...g,
    options: g.options.filter((o) => !btnSearch || o.label.toLowerCase().includes(btnSearch.toLowerCase())),
  })).filter((g) => g.options.length > 0)

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold mb-1">Khai báo nội dung</h1>
            <p className="text-sm text-muted-foreground mb-6">Chọn loại Template, mục đích và các thành phần cần thiết trong nội dung tin ZBS</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0 mt-1">
            <span className="text-xs">📋</span> Chọn từ thư viện Template
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

        {/* Logo */}
        <section className="mb-4 rounded-lg border border-border bg-white overflow-hidden">
          <button onClick={() => setLogoOpen(!logoOpen)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold">
            <span>Logo, hình ảnh <span className="text-red-500">*</span></span>
            {logoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {logoOpen && (
            <div className="px-4 pb-4 border-t border-border">
              <p className="text-xs text-muted-foreground mt-3 mb-4">Chỉ được thêm tối đa 1 logo hoặc tối đa 3 hình ảnh</p>
              <div className="rounded border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Logo</span>
                  <button className="text-red-400 hover:text-red-600"><X className="h-4 w-4" /></button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Logo sau khi được duyệt sẽ được tự động cập nhật cho các mẫu ZBS của OA, xem gợi ý thiết kế logo <span className="text-blue-600 cursor-pointer hover:underline">tại đây</span></p>
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
            {/* Title */}
            <div className="rounded border border-border p-3">
              <div className="text-xs font-semibold mb-1 flex items-center justify-between">
                <span>Tiêu đề <span className="text-red-500">*</span></span>
                <span className="text-muted-foreground font-normal">Mỗi tin chỉ chứa 1 tiêu đề</span>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 65))}
                className="text-sm border-0 px-0 focus-visible:ring-0 h-8"
                placeholder="Nhập tiêu đề..."
              />
              <div className="text-right text-[10px] text-muted-foreground mt-1">{title.length}/65</div>
            </div>

            {/* Blocks */}
            {blocks.map((b) => {
              if (b.type === "text") return (
                <div key={b.id} className="rounded border border-border p-3">
                  <div className="text-xs font-semibold mb-1">Văn bản <span className="text-red-500">*</span></div>
                  <textarea
                    value={b.value}
                    onChange={(e) => updateTextBlock(b.id, e.target.value.slice(0, 400))}
                    rows={3}
                    className="w-full text-sm border-0 resize-none focus:outline-none"
                    placeholder="Nhập nội dung văn bản..."
                  />
                  <div className="text-right text-[10px] text-muted-foreground">{b.value.length}/400</div>
                </div>
              )
              return (
                <div key={b.id} className="rounded border border-border p-3">
                  <div className="text-xs font-semibold mb-3">Bảng</div>
                  <p className="text-xs text-muted-foreground mb-3">Vui lòng thêm tiêu đề và nội dung từng hàng của bảng, nhấn nút "Thêm hàng" để thêm hàng mới.</p>
                  <div className="grid grid-cols-[1fr_1fr_24px] gap-2 text-xs font-semibold text-muted-foreground mb-2">
                    <span>Tiêu đề</span><span>Nội dung</span><span />
                  </div>
                  {b.rows.map((r, ri) => (
                    <div key={ri} className="grid grid-cols-[1fr_1fr_24px] gap-2 mb-2">
                      <Input value={r.label} onChange={(e) => updateTableRow(b.id, ri, "label", e.target.value)} className="h-8 text-sm" placeholder="Tiêu đề hàng" />
                      <Input value={r.value} onChange={(e) => updateTableRow(b.id, ri, "value", e.target.value)} className="h-8 text-sm" placeholder="<tham_so>" />
                      <button onClick={() => removeTableRow(b.id, ri)} className="flex items-center justify-center text-red-400 hover:text-red-600">
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addTableRow(b.id)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                    <Plus className="h-3 w-3" /> Thêm hàng
                  </button>
                </div>
              )
            })}

            {/* Add block */}
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <button onClick={() => addBlock("text")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50">
                <span>☰</span> Văn bản
              </button>
              <button onClick={() => addBlock("table")} className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:bg-gray-50">
                <span>⊞</span> Bảng
              </button>
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
              <div className="mt-3 rounded border border-border p-3 relative">
                <div className="text-xs font-semibold mb-2">Nút thao tác 1</div>
                <div className="text-xs text-muted-foreground mb-2">Loại nút</div>
                <div className="relative">
                  <div
                    className={cn("flex items-center border border-border rounded px-3 h-9 text-sm cursor-pointer", showBtnDropdown && "border-blue-500 ring-1 ring-blue-500")}
                    onClick={() => setShowBtnDropdown(!showBtnDropdown)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    <input
                      value={btnSearch}
                      onChange={(e) => { setBtnSearch(e.target.value); setShowBtnDropdown(true) }}
                      placeholder={activeBtn ? activeBtn.label.split(" (+")[0] : "Đến trang thông tin OA (+0đ)"}
                      className="flex-1 text-sm focus:outline-none bg-transparent"
                    />
                  </div>
                  {showBtnDropdown && (
                    <div className="absolute top-full left-0 right-0 z-20 border border-border bg-white rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
                      {filteredBtnOptions.map((g) => (
                        <div key={g.group}>
                          <div className="px-3 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-gray-50">{g.group}</div>
                          {g.options.map((o) => (
                            <button key={o.id} onClick={() => { setActionButtonId(o.id); setShowBtnDropdown(false); setBtnSearch("") }}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors">
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

      <PreviewPanel dark={dark} setDark={setDark} title={title} blocks={blocks} actionButtonId={actionButtonId} templateType={templateType} />
    </div>
  )
}

// ── Step 3 ────────────────────────────────────────────────────────────────────

function Step3({
  title, blocks, note, setNote, agreed, setAgreed, dark, setDark, templateType, actionButtonId,
}: {
  title: string; blocks: Block[]; note: string; setNote: (v: string) => void
  agreed: boolean; setAgreed: (v: boolean) => void
  dark: boolean; setDark: (v: boolean) => void
  templateType: string; actionButtonId: string
}) {
  const params = extractParams(title, blocks)
  const [techSettings, setTechSettings] = useState<Record<string, string>>({})
  const [sampleValues, setSampleValues] = useState<Record<string, string>>({})

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <h1 className="text-2xl font-bold mb-1">Gửi duyệt</h1>
        <p className="text-sm text-muted-foreground mb-8">Chọn cài đặt tham số tương ứng và điền ghi chú nhằm hỗ trợ kiểm duyệt chính xác</p>

        {/* Params */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-1.5">
            Tham số <Info className="h-4 w-4 text-muted-foreground" />
          </h2>
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[200px_1fr_1fr_32px] gap-0 bg-gray-50 border-b border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              <span>Tên tham số</span>
              <span className="flex items-center gap-1">Cài đặt kỹ thuật <Info className="h-3 w-3" /></span>
              <span className="flex items-center gap-1">Nội dung tham số <span className="text-red-500">*</span> <Info className="h-3 w-3" /></span>
              <span />
            </div>
            {params.length === 0 && (
              <div className="px-4 py-6 text-sm text-muted-foreground text-center">Chưa có tham số nào trong nội dung</div>
            )}
            {params.map((p, i) => (
              <div key={p} className={cn("grid grid-cols-[200px_1fr_1fr_32px] gap-3 px-4 py-3 items-center", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                <div className="text-sm text-muted-foreground font-mono">{p}</div>
                <div className="relative">
                  <select
                    value={techSettings[p] ?? ""}
                    onChange={(e) => setTechSettings({ ...techSettings, [p]: e.target.value })}
                    className="w-full appearance-none border border-border rounded px-2.5 py-1.5 text-xs pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn --</option>
                    {TECH_SETTINGS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
                <Input
                  value={sampleValues[p] ?? ""}
                  onChange={(e) => setSampleValues({ ...sampleValues, [p]: e.target.value })}
                  placeholder={`VD: Nguyễn Lê Minh Khoa`}
                  className="h-8 text-xs"
                />
                <button className="text-muted-foreground hover:text-foreground flex items-center justify-center">
                  <span className="text-base">🏷️</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-3">Ghi chú cho kiểm duyệt</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Thêm ghi chú để hỗ trợ kiểm duyệt..."
          />
        </section>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-blue-600"
          />
          <span className="text-sm text-muted-foreground">
            Tôi đã đọc và đồng ý với{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản và Chính sách sử dụng</span>{" "}
            của Zalo Business Solutions.
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
  const basePath = `/${pathname.split("/")[1]}`

  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  // Step 1
  const [templateName, setTemplateName] = useState("")
  const [selectedApp, setSelectedApp]   = useState("")
  const [selectedOA, setSelectedOA]     = useState("")

  // Step 2
  const [templateType, setTemplateType]       = useState("tuy-chinh")
  const [purpose, setPurpose]                 = useState("cap-do-1")
  const [title, setTitle]                     = useState("Xin chào <customer_name>,")
  const [blocks, setBlocks]                   = useState<Block[]>([
    { type: "text",  id: 1, value: "Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi." },
    { type: "text",  id: 2, value: "Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng các sản phẩm của <company_name>." },
    { type: "table", id: 3, rows: [{ label: "Mã đơn hàng", value: "<order_code>" }, { label: "Trạng thái", value: "<payment_status>" }] },
  ])
  const [actionButtonId, setActionButtonId]   = useState("oa-profile")
  const [dark, setDark]                       = useState(false)

  // Step 3
  const [note, setNote]     = useState("")
  const [agreed, setAgreed] = useState(false)

  function exit() { router.push(`${basePath}/cong-cu/gui-tin/quan-ly-template`) }

  const canNext1 = templateName.trim() && selectedApp && selectedOA
  const canNext2 = true
  const canDone  = agreed

  if (done) return (
    <div className="fixed top-8 inset-x-0 bottom-0 z-[90] bg-white flex flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold">Gửi duyệt thành công!</h2>
      <p className="text-sm text-muted-foreground max-w-sm text-center">Template đã được gửi đến Zalo để xét duyệt. Thời gian duyệt thường từ 1–3 ngày làm việc.</p>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" onClick={() => { setStep(0); setDone(false); setTemplateName(""); setSelectedApp(""); setSelectedOA(""); setNote(""); setAgreed(false) }}>Tạo template khác</Button>
        <Button onClick={exit} className="bg-blue-600 hover:bg-blue-700 text-white">Xem Quản lý Template</Button>
      </div>
    </div>
  )

  return (
    <div className="fixed top-8 inset-x-0 bottom-0 z-[90] bg-white flex flex-col">
      <StepHeader step={step} onExit={exit} saved={step > 0} />

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
        />
      )}
      {step === 2 && (
        <Step3
          title={title} blocks={blocks}
          note={note} setNote={setNote}
          agreed={agreed} setAgreed={setAgreed}
          dark={dark} setDark={setDark}
          templateType={templateType} actionButtonId={actionButtonId}
        />
      )}

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-border bg-white shrink-0">
        {step === 0
          ? <Button variant="outline" onClick={exit}>Hủy</Button>
          : <Button variant="outline" onClick={() => setStep(step - 1)}>Quay lại</Button>
        }
        {step < 2
          ? <Button onClick={() => setStep(step + 1)} disabled={step === 0 && !canNext1} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Tiếp tục</Button>
          : <Button onClick={() => setDone(true)} disabled={!canDone} className="bg-blue-600 hover:bg-blue-700 text-white px-8">Hoàn thành</Button>
        }
      </div>
    </div>
  )
}
