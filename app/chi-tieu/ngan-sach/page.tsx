"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search, Plus, ChevronDown, ChevronUp, X, Check,
  HelpCircle, Trash2, MessageSquarePlus, ChevronLeft, ChevronRight, Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────

type BudgetStatus = "binh-thuong" | "canh-bao" | "vuot-muc" | "da-ket-thuc"

type Budget = {
  id: number
  name: string
  oas: { initials: string; color: string }[]
  fromDate: string
  toDate: string
  limit: number
  spent: number
  status: BudgetStatus
  thresholds: number[]
  history: { time: string; event: string }[]
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const OA_COLORS = [
  "oklch(0.55 0.18 260)", "oklch(0.55 0.18 140)", "oklch(0.55 0.18 30)",
  "oklch(0.55 0.18 200)", "oklch(0.55 0.18 310)", "oklch(0.55 0.15 80)",
]

const mkOas = (list: [string, number][]) => list.map(([i, c]) => ({ initials: i, color: OA_COLORS[c] }))

const MOCK_BUDGETS: Budget[] = [
  { id: 1,  name: "ZNS Q2/2026", oas: mkOas([["TP",0],["KN",1],["MH",2],["VT",3],["BD",4]]), fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent:  67_500_000, status: "binh-thuong", thresholds: [50, 80, 100], history: [{ time: "21/04/2026 18:30", event: "Đạt ngưỡng 50%" }] },
  { id: 2,  name: "ZNS Q2/2026", oas: mkOas([["TP",0],["KN",1]]),                             fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent: 246_000_000, status: "vuot-muc",    thresholds: [80, 100], history: [{ time: "18/04/2026 09:00", event: "Đạt ngưỡng 100%" }, { time: "17/04/2026 14:20", event: "Đạt ngưỡng 80%" }] },
  { id: 3,  name: "ZNS Q2/2026", oas: mkOas([["MH",2],["VT",3],["LG",5]]),                    fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent:  67_500_000, status: "da-ket-thuc", thresholds: [80, 100], history: [] },
  { id: 4,  name: "ZNS Q2/2026", oas: mkOas([["TP",0],["MH",2],["VT",3],["BD",4]]),           fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent: 180_000_000, status: "canh-bao",    thresholds: [80, 100], history: [{ time: "15/04/2026 10:00", event: "Đạt ngưỡng 80%" }] },
  { id: 5,  name: "ZNS Q2/2026", oas: mkOas([["KN",1],["VT",3]]),                             fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent: 170_000_000, status: "canh-bao",    thresholds: [80, 100], history: [{ time: "20/04/2026 16:00", event: "Đạt ngưỡng 80%" }] },
  { id: 6,  name: "ZNS Q2/2026", oas: mkOas([["TP",0],["KN",1],["MH",2],["VT",3]]),           fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent:  67_500_000, status: "binh-thuong", thresholds: [80, 100], history: [] },
  { id: 7,  name: "ZNS Q2/2026", oas: mkOas([["MH",2],["BD",4],["LG",5]]),                    fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent:  67_500_000, status: "binh-thuong", thresholds: [80, 100], history: [] },
  { id: 8,  name: "ZNS Q2/2026", oas: mkOas([["TP",0],["KN",1],["MH",2],["VT",3],["BD",4]]), fromDate: "01/04/2026", toDate: "30/06/2026", limit: 200_000_000, spent:  67_500_000, status: "binh-thuong", thresholds: [80, 100], history: [] },
  { id: 9,  name: "ZNS Q1/2026", oas: mkOas([["VT",3],["BD",4]]),                             fromDate: "01/01/2026", toDate: "31/03/2026", limit: 150_000_000, spent:  60_000_000, status: "da-ket-thuc", thresholds: [80, 100], history: [{ time: "10/02/2026 08:00", event: "Đạt ngưỡng 80%" }] },
  { id: 10, name: "ZNS Q1/2026", oas: mkOas([["TP",0],["KN",1],["MH",2]]),                    fromDate: "01/01/2026", toDate: "31/03/2026", limit: 150_000_000, spent:  55_000_000, status: "binh-thuong", thresholds: [80, 100], history: [] },
]

const statusCfg: Record<BudgetStatus, { label: string; cls: string }> = {
  "binh-thuong": { label: "Bình Thường", cls: "bg-green-100 text-green-700 border border-green-200" },
  "canh-bao":    { label: "Cảnh báo",   cls: "bg-orange-100 text-orange-700 border border-orange-200" },
  "vuot-muc":    { label: "Vượt mức",   cls: "bg-red-100 text-red-700 border border-red-200" },
  "da-ket-thuc": { label: "Đã kết thúc", cls: "bg-gray-100 text-gray-500 border border-gray-200" },
}

const MOCK_APPS = [
  { id: "app1", label: "App DEG", code: "APP5530" },
  { id: "app2", label: "App Got It", code: "APP5530" },
  { id: "app3", label: "APP Got It Zalo CRM", code: "APP5530" },
  { id: "app4", label: "App VPBank App", code: "APP5530" },
  { id: "app5", label: "App Momo", code: "APP5531" },
]

const MOCK_OAS = [
  { id: "oa1", label: "Ngân hàng số Timo",    code: "OA 5530", color: OA_COLORS[0] },
  { id: "oa2", label: "Ngân hàng BIDV",        code: "OA 5530", color: OA_COLORS[1] },
  { id: "oa3", label: "Ngân hàng HSBC",        code: "OA 5530", color: OA_COLORS[2] },
  { id: "oa4", label: "Ngân hàng VietcomBank", code: "OA 5530", color: OA_COLORS[3] },
  { id: "oa5", label: "Ngân hàng Techcombank", code: "OA 5530", color: OA_COLORS[4] },
]

const ROLES = ["Quản trị viên", "Quản trị viên cao cấp", "Tài chính viên", "Nhân viên"]

type Threshold = { id: number; pct: string; system?: boolean }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtVnd(n: number) { return n.toLocaleString("vi-VN") }

function ProgressBar({ limit, spent, status }: { limit: number; spent: number; status: BudgetStatus }) {
  const pct   = Math.min(Math.round((spent / limit) * 100), 150)
  const color = status === "vuot-muc" ? "bg-red-500" : status === "canh-bao" ? "bg-orange-400" : status === "da-ket-thuc" ? "bg-gray-300" : "bg-green-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className={cn("text-xs font-semibold tabular-nums w-10 text-right",
        status === "vuot-muc" ? "text-red-600" : status === "canh-bao" ? "text-orange-600" : "text-gray-600")}>
        {pct}%
      </span>
    </div>
  )
}

