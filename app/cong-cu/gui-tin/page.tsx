"use client"

import { useState } from "react"
import {
  FileText, Globe, QrCode, Star, CreditCard, Ticket,
  Download, Search, Plus, MoreHorizontal, Clock,
  ChevronDown, ChevronUp, AlertTriangle,
} from "lucide-react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

/* ---------- Types ---------- */

type TemplateStatus = "Nháp" | "Đang duyệt" | "Đã duyệt" | "Bị từ chối" | "Bị khóa"
type TemplateType = "Mẫu tuỳ chỉnh" | "Mẫu OTP" | "Mẫu đánh giá dịch vụ" | "Mẫu yêu cầu thanh toán" | "Mẫu Voucher"
type CskhType = "Giao dịch" | "Chăm sóc khách hàng" | "Hậu mãi"

interface Template {
  id: string
  name: string
  zbsId: string
  oaName: string
  oaColor: string
  appName: string
  createdAt: string
  status: TemplateStatus
  type: TemplateType
  cskh: CskhType
  iconType: "default" | "webhook" | "otp" | "rating" | "payment" | "voucher"
}

/* ---------- Mock data ---------- */

const templates: Template[] = [
  { id: "1", name: "Test Template",         zbsId: "578634", oaName: "Qc Test ZNS 4",              oaColor: "#1a1a1a",                    appName: "QC Test ZNS 1",      createdAt: "16h39 12/05/2026", status: "Bị từ chối", type: "Mẫu tuỳ chỉnh",          cskh: "Giao dịch",           iconType: "default"  },
  { id: "2", name: "Test template webhook", zbsId: "578321", oaName: "Qc Test ZNS 4",              oaColor: "#1a1a1a",                    appName: "QC Test ZNS 1",      createdAt: "13h54 12/05/2026", status: "Đã duyệt",   type: "Mẫu tuỳ chỉnh",          cskh: "Giao dịch",           iconType: "webhook"  },
  { id: "3", name: "test create temp",      zbsId: "578303", oaName: "Qc Test ZNS 4",              oaColor: "#1a1a1a",                    appName: "QC Test ZNS 4",      createdAt: "13h32 12/05/2026", status: "Đã duyệt",   type: "Mẫu OTP",                 cskh: "Giao dịch",           iconType: "otp"      },
  { id: "4", name: "Con cua củ quả 1",      zbsId: "578569", oaName: "Doanh nghiệp KCX Tân Thuận", oaColor: "oklch(0.55 0.18 30)",        appName: "Thinh OA ZBA Test 1208", createdAt: "17h11 11/05/2026", status: "Nháp",       type: "Mẫu tuỳ chỉnh",          cskh: "Chăm sóc khách hàng", iconType: "default"  },
  { id: "5", name: "Testingáasdasdsa",       zbsId: "",       oaName: "Doanh nghiệp KCX Tân Thuận", oaColor: "oklch(0.55 0.18 30)",        appName: "ZOA",                createdAt: "21h25 08/05/2026", status: "Nháp",       type: "Mẫu đánh giá dịch vụ",   cskh: "Chăm sóc khách hàng", iconType: "rating"   },
  { id: "6", name: "Mẫu thanh toán VIP",    zbsId: "577890", oaName: "Zalo Business Solutions",   oaColor: "oklch(0.45 0.22 265)",       appName: "Test ZBS App",       createdAt: "09h10 07/05/2026", status: "Đã duyệt",   type: "Mẫu yêu cầu thanh toán", cskh: "Giao dịch",           iconType: "payment"  },
  { id: "7", name: "Voucher ưu đãi hè",     zbsId: "577201", oaName: "Zalo Business Solutions",   oaColor: "oklch(0.45 0.22 265)",       appName: "Test ZBS App",       createdAt: "14h30 06/05/2026", status: "Đang duyệt", type: "Mẫu Voucher",             cskh: "Hậu mãi",             iconType: "voucher"  },
  { id: "8", name: "OTP đăng nhập",         zbsId: "576544", oaName: "Qc Test ZNS 4",              oaColor: "#1a1a1a",                    appName: "QC Test ZNS 1",      createdAt: "08h00 05/05/2026", status: "Bị khóa",    type: "Mẫu OTP",                 cskh: "Giao dịch",           iconType: "otp"      },
]

/* ---------- Status badge ---------- */

const statusStyle: Record<TemplateStatus, string> = {
  "Nháp":        "bg-gray-100 text-gray-500 border border-gray-300",
  "Đang duyệt":  "bg-yellow-50 text-yellow-700 border border-yellow-300",
  "Đã duyệt":    "bg-green-500 text-white",
  "Bị từ chối":  "bg-red-100 text-red-600 border border-red-300",
  "Bị khóa":     "bg-gray-200 text-gray-500 border border-gray-300",
}

/* ---------- Template icon ---------- */

const iconMap = {
  default: FileText,
  webhook: Globe,
  otp:     QrCode,
  rating:  Star,
  payment: CreditCard,
  voucher: Ticket,
}

function TemplateIcon({ type }: { type: Template["iconType"] }) {
  const Icon = iconMap[type]
  return (
    <div className="h-9 w-9 rounded border border-border flex items-center justify-center shrink-0 bg-white">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
  )
}

/* ---------- OA avatar ---------- */

function OaAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  )
}

/* ---------- Filter section ---------- */

