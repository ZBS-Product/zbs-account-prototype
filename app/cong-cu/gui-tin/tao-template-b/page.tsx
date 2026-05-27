"use client"

import { useState, useEffect, useRef } from "react"
import { GripVertical, Plus, X, ChevronUp, ChevronDown, Library, Info, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import ZbsHeader from "@/components/zbs-header"

// ── Constants ─────────────────────────────────────────────────────────────────

const APPS = ["QC Test ZNS 4", "ZNS Service", "Test ZBS App", "QC Test App New", "Andy Hotel"]
const OAS  = ["QC Test ZNS 4", "Trợ lý tin doanh nghiệp", "ZBS Account", "Zalo Business Solutions", "QC OA 1"]

const TEMPLATE_TYPES = [
  { id: "tuy-chinh",   icon: "✏️", label: "Mẫu tuỳ chỉnh",          price: "Từ 210đ" },
  { id: "xac-thuc",   icon: "🔐", label: "Mẫu xác thực",            price: "Từ 280đ" },
  { id: "danh-gia",   icon: "⭐", label: "Mẫu đánh giá",            price: "Từ 210đ" },
  { id: "thanh-toan", icon: "💳", label: "Mẫu thanh toán",          price: "Từ 210đ" },
  { id: "voucher",    icon: "🎟️", label: "Mẫu Voucher",             price: "Từ 280đ" },
]

const PURPOSES = [
  { id: "cap-do-1", label: "Cấp độ 1", sub: "Giao dịch" },
  { id: "cap-do-2", label: "Cấp độ 2", sub: "Chăm sóc KH" },
  { id: "cap-do-3", label: "Cấp độ 3", sub: "Hậu mãi" },
]

const BUTTON_TYPES = [
  { group: "ĐẾN TÀI SẢN ZALO", items: [
    { id: "oa-profile", label: "Đến trang thông tin OA",  cost: 0,   hasUrl: false, placeholder: "Chọn OA" },
    { id: "mini-app",   label: "Đến Zalo Mini App",       cost: 100, hasUrl: false, placeholder: "Chọn Mini App" },
    { id: "oa-post",    label: "Đến bài viết OA",         cost: 100, hasUrl: false, placeholder: "Chọn bài viết" },
  ]},
  { group: "LIÊN KẾT TÙY CHỈNH", items: [
    { id: "custom-url", label: "Đến URL tùy chỉnh",       cost: 100, hasUrl: true,  placeholder: "https://..." },
  ]},
]
const SPECIAL_BTN_TYPES = [
  { id: "sao-chep",       label: "Sao chép",     cost: 0, hasUrl: false, placeholder: "Sao chép mã" },
  { id: "thanh-toan-btn", label: "Thanh toán",   cost: 0, hasUrl: false, placeholder: "Thanh toán ngay" },
  { id: "xem-chi-tiet",   label: "Xem chi tiết", cost: 0, hasUrl: false, placeholder: "Xem mã ưu đãi" },
]
const ALL_BUTTON_TYPES = [...BUTTON_TYPES.flatMap((g) => g.items), ...SPECIAL_BTN_TYPES]

const MAX_BUTTONS_BY_TYPE: Record<string, number> = {
  "xac-thuc":   3,
  "danh-gia":   2,
  "thanh-toan": 3,
  "voucher":    3,
  "tuy-chinh":  3,
}

const TYPE_PRICES: Record<string, number> = {
  "tuy-chinh":  300,
  "xac-thuc":   400,
  "danh-gia":   300,
  "thanh-toan": 300,
  "voucher":    400,
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActionButton {
  id: number
  type: string
  label: string
  url: string
}

type BlockType = "text" | "table"
interface TextBlock  { type: "text";  id: number; value: string }
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

function getDefaultBlocks(typeId: string): Block[] {
  if (typeId === "thanh-toan") {
    return [
      { type: "text", id: 1, value: "OA name trân trọng thông báo đến Quý khách cước phí như sau:" },
      { type: "table", id: 2, rows: [
        { label: "Quý khách", value: "<customer_name>" },
        { label: "Mã hợp đồng", value: "<contract_number>" },
        { label: "Số tiền", value: "<price>" },
      ]},
    ]
  }
  if (typeId === "voucher") {
    return [
      { type: "text", id: 1, value: "Gửi khách hàng mã thành viên <customer_id>, khi đặt hàng trực tiếp tại shop, giảm trực tiếp lên đến 70.000đ từ nay cho đến hết <expire>." },
    ]
  }
  if (typeId === "danh-gia") {
    return [
      { type: "text", id: 1, value: "Xin chào <customer_name>, đơn hàng <order_id> đã được giao thành công. Bạn có hài lòng về sản phẩm không?" },
    ]
  }
  return [
    { type: "text", id: 1, value: "" },
  ]
}

function getDefaultTitle(typeId: string): string {
  if (typeId === "xac-thuc")   return ""
  if (typeId === "thanh-toan") return "Thông tin thanh toán"
  if (typeId === "danh-gia")   return "Đánh giá sản phẩm"
  if (typeId === "voucher")    return "Mã giảm giá đặc biệt dành cho bạn"
  return "Xác nhận đơn hàng thành công"
}

// ── Preview components ────────────────────────────────────────────────────────

function XacThucPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-400" : "text-gray-500"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">Mã xác minh của bạn là</p>
      <div className={cn("text-center py-3 rounded-lg", dark ? "bg-gray-800" : "bg-blue-50")}>
        <span className="text-xl font-bold tracking-widest" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;otp&gt;</span>
      </div>
      <p className={cn("text-[11px] leading-relaxed", muted)}>
        Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai. Mã có hiệu lực trong 5 phút.
      </p>
      <button className="w-full py-2 rounded text-xs font-semibold text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
        Sao chép mã
      </button>
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
        Bạn có hài lòng không?
      </p>
      <div className="flex justify-center gap-1.5 py-1">
        {[1,2,3,4,5].map((i) => <span key={i} className="text-xl text-yellow-400">☆</span>)}
      </div>
    </div>
  )
}

function ThanhToanPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-400" : "text-gray-500"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">Thông tin thanh toán</p>
      <p className={cn("text-[11px]", muted)}>OA name trân trọng thông báo đến Quý khách cước phí như sau:</p>
      <table className="w-full text-[11px]">
        <tbody>
          {[["Quý khách", "<customer_name>"], ["Mã hợp đồng", "<contract_number>"], ["Số tiền", "<price>"]].map(([k, v], i) => (
            <tr key={i} className={cn("border-t", dark ? "border-gray-700" : "border-gray-100")}>
              <td className={cn("py-1 pr-2 font-medium", muted)}>{k}</td>
              <td className="py-1 font-semibold">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={cn("rounded-lg border p-2.5 text-[11px]", dark ? "bg-gray-800 border-gray-700" : "bg-blue-50 border-blue-100")}>
        <p className={cn("mb-0.5", muted)}>Số tiền thanh toán</p>
        <p className="font-bold text-sm" style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;transfer_amount&gt;đ</p>
        <p className={cn("text-[10px] mt-0.5", muted)}>Tài khoản: 0123456789 - CÔNG TY OA NAME</p>
      </div>
    </div>
  )
}

function VoucherPreview({ dark }: { dark: boolean }) {
  const muted = dark ? "text-gray-300" : "text-gray-700"
  return (
    <div className="space-y-2">
      <p className="text-[13px] font-semibold leading-snug">
        Gửi <span style={{ color: "oklch(0.488 0.243 264.376)" }}>&lt;customer_name&gt;</span> mã giảm giá 70.000đ
      </p>
      <p className={cn("text-[12px] leading-relaxed", muted)}>
        Giảm trực tiếp lên đến 70.000đ từ nay cho đến hết <span className="font-semibold">&lt;expire&gt;</span>.
      </p>
      <div className={cn("rounded-lg border p-2.5 flex items-start gap-2.5", dark ? "bg-gray-800 border-gray-700" : "bg-orange-50 border-orange-200")}>
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

// ── Left Config Sidebar ───────────────────────────────────────────────────────

function LeftConfigSidebar({
  templateType, setTemplateType,
  purpose, setPurpose,
  app, setApp,
  oa, setOa,
  params,
}: {
  templateType: string; setTemplateType: (v: string) => void
  purpose: string; setPurpose: (v: string) => void
  app: string; setApp: (v: string) => void
  oa: string; setOa: (v: string) => void
  params: string[]
}) {
  return (
    <aside className="w-[220px] shrink-0 border-r border-border bg-white overflow-y-auto flex flex-col">
      {/* Section: Loại template */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Loại template</p>
        <div className="flex flex-col gap-1">
          {TEMPLATE_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateType(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all",
                templateType === t.id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-border hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <span className="text-sm shrink-0">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-[11px] font-medium leading-tight truncate", templateType === t.id ? "text-blue-700" : "text-foreground")}>{t.label}</p>
                <p className="text-[10px] text-muted-foreground">{t.price}</p>
              </div>
              {templateType === t.id && (
                <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border mx-3 my-1" />

      {/* Section: Mục đích */}
      <div className="px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mục đích</p>
        <div className="flex flex-col gap-1">
          {PURPOSES.map((p) => (
            <label key={p.id} className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition-all",
              purpose === p.id
                ? "border-blue-500 bg-blue-50"
                : "border-border hover:border-blue-300"
            )}>
              <div className={cn(
                "h-3.5 w-3.5 rounded-full border-2 shrink-0 flex items-center justify-center",
                purpose === p.id ? "border-blue-500" : "border-gray-300"
              )}>
                {purpose === p.id && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
              </div>
              <input type="radio" className="sr-only" checked={purpose === p.id} onChange={() => setPurpose(p.id)} />
              <div>
                <p className="text-[11px] font-medium leading-tight">{p.label}</p>
                <p className="text-[10px] text-muted-foreground">{p.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-border mx-3 my-1" />

      {/* Section: App & OA */}
      <div className="px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">App & OA</p>
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Ứng dụng</label>
            <select
              value={app}
              onChange={(e) => setApp(e.target.value)}
              className="w-full text-[11px] border border-border rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Chọn ứng dụng...</option>
              {APPS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Official Account</label>
            <select
              value={oa}
              onChange={(e) => setOa(e.target.value)}
              className="w-full text-[11px] border border-border rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Chọn OA...</option>
              {OAS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="h-px bg-border mx-3 my-1" />

      {/* Section: Params */}
      <div className="px-3 py-2 pb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Params phát hiện {params.length > 0 && <span className="ml-1 bg-blue-100 text-blue-600 rounded-full px-1.5 py-0.5 text-[9px]">{params.length}</span>}
        </p>
        {params.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic">Nhập tham số dạng &lt;param&gt; trong nội dung</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {params.map((p) => (
              <span key={p} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600 border border-gray-200">
                &lt;{p}&gt;
              </span>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

// ── Center Composer ───────────────────────────────────────────────────────────

let _blockId = 100
function nextBlockId() { return ++_blockId }
let _btnId = 100
function nextBtnId() { return ++_btnId }

function TextBlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  block: TextBlock
  onChange: (value: string) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean; isLast: boolean
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [block.value])

  return (
    <div className="rounded-xl border border-border bg-white p-4 flex gap-3 group">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
        <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors">
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors">
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Văn bản</span>
        </div>
        <textarea
          ref={textareaRef}
          value={block.value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập nội dung... Dùng <tên_tham_số> để chèn biến động"
          rows={2}
          className="w-full text-sm border-0 outline-none resize-none bg-transparent placeholder:text-gray-300 leading-relaxed"
          style={{ minHeight: "48px" }}
        />
        {/* Param chips */}
        {block.value && /<[^>]+>/.test(block.value) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {[...new Set(Array.from(block.value.matchAll(/<([^>]+)>/g), m => m[1]))].map((p) => (
              <span key={p} className="text-[10px] font-mono text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 border border-blue-100">
                &lt;{p}&gt;
              </span>
            ))}
          </div>
        )}
      </div>
      <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function TableBlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: {
  block: TableBlock
  onChange: (rows: { label: string; value: string }[]) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean; isLast: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 flex gap-3 group">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
        <GripVertical className="h-4 w-4 text-gray-300 cursor-grab" />
        <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors">
          <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 transition-colors">
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Bảng thông tin</span>
        </div>
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          <div className="grid grid-cols-2 gap-0 bg-gray-50 px-3 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nhãn</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Giá trị</span>
          </div>
          {block.rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-2 gap-0 group/row relative">
              <input
                value={row.label}
                onChange={(e) => {
                  const next = [...block.rows]
                  next[ri] = { ...next[ri], label: e.target.value }
                  onChange(next)
                }}
                placeholder="Nhãn..."
                className="px-3 py-2 text-sm border-r border-border bg-white focus:outline-none focus:bg-blue-50 text-muted-foreground"
              />
              <div className="flex items-center">
                <input
                  value={row.value}
                  onChange={(e) => {
                    const next = [...block.rows]
                    next[ri] = { ...next[ri], value: e.target.value }
                    onChange(next)
                  }}
                  placeholder="Giá trị hoặc <param>..."
                  className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none focus:bg-blue-50"
                />
                {block.rows.length > 1 && (
                  <button
                    onClick={() => onChange(block.rows.filter((_, i) => i !== ri))}
                    className="p-1.5 mr-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 opacity-0 group-hover/row:opacity-100 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => onChange([...block.rows, { label: "", value: "" }])}
          className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> Thêm dòng
        </button>
      </div>
      <button onClick={onDelete} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

function CenterComposer({
  templateType,
  title, setTitle,
  logo, setLogo,
  blocks, setBlocks,
  actionButtons, setActionButtons,
  onOpenLibrary,
}: {
  templateType: string
  title: string; setTitle: (v: string) => void
  logo: string | null; setLogo: (v: string | null) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  actionButtons: ActionButton[]; setActionButtons: (b: ActionButton[]) => void
  onOpenLibrary: () => void
}) {
  const maxButtons = MAX_BUTTONS_BY_TYPE[templateType] ?? 3
  const showTitle = templateType !== "xac-thuc"

  function addTextBlock() {
    setBlocks([...blocks, { type: "text", id: nextBlockId(), value: "" }])
  }
  function addTableBlock() {
    setBlocks([...blocks, { type: "table", id: nextBlockId(), rows: [{ label: "", value: "" }, { label: "", value: "" }] }])
  }
  function updateBlock(id: number, update: Partial<Block>) {
    setBlocks(blocks.map((b) => b.id === id ? { ...b, ...update } as Block : b))
  }
  function deleteBlock(id: number) {
    setBlocks(blocks.filter((b) => b.id !== id))
  }
  function moveBlock(idx: number, dir: -1 | 1) {
    const next = [...blocks]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setBlocks(next)
  }

  function addButton() {
    if (actionButtons.length >= maxButtons) return
    setActionButtons([...actionButtons, { id: nextBtnId(), type: "custom-url", label: "", url: "" }])
  }
  function updateButton(id: number, update: Partial<ActionButton>) {
    setActionButtons(actionButtons.map((b) => b.id === id ? { ...b, ...update } : b))
  }
  function deleteButton(id: number) {
    setActionButtons(actionButtons.filter((b) => b.id !== id))
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* Composer header */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-border shrink-0">
        <h4 className="text-sm font-semibold text-foreground">Soạn nội dung</h4>
        <button
          onClick={onOpenLibrary}
          data-library-toggle
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg px-3 py-1.5 transition-all"
        >
          <Library className="h-3.5 w-3.5" />
          Thư viện Component
        </button>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {/* Template name */}
        <div className="rounded-xl border border-border bg-white p-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Tên template</label>
          <input
            type="text"
            placeholder="Nhập tên template để dễ quản lý..."
            className="w-full text-sm border-0 outline-none bg-transparent placeholder:text-gray-300"
          />
        </div>

        {/* Logo section */}
        <div className="rounded-xl border border-border bg-white p-4">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Logo</label>
          {logo ? (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 w-fit">
              <span className="text-sm">🖼️</span>
              <span className="text-xs font-medium text-blue-700">{logo}</span>
              <button onClick={() => setLogo(null)} className="p-0.5 rounded hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLogo("Logo ShopViet")}
              className="flex items-center gap-2 w-full rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50 px-4 py-3 text-sm text-muted-foreground hover:text-blue-600 transition-all"
            >
              <Plus className="h-4 w-4" />
              Chọn logo từ thư viện
            </button>
          )}
        </div>

        {/* Title — hidden for xac-thuc */}
        {showTitle && (
          <div className="rounded-xl border border-border bg-white p-4">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tin nhắn..."
              className="w-full text-sm font-semibold border-0 outline-none bg-transparent placeholder:text-gray-300"
            />
          </div>
        )}

        {/* Blocks */}
        {blocks.map((block, idx) =>
          block.type === "text" ? (
            <TextBlockEditor
              key={block.id}
              block={block}
              onChange={(value) => updateBlock(block.id, { value })}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(idx, -1)}
              onMoveDown={() => moveBlock(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === blocks.length - 1}
            />
          ) : (
            <TableBlockEditor
              key={block.id}
              block={block as TableBlock}
              onChange={(rows) => updateBlock(block.id, { rows })}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveBlock(idx, -1)}
              onMoveDown={() => moveBlock(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === blocks.length - 1}
            />
          )
        )}

        {/* Add block buttons */}
        <div className="flex gap-2">
          <button
            onClick={addTextBlock}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-gray-400 rounded-lg px-4 py-2.5 transition-all hover:bg-white"
          >
            <Plus className="h-3.5 w-3.5" /> Thêm văn bản
          </button>
          <button
            onClick={addTableBlock}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-gray-400 rounded-lg px-4 py-2.5 transition-all hover:bg-white"
          >
            <Plus className="h-3.5 w-3.5" /> Thêm bảng
          </button>
        </div>

        {/* Action buttons */}
        <div className="rounded-xl border border-border bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Nút hành động</span>
            <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-gray-100 text-[10px] font-semibold text-muted-foreground">
              {actionButtons.length}
            </span>
            <span className="text-[10px] text-muted-foreground">/ {maxButtons} tối đa</span>
          </div>

          {actionButtons.length === 0 && (
            <p className="text-xs text-muted-foreground italic mb-3">Chưa có nút hành động. Thêm nút để tăng tương tác.</p>
          )}

          <div className="space-y-2 mb-3">
            {actionButtons.map((btn) => {
              const typeInfo = ALL_BUTTON_TYPES.find((t) => t.id === btn.type)
              return (
                <div key={btn.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5 group/btn">
                  <select
                    value={btn.type}
                    onChange={(e) => updateButton(btn.id, { type: e.target.value })}
                    className="text-xs border border-border rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 shrink-0"
                  >
                    {BUTTON_TYPES.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.items.map((item) => (
                          <option key={item.id} value={item.id}>{item.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <input
                    value={btn.label}
                    onChange={(e) => updateButton(btn.id, { label: e.target.value })}
                    placeholder={typeInfo?.placeholder ?? "Nhãn nút..."}
                    className="flex-1 text-xs border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {typeInfo?.hasUrl && (
                    <input
                      value={btn.url}
                      onChange={(e) => updateButton(btn.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 text-xs border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                  <button
                    onClick={() => deleteButton(btn.id)}
                    className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover/btn:opacity-100 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>

          {actionButtons.length < maxButtons && (
            <button
              onClick={addButton}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm nút
            </button>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-border bg-white px-6 py-3 flex items-center justify-between">
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lưu nháp</button>
        <div className="flex gap-2">
          <button className="text-sm font-medium px-5 py-2 rounded-lg border border-border hover:bg-gray-50 transition-colors">
            Xem trước
          </button>
          <button
            className="text-sm font-semibold px-5 py-2 rounded-lg text-white transition-colors"
            style={{ background: "oklch(0.45 0.22 265)" }}
          >
            Gửi duyệt
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Right Preview ─────────────────────────────────────────────────────────────

function RightPreview({
  dark, setDark,
  templateType,
  title,
  blocks,
  actionButtons,
  logo,
}: {
  dark: boolean; setDark: (v: boolean) => void
  templateType: string
  title: string
  blocks: Block[]
  actionButtons: ActionButton[]
  logo: string | null
}) {
  const typeInfo   = TEMPLATE_TYPES.find((t) => t.id === templateType)
  const btnCost    = actionButtons.reduce((sum, b) => sum + (ALL_BUTTON_TYPES.find((t) => t.id === b.type)?.cost ?? 0), 0)
  const basePrice  = TYPE_PRICES[templateType] ?? 300
  const totalPrice = basePrice + btnCost
  const muted      = dark ? "text-gray-400" : "text-gray-500"
  const showTitle  = templateType !== "xac-thuc"

  return (
    <div className="w-[280px] shrink-0 border-l border-border bg-gray-50 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white shrink-0">
        <span className="text-xs font-semibold">Xem trước</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Tối</span>
          <button
            onClick={() => setDark(!dark)}
            className={cn("relative h-4.5 w-8 rounded-full transition-colors", dark ? "bg-blue-600" : "bg-gray-300")}
            style={{ height: "18px", width: "32px" }}
          >
            <span className={cn("absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform", dark ? "translate-x-3.5" : "translate-x-0.5")} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Phone mockup */}
        <div className={cn("rounded-2xl border overflow-hidden shadow-sm text-sm", dark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-border text-gray-900")}>
          {/* Logo / header bar */}
          <div className={cn("px-4 pt-4 pb-2 flex items-center gap-2", dark ? "bg-gray-800" : "bg-orange-50")}>
            {logo ? (
              <p className={cn("text-sm font-extrabold leading-none", dark ? "text-orange-400" : "text-orange-600")}>
                {logo}
              </p>
            ) : (
              <p className="text-sm font-extrabold leading-none">
                <span className={dark ? "text-orange-400" : "text-orange-500"}>ATP </span>
                <span className={dark ? "text-white" : "text-gray-900"}>SOFTWARE</span>
              </p>
            )}
          </div>

          <div className="px-4 py-3 space-y-2">
            {/* Title */}
            {showTitle && (
              <p className="text-[13px] font-semibold leading-snug">
                {title || "Tiêu đề template"}
              </p>
            )}

            {/* Type-specific content */}
            {templateType === "xac-thuc" && <XacThucPreview dark={dark} />}
            {templateType === "danh-gia" && <DanhGiaPreview dark={dark} />}
            {templateType === "thanh-toan" && <ThanhToanPreview dark={dark} />}
            {templateType === "voucher" && <VoucherPreview dark={dark} />}

            {/* Blocks — for tuy-chinh type or as supplement */}
            {templateType === "tuy-chinh" && blocks.map((b) => {
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
                        <td className={cn("py-1 pr-2 font-medium", muted)}>{r.label || "—"}</td>
                        <td className="py-1 font-semibold">{r.value || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            })}

            {/* Action buttons */}
            {actionButtons.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {actionButtons.map((ab, i) => {
                  const typeInfo = ALL_BUTTON_TYPES.find((t) => t.id === ab.type)
                  return (
                    <button key={ab.id}
                      className={cn("w-full py-2 rounded text-xs font-semibold",
                        i === 0 ? "text-white" : dark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-700"
                      )}
                      style={i === 0 ? { background: "oklch(0.488 0.243 264.376)" } : undefined}
                    >
                      {ab.label || typeInfo?.placeholder || `Nút ${i + 1}`}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg border border-border bg-white p-3 space-y-1.5 text-xs">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Ước tính chi phí</p>
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
          <div className="border-t border-border pt-1.5 mt-1 space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center gap-1">Đơn giá dự kiến <Info className="h-3 w-3" /></span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gửi qua SĐT</span>
              <span className="font-semibold">{totalPrice} VNĐ/tin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gửi qua UID</span>
              <span className="font-semibold">{totalPrice - 50} VNĐ/tin</span>
            </div>
          </div>
        </div>

        <button className="w-full text-xs font-medium py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
          Gửi thử mẫu ZBS
        </button>
      </div>
    </div>
  )
}

// ── Simple Library Modal ──────────────────────────────────────────────────────

const MOCK_COMPONENTS = [
  { id: "c1", icon: "📝", name: "Văn bản chào mừng", type: "Văn bản" },
  { id: "c2", icon: "📋", name: "Bảng thông tin đơn", type: "Bảng" },
  { id: "c3", icon: "🔗", name: "Nút xem chi tiết",   type: "Nút" },
  { id: "c4", icon: "🖼️", name: "Banner hình ảnh",    type: "Ảnh" },
  { id: "c5", icon: "⭐", name: "Đánh giá sao",       type: "Widget" },
  { id: "c6", icon: "💳", name: "Bảng thanh toán",    type: "Bảng" },
]

function LibraryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold">Thư viện Component</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-3">
            {MOCK_COMPONENTS.map((c) => (
              <button
                key={c.id}
                onClick={onClose}
                className="flex flex-col items-start gap-2 rounded-xl border-2 border-border hover:border-blue-400 hover:bg-blue-50 p-4 text-left transition-all group"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-xs font-semibold group-hover:text-blue-700 transition-colors">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-3 border-t border-border flex justify-end">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TaoTemplateBPage() {
  const [templateType, setTemplateType] = useState("tuy-chinh")
  const [purpose, setPurpose]           = useState("cap-do-1")
  const [app, setApp]                   = useState("")
  const [oa, setOa]                     = useState("")
  const [dark, setDark]                 = useState(false)
  const [logo, setLogo]                 = useState<string | null>(null)
  const [title, setTitle]               = useState(() => getDefaultTitle("tuy-chinh"))
  const [blocks, setBlocks]             = useState<Block[]>(() => getDefaultBlocks("tuy-chinh"))
  const [actionButtons, setActionButtons] = useState<ActionButton[]>([])
  const [libraryOpen, setLibraryOpen]   = useState(false)

  // Reset blocks/title when template type changes
  useEffect(() => {
    setTitle(getDefaultTitle(templateType))
    setBlocks(getDefaultBlocks(templateType))
    setActionButtons([])
  }, [templateType])

  const params = extractParams(title, blocks)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Standalone header */}
      <ZbsHeader standalone />

      {/* Option B badge + page title */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-border px-6 py-2.5 flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">
          Option B
        </span>
        <span className="text-sm font-semibold text-foreground">Tạo Template ZNS</span>
        <span className="text-xs text-muted-foreground">· Sidebar Config + Full-width Composer</span>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <Check className="h-3 w-3 text-green-500" />
          Prototype — mock data only
        </div>
      </div>

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 68px - 44px)" }}>
        <LeftConfigSidebar
          templateType={templateType}
          setTemplateType={setTemplateType}
          purpose={purpose}
          setPurpose={setPurpose}
          app={app}
          setApp={setApp}
          oa={oa}
          setOa={setOa}
          params={params}
        />

        <CenterComposer
          templateType={templateType}
          title={title}
          setTitle={setTitle}
          logo={logo}
          setLogo={setLogo}
          blocks={blocks}
          setBlocks={setBlocks}
          actionButtons={actionButtons}
          setActionButtons={setActionButtons}
          onOpenLibrary={() => setLibraryOpen(true)}
        />

        <RightPreview
          dark={dark}
          setDark={setDark}
          templateType={templateType}
          title={title}
          blocks={blocks}
          actionButtons={actionButtons}
          logo={logo}
        />
      </div>

      {/* Library modal */}
      <LibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} />
    </div>
  )
}
