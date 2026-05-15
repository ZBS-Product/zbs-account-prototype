"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  ArrowUpDown, ChevronLeft, ChevronDown, ChevronUp,
  Trash2, Check, HelpCircle, Plus, X as XIcon, AlertTriangle, Search,
} from "lucide-react"

/* ─── Types ─────────────────────────────────────────── */
type Status = "normal" | "warning" | "over" | "ended"

/* ─── Mock Data ─────────────────────────────────────── */
const OA_COLORS = [
  "oklch(0.55 0.22 260)", "oklch(0.60 0.18 200)",
  "oklch(0.65 0.20 50)",  "oklch(0.55 0.16 150)",
  "oklch(0.60 0.20 320)", "oklch(0.58 0.19 30)",
]

const BUDGETS = [
  {
    id: 1, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 5, appLabel: "Tất cả App",
    history: [{ t: "21/04/2026 18:30", e: "Đạt ngưỡng 80%" }, { t: "19/04/2026 18:30", e: "Đạt ngưỡng 50%" }],
  },
  {
    id: 2, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 246_000_000, pct: 123, status: "over" as Status,
    oas: 3, appLabel: "App Got It",
    history: [{ t: "18/04/2026 09:00", e: "Đạt ngưỡng 100%" }, { t: "17/04/2026 14:20", e: "Đạt ngưỡng 80%" }],
  },
  {
    id: 3, name: "ZNS 3 OA", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 3, appLabel: "Tất cả App", history: [],
  },
  {
    id: 4, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 180_000_000, pct: 90, status: "ended" as Status,
    oas: 4, appLabel: "App DEG",
    history: [{ t: "15/04/2026 10:00", e: "Đạt ngưỡng 80%" }, { t: "10/04/2026 08:00", e: "Đạt ngưỡng 50%" }],
  },
  {
    id: 5, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 166_000_000, pct: 83, status: "warning" as Status,
    oas: 5, appLabel: "Tất cả App",
    history: [{ t: "20/04/2026 16:00", e: "Đạt ngưỡng 80%" }],
  },
  {
    id: 6, name: "ZNS Q2/2026 Tất cả OA", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 166_000_000, pct: 83, status: "warning" as Status,
    oas: 6, appLabel: "OA Manager",
    history: [{ t: "19/04/2026 12:30", e: "Đạt ngưỡng 80%" }],
  },
  {
    id: 7, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 4, appLabel: "App VPBank", history: [],
  },
  {
    id: 8, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 3, appLabel: "Tất cả App", history: [],
  },
  {
    id: 9, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 4, appLabel: "App Timo", history: [],
  },
  {
    id: 10, name: "ZNS Q2/2026", period: "01/04–30/06/2026",
    limit: 200_000_000, spent: 80_000_000, pct: 40, status: "normal" as Status,
    oas: 5, appLabel: "Tất cả App", history: [],
  },
]

const APPS = [
  { id: "app-deg",       name: "App DEG",            code: "APP5530" },
  { id: "app-gotit",     name: "App Got It",          code: "APP5530" },
  { id: "app-gotit-crm", name: "APP Got It Zalo CRM", code: "APP5530" },
  { id: "app-vpbank",    name: "App VPBank App",      code: "APP5530" },
  { id: "app-momo",      name: "App MoMo",            code: "APP5531" },
]

const OAS = [
  { id: "oa-timo",    name: "Ngân hàng số Timo", code: "OA 5530", color: OA_COLORS[0] },
  { id: "oa-bidv",    name: "Ngân hàng BIDV",    code: "OA 5530", color: OA_COLORS[1] },
  { id: "oa-hsbc",    name: "Ngân hàng HSBC",    code: "OA 5530", color: OA_COLORS[2] },
  { id: "oa-vpbank",  name: "VPBank",             code: "OA 5530", color: OA_COLORS[3] },
  { id: "oa-viettel", name: "Viettel Pay",        code: "OA 5530", color: OA_COLORS[4] },
  { id: "oa-momo",    name: "MoMo",               code: "OA 5531", color: OA_COLORS[5] },
]