const filterIcons: Record<string, React.ReactNode> = {
  "Tất cả":                  <FileText className="h-3.5 w-3.5" />,
  "Nháp":                    <span className="h-3.5 w-3.5 flex items-center justify-center"><svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="10" height="10" rx="1"/><line x1="4" y1="5" x2="10" y2="5"/><line x1="4" y1="8" x2="8" y2="8"/></svg></span>,
  "Đang duyệt":              <Clock className="h-3.5 w-3.5" />,
  "Đã duyệt":                <span className="h-3.5 w-3.5 flex items-center justify-center text-current">✓</span>,
  "Bị từ chối":              <span className="h-3.5 w-3.5 flex items-center justify-center">✕</span>,
  "Bị khóa":                 <span className="h-3.5 w-3.5 flex items-center justify-center">🔒</span>,
  "Mẫu tuỳ chỉnh":          <FileText className="h-3.5 w-3.5" />,
  "Mẫu OTP":                 <QrCode className="h-3.5 w-3.5" />,
  "Mẫu đánh giá dịch vụ":   <Star className="h-3.5 w-3.5" />,
  "Mẫu yêu cầu thanh toán": <CreditCard className="h-3.5 w-3.5" />,
  "Mẫu Voucher":             <Ticket className="h-3.5 w-3.5" />,
  "Giao dịch":               <CreditCard className="h-3.5 w-3.5" />,
  "Chăm sóc khách hàng":     <span className="h-3.5 w-3.5 flex items-center justify-center">😊</span>,
  "Hậu mãi":                 <Star className="h-3.5 w-3.5" />,
}

function FilterPanel({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: string[]
  selected: string
  onSelect: (v: string) => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-xs font-semibold text-foreground"
      >
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="space-y-0.5">
          {options.map((opt) => {
            const active = selected === opt
            return (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-sm text-left transition-colors",
                  active
                    ? "border-l-[3px] border-blue-600 bg-blue-50 text-blue-700 font-medium"
                    : "border-l-[3px] border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span className={active ? "text-blue-600" : "text-muted-foreground"}>
                  {filterIcons[opt] ?? <FileText className="h-3.5 w-3.5" />}
                </span>
                {opt}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------- Page ---------- */

export default function GuiTinPage() {
  const [statusFilter, setStatusFilter]   = useState("Tất cả")
  const [typeFilter, setTypeFilter]       = useState("Tất cả")
  const [cskhFilter, setCskhFilter]       = useState("Tất cả")
  const [search, setSearch]               = useState("")

  const filtered = templates.filter((t) => {
    const matchStatus = statusFilter === "Tất cả" || t.status === statusFilter
    const matchType   = typeFilter === "Tất cả"   || t.type === typeFilter
    const matchCskh   = cskhFilter === "Tất cả"   || t.cskh === cskhFilter
    const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.zbsId.includes(search) || t.oaName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchType && matchCskh && matchSearch
  })

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex h-[calc(100vh-56px)] overflow-hidden">

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Quản lý Template</h1>
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4" />
                Tạo Template
              </Button>
            </div>

            {/* Warning banner */}
            <div className="flex items-start gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />
              <p>
                <strong>Thông báo:</strong> Từ ngày 16/03/2026, Zalo Platforms sẽ thực hiện cập nhật cấu trúc và đơn giá mới cho ZBS Template Message. Xem chi tiết{" "}
                <a href="#" className="underline font-medium">tại đây</a>.
              </p>
            </div>

            {/* List header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold">Danh sách Template</h2>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              {/* Search + sort */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo tên hoặc ID của ứng dụng/OA/mẫu ZBS"
                    className="pl-8 h-9 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <span>Sắp xếp theo:</span>
                  <Select defaultValue="thoi-gian">
                    <SelectTrigger className="h-9 w-[160px] text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thoi-gian">Thời gian tạo</SelectItem>
                      <SelectItem value="ten">Tên template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Template list */}
              <div className="border border-border rounded-lg overflow-hidden bg-white divide-y divide-border">
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    Không có template nào phù hợp.
                  </div>
                )}
                {filtered.map((t) => (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                    <TemplateIcon type={t.iconType} />

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <OaAvatar name={t.oaName} color={t.oaColor} />
                        <span className="truncate max-w-[180px]">{t.oaName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{t.createdAt}</span>
                      </div>
                    </div>

                    {/* ZBS ID + App */}
                    <div className="w-44 shrink-0 space-y-1">
                      {t.zbsId && (
                        <p className="text-xs text-muted-foreground">
                          ID mẫu ZBS <span className="font-semibold text-foreground">{t.zbsId}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Ứng dụng <span className="font-semibold text-foreground">{t.appName}</span>
                      </p>
                    </div>

                    {/* Status */}
                    <div className="w-28 shrink-0 flex justify-center">
                      <span className={cn("rounded px-2.5 py-0.5 text-xs font-medium", statusStyle[t.status])}>
                        {t.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                        Xem chi tiết
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right filter panel */}
          <aside className="w-52 shrink-0 border-l border-border bg-white overflow-y-auto px-3 py-4">
            <FilterPanel
              title="Lọc theo trạng thái"
              options={["Tất cả", "Nháp", "Đang duyệt", "Đã duyệt", "Bị từ chối", "Bị khóa"]}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />
            <FilterPanel
              title="Lọc theo loại mẫu ZBS"
              options={["Tất cả", "Mẫu tuỳ chỉnh", "Mẫu OTP", "Mẫu đánh giá dịch vụ", "Mẫu yêu cầu thanh toán", "Mẫu Voucher"]}
              selected={typeFilter}
              onSelect={setTypeFilter}
            />
            <FilterPanel
              title="Lọc theo mục đích CSKH"
              options={["Tất cả", "Giao dịch", "Chăm sóc khách hàng", "Hậu mãi"]}
              selected={cskhFilter}
              onSelect={setCskhFilter}
            />
          </aside>

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
