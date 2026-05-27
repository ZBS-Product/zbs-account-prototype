"use client"

import { useState, useRef, useEffect } from "react"
import ZbsHeader from "@/components/zbs-header"
import { cn } from "@/lib/utils"
import { Plus, X, ChevronUp, ChevronDown, Trash2 } from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type TemplateType = "tuy-chinh" | "xac-thuc" | "danh-gia" | "thanh-toan" | "voucher"

type SelectedEl =
  | { type: "none" }
  | { type: "logo" }
  | { type: "title" }
  | { type: "block"; id: number }
  | { type: "button"; id: number }

interface TextBlock  { kind: "text";  id: number; value: string }
interface TableBlock { kind: "table"; id: number; rows: { label: string; value: string }[] }
type Block = TextBlock | TableBlock

interface ActionButton { id: number; label: string; btnType: string }

// ── Constants ─────────────────────────────────────────────────────────────────

const TEMPLATE_TYPES = [
  { id: "tuy-chinh",   icon: "✏️", label: "Tuỳ chỉnh",   price: "Từ 210đ" },
  { id: "xac-thuc",   icon: "🔐", label: "Xác thực",     price: "Từ 280đ" },
  { id: "danh-gia",   icon: "⭐", label: "Đánh giá",     price: "Từ 210đ" },
  { id: "thanh-toan", icon: "💳", label: "Thanh toán",   price: "Từ 210đ" },
  { id: "voucher",    icon: "🎟️", label: "Voucher",       price: "Từ 280đ" },
]

const BUTTON_TYPES = [
  { id: "custom-url",  label: "Đến URL tuỳ chỉnh" },
  { id: "oa-profile",  label: "Đến trang OA" },
  { id: "mini-app",    label: "Đến Mini App" },
  { id: "sao-chep",    label: "Sao chép" },
  { id: "thanh-toan",  label: "Thanh toán" },
]

const MOCK_LOGOS = [
  { id: "sv",  initials: "SV", bg: "oklch(0.78 0.13 50)",  name: "ShopViet" },
  { id: "mc",  initials: "MC", bg: "oklch(0.78 0.10 165)", name: "MedCare" },
  { id: "fb",  initials: "FB", bg: "oklch(0.78 0.14 25)",  name: "FoodBee" },
  { id: "zbs", initials: "ZB", bg: "oklch(0.55 0.22 265)", name: "ZBS" },
]

const BLUE = "oklch(0.488 0.243 264.376)"

function extractParams(text: string): string[] {
  const re = /<([^>]+)>/g
  const set = new Set<string>()
  let m
  while ((m = re.exec(text)) !== null) set.add(m[1])
  return [...set]
}

// ── Auto-resize textarea hook ─────────────────────────────────────────────────

function useAutoResize(ref: React.RefObject<HTMLTextAreaElement | null>, value: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }, [value, ref])
}

// ── Inspector Panel ───────────────────────────────────────────────────────────