const RECIPIENTS = [
  { id: "admin",        label: "Quản trị viên" },
  { id: "senior_admin", label: "Quản trị viên cao cấp" },
  { id: "finance",      label: "Tài chính viên" },
]

/* ─── Helpers ───────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString("vi-VN")

function StatusPill({ status }: { status: Status }) {
  const cfg: Record<Status, { bg: string; fg: string; label: string }> = {
    normal:  { bg: "oklch(0.95 0.05 145)", fg: "oklch(0.40 0.15 145)", label: "Bình Thường" },
    warning: { bg: "oklch(0.95 0.06 70)",  fg: "oklch(0.50 0.18 60)",  label: "Cảnh báo" },
    over:    { bg: "oklch(0.95 0.05 25)",  fg: "oklch(0.48 0.20 25)",  label: "Vượt mức" },
    ended:   { bg: "oklch(0.93 0.00 0)",   fg: "oklch(0.50 0.00 0)",   label: "Đã kết thúc" },
  }
  const { bg, fg, label } = cfg[status]
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: bg, color: fg }}>
      {label}
    </span>
  )
}

function PctBar({ pct }: { pct: number }) {
  const fill = Math.min(pct, 100)
  const color = pct >= 100 ? "oklch(0.55 0.20 25)" : pct >= 80 ? "oklch(0.65 0.20 50)" : "oklch(0.50 0.18 145)"
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${fill}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold w-8 text-right tabular-nums" style={{ color }}>{pct}%</span>
    </div>
  )
}

function OaAvatarRow({ count }: { count: number }) {
  const show = Math.min(count, 4)
  return (
    <div className="flex -space-x-1 mt-1">
      {Array.from({ length: show }, (_, i) => (
        <div key={i}
          className="w-5 h-5 rounded-full border-[1.5px] border-white text-[7px] font-bold text-white flex items-center justify-center"
          style={{ background: OA_COLORS[i % OA_COLORS.length] }}>
          {String.fromCharCode(65 + i)}
        </div>
      ))}
      {count > 4 && (
        <div className="w-5 h-5 rounded-full border-[1.5px] border-white bg-gray-200 text-[7px] text-gray-600 font-bold flex items-center justify-center">
          +{count - 4}
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
      style={{
        background: checked ? "oklch(0.45 0.22 265)" : "white",
        borderColor: checked ? "oklch(0.45 0.22 265)" : "oklch(0.70 0.00 0)",
      }}>
      {checked && <Check className="w-2.5 h-2.5 text-white" />}
    </button>
  )
}

/* ─── Main Component ────────────────────────────────── */
export default function QuanLyNganSachPage() {
  /* view state */
  const [detailId,     setDetailId]     = useState<number | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [showSuccess,  setShowSuccess]  = useState(false)
  const [newBudgetName, setNewBudgetName] = useState("")

  /* list filter */
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  /* create form — channels */
  const [useApi,       setUseApi]       = useState(true)
  const [useOaMgr,     setUseOaMgr]     = useState(true)
  const [selectedApps, setSelectedApps] = useState<string[]>(APPS.map(a => a.id))
  const [showAppPicker, setShowAppPicker] = useState(false)
  const [selectedOas,  setSelectedOas]  = useState<string[]>(OAS.map(o => o.id))
  const [showOaPicker, setShowOaPicker] = useState(false)
  const [oaSearch,     setOaSearch]     = useState("")

  /* create form — budget info */
  const [budgetName, setBudgetName] = useState("")
  const [startDate,  setStartDate]  = useState("")
  const [endDate,    setEndDate]    = useState("")
  const [limitAmt,   setLimitAmt]   = useState("")

  /* create form — thresholds */
  const [thresholds, setThresholds] = useState([
    { id: 1, pct: 100, isSystem: true },
    { id: 2, pct: 80,  isSystem: false },
  ])

  /* create form — notifications */
  const [notifOn,    setNotifOn]    = useState(true)
  const [recipients, setRecipients] = useState(["admin", "senior_admin", "finance"])

  /* section expand/collapse */
  const [secOpen, setSecOpen] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true })

  function resetForm() {
    setUseApi(true); setUseOaMgr(true)
    setSelectedApps(APPS.map(a => a.id)); setShowAppPicker(false)
    setSelectedOas(OAS.map(o => o.id));  setShowOaPicker(false); setOaSearch("")
    setBudgetName(""); setStartDate(""); setEndDate(""); setLimitAmt("")
    setThresholds([{ id: 1, pct: 100, isSystem: true }, { id: 2, pct: 80, isSystem: false }])
    setNotifOn(true); setRecipients(["admin", "senior_admin", "finance"])
    setSecOpen({ 1: true, 2: true, 3: true, 4: true })
  }

  function handleCreate() {
    setNewBudgetName(budgetName.trim() || "Ngân sách mới")
    setIsCreateOpen(false)
    setShowSuccess(true)
    resetForm()
  }

  const allAppsSelected = selectedApps.length === APPS.length
  const allOasSelected  = selectedOas.length === OAS.length
  const appLabel = allAppsSelected ? "Tất cả App" : `Đã chọn ${selectedApps.length}/${APPS.length} App`
  const oaLabel  = allOasSelected  ? "Tất cả OA"  : `Đã chọn ${selectedOas.length}/${OAS.length} OA`
  const filteredOasForPicker = OAS.filter(o => o.name.toLowerCase().includes(oaSearch.toLowerCase()))

  const filteredBudgets = BUDGETS.filter(b => {
    const matchS = b.name.toLowerCase().includes(search.toLowerCase())
    const matchF = statusFilter === "all" || b.status === statusFilter
    return matchS && matchF
  })

  const detailBudget = BUDGETS.find(b => b.id === detailId)
  const isFormValid  = !!budgetName.trim() && !!startDate && !!endDate && !!limitAmt

  function toggleApp(id: string) {
    setSelectedApps(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleOa(id: string) {
    setSelectedOas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleAllApps() { setSelectedApps(allAppsSelected ? [] : APPS.map(a => a.id)) }
  function toggleAllOas()  { setSelectedOas(allOasSelected  ? [] : OAS.map(o => o.id)) }
  function toggleRecipient(id: string) {
    setRecipients(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleSection(n: number) {
    setSecOpen(prev => ({ ...prev, [n]: !prev[n] }))
  }
  function addThreshold() {
    setThresholds(prev => [...prev, { id: Date.now(), pct: 0, isSystem: false }])
  }
  function removeThreshold(id: number) {
    setThresholds(prev => prev.filter(t => t.id !== id))
  }
  function updateThresholdPct(id: number, val: number) {
    setThresholds(prev => prev.map(t => t.id === id ? { ...t, pct: val } : t))
  }

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 h-[calc(100vh-56px)]">

          {/* ══ DETAIL VIEW ══════════════════════════════════ */}
          {detailId !== null && detailBudget ? (
            <div>
              {/* Back + title */}
              <div className="flex items-start gap-3 mb-6">
                <button
                  onClick={() => setDetailId(null)}
                  className="mt-1 w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-gray-50 flex-shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold">{detailBudget.name}</h1>
                    <StatusPill status={detailBudget.status} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span>{detailBudget.period}</span>
                    <span>·</span>
                    <span>{detailBudget.appLabel}</span>
                    <span>·</span>
                    <span>OA Manager</span>
                    <span>·</span>
                    <OaAvatarRow count={detailBudget.oas} />
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Hạn mức",   value: detailBudget.limit,                    color: "oklch(0.15 0 0)" },
                  { label: `Đã tiêu: ${detailBudget.pct}%`, value: detailBudget.spent, color: detailBudget.pct >= 80 ? "oklch(0.55 0.20 25)" : "oklch(0.50 0.18 145)" },
                  { label: `Còn lại: ${Math.max(0, Math.round((detailBudget.limit - detailBudget.spent) / detailBudget.limit * 100))}%`, value: Math.max(0, detailBudget.limit - detailBudget.spent), color: "oklch(0.15 0 0)" },
                ].map(card => (
                  <div key={card.label} className="bg-white rounded-xl border border-border p-5">
                    <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                    <p className="text-2xl font-bold tabular-nums" style={{ color: card.color }}>{fmt(card.value)} đ</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="bg-white rounded-xl border border-border p-5 mb-5">
                <p className="text-xs font-semibold text-muted-foreground tracking-widest mb-4">TIẾN ĐỘ TỔNG</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="h-full rounded-full"
                      style={{ width: `${Math.min(detailBudget.pct, 100)}%`, background: "oklch(0.50 0.18 145)" }} />
                    {[50, 80, 100].map(m => (
                      <div key={m} className="absolute top-0 bottom-0 w-px bg-white/80" style={{ left: `${m}%` }} />
                    ))}
                  </div>
                  <span className="text-lg font-bold tabular-nums" style={{ color: "oklch(0.50 0.18 145)" }}>
                    {Math.min(detailBudget.pct, 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
                  {[50, 80, 100].map(m => {
                    const activated = detailBudget.pct >= m
                    return (
                      <div key={m} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full"
                          style={{ background: activated ? "oklch(0.50 0.18 145)" : "oklch(0.60 0.20 25)" }} />
                        <span>{m}% {activated ? "Đã kích hoạt" : "Chưa kích hoạt"}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Warning history */}
              <div className="bg-white rounded-xl border border-border p-5">
                <h3 className="font-semibold mb-4">Lịch sử cảnh báo</h3>
                {detailBudget.history.length === 0 ? (
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
                      {detailBudget.history.map((h, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-3 pr-12 text-muted-foreground whitespace-nowrap">{h.t}</td>
                          <td className="py-3 font-semibold">{h.e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          ) : (
            /* ══ LIST VIEW ═══════════════════════════════════ */
            <>
              {/* Page header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Quản lý ngân sách</h1>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">Beta</Badge>
                </div>
                <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Đóng góp ý kiến
                </button>
              </div>

              {/* Filter row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    className="pl-9"
                    placeholder="Tìm tên ngân sách hoặc OA"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="normal">Bình Thường</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="over">Vượt mức</SelectItem>
                    <SelectItem value="ended">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="ml-auto gap-2 text-white"
                  style={{ background: "oklch(0.45 0.22 265)" }}>
                  <Plus className="w-4 h-4" /> Thêm ngân sách
                </Button>
              </div>

              {/* Empty state — search no results */}
              {filteredBudgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="font-semibold text-lg mb-1">Không tìm thấy kết quả</p>
                  <p className="text-sm text-muted-foreground mb-4">Hãy thử tìm với điều kiện khác.</p>
                  <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all") }}>
                    Xóa bộ lọc
                  </Button>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
                          <TableHead className="font-semibold">Tên ngân sách</TableHead>
                          <TableHead className="font-semibold">Thời hạn</TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">Ngân sách (VNĐ) <ArrowUpDown className="w-3 h-3" /></div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">Đã tiêu (VNĐ) <ArrowUpDown className="w-3 h-3" /></div>
                          </TableHead>
                          <TableHead className="font-semibold">
                            <div className="flex items-center gap-1">Tiến độ <ArrowUpDown className="w-3 h-3" /></div>
                          </TableHead>
                          <TableHead className="font-semibold">Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBudgets.map(b => (
                          <TableRow
                            key={b.id}
                            className="cursor-pointer hover:bg-blue-50/30"
                            onClick={() => setDetailId(b.id)}>
                            <TableCell>
                              <p className="font-medium text-sm" style={{ color: "oklch(0.45 0.22 265)" }}>{b.name}</p>
                              <OaAvatarRow count={b.oas} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{b.period}</TableCell>
                            <TableCell className="text-sm tabular-nums">{fmt(b.limit)}</TableCell>
                            <TableCell className="text-sm tabular-nums">{fmt(b.spent)}</TableCell>
                            <TableCell><PctBar pct={b.pct} /></TableCell>
                            <TableCell><StatusPill status={b.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>1–{filteredBudgets.length} trên 500 mục</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5, 6].map(p => (
                        <button
                          key={p}
                          className="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
                          style={p === 1 ? { background: "oklch(0.45 0.22 265)", color: "white", fontWeight: 600 } : { color: "oklch(0.4 0 0)" }}
                          onClick={() => {}}>
                          {p}
                        </button>
                      ))}
                      <span className="px-1">...</span>
                      <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-sm">50</button>
                      <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-sm">›</button>
                    </div>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 / trang</SelectItem>
                        <SelectItem value="20">20 / trang</SelectItem>
                        <SelectItem value="50">50 / trang</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </SidebarInset>

      {/* ══ CREATE SHEET ═════════════════════════════════════ */}
      <Sheet
        open={isCreateOpen}
        onOpenChange={open => { setIsCreateOpen(open); if (!open) resetForm() }}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[480px] sm:max-w-[480px] p-0 flex flex-col gap-0 top-[68px] h-[calc(100vh-68px)]">

          {/* Sheet header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <h2 className="text-base font-semibold">Tạo ngân sách</h2>
            <button
              onClick={() => { setIsCreateOpen(false); resetForm() }}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Sheet body */}
          <div className="flex-1 overflow-y-auto">

            {/* Section 1: Phạm vi ngân sách */}
            <div className="border-b border-border">
              <button type="button"
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50"
                onClick={() => toggleSection(1)}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.45 0.22 265)" }}>1</span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">PHẠM VI NGÂN SÁCH</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                {secOpen[1]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {secOpen[1] && (
                <div className="px-6 pb-5 space-y-4">
                  {/* Kênh chi tiêu */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-2">
                      Kênh chi tiêu <HelpCircle className="w-3 h-3" />
                    </p>

                    {/* API row */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={useApi} onChange={() => setUseApi(v => !v)} />
                          <span className="text-sm">{useApi ? `API (${appLabel})` : "API"}</span>
                        </div>
                        {useApi && (
                          <button type="button"
                            className="text-xs font-medium"
                            style={{ color: "oklch(0.45 0.22 265)" }}
                            onClick={() => setShowAppPicker(v => !v)}>
                            {showAppPicker ? "Thu gọn" : "Tùy chỉnh App"}
                          </button>
                        )}
                      </div>

                      {/* App picker */}
                      {useApi && showAppPicker && (
                        <div className="rounded-lg border border-border bg-gray-50/60 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: "oklch(0.45 0.22 265)" }}>A</div>
                              <span className="text-xs font-medium">API</span>
                            </div>
                            <button type="button"
                              className="text-xs font-medium"
                              style={{ color: "oklch(0.45 0.22 265)" }}
                              onClick={() => setShowAppPicker(false)}>
                              Lưu lựa chọn
                            </button>
                          </div>
                          <Input placeholder="Tìm kiếm App" className="h-7 text-xs" />
                          <div className="space-y-2 max-h-36 overflow-y-auto">
                            <div className="flex items-center gap-2">
                              <Checkbox checked={allAppsSelected} onChange={toggleAllApps} />
                              <span className="text-xs text-muted-foreground">Chọn tất cả</span>
                            </div>
                            {APPS.map(app => (
                              <div key={app.id} className="flex items-center gap-2">
                                <Checkbox checked={selectedApps.includes(app.id)} onChange={() => toggleApp(app.id)} />
                                <span className="text-xs flex-1">{app.name}</span>
                                <span className="text-xs text-muted-foreground">{app.code}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* OA Manager */}
                      <div className="flex items-center gap-2">
                        <Checkbox checked={useOaMgr} onChange={() => setUseOaMgr(v => !v)} />
                        <span className="text-sm">OA Manager</span>
                      </div>
                    </div>
                  </div>

                  {/* OA áp dụng */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">OA áp dụng</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox checked={allOasSelected} onChange={toggleAllOas} />
                        <span className="text-sm">{oaLabel}</span>
                      </div>
                      <button type="button"
                        className="text-xs font-medium"
                        style={{ color: "oklch(0.45 0.22 265)" }}
                        onClick={() => setShowOaPicker(v => !v)}>
                        {showOaPicker ? "Thu gọn" : "Tùy chỉnh OA"}
                      </button>
                    </div>

                    {/* OA picker */}
                    {showOaPicker && (
                      <div className="rounded-lg border border-border bg-gray-50/60 p-3 space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                            <Input
                              placeholder="Tìm kiếm OA..."
                              className="h-7 text-xs pl-7 pr-6"
                              value={oaSearch}
                              onChange={e => setOaSearch(e.target.value)}
                            />
                            {oaSearch && (
                              <button className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setOaSearch("")}>
                                <XIcon className="w-3 h-3 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                          <button type="button"
                            className="text-xs font-medium whitespace-nowrap"
                            style={{ color: "oklch(0.45 0.22 265)" }}
                            onClick={() => setShowOaPicker(false)}>
                            Lưu lựa chọn
                          </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {filteredOasForPicker.map(oa => (
                            <div key={oa.id} className="flex items-center gap-2">
                              <Checkbox checked={selectedOas.includes(oa.id)} onChange={() => toggleOa(oa.id)} />
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                                style={{ background: oa.color }}>{oa.name[0]}</div>
                              <span className="text-xs flex-1">{oa.name}</span>
                              <span className="text-xs text-muted-foreground">{oa.code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Thông tin ngân sách */}
            <div className="border-b border-border">
              <button type="button"
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50"
                onClick={() => toggleSection(2)}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.45 0.22 265)" }}>2</span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">THÔNG TIN NGÂN SÁCH</span>
                </div>
                {secOpen[2]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {secOpen[2] && (
                <div className="px-6 pb-5 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Tên ngân sách</label>
                    <Input
                      placeholder="Nhập tên ngân sách"
                      value={budgetName}
                      onChange={e => setBudgetName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Ngày bắt đầu</label>
                      <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Ngày kết thúc</label>
                      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Hạn mức</label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={50000}
                        placeholder="Nhập hạn mức, tối thiểu 50.000"
                        value={limitAmt}
                        onChange={e => setLimitAmt(e.target.value)}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">đ</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Đặt ngưỡng cảnh báo */}
            <div className="border-b border-border">
              <button type="button"
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50"
                onClick={() => toggleSection(3)}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.45 0.22 265)" }}>3</span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">ĐẶT NGƯỠNG CẢNH BÁO</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                {secOpen[3]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {secOpen[3] && (
                <div className="px-6 pb-5 space-y-3">
                  {thresholds.map(t => (
                    <div key={t.id} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground flex-1">
                        Ngưỡng {t.isSystem ? "vượt mức" : "tùy chỉnh"}, cảnh báo khi đạt
                      </span>
                      {t.isSystem ? (
                        <span className="font-semibold w-10 text-right">{t.pct}%</span>
                      ) : (
                        <div className="relative w-16">
                          <Input
                            type="number" min={1} max={99}
                            value={t.pct}
                            onChange={e => updateThresholdPct(t.id, Number(e.target.value))}
                            className="h-8 text-sm text-center pr-5"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
                        </div>
                      )}
                      <span className="text-muted-foreground">hạn mức</span>
                      {t.isSystem ? (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-muted-foreground whitespace-nowrap">Hệ thống</span>
                      ) : (
                        <button type="button"
                          onClick={() => removeThreshold(t.id)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 flex-shrink-0"
                          style={{ color: "oklch(0.6 0.20 25)" }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button"
                    className="flex items-center gap-1 text-sm font-medium"
                    style={{ color: "oklch(0.45 0.22 265)" }}
                    onClick={addThreshold}>
                    <Plus className="w-3.5 h-3.5" /> Thêm ngưỡng
                  </button>
                </div>
              )}
            </div>

            {/* Section 4: Tùy chỉnh nhận thông báo */}
            <div>
              <button type="button"
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50"
                onClick={() => toggleSection(4)}>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.45 0.22 265)" }}>4</span>
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">TÙY CHỈNH NHẬN THÔNG BÁO</span>
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                {secOpen[4]
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {secOpen[4] && (
                <div className="px-6 pb-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Người nhận thông báo</span>
                    <div className="flex items-center gap-2">
                      <Switch checked={notifOn} onCheckedChange={setNotifOn} />
                      <span className="text-xs text-muted-foreground">{notifOn ? "Nhận thông báo" : "Tắt"}</span>
                    </div>
                  </div>
                  {notifOn && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Có thể điều chỉnh sau tại trang Quản Lý Thông Báo
                      </p>
                      {/* Recipient tags */}
                      <div className="flex flex-wrap gap-1.5 border border-border rounded-lg p-2 min-h-[40px] cursor-text">
                        {recipients.map(rid => {
                          const r = RECIPIENTS.find(x => x.id === rid)
                          return r ? (
                            <span key={rid}
                              className="inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 bg-gray-100">
                              {r.label}
                              <button type="button" onClick={() => toggleRecipient(rid)}
                                className="hover:text-red-500 transition-colors">
                                <XIcon className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ) : null
                        })}
                        {RECIPIENTS.some(r => !recipients.includes(r.id)) && (
                          <select
                            className="text-xs text-muted-foreground bg-transparent outline-none cursor-pointer"
                            onChange={e => { if (e.target.value) { toggleRecipient(e.target.value); e.currentTarget.value = "" } }}>
                            <option value="">+ Thêm</option>
                            {RECIPIENTS.filter(r => !recipients.includes(r.id)).map(r => (
                              <option key={r.id} value={r.id}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                      {/* Warning note */}
                      <div className="flex items-start gap-2 p-2.5 rounded-lg text-xs"
                        style={{ background: "oklch(0.97 0.05 70)", color: "oklch(0.50 0.18 60)" }}>
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>Lưu ý: Thay đổi cài đặt thông báo sẽ được áp dụng cho tất cả ngân sách khác</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sheet footer */}
          <div className="border-t border-border px-6 py-4 flex justify-end gap-3 flex-shrink-0">
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm() }}>Hủy</Button>
            <Button
              disabled={!isFormValid}
              onClick={handleCreate}
              className="text-white"
              style={isFormValid ? { background: "oklch(0.45 0.22 265)" } : {}}>
              Tạo ngân sách
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* ══ SUCCESS MODAL ════════════════════════════════════ */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "oklch(0.90 0.10 145)" }}>
              <Check className="w-6 h-6" style={{ color: "oklch(0.45 0.18 145)" }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.45 0.18 145)" }}>
              Tạo ngân sách thành công
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Đã tạo ngân sách <strong>{newBudgetName}</strong> thành công, xem chi tiết ngân sách vừa tạo hoặc xem danh sách tất cả ngân sách.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowSuccess(false)}>
                Xem danh sách
              </Button>
              <Button
                className="text-white"
                style={{ background: "oklch(0.45 0.22 265)" }}
                onClick={() => setShowSuccess(false)}>
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
