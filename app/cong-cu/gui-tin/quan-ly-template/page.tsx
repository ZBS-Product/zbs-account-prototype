"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  Download, Search, MoreHorizontal, ChevronUp, ChevronDown,
  FileText, FileCheck, Clock, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

/* ---------- Types ---------- */
type Status = "bi-tu-choi" | "da-duyet" | "nhap" | "dang-duyet" | "bi-khoa"
type TemplateType = "tuy-chinh" | "otp" | "danh-gia" | "thanh-toan" | "voucher"
type MucDich = "giao-dich" | "cham-soc" | "hau-mai"

/* ---------- Mock data ---------- */
const templates = [
  {
    id: 1,
    name: "Test Template",
    idMau: "578634",
    user: "Qc Test ZNS 4",
    userAvatar: "",
    ungDung: "QC Test ZNS 1",
    time: "16h39 12/05/2026",
    status: "bi-tu-choi" as Status,
    type: "tuy-chinh" as TemplateType,
    mucDich: "giao-dich" as MucDich,
  },
  {
    id: 2,
    name: "Test template webhook",
    idMau: "578321",
    user: "Qc Test ZNS 4",
    userAvatar: "",
    ungDung: "QC Test ZNS 1",
    time: "13h54 12/05/2026",
    status: "da-duyet" as Status,
    type: "otp" as TemplateType,
    mucDich: "giao-dich" as MucDich,
  },
  {
    id: 3,
    name: "test create temp",
    idMau: "578303",
    user: "Qc Test ZNS 4",
    userAvatar: "",
    ungDung: "QC Test ZNS 4",
    time: "13h32 12/05/2026",
    status: "da-duyet" as Status,
    type: "tuy-chinh" as TemplateType,
    mucDich: "cham-soc" as MucDich,
  },
  {
    id: 4,
    name: "Con cua củ quả 1",
    idMau: "578569",
    user: "Doanh nghiệp KCX Tân Thuận",
    userAvatar: "",
    ungDung: "Thinh OA ZBA Test 1208",
    time: "17h11 11/05/2026",
    status: "nhap" as Status,
    type: "tuy-chinh" as TemplateType,
    mucDich: "hau-mai" as MucDich,
  },
  {
    id: 5,
    name: "Testingáasdasdsa",
    idMau: "",
    user: "Doanh nghiệp KCX Tân Thuận",
    userAvatar: "",
    ungDung: "ZOA",
    time: "21h25 08/05/2026",
    status: "nhap" as Status,
    type: "otp" as TemplateType,
    mucDich: "giao-dich" as MucDich,
  },
  {
    id: 6,
    name: "Kien Nguyen",
    idMau: "577125",
    user: "Qc Test ZNS 4",
    userAvatar: "",
    ungDung: "QC Test ZNS 1",
    time: "09h10 07/05/2026",
    status: "da-duyet" as Status,
    type: "tuy-chinh" as TemplateType,
    mucDich: "cham-soc" as MucDich,
  },
  {
    id: 7,
    name: "Thông báo thanh toán định kỳ",
    idMau: "576980",
    user: "Doanh nghiệp KCX Tân Thuận",
    userAvatar: "",
    ungDung: "Thinh OA ZBA Test 1208",
    time: "14h22 06/05/2026",
    status: "dang-duyet" as Status,
    type: "thanh-toan" as TemplateType,
    mucDich: "giao-dich" as MucDich,
  },
]