function Inspector({
  selected, templateType, setTemplateType,
  logo, setLogo,
  title, setTitle,
  blocks, setBlocks,
  buttons, setButtons,
  onDeselect,
}: {
  selected: SelectedEl
  templateType: TemplateType; setTemplateType: (t: TemplateType) => void
  logo: string; setLogo: (id: string) => void
  title: string; setTitle: (v: string) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  buttons: ActionButton[]; setButtons: (b: ActionButton[]) => void
  onDeselect: () => void
}) {
  const block = selected.type === "block" ? blocks.find(b => b.id === selected.id) : null
  const button = selected.type === "button" ? buttons.find(b => b.id === selected.id) : null

  function updateBlock(id: number, updater: (b: Block) => Block) {
    setBlocks(blocks.map(b => b.id === id ? updater(b) : b))
  }
  function removeBlock(id: number) {
    setBlocks(blocks.filter(b => b.id !== id))
    onDeselect()
  }
  function removeButton(id: number) {
    setButtons(buttons.filter(b => b.id !== id))
    onDeselect()
  }
  function updateButton(id: number, patch: Partial<ActionButton>) {
    setButtons(buttons.map(b => b.id === id ? { ...b, ...patch } : b))
  }

  // ── None selected: template settings ──
  if (selected.type === "none") {
    return (
      <div className="space-y-6 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Cài đặt template</p>
          <div className="space-y-1.5">
            {TEMPLATE_TYPES.map(t => (
              <button key={t.id} onClick={() => setTemplateType(t.id as TemplateType)}
                className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-all",
                  templateType === t.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-border bg-white hover:border-blue-300")}>
                <span className="text-base">{t.icon}</span>
                <span className="flex-1 text-sm font-medium">{t.label}</span>
                <span className="text-[11px] text-muted-foreground">{t.price}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Mục đích</p>
          <div className="space-y-1">
            {[["cap-1","Cấp độ 1","Giao dịch"],["cap-2","Cấp độ 2","Chăm sóc KH"],["cap-3","Cấp độ 3","Hậu mãi"]].map(([id, label, sub]) => (
              <label key={id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border hover:border-blue-300 cursor-pointer">
                <input type="radio" name="purpose" defaultChecked={id === "cap-1"} className="accent-blue-600" />
                <span className="text-sm flex-1">{label}</span>
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Ước tính giá</p>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 text-sm">
            <span className="font-bold" style={{ color: BLUE }}>
              {TEMPLATE_TYPES.find(t => t.id === templateType)?.price}
            </span>
            <span className="text-muted-foreground text-xs"> / tin</span>
          </div>
        </div>
      </div>
    )
  }

  // ── Logo selected ──
  if (selected.type === "logo") {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Logo</p>
          <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <p className="text-xs text-muted-foreground">Chọn logo thương hiệu hiển thị trên tin nhắn</p>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_LOGOS.map(l => (
            <button key={l.id} onClick={() => setLogo(l.id)}
              className={cn("flex items-center gap-2.5 p-2.5 rounded-lg border transition-all text-left",
                logo === l.id ? "border-blue-500 bg-blue-50" : "border-border hover:border-blue-300")}>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: l.bg }}>{l.initials}</div>
              <span className="text-xs font-medium">{l.name}</span>
            </button>
          ))}
        </div>
        <button className="w-full py-2 text-xs border border-dashed border-border rounded-lg text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors">
          + Upload logo mới
        </button>
      </div>
    )
  }

  // ── Title selected ──
  if (selected.type === "title") {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Tiêu đề</p>
          <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <textarea value={title} onChange={e => setTitle(e.target.value)} rows={3}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Nhập tiêu đề..." />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">{title.length}/100 ký tự</p>
        </div>
        {extractParams(title).length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Tham số phát hiện:</p>
            <div className="flex flex-wrap gap-1">
              {extractParams(title).map(p => (
                <span key={p} className="px-2 py-0.5 rounded-full text-[11px] font-mono" style={{ background: "oklch(0.93 0.08 265)", color: BLUE }}>&lt;{p}&gt;</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Text block selected ──
  if (selected.type === "block" && block?.kind === "text") {
    const params = extractParams(block.value)
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Văn bản</p>
          <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <textarea value={block.value}
          onChange={e => updateBlock(block.id, b => ({ ...b, value: e.target.value } as TextBlock))}
          rows={6}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Nhập nội dung văn bản..." />
        <p className="text-[11px] text-muted-foreground">{block.value.length}/300 ký tự · Dùng &lt;tên_param&gt; cho biến động</p>
        {params.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Tham số phát hiện:</p>
            <div className="flex flex-wrap gap-1">
              {params.map(p => (
                <span key={p} className="px-2 py-0.5 rounded-full text-[11px] font-mono" style={{ background: "oklch(0.93 0.08 265)", color: BLUE }}>&lt;{p}&gt;</span>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => removeBlock(block.id)}
          className="w-full py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" /> Xóa block này
        </button>
      </div>
    )
  }

  // ── Table block selected ──
  if (selected.type === "block" && block?.kind === "table") {
    const tblock = block as TableBlock
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Bảng dữ liệu</p>
          <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-2">
          {tblock.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={row.label}
                onChange={e => updateBlock(tblock.id, b => {
                  const rows = [...(b as TableBlock).rows]
                  rows[i] = { ...rows[i], label: e.target.value }
                  return { ...b, rows } as TableBlock
                })}
                className="flex-1 px-2 py-1.5 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Nhãn" />
              <input value={row.value}
                onChange={e => updateBlock(tblock.id, b => {
                  const rows = [...(b as TableBlock).rows]
                  rows[i] = { ...rows[i], value: e.target.value }
                  return { ...b, rows } as TableBlock
                })}
                className="flex-1 px-2 py-1.5 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="Giá trị" />
              <button onClick={() => updateBlock(tblock.id, b => {
                const rows = (b as TableBlock).rows.filter((_, j) => j !== i)
                return { ...b, rows } as TableBlock
              })} className="p-1 text-gray-400 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => updateBlock(tblock.id, b => {
          const rows = [...(b as TableBlock).rows, { label: "", value: "" }]
          return { ...b, rows } as TableBlock
        })}
          className="w-full py-1.5 text-xs border border-dashed border-border rounded-lg text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors">
          + Thêm dòng
        </button>
        <button onClick={() => removeBlock(tblock.id)}
          className="w-full py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" /> Xóa bảng này
        </button>
      </div>
    )
  }

  // ── Button selected ──
  if (selected.type === "button" && button) {
    return (
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Nút hành động</p>
          <button onClick={onDeselect} className="p-1 rounded hover:bg-gray-100"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1.5">Loại nút</label>
            <select value={button.btnType} onChange={e => updateButton(button.id, { btnType: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              {BUTTON_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5">Nhãn nút</label>
            <input value={button.label} onChange={e => updateButton(button.id, { label: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Tên hiển thị..." />
          </div>
          {button.btnType === "custom-url" && (
            <div>
              <label className="text-xs font-medium block mb-1.5">URL đích</label>
              <input placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          )}
        </div>
        <button onClick={() => removeButton(button.id)}
          className="w-full py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" /> Xóa nút này
        </button>
      </div>
    )
  }

  return null
}

// ── Canvas Card ───────────────────────────────────────────────────────────────

function CanvasCard({
  selected, setSelected,
  logo, title, setTitle,
  blocks, setBlocks,
  buttons,
  templateType,
}: {
  selected: SelectedEl; setSelected: (s: SelectedEl) => void
  logo: string; title: string; setTitle: (v: string) => void
  blocks: Block[]; setBlocks: (b: Block[]) => void
  buttons: ActionButton[]; templateType: TemplateType
}) {
  const logoData = MOCK_LOGOS.find(l => l.id === logo) ?? MOCK_LOGOS[0]
  const titleRef = useRef<HTMLTextAreaElement>(null)
  useAutoResize(titleRef, title)

  const isSelected = (el: SelectedEl) => {
    if (el.type !== selected.type) return false
    if (el.type === "block" && selected.type === "block") return el.id === selected.id
    if (el.type === "button" && selected.type === "button") return el.id === selected.id
    return true
  }

  const ringCls = "ring-2 ring-blue-500 ring-offset-1 rounded-lg"
  const hoverCls = "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 rounded-lg cursor-pointer"

  function addBlock(kind: "text" | "table") {
    const id = Date.now()
    const newBlock: Block = kind === "text"
      ? { kind: "text", id, value: "" }
      : { kind: "table", id, rows: [{ label: "", value: "" }, { label: "", value: "" }] }
    setBlocks([...blocks, newBlock])
    setSelected({ type: "block", id })
  }

  function moveBlock(id: number, dir: -1 | 1) {
    const idx = blocks.findIndex(b => b.id === id)
    if (idx < 0) return
    const next = idx + dir
    if (next < 0 || next >= blocks.length) return
    const arr = [...blocks]
    ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
    setBlocks(arr)
  }

  return (
    <div className="w-[360px] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden select-none">
      {/* Logo header */}
      <div
        onClick={e => { e.stopPropagation(); setSelected({ type: "logo" }) }}
        className={cn("px-4 py-3 bg-orange-50 border-b border-orange-100 transition-all",
          isSelected({ type: "logo" }) ? ringCls : hoverCls)}>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ background: logoData.bg }}>{logoData.initials}</div>
          <span className="text-sm font-semibold text-gray-800">{logoData.name}</span>
          {isSelected({ type: "logo" }) && (
            <span className="ml-auto text-[10px] text-blue-600 font-medium">Đang chỉnh sửa</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Title */}
        <div onClick={e => { e.stopPropagation(); setSelected({ type: "title" }) }}
          className={cn("transition-all p-1 -mx-1", isSelected({ type: "title" }) ? ringCls : hoverCls)}>
          {isSelected({ type: "title" }) ? (
            <textarea ref={titleRef} value={title} onChange={e => setTitle(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-full text-sm font-bold leading-snug resize-none focus:outline-none bg-transparent"
              placeholder="Nhập tiêu đề..." rows={1} />
          ) : (
            <p className="text-sm font-bold leading-snug text-gray-900 min-h-[20px]">
              {title || <span className="text-gray-300 font-normal">Tiêu đề tin nhắn...</span>}
            </p>
          )}
        </div>

        {/* Blocks */}
        {blocks.map((block, idx) => (
          <div key={block.id} className="group relative">
            {/* Move controls */}
            <div className="absolute -left-7 top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col gap-0.5">
              <button onClick={e => { e.stopPropagation(); moveBlock(block.id, -1) }} disabled={idx === 0}
                className="p-0.5 rounded bg-white border border-border shadow-sm disabled:opacity-30 hover:border-blue-400">
                <ChevronUp className="h-2.5 w-2.5" />
              </button>
              <button onClick={e => { e.stopPropagation(); moveBlock(block.id, 1) }} disabled={idx === blocks.length - 1}
                className="p-0.5 rounded bg-white border border-border shadow-sm disabled:opacity-30 hover:border-blue-400">
                <ChevronDown className="h-2.5 w-2.5" />
              </button>
            </div>

            <div onClick={e => { e.stopPropagation(); setSelected({ type: "block", id: block.id }) }}
              className={cn("transition-all p-1.5 -mx-1.5", isSelected({ type: "block", id: block.id }) ? ringCls : hoverCls)}>
              {isSelected({ type: "block", id: block.id }) && (
                <p className="text-[10px] text-blue-600 font-medium mb-1">
                  {block.kind === "text" ? "Văn bản" : "Bảng"} · Đang chỉnh sửa
                </p>
              )}

              {block.kind === "text" ? (
                <p className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap min-h-[16px]">
                  {block.value
                    ? block.value.split(/(<[^>]+>)/).map((part, i) =>
                        /^<[^>]+>$/.test(part)
                          ? <span key={i} className="font-mono rounded px-0.5" style={{ background: "oklch(0.93 0.08 265)", color: BLUE }}>{part}</span>
                          : part
                      )
                    : <span className="text-gray-300">Nội dung văn bản...</span>
                  }
                </p>
              ) : (
                <table className="w-full text-[11px]">
                  <tbody>
                    {(block as TableBlock).rows.map((row, i) => (
                      <tr key={i} className="border-t border-gray-100 first:border-0">
                        <td className="py-1 pr-2 text-gray-500">{row.label || "Nhãn"}</td>
                        <td className="py-1 font-medium text-gray-800">{row.value || "Giá trị"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}

        {/* Add block zone */}
        <div className="flex gap-2">
          <button onClick={e => { e.stopPropagation(); addBlock("text") }}
            className="flex-1 py-1.5 text-[11px] text-muted-foreground border border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
            <Plus className="h-3 w-3" /> Văn bản
          </button>
          <button onClick={e => { e.stopPropagation(); addBlock("table") }}
            className="flex-1 py-1.5 text-[11px] text-muted-foreground border border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
            <Plus className="h-3 w-3" /> Bảng
          </button>
        </div>

        {/* Buttons */}
        <div className="pt-1 space-y-1.5">
          {buttons.map(btn => (
            <div key={btn.id}
              onClick={e => { e.stopPropagation(); setSelected({ type: "button", id: btn.id }) }}
              className={cn("py-2 px-3 rounded-lg text-center text-xs font-semibold text-white cursor-pointer transition-all",
                isSelected({ type: "button", id: btn.id }) ? "ring-2 ring-blue-500 ring-offset-1" : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1")}
              style={{ background: BLUE }}>
              {btn.label}
            </div>
          ))}
          {buttons.length < 3 && (
            <button onClick={e => { e.stopPropagation()
              const id = Date.now()
              const newBtn: ActionButton = { id, label: "Nút hành động", btnType: "custom-url" }
              ;(window as any).__setButtons?.([...buttons, newBtn])
              setSelected({ type: "button", id })
            }}
              className="w-full py-1.5 text-[11px] text-muted-foreground border border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
              <Plus className="h-3 w-3" /> Thêm nút
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TaoTemplateDPage() {
  const [templateType, setTemplateType] = useState<TemplateType>("tuy-chinh")
  const [templateName, setTemplateName] = useState("Xác nhận đơn hàng")
  const [logo, setLogo] = useState("sv")
  const [title, setTitle] = useState("Đơn hàng #DH20240531 đã được xác nhận")
  const [blocks, setBlocks] = useState<Block[]>([
    { kind: "text", id: 1, value: "Xin chào <customer_name>, cảm ơn bạn đã đặt hàng tại ShopViet!" },
    { kind: "table", id: 2, rows: [
      { label: "Mã đơn", value: "<order_id>" },
      { label: "Tổng tiền", value: "<total>" },
      { label: "Trạng thái", value: "Đã xác nhận" },
    ]},
  ])
  const [buttons, setButtonsState] = useState<ActionButton[]>([
    { id: 10, label: "Xem đơn hàng", btnType: "custom-url" },
    { id: 11, label: "Liên hệ CSKH", btnType: "oa-profile" },
  ])
  const [selected, setSelected] = useState<SelectedEl>({ type: "none" })

  // expose setButtons for canvas add-button hack
  useEffect(() => {
    ;(window as any).__setButtons = setButtonsState
  }, [setButtonsState])

  function setButtons(b: ActionButton[]) {
    setButtonsState(b)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ZbsHeader standalone />

      {/* Toolbar */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-border px-5 py-2.5 flex items-center gap-3">
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Danh sách template</button>
        <div className="h-4 w-px bg-border" />
        <input value={templateName} onChange={e => setTemplateName(e.target.value)}
          className="flex-1 text-sm font-semibold focus:outline-none text-center bg-transparent placeholder:text-muted-foreground"
          placeholder="Tên template..." />
        <div className="h-4 w-px bg-border" />
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: "oklch(0.6 0.18 185)" }}>
          Option D · Canvas
        </span>
        <button className="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-gray-50 transition-colors">Lưu nháp</button>
        <button className="px-3 py-1.5 text-xs rounded-lg text-white font-medium transition-colors" style={{ background: BLUE }}>
          Gửi duyệt
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 68px - 49px)" }}>
        {/* Canvas area */}
        <div
          className="flex-1 overflow-y-auto flex items-start justify-center pt-12 pb-16 px-8"
          style={{ background: "oklch(0.94 0.02 265)" }}
          onClick={() => setSelected({ type: "none" })}>
          <div className="flex flex-col items-center gap-3">
            {/* Label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400 font-medium">Click vào bất kỳ phần nào để chỉnh sửa</span>
            </div>
            <CanvasCard
              selected={selected} setSelected={setSelected}
              logo={logo} title={title} setTitle={setTitle}
              blocks={blocks} setBlocks={setBlocks}
              buttons={buttons} templateType={templateType}
            />
            <p className="text-[11px] text-gray-400 mt-2">
              {TEMPLATE_TYPES.find(t => t.id === templateType)?.icon} {TEMPLATE_TYPES.find(t => t.id === templateType)?.label} · {TEMPLATE_TYPES.find(t => t.id === templateType)?.price}/tin
            </p>
          </div>
        </div>

        {/* Inspector panel */}
        <div className="w-[340px] shrink-0 border-l border-border bg-white overflow-y-auto">
          <div className="px-5 py-3 border-b border-border bg-gray-50 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {selected.type === "none"    && "Cài đặt template"}
              {selected.type === "logo"    && "Logo"}
              {selected.type === "title"   && "Tiêu đề"}
              {selected.type === "block"   && (blocks.find(b => b.id === (selected as any).id)?.kind === "text" ? "Văn bản" : "Bảng")}
              {selected.type === "button"  && "Nút hành động"}
            </span>
          </div>
          <Inspector
            key={selected.type + ((selected as any).id ?? "")}
            selected={selected}
            templateType={templateType} setTemplateType={setTemplateType}
            logo={logo} setLogo={setLogo}
            title={title} setTitle={setTitle}
            blocks={blocks} setBlocks={setBlocks}
            buttons={buttons} setButtons={setButtons}
            onDeselect={() => setSelected({ type: "none" })}
          />
        </div>
      </div>
    </div>
  )
}
