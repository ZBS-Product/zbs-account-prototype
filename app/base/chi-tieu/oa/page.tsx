"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CalendarDays, ChevronDown, Download, Info, Search } from "lucide-react"

const barData = [
  { month: "01/11", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 300,   "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 1186 },
  { month: "01/12", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 0,     "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 0 },
  { month: "01/01", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 0,     "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 4787 },
  { month: "01/02", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 0,     "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 0 },
  { month: "01/03", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 0,     "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 0 },
  { month: "01/04", "Phí xử lý hệ thống": 150,  "Gói tính năng lẻ OA": 675,   "Dịch vụ tin nhắn OA": 120,  "Gói dịch vụ OA": 15540 },
  { month: "01/05", "Phí xử lý hệ thống": 0,    "Gói tính năng lẻ OA": 300,   "Dịch vụ tin nhắn OA": 0,    "Gói dịch vụ OA": 4787 },
]

const pieAppData = [
  { name: "Test app Quản", value: 26271000 },
]

const pieOaData = [
  { name: "Qc Test ZNS 4", value: 24271000 },
  { name: "ZBS Test OA",   value: 1186667 },
  { name: "Ngân hàng X",   value: 538333 },
  { name: "Qc Test ZNS 3", value: 275000 },
]

const COLORS_APP = ["oklch(0.35 0.22 265)"]
const COLORS_OA  = ["oklch(0.35 0.22 265)", "oklch(0.6 0.13 185)", "oklch(0.65 0.12 145)", "oklch(0.75 0.15 80)"]

const BAR_COLORS: Record<string, string> = {
  "Phí xử lý hệ thống":  "oklch(0.35 0.22 265)",
  "Gói tính năng lẻ OA": "oklch(0.6 0.13 185)",
  "Dịch vụ tin nhắn OA": "oklch(0.65 0.12 145)",
  "Gói dịch vụ OA":      "oklch(0.82 0.14 80)",
}

const OA_AVATARS: Record<string, { bg: string; text: string; initials: string }> = {
  "Qc Test ZNS 4": { bg: "oklch(0.25 0.22 265)", text: "#fff", initials: "Q" },
  "ZBS Test OA":   { bg: "oklch(0.55 0.2 220)",  text: "#fff", initials: "Z" },
  "Ngân hàng X":   { bg: "oklch(0.65 0.18 140)", text: "#fff", initials: "N" },
  "Qc Test ZNS 3": { bg: "oklch(0.25 0.22 265)", text: "#fff", initials: "Q" },
}

type Row = {
  date: string
  app: string | null
  oa: string
  serviceType: string
  serviceDetail: string
  qty: number
  unitPrice: number
  total: number
}

const allRows: Row[] = [
  { date: "04/05/2026", app: null,            oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Premium 1 năm",     qty: 1, unitPrice: 4786667, total: 4786667 },
  { date: "03/05/2026", app: null,            oa: "Qc Test ZNS 4", serviceType: "Gói tính năng lẻ OA", serviceDetail: "GMF 1000",                  qty: 1, unitPrice: 300000,  total: 300000 },
  { date: "03/04/2026", app: "Test app Quản", oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Nâng cao 6 tháng",   qty: 1, unitPrice: 594000,  total: 594000 },
  { date: "03/04/2026", app: "Test app Quản", oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Premium 1 năm",     qty: 1, unitPrice: 4786667, total: 4786667 },
  { date: "03/04/2026", app: null,            oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Premium 1 năm",     qty: 2, unitPrice: 4786667, total: 9573334 },
  { date: "03/04/2026", app: "Test app Quản", oa: "Qc Test ZNS 4", serviceType: "Gói tính năng lẻ OA", serviceDetail: "GMF 100",                   qty: 1, unitPrice: 75000,   total: 75000 },
  { date: "03/04/2026", app: "Test app Quản", oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Premium 6 tháng",   qty: 1, unitPrice: 2394000, total: 2394000 },
  { date: "03/04/2026", app: null,            oa: "Qc Test ZNS 4", serviceType: "Gói tính năng lẻ OA", serviceDetail: "GMF 1000",                  qty: 1, unitPrice: 300000,  total: 300000 },
  { date: "05/01/2026", app: null,            oa: "Qc Test ZNS 4", serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Premium 1 năm",     qty: 1, unitPrice: 4786667, total: 4786667 },
  { date: "23/10/2025", app: null,            oa: "ZBS Test OA",   serviceType: "Gói dịch vụ OA",      serviceDetail: "Gói OA Nâng cao 1 năm",    qty: 1, unitPrice: 1186667, total: 1186667 },
]

const serviceTypes = ["Tất cả dịch vụ OA", "Gói dịch vụ OA", "Gói tính năng lẻ OA", "Phí xử lý hệ thống", "Dịch vụ tin nhắn OA"]
const pageSizes = [10, 20, 50]

function fmtK(v: number) {
  return v === 0 ? "0" : `${(v / 1000).toLocaleString("vi-VN")}K`
}
function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

function OaChip({ oa }: { oa: string }) {
  const cfg = OA_AVATARS[oa] ?? { bg: "oklch(0.5 0.1 265)", text: "#fff", initials: oa[0] }
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.text }}>
        {cfg.initials}
      </div>
      <span>{oa}</span>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded border border-border bg-white p-3 text-xs shadow-md space-y-1">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span>{p.name}: {fmtK(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function ChiTieuOAPage() {
  const [serviceFilter, setServiceFilter] = useState("Tất cả dịch vụ OA")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = allRows.filter((r) => {
    const matchService = serviceFilter === "Tất cả dịch vụ OA" || r.serviceType === serviceFilter
    const matchSearch =
      search === "" ||
      (r.app ?? "").toLowerCase().includes(search.toLowerCase()) ||
      r.oa.toLowerCase().includes(search.toLowerCase()) ||
      r.serviceDetail.toLowerCase().includes(search.toLowerCase())
    return matchService && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, filtered.length)

  function changePage(p: number) { setPage(Math.max(1, Math.min(p, totalPages))) }

  const totalSpend = allRows.reduce((s, r) => s + r.total, 0)

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">

          {/* Title + date + total */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dịch vụ OA</h1>
              <Info className="h-4 w-4 text-muted-foreground mt-1" />
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Tổng chi tiêu</span>
              <span className="text-lg font-bold">{fmtVND(totalSpend)}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded border border-border bg-white px-3 py-2 text-sm hover:bg-accent transition-colors">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              01-09-2025 → 30-09-2026
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 font-normal">
                  {serviceFilter}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {serviceTypes.map((s) => (
                  <DropdownMenuItem key={s} onSelect={() => { setServiceFilter(s); setPage(1) }} className={serviceFilter === s ? "font-semibold" : ""}>
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative ml-auto w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Tìm theo tên hoặc ID của ứng dụng/OA/mẫu t..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
            </div>
          </div>

          {/* Bar chart */}
          <div className="rounded border border-border bg-white px-5 pt-4 pb-2">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtK} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Chi tiêu", angle: -90, position: "insideLeft", offset: -5, style: { fontSize: 11, fill: "oklch(0.552 0.016 285.938)" } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                {Object.entries(BAR_COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={color} radius={key === "Gói dịch vụ OA" ? [2, 2, 0, 0] : [0, 0, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie charts */}
          <div className="grid grid-cols-2 gap-5">
            {/* By app */}
            <div className="rounded border border-border bg-white px-5 pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Chi tiêu theo ứng dụng</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground"><Download className="h-4 w-4" /></Button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieAppData} cx="50%" cy="50%" innerRadius={0} outerRadius={90} dataKey="value" label={false}>
                    {pieAppData.map((_, i) => <Cell key={i} fill={COLORS_APP[i % COLORS_APP.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: unknown) => fmtVND(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* By OA */}
            <div className="rounded border border-border bg-white px-5 pt-4 pb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Chi tiêu theo OA</h3>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground"><Download className="h-4 w-4" /></Button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieOaData} cx="50%" cy="50%" innerRadius={0} outerRadius={90} dataKey="value" label={false}>
                    {pieOaData.map((_, i) => <Cell key={i} fill={COLORS_OA[i % COLORS_OA.length]} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: unknown) => fmtVND(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History table */}
          <div className="rounded border border-border bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold">Lịch sử chi tiêu</h2>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground"><Download className="h-4 w-4" /></Button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold w-32">Ngày giao dịch</th>
                  <th className="px-4 py-3 text-left font-semibold w-36">Tên ứng dụng</th>
                  <th className="px-4 py-3 text-left font-semibold w-40">Tên OA</th>
                  <th className="px-4 py-3 text-left font-semibold w-40">Loại dịch vụ</th>
                  <th className="px-4 py-3 text-left font-semibold">Chi tiết dịch vụ</th>
                  <th className="px-4 py-3 text-right font-semibold w-20">Số lượng</th>
                  <th className="px-4 py-3 text-right font-semibold w-28">Đơn giá</th>
                  <th className="px-4 py-3 text-right font-semibold w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, i) => (
                  <tr key={i} className={i < paged.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.app ?? "–"}</td>
                    <td className="px-4 py-3"><OaChip oa={r.oa} /></td>
                    <td className="px-4 py-3">{r.serviceType}</td>
                    <td className="px-4 py-3">{r.serviceDetail}</td>
                    <td className="px-4 py-3 text-right">{r.qty}</td>
                    <td className="px-4 py-3 text-right">{r.unitPrice.toLocaleString("vi-VN")}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmtVND(r.total)}</td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">Không tìm thấy dữ liệu</td></tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-muted-foreground">
              <span>{filtered.length === 0 ? "0 mục" : `${start}–${end} trên ${filtered.length} mục`}</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>&lt;</Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button key={p} variant="ghost" size="sm" className="h-7 w-7 p-0"
                    style={currentPage === p ? { color: "oklch(0.488 0.243 264.376)", fontWeight: 700, background: "oklch(0.93 0.04 264)" } : {}}
                    onClick={() => changePage(p)}>{p}</Button>
                ))}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>&gt;</Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 font-normal">{pageSize} / trang <ChevronDown className="h-3 w-3 opacity-50" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pageSizes.map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => { setPageSize(s); setPage(1) }} className={pageSize === s ? "font-semibold" : ""}>{s} / trang</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="px-5 py-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Số liệu chỉ mang tính chất tham khảo, không phục vụ cho mục đích đối soát
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