const statusConfig: Record<Status, { label: string; className: string }> = {
  "bi-tu-choi": { label: "Bị từ chối", className: "bg-red-100 text-red-700 border-red-200" },
  "da-duyet":   { label: "Đã duyệt",   className: "bg-green-100 text-green-700 border-green-200" },
  "nhap":       { label: "Nháp",        className: "bg-gray-100 text-gray-600 border-gray-200" },
  "dang-duyet": { label: "Đang duyệt", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "bi-khoa":    { label: "Bị khoá",    className: "bg-orange-100 text-orange-700 border-orange-200" },
}

/* ---------- Filter section component ---------- */
function FilterSection({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-border pb-3">
      <button
        className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                value === opt.value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {value === opt.value ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Template row icon ---------- */
function TemplateIcon({ type }: { type: TemplateType }) {
  return (
    <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
      <FileText className="h-4 w-4 text-gray-500" />
    </div>
  )
}

/* ---------- Page ---------- */
export default function QuanLyTemplatePage() {
  const router = useRouter()
  const pathname = usePathname()
  const basePath = `/${pathname.split("/")[1]}`
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("tat-ca")
  const [filterType, setFilterType] = useState("tat-ca")
  const [filterMucDich, setFilterMucDich] = useState("tat-ca")

  const filtered = templates.filter((t) => {
    if (filterStatus !== "tat-ca" && t.status !== filterStatus) return false
    if (filterType !== "tat-ca" && t.type !== filterType) return false
    if (filterMucDich !== "tat-ca" && t.mucDich !== filterMucDich) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto min-w-0">
        <h1 className="text-xl font-semibold">Quản lý Template</h1>

        {/* Announcement banner */}
        <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
          <p>
            <span className="font-semibold">Thông báo:</span> Từ ngày 16/03/2026, Zalo Platforms sẽ thực hiện cập nhật cấu trúc và đơn giá mới cho ZBS Template Message.{" "}
            <a href="#" className="text-blue-600 underline underline-offset-2">Xem chi tiết tại đây.</a>
          </p>
        </div>

        {/* List header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Danh sách Template</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm template..."
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
                <SelectItem value="trang-thai">Trạng thái</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Template list */}
        <div className="divide-y divide-border border border-border rounded-lg bg-white overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Không tìm thấy template nào
            </div>
          ) : (
            filtered.map((t) => {
              const statusCfg = statusConfig[t.status]
              return (
                <div key={t.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                  {/* Template icon */}
                  <TemplateIcon type={t.type} />

                  {/* Left info */}
                  <div className="min-w-0 flex-[2]">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[8px] bg-gray-300">
                          {t.user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate">{t.user}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{t.time}</span>
                    </div>
                  </div>

                  {/* ID + App */}
                  <div className="flex-[2] min-w-0">
                    <p className="text-xs text-muted-foreground">
                      ID mẫu ZBS <span className="font-medium text-foreground">{t.idMau || "–"}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Ứng dụng <span className="font-medium text-foreground">{t.ungDung}</span>
                    </p>
                  </div>

                  {/* Status badge */}
                  <div className="flex-1 flex justify-center">
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      statusCfg.className
                    )}>
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline" size="sm" className="h-8 text-xs"
                      onClick={() => router.push(`${basePath}/cong-cu/gui-tin/${t.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right filter panel */}
      <aside className="w-[220px] shrink-0 border-l border-border bg-white px-4 py-4 overflow-y-auto space-y-3">
        <FilterSection
          title="Lọc theo trạng thái"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "tat-ca", label: "Tất cả" },
            { value: "nhap", label: "Nháp" },
            { value: "dang-duyet", label: "Đang duyệt" },
            { value: "da-duyet", label: "Đã duyệt" },
            { value: "bi-tu-choi", label: "Bị từ chối" },
            { value: "bi-khoa", label: "Bị khoá" },
          ]}
        />
        <FilterSection
          title="Lọc theo loại mẫu ZBS"
          value={filterType}
          onChange={setFilterType}
          options={[
            { value: "tat-ca", label: "Tất cả" },
            { value: "tuy-chinh", label: "Mẫu tuỳ chỉnh" },
            { value: "otp", label: "Mẫu OTP" },
            { value: "danh-gia", label: "Mẫu đánh giá dịch vụ" },
            { value: "thanh-toan", label: "Mẫu yêu cầu thanh toán" },
            { value: "voucher", label: "Mẫu Voucher" },
          ]}
        />
        <FilterSection
          title="Lọc theo mục đích CSKH"
          value={filterMucDich}
          onChange={setFilterMucDich}
          options={[
            { value: "tat-ca", label: "Tất cả" },
            { value: "giao-dich", label: "Giao dịch" },
            { value: "cham-soc", label: "Chăm sóc khách hàng" },
            { value: "hau-mai", label: "Hậu mãi" },
          ]}
        />
      </aside>
    </div>
  )
}
