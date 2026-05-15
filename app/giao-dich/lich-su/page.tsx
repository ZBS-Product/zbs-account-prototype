"use client"

import { useState } from "react"
import { Download, Search, CreditCard, Check, ChevronDown } from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* ---------- Types ---------- */

type TxStatus = "Thành công" | "Đang xử lý" | "Thất bại"
type TxType = "Chi tiêu" | "Nạp tiền"

interface Transaction {
  id: string
  time: string
  code: string
  type: TxType
  activity: string
  amountInitial: number
  amountActual: number
  status: TxStatus
  detail: string
}

/* ---------- Mock data ---------- */

const transactions: Transaction[] = [
  { id: "1",  time: "14/05/2026 14:36:30", code: "55902628500917499",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -43747,   amountActual: -43747,   status: "Thành công", detail: "ZNS thường" },
  { id: "2",  time: "14/05/2026 13:45:36", code: "64851855622108129",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -31369.8,  amountActual: -31369.8, status: "Thành công", detail: "ZNS Payment Request" },
  { id: "3",  time: "14/05/2026 13:45:35", code: "29509521972016776",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -31369.8,  amountActual: -31369.8, status: "Thành công", detail: "ZNS Rating" },
  { id: "4",  time: "14/05/2026 13:34:55", code: "81428227891704831",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -40546,    amountActual: -40546,   status: "Thành công", detail: "ZNS thường" },
  { id: "5",  time: "14/05/2026 12:33:27", code: "89651089408554634",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -34037.3,  amountActual: -34037.3, status: "Thành công", detail: "ZNS thường" },
  { id: "6",  time: "14/05/2026 12:12:40", code: "10606587331952151",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -30729.6,  amountActual: -30729.6, status: "Thành công", detail: "ZNS Payment Request" },
  { id: "7",  time: "14/05/2026 12:12:40", code: "79824880453905482",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -30729.6,  amountActual: -30729.6, status: "Thành công", detail: "ZNS Rating" },
  { id: "8",  time: "14/05/2026 12:02:32", code: "29213073754830453",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -30089.4,  amountActual: -30089.4, status: "Thành công", detail: "ZNS thường" },
  { id: "9",  time: "14/05/2026 09:59:36", code: "39998140552691225",  type: "Chi tiêu", activity: "ZBS Template Message", amountInitial: -37985.2,  amountActual: -37985.2, status: "Thành công", detail: "ZNS thường" },
  { id: "10", time: "13/05/2026 17:21:04", code: "11234567890123456",  type: "Nạp tiền", activity: "ZBS Template Message", amountInitial: 5000000,   amountActual: 5000000,  status: "Thành công", detail: "—" },
  { id: "11", time: "13/05/2026 10:05:11", code: "22345678901234567",  type: "Chi tiêu", activity: "ZNS hành trình",        amountInitial: -21500,    amountActual: -21500,   status: "Đang xử lý", detail: "ZNS thường" },
  { id: "12", time: "12/05/2026 08:44:22", code: "33456789012345678",  type: "Chi tiêu", activity: "ZNS Verification",      amountInitial: -18200,    amountActual: -18200,   status: "Thất bại",   detail: "ZNS thường" },
]

const ACTIVITIES = [
  "ZBS Template Message",
  "ZNS hành trình",
  "ZNS Verification",
  "ZNS thường",
  "ZNS Payment Request",
]

function formatVND(n: number) {
  const abs = Math.abs(n).toLocaleString("vi-VN", { minimumFractionDigits: 0, maximumFractionDigits: 1 })
  return (n < 0 ? "-" : "+") + abs + " đ"
}

/* ---------- Status badge ---------- */

const statusStyle: Record<TxStatus, string> = {
  "Thành công": "bg-green-600 text-white",
  "Đang xử lý": "bg-yellow-500 text-white",
  "Thất bại":   "bg-red-500 text-white",
}

/* ---------- Multi-select dropdown ---------- */