function OaAvatarStack({ oas }: { oas: { initials: string; color: string }[] }) {
  const show = oas.slice(0, 4)
  const rest = oas.length - 4
  return (
    <div className="flex items-center mt-1">
      {show.map((oa, i) => (
        <span key={i} className="inline-flex h-5 w-5 rounded-full items-center justify-center text-[8px] font-bold text-white border border-white -ml-1 first:ml-0"
          style={{ background: oa.color }}>{oa.initials.slice(0,1)}</span>
      ))}
      {rest > 0 && (
        <span className="inline-flex h-5 w-5 rounded-full items-center justify-center text-[8px] font-bold bg-gray-200 text-gray-600 border border-white -ml-1">
          +{rest}
        </span>
      )}
    </div>
  )
}

function SectionBox({ num, title, hasHelp, children }: { num: number; title: string; hasHelp?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors" onClick={() => setOpen(v => !v)}>
        <span className="flex h-5 w-5 rounded-full items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "oklch(0.45 0.22 265)" }}>{num}</span>
        <span className="text-xs font-bold tracking-wider text-foreground flex-1 text-left">{title}</span>
        {hasHelp && <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={cn("h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors",
        checked ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white")}>
      {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
    </button>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className={cn("relative h-5 w-9 rounded-full transition-colors shrink-0", on ? "bg-blue-500" : "bg-gray-300")}>
      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
    </button>
  )
}

// ── Create Sheet (right sidebar) ──────────────────────────────────────────────

function CreateSheet({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: (name: string) => void }) {
  const [useApi,     setUseApi]     = useState(true)
  const [useOaMgr,   setUseOaMgr]   = useState(true)
  const [expandApps, setExpandApps] = useState(false)
  const [expandOas,  setExpandOas]  = useState(false)
  const [appSearch,  setAppSearch]  = useState("")
  const [oaSearch,   setOaSearch]   = useState("")
  const [selApps,    setSelApps]    = useState<string[]>(MOCK_APPS.map(a => a.id))
  const [selOas,     setSelOas]     = useState<string[]>(MOCK_OAS.map(o => o.id))
  const [allOas,     setAllOas]     = useState(true)
  const [budgetName, setBudgetName] = useState("")
  const [fromDate,   setFromDate]   = useState("")
  const [toDate,     setToDate]     = useState("")
  const [limit,      setLimit]      = useState("")
  const [thresholds, setThresholds] = useState<Threshold[]>([
    { id: 1, pct: "100", system: true },
    { id: 2, pct: "80" },
  ])
  const nextThId = () => Math.max(...thresholds.map(t => t.id)) + 1
  const [notifOn,  setNotifOn]  = useState(true)
  const [selRoles, setSelRoles] = useState(["Quản trị viên", "Quản trị viên cao cấp", "Tài chính viên"])

  function toggleApp(id: string)  { setSelApps(prev => prev.includes(id)  ? prev.filter(x => x !== id)  : [...prev, id]) }
  function toggleOa(id: string)   { setSelOas(prev  => prev.includes(id)  ? prev.filter(x => x !== id)  : [...prev, id]) }
  function toggleRole(r: string)  { setSelRoles(prev => prev.includes(r)  ? prev.filter(x => x !== r)   : [...prev, r]) }

  const filteredApps = MOCK_APPS.filter(a => a.label.toLowerCase().includes(appSearch.toLowerCase()))
  const filteredOas  = MOCK_OAS.filter(o => o.label.toLowerCase().includes(oaSearch.toLowerCase()))

  function handleSubmit() {
    if (!budgetName.trim()) return
    onSuccess(budgetName.trim())
    // reset
    setBudgetName(""); setFromDate(""); setToDate(""); setLimit("")
    setThresholds([{ id: 1, pct: "100", system: true }, { id: 2, pct: "80" }])
  }

  return (
    <Sheet open={open} onOpenChange={v => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[460px] sm:max-w-[460px] p-0 flex flex-col gap-0 top-[36px] h-[calc(100vh-36px)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-bold">Tạo ngân sách</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Section 1 */}
          <SectionBox num={1} title="PHẠM VI NGÂN SÁCH" hasHelp>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Kênh chi tiêu</p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={useApi} onChange={setUseApi} />
                      <span className="text-sm font-medium">API</span>
                      <span className="text-xs text-muted-foreground">(Tất cả App)</span>
                    </label>
                    <button className="text-xs font-medium" style={{ color: "oklch(0.488 0.243 264.376)" }}
                      onClick={() => setExpandApps(v => !v)}>
                      {expandApps ? "Thu gọn" : "Tùy chỉnh App"}
                    </button>
                  </div>
                  {expandApps && (
                    <div className="border-t border-border px-3 py-2 space-y-1.5">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input value={appSearch} onChange={e => setAppSearch(e.target.value)}
                          placeholder="Tìm kiếm App" className="w-full pl-6 pr-2 py-1 text-xs border border-border rounded outline-none focus:border-blue-400" />
                      </div>
                      {filteredApps.map(app => (
                        <label key={app.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <Checkbox checked={selApps.includes(app.id)} onChange={() => toggleApp(app.id)} />
                          <span className="text-xs flex-1">{app.label}</span>
                          <span className="text-[10px] text-muted-foreground">{app.code}</span>
                        </label>
                      ))}
                      <button className="text-xs font-medium mt-1" style={{ color: "oklch(0.488 0.243 264.376)" }}>Lưu lựa chọn</button>
                    </div>
                  )}
                  <div className="flex items-center px-3 py-2.5 border-t border-border">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <Checkbox checked={useOaMgr} onChange={setUseOaMgr} />
                      <span className="text-sm font-medium">OA Manager</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-foreground mb-2">OA áp dụng</p>
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox checked={allOas} onChange={v => { setAllOas(v); if (!v) setExpandOas(true) }} />
                      <span className="text-sm font-medium">Tất cả OA</span>
                    </label>
                    <button className="text-xs font-medium" style={{ color: "oklch(0.488 0.243 264.376)" }}
                      onClick={() => { setExpandOas(v => !v); setAllOas(false) }}>
                      {expandOas ? "Thu gọn" : "Tùy chỉnh OA"}
                    </button>
                  </div>
                  {expandOas && (
                    <div className="border-t border-border px-3 py-2 space-y-1.5">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input value={oaSearch} onChange={e => setOaSearch(e.target.value)}
                          placeholder="Tìm kiếm OA" className="w-full pl-6 pr-2 py-1 text-xs border border-border rounded outline-none focus:border-blue-400" />
                        {oaSearch && <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setOaSearch("")}><X className="h-3 w-3 text-muted-foreground" /></button>}
                      </div>
                      {filteredOas.map(oa => (
                        <label key={oa.id} className="flex items-center gap-2 cursor-pointer py-0.5">
                          <Checkbox checked={selOas.includes(oa.id)} onChange={() => toggleOa(oa.id)} />
                          <span className="inline-flex h-4 w-4 rounded-full text-[7px] font-bold text-white items-center justify-center" style={{ background: oa.color }}>
                            {oa.label.slice(0,1)}
                          </span>
                          <span className="text-xs flex-1">{oa.label}</span>
                          <span className="text-[10px] text-muted-foreground">{oa.code}</span>
                        </label>
                      ))}
                      <button className="text-xs font-medium mt-1" style={{ color: "oklch(0.488 0.243 264.376)" }}>Lưu lựa chọn</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionBox>

          {/* Section 2 */}
          <SectionBox num={2} title="THÔNG TIN NGÂN SÁCH">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1">Tên ngân sách</label>
                <input value={budgetName} onChange={e => setBudgetName(e.target.value)}
                  placeholder="Nhập tên ngân sách"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-blue-400 placeholder:text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Ngày bắt đầu</label>
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-blue-400 text-muted-foreground" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Ngày kết thúc</label>
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-blue-400 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Hạn mức</label>
                <div className="relative">
                  <input value={limit} onChange={e => setLimit(e.target.value.replace(/\D/g, ""))}
                    placeholder="Nhập hạn mức, tối thiểu 50.000"
                    className="w-full px-3 py-2 pr-7 text-sm border border-border rounded-lg outline-none focus:border-blue-400 placeholder:text-muted-foreground" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">đ</span>
                </div>
              </div>
            </div>
          </SectionBox>

          {/* Section 3 */}
          <SectionBox num={3} title="ĐẶT NGƯỠNG CẢNH BÁO" hasHelp>
            <div className="space-y-2">
              {thresholds.map(th => (
                <div key={th.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs flex-1">
                    {th.system ? "Ngưỡng vượt mức, cảnh báo khi đạt" : "Ngưỡng tùy chỉnh, cảnh báo khi đạt"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      value={th.pct} readOnly={th.system}
                      onChange={e => setThresholds(prev => prev.map(t => t.id === th.id ? { ...t, pct: e.target.value } : t))}
                      className={cn("w-12 text-center border border-border rounded px-1 py-0.5 text-xs outline-none",
                        th.system ? "bg-gray-50 text-muted-foreground" : "focus:border-blue-400")}
                    />
                    <span className="text-xs text-muted-foreground">% hạn mức</span>
                  </div>
                  {th.system
                    ? <span className="text-xs text-muted-foreground w-16 text-right">Hệ thống</span>
                    : <button onClick={() => setThresholds(prev => prev.filter(t => t.id !== th.id))} className="text-red-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  }
                </div>
              ))}
              <button onClick={() => setThresholds(prev => [...prev, { id: nextThId(), pct: "" }])}
                className="text-xs font-medium mt-1" style={{ color: "oklch(0.488 0.243 264.376)" }}>
                + Thêm ngưỡng
              </button>
            </div>
          </SectionBox>

          {/* Section 4 */}
          <SectionBox num={4} title="TÙY CHỈNH NHẬN THÔNG BÁO" hasHelp>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Người nhận thông báo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Có thể điều chỉnh sau tại trang Quản Lý Thông Báo</p>
                </div>
                <Toggle on={notifOn} onChange={setNotifOn} />
              </div>
              {notifOn && (
                <>
                  <div className="flex flex-wrap gap-1.5 p-2 border border-border rounded-lg min-h-[36px]">
                    {selRoles.map(r => (
                      <span key={r} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-0.5 text-xs font-medium">
                        {r}
                        <button onClick={() => toggleRole(r)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLES.filter(r => !selRoles.includes(r)).map(r => (
                      <button key={r} onClick={() => toggleRole(r)}
                        className="text-xs border border-dashed border-border rounded px-2 py-0.5 text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition-colors">
                        + {r}
                      </button>
                    ))}
                  </div>
                  {selRoles.length > 0 && (
                    <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                      <span className="text-amber-500 text-xs mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-700">Lưu ý: Thay đổi cài đặt thông báo sẽ được áp dụng cho tất cả ngân sách khác.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </SectionBox>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <Button variant="outline" onClick={onClose} className="text-sm">Hủy</Button>
          <Button onClick={handleSubmit} disabled={!budgetName.trim()}
            className="text-sm text-white disabled:opacity-40"
            style={{ background: budgetName.trim() ? "oklch(0.45 0.22 265)" : undefined }}>
            Tạo ngân sách
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ── Success Modal ─────────────────────────────────────────────────────────────

function SuccessModal({ name, onViewList, onViewDetail }: { name: string; onViewList: () => void; onViewDetail: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-[400px] px-8 py-8 text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-green-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-lg font-bold text-green-700">Tạo ngân sách thành công</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Đã tạo ngân sách <strong className="text-foreground">{name}</strong> thành công, xem chi tiết ngân sách vừa tạo hoặc xem danh sách tất cả ngân sách.
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 text-sm" onClick={onViewList}>Xem danh sách</Button>
          <Button className="flex-1 text-sm text-white" style={{ background: "oklch(0.45 0.22 265)" }} onClick={onViewDetail}>Xem chi tiết</Button>
        </div>
      </div>
    </div>
  )
}

// ── Detail View ───────────────────────────────────────────────────────────────

function DetailView({ budget, onBack, onEdit }: { budget: Budget; onBack: () => void; onEdit: () => void }) {
  const pct     = Math.round((budget.spent / budget.limit) * 100)
  const remain  = budget.limit - budget.spent
  const barColor = budget.status === "vuot-muc" ? "bg-red-500" : budget.status === "canh-bao" ? "bg-orange-400" : budget.status === "da-ket-thuc" ? "bg-gray-400" : "bg-green-500"
  const pctColor = budget.status === "vuot-muc" ? "text-red-600" : budget.status === "canh-bao" ? "text-orange-600" : "text-green-600"

  return (
    <div className="space-y-5">
      {/* Back + title */}
      <div className="flex items-start gap-3">
        <button onClick={onBack} className="mt-0.5 h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{budget.name}</h1>
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusCfg[budget.status].cls)}>
              {statusCfg[budget.status].label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground flex-wrap">
            <span>{budget.fromDate}–{budget.toDate}</span>
            <span>·</span>
            <span>Tất cả App · OA Manager</span>
            <span>·</span>
            <OaAvatarStack oas={budget.oas} />
          </div>
        </div>
        <button onClick={onEdit} className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border text-sm font-medium hover:bg-gray-50 shrink-0 mt-0.5">
          <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Hạn mức",              value: budget.limit,  sub: undefined,        color: "text-foreground" },
          { label: `Đã tiêu: ${pct}%`,     value: budget.spent,  sub: undefined,        color: pctColor },
          { label: `Còn lại: ${Math.max(0, Math.round(remain / budget.limit * 100))}%`, value: Math.max(0, remain), sub: undefined, color: "text-foreground" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">{c.label}</p>
            <p className={cn("text-lg font-bold tabular-nums", c.color)}>{fmtVnd(c.value)} đ</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-border p-5">
        <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-4">TIẾN ĐỘ TỔNG</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden relative">
            <div className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${Math.min(pct, 100)}%` }} />
            {budget.thresholds.map(m => (
              <div key={m} className="absolute top-0 bottom-0 w-px bg-white/80" style={{ left: `${m}%` }} />
            ))}
          </div>
          <span className={cn("text-lg font-bold tabular-nums w-14 text-right", pctColor)}>{pct}%</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
          {budget.thresholds.map(m => {
            const activated = pct >= m
            return (
              <div key={m} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: activated ? "oklch(0.50 0.18 145)" : "oklch(0.75 0 0)" }} />
                <span>{m}% {activated ? "Đã kích hoạt" : "Chưa kích hoạt"}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Warning history */}
      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold mb-4">Lịch sử cảnh báo</h3>
        {budget.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có cảnh báo nào.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left font-medium text-muted-foreground pb-2 pr-12 whitespace-nowrap">Thời gian</th>
                <th className="text-left font-medium text-muted-foreground pb-2">Sự kiện</th>
              </tr>
            </thead>
            <tbody>
              {budget.history.map((h, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 pr-12 text-muted-foreground whitespace-nowrap">{h.time}</td>
                  <td className="py-3 font-semibold">{h.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function QuanLyNganSachPage() {
  const [budgets,      setBudgets]      = useState<Budget[]>(MOCK_BUDGETS)
  const [search,       setSearch]       = useState("")
  const [filterStatus, setFilterStatus] = useState("tat-ca")
  const [showCreate,   setShowCreate]   = useState(false)
  const [successName,  setSuccessName]  = useState<string | null>(null)
  const [detailId,     setDetailId]     = useState<number | null>(null)
  const [page,         setPage]         = useState(1)
  const PER_PAGE = 10

  const filtered = budgets.filter(b => {
    if (filterStatus !== "tat-ca" && b.status !== filterStatus) return false
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const detailBudget = budgets.find(b => b.id === detailId)

  function handleSuccess(name: string) {
    setShowCreate(false)
    const newBudget: Budget = {
      id: budgets.length + 1, name,
      oas: [0,1,2].map(i => ({ initials: ["TP","KN","MH"][i], color: OA_COLORS[i] })),
      fromDate: "15/05/2026", toDate: "31/05/2026",
      limit: 120_000_000, spent: 0, status: "binh-thuong",
      thresholds: [80, 100], history: [],
    }
    setBudgets(prev => [newBudget, ...prev])
    setSuccessName(name)
  }

  const isEmpty      = budgets.length === 0
  const isNullSearch = !isEmpty && filtered.length === 0

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">

          {detailId !== null && detailBudget ? (
            <DetailView budget={detailBudget} onBack={() => setDetailId(null)} onEdit={() => setShowCreate(true)} />
          ) : isEmpty ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-4xl">💰</div>
              <h2 className="text-lg font-bold">Tạo ngay ngân sách đầu tiên của bạn</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Thay thế theo dõi thủ công bằng hệ thống Ngân Sách tự động. Thiết lập một lần, yên tâm vận hành.
              </p>
              <Button className="text-white gap-1.5 mt-2" style={{ background: "oklch(0.45 0.22 265)" }} onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Tạo ngân sách
              </Button>
            </div>
          ) : (
            <>
              {/* Page header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">Quản lý ngân sách</h1>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">Beta</Badge>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  Đóng góp ý kiến
                </button>
              </div>

              {/* Search + filter + add */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                    placeholder="Tìm kiếm ngân sách hoặc OA" className="pl-8 h-9 text-sm" />
                </div>
                <div className="relative">
                  <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
                    className="h-9 rounded-lg border border-border bg-white px-3 pr-8 text-sm outline-none appearance-none cursor-pointer">
                    <option value="tat-ca">Tất cả trạng thái</option>
                    <option value="binh-thuong">Bình Thường</option>
                    <option value="canh-bao">Cảnh báo</option>
                    <option value="vuot-muc">Vượt mức</option>
                    <option value="da-ket-thuc">Đã kết thúc</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
                <Button className="text-white gap-1.5 ml-auto" style={{ background: "oklch(0.45 0.22 265)" }} onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4" /> Thêm ngân sách
                </Button>
              </div>

              {isNullSearch ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="font-semibold">Không tìm thấy kết quả</p>
                  <p className="text-sm text-muted-foreground">Hãy thử tìm với điều kiện khác.</p>
                  <Button variant="outline" size="sm" onClick={() => { setSearch(""); setFilterStatus("tat-ca") }}>Xóa bộ lọc</Button>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-white overflow-hidden">
                  <div className="grid text-xs font-semibold text-muted-foreground bg-gray-50 border-b border-border px-4 py-2.5"
                    style={{ gridTemplateColumns: "2fr 1.4fr 1.8fr 1.6fr 1.8fr 1.4fr" }}>
                    <span>Tên ngân sách</span>
                    <span>Thời hạn</span>
                    <span className="flex items-center gap-0.5 cursor-pointer hover:text-foreground">Ngân sách (VNĐ) <ChevronDown className="h-3 w-3" /></span>
                    <span className="flex items-center gap-0.5 cursor-pointer hover:text-foreground">Đã tiêu (VNĐ) <ChevronDown className="h-3 w-3" /></span>
                    <span className="flex items-center gap-0.5 cursor-pointer hover:text-foreground">Tiến độ <ChevronDown className="h-3 w-3" /></span>
                    <span>Trạng thái</span>
                  </div>
                  {paged.map((b, i) => (
                    <div key={b.id}
                      className={cn("grid items-center px-4 py-3 hover:bg-blue-50/40 transition-colors cursor-pointer",
                        i < paged.length - 1 ? "border-b border-border" : "")}
                      style={{ gridTemplateColumns: "2fr 1.4fr 1.8fr 1.6fr 1.8fr 1.4fr" }}
                      onClick={() => setDetailId(b.id)}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "oklch(0.45 0.22 265)" }}>{b.name}</p>
                        <OaAvatarStack oas={b.oas} />
                      </div>
                      <span className="text-xs text-muted-foreground">{b.fromDate}–{b.toDate}</span>
                      <span className="text-xs font-medium tabular-nums">{fmtVnd(b.limit)}</span>
                      <span className="text-xs tabular-nums">{fmtVnd(b.spent)}</span>
                      <ProgressBar limit={b.limit} spent={b.spent} status={b.status} />
                      <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit", statusCfg[b.status].cls)}>
                        {statusCfg[b.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isNullSearch && filtered.length > 0 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>1–{Math.min(PER_PAGE, filtered.length)} trên {filtered.length} mục</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={cn("h-7 w-7 rounded border text-xs flex items-center justify-center",
                          page === p ? "border-blue-500 text-blue-600 font-semibold bg-blue-50" : "border-border hover:bg-gray-50")}>
                        {p}
                      </button>
                    ))}
                    {totalPages > 6 && <span className="px-1">…</span>}
                    {totalPages > 6 && (
                      <button onClick={() => setPage(totalPages)}
                        className={cn("h-7 w-7 rounded border text-xs flex items-center justify-center",
                          page === totalPages ? "border-blue-500 text-blue-600 font-semibold bg-blue-50" : "border-border hover:bg-gray-50")}>
                        {totalPages}
                      </button>
                    )}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="h-7 w-7 rounded border border-border flex items-center justify-center hover:bg-gray-50 disabled:opacity-40">
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <span className="ml-2">10 / trang</span>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </SidebarInset>

      <CreateSheet open={showCreate} onClose={() => setShowCreate(false)} onSuccess={handleSuccess} />

      {successName && (
        <SuccessModal
          name={successName}
          onViewList={() => setSuccessName(null)}
          onViewDetail={() => { setSuccessName(null); setDetailId(budgets.find(b => b.name === successName)?.id ?? null) }}
        />
      )}
    </SidebarProvider>
  )
}