function ActivityDropdown({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(selected)

  const allSelected = draft.length === ACTIVITIES.length

  function toggleAll() {
    setDraft(allSelected ? [] : [...ACTIVITIES])
  }

  function toggle(v: string) {
    setDraft((d) => d.includes(v) ? d.filter((x) => x !== v) : [...d, v])
  }

  function confirm() {
    onChange(draft)
    setOpen(false)
  }

  const label = selected.length === ACTIVITIES.length || selected.length === 0
    ? "Tất cả hoạt động"
    : selected.length === 1
    ? selected[0]
    : `${selected.length} hoạt động`

  return (
    <div className="relative">
      <button
        onClick={() => { setDraft(selected); setOpen(!open) }}
        className={cn(
          "flex items-center gap-2 h-9 px-3 text-sm border rounded-md bg-white min-w-[180px] justify-between",
          open ? "border-blue-500 ring-1 ring-blue-500" : "border-border"
        )}
      >
        <span className="text-foreground">{label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-20 top-10 left-0 w-56 bg-white border border-border rounded-md shadow-lg py-1">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent"
          >
            <div className={cn("h-4 w-4 rounded border flex items-center justify-center", allSelected ? "bg-blue-600 border-blue-600" : "border-border")}>
              {allSelected && <Check className="h-3 w-3 text-white" />}
            </div>
            <span className={allSelected ? "text-blue-600 font-medium" : ""}>Tất cả hoạt động</span>
          </button>
          <div className="border-t border-border my-1" />
          {ACTIVITIES.map((act) => {
            const checked = draft.includes(act)
            return (
              <button
                key={act}
                onClick={() => toggle(act)}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent text-left"
              >
                <div className={cn("h-4 w-4 rounded border flex items-center justify-center shrink-0", checked ? "bg-blue-600 border-blue-600" : "border-border")}>
                  {checked && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>{act}</span>
              </button>
            )
          })}
          <div className="border-t border-border mt-1 px-3 pt-2 pb-2">
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 text-sm" onClick={confirm}>
              Xác nhận
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Simple select ---------- */

function SimpleSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 text-sm border rounded-md bg-white min-w-[180px] justify-between",
          open ? "border-blue-500 ring-1 ring-blue-500" : "border-border"
        )}
      >
        <span className={value === options[0] ? "text-foreground" : "text-blue-600 font-medium"}>{value}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute z-20 top-10 left-0 w-48 bg-white border border-border rounded-md shadow-lg py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={cn(
                "w-full text-left px-3 py-2 text-sm hover:bg-accent",
                opt === value ? "text-blue-600 font-medium" : "text-foreground"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Page ---------- */

export default function LichSuGiaoDichPage() {
  const [typeFilter, setTypeFilter] = useState("Tất cả loại giao dịch")
  const [activityFilter, setActivityFilter] = useState<string[]>([...ACTIVITIES])
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái")
  const [search, setSearch] = useState("")

  const filtered = transactions.filter((tx) => {
    const matchType = typeFilter === "Tất cả loại giao dịch" || tx.type === typeFilter
    const matchActivity = activityFilter.length === 0 || activityFilter.includes(tx.activity)
    const matchStatus = statusFilter === "Tất cả trạng thái" || tx.status === statusFilter
    const matchSearch = search === "" || tx.code.includes(search)
    return matchType && matchActivity && matchStatus && matchSearch
  })

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground">Lịch sử giao dịch</h1>

          {/* Account banner */}
          <div className="rounded-lg bg-[#1e2a8a] text-white px-6 py-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold opacity-90">ZNSTest</p>
              <p className="text-sm font-mono opacity-75">8BUBW694KQDGKV67</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end opacity-75 text-xs mb-1">
                <CreditCard className="h-3.5 w-3.5" />
                <span className="uppercase tracking-wide font-medium">Hạn mức tài khoản</span>
              </div>
              <p className="text-2xl font-bold">10.000.000.000</p>
            </div>
          </div>

          {/* Filters row 1 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
              <span>07-05-2026</span>
              <span>→</span>
              <span>14-05-2026</span>
            </div>
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã giao dịch"
                className="pl-8 h-9 w-[240px] text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters row 2 */}
          <div className="flex items-center gap-3 flex-wrap">
            <SimpleSelect
              value={typeFilter}
              options={["Tất cả loại giao dịch", "Nạp tiền", "Chi tiêu"]}
              onChange={setTypeFilter}
            />
            <ActivityDropdown selected={activityFilter} onChange={setActivityFilter} />
            <SimpleSelect
              value={statusFilter}
              options={["Tất cả trạng thái", "Thành công", "Đang xử lý", "Thất bại"]}
              onChange={setStatusFilter}
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold">Lịch sử chi tiêu</h2>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-xs bg-muted/30">
                  <TableHead className="whitespace-nowrap">Thời gian giao dịch</TableHead>
                  <TableHead className="whitespace-nowrap">Mã giao dịch</TableHead>
                  <TableHead className="whitespace-nowrap">Loại giao dịch</TableHead>
                  <TableHead className="whitespace-nowrap">Hoạt động</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Số tiền ban đầu</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Số tiền thực tế</TableHead>
                  <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                  <TableHead className="whitespace-nowrap">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                      Không có giao dịch nào phù hợp.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((tx) => (
                  <TableRow key={tx.id} className="text-sm">
                    <TableCell className="text-muted-foreground whitespace-nowrap">{tx.time}</TableCell>
                    <TableCell className="font-mono text-xs">{tx.code}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "rounded border px-2 py-0.5 text-xs font-medium",
                        tx.type === "Chi tiêu"
                          ? "border-orange-400 text-orange-500"
                          : "border-green-500 text-green-600"
                      )}>
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{tx.activity}</TableCell>
                    <TableCell className={cn("text-right font-medium whitespace-nowrap", tx.amountInitial < 0 ? "text-red-500" : "text-green-600")}>
                      {formatVND(tx.amountInitial)}
                    </TableCell>
                    <TableCell className={cn("text-right font-medium whitespace-nowrap", tx.amountActual < 0 ? "text-red-500" : "text-green-600")}>
                      {formatVND(tx.amountActual)}
                    </TableCell>
                    <TableCell>
                      <span className={cn("rounded px-2 py-0.5 text-xs font-medium", statusStyle[tx.status])}>
                        {tx.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.detail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <span className="text-xs text-muted-foreground">1–{filtered.length} trên {filtered.length} mục</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, "...", 10].map((p, i) => (
                  <Button
                    key={i}
                    variant={p === 1 ? "default" : "ghost"}
                    size="sm"
                    className="h-7 w-7 p-0 text-xs"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
