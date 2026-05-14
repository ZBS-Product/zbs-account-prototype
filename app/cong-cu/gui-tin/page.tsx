"use client"

import { useState } from "react"
import { Search, Download, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react"
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

type CampaignStatus =
  | "Hoàn tất"
  | "Nháp"
  | "Đang gửi"
  | "Thất bại"
  | "Hẹn giờ gửi"
  | "Không đủ ngân sách"
  | "Hủy"

type Cskh = "Giao dịch" | "Chăm sóc khách hàng" | "Hậu mãi"

interface Campaign {
  id: string
  name: string
  campId: string
  oaName: string
  oaColor: string
  createdAt: string
  templateId: string
  appName: string
  status: CampaignStatus
  ghiNhan: number
  daSent: number
  successRate: number
  tongChi: string
  cskh: Cskh
}

/* ---------- Mock data ---------- */

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Chiến dịch 08/05/2026",
    campId: "50003367599193728",
    oaName: "Zalo Business Solutions",
    oaColor: "oklch(0.45 0.22 265)",
    createdAt: "16h31 08/05/2026",
    templateId: "577125",
    appName: "Test ZBS App",
    status: "Hoàn tất",
    ghiNhan: 1,
    daSent: 1,
    successRate: 100,
    tongChi: "330 VNĐ",
    cskh: "Giao dịch",
  },
  {
    id: "2",
    name: "Chiến dịch 04/04/2026",
    campId: "255732244554929418",
    oaName: "Qc Test ZNS 4",
    oaColor: "#1a1a1a",
    createdAt: "12h55 04/04/2026",
    templateId: "561797",
    appName: "QC Test ZNS 1",
    status: "Hoàn tất",
    ghiNhan: 2,
    daSent: 2,
    successRate: 100,
    tongChi: "660 VNĐ",
    cskh: "Giao dịch",
  },
  {
    id: "3",
    name: "Chiến dịch 17/03/2026",
    campId: "396564443191377453",
    oaName: "Qc Test ZNS 4",
    oaColor: "#1a1a1a",
    createdAt: "10h41 17/03/2026",
    templateId: "552986",
    appName: "QC Test ZNS 1",
    status: "Hoàn tất",
    ghiNhan: 2,
    daSent: 2,
    successRate: 50,
    tongChi: "880 VNĐ",
    cskh: "Chăm sóc khách hàng",
  },
  {
    id: "4",
    name: "Chiến dịch 16/03/2026",
    campId: "757751139589789744",
    oaName: "Zalo Business Solutions",
    oaColor: "oklch(0.45 0.22 265)",
    createdAt: "10h42 16/03/2026",
    templateId: "552235",
    appName: "Test ZBS App",
    status: "Hoàn tất",
    ghiNhan: 1,
    daSent: 1,
    successRate: 100,
    tongChi: "660 VNĐ",
    cskh: "Giao dịch",
  },
  {
    id: "5",
    name: "Chiến dịch 02/03/2026",
    campId: "588747434994387372",
    oaName: "Zalo Business Solutions",
    oaColor: "oklch(0.45 0.22 265)",
    createdAt: "16h40 02/03/2026",
    templateId: "534072",
    appName: "Test ZBS App",
    status: "Hoàn tất",
    ghiNhan: 1,
    daSent: 1,
    successRate: 100,
    tongChi: "1.210 VNĐ",
    cskh: "Hậu mãi",
  },
  {
    id: "6",
    name: "Chiến dịch test hẹn giờ",
    campId: "112233445566778899",
    oaName: "Qc Test ZNS 4",
    oaColor: "#1a1a1a",
    createdAt: "09h00 01/03/2026",
    templateId: "533001",
    appName: "QC Test ZNS 1",
    status: "Hẹn giờ gửi",
    ghiNhan: 50,
    daSent: 0,
    successRate: 0,
    tongChi: "16.500 VNĐ",
    cskh: "Giao dịch",
  },
  {
    id: "7",
    name: "Chiến dịch bị thất bại",
    campId: "998877665544332211",
    oaName: "Qc Test ZNS 4",
    oaColor: "#1a1a1a",
    createdAt: "14h20 20/02/2026",
    templateId: "521000",
    appName: "QC Test ZNS 1",
    status: "Thất bại",
    ghiNhan: 10,
    daSent: 3,
    successRate: 30,
    tongChi: "990 VNĐ",
    cskh: "Chăm sóc khách hàng",
  },
]

/* ---------- Status badge ---------- */

const statusStyles: Record<CampaignStatus, string> = {
  "Hoàn tất": "bg-green-100 text-green-700",
  "Nháp": "bg-gray-100 text-gray-600",
  "Đang gửi": "bg-blue-100 text-blue-700",
  "Thất bại": "bg-red-100 text-red-700",
  "Hẹn giờ gửi": "bg-amber-100 text-amber-700",
  "Không đủ ngân sách": "bg-orange-100 text-orange-700",
  "Hủy": "bg-gray-200 text-gray-500",
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span className={cn("rounded px-2 py-0.5 text-xs font-medium", statusStyles[status])}>
      {status}
    </span>
  )
}

/* ---------- OA avatar ---------- */

function OaAvatar({ name, color }: { name: string; color: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div
      className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

/* ---------- Filter section ---------- */

function FilterSection({
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
    <div className="border-b border-border pb-3 mb-3">
      <button
        className="flex items-center justify-between w-full text-xs font-semibold text-foreground mb-2"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>
      {open && (
        <div className="space-y-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={cn(
                "flex items-center gap-2 w-full rounded px-2 py-1 text-xs text-left transition-colors",
                selected === opt
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              <span
                className={cn(
                  "h-3.5 w-3.5 rounded-sm border flex items-center justify-center shrink-0",
                  selected === opt ? "border-white bg-white/20" : "border-border"
                )}
              >
                {selected === opt && (
                  <span className="block h-1.5 w-1.5 rounded-sm bg-white" />
                )}
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- Page ---------- */

export default function GuiTinPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [cskhFilter, setCskhFilter] = useState("Tất cả")

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.campId.includes(search) ||
      c.oaName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "Tất cả" || c.status === statusFilter
    const matchCskh = cskhFilter === "Tất cả" || c.cskh === cskhFilter
    return matchSearch && matchStatus && matchCskh
  })

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-56px)]">
          <div className="flex h-full">
            {/* Main content */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {/* Title + action */}
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-foreground">Gửi theo chiến dịch</h1>
                <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                  Tạo chiến dịch
                </Button>
              </div>

              {/* List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-foreground">Danh sách chiến dịch</h2>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Tìm theo tên hoặc ID của chiến dịch/ứng dụng/OA"
                        className="pl-8 h-8 w-[320px] text-xs"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>Sắp xếp theo:</span>
                      <Select defaultValue="thoi-gian">
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thoi-gian">Thời gian tạo</SelectItem>
                          <SelectItem value="ten">Tên chiến dịch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Campaign items */}
                <div className="space-y-0 border border-border rounded-lg overflow-hidden bg-white">
                  {filtered.length === 0 && (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      Không có chiến dịch nào phù hợp.
                    </div>
                  )}
                  {filtered.map((c, i) => (
                    <div
                      key={c.id}
                      className={cn(
                        "flex items-start gap-4 px-4 py-3.5",
                        i !== filtered.length - 1 && "border-b border-border"
                      )}
                    >
                      {/* Left: info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{c.name}</span>
                          <StatusBadge status={c.status} />
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">
                          Camp ID {c.campId}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <OaAvatar name={c.oaName} color={c.oaColor} />
                          <span>{c.oaName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>🕐</span>
                          <span>{c.createdAt}</span>
                        </div>
                      </div>

                      {/* Middle: template + app */}
                      <div className="w-52 shrink-0 space-y-1 pt-0.5">
                        <p className="text-xs text-muted-foreground">
                          ID mẫu ZBS{" "}
                          <span className="font-semibold text-foreground">{c.templateId}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ứng dụng <span className="font-semibold text-foreground">{c.appName}</span>
                        </p>
                      </div>

                      {/* Right: stats */}
                      <div className="w-52 shrink-0 space-y-0.5 pt-0.5 text-xs text-muted-foreground">
                        <p>
                          Đã ghi nhận:{" "}
                          <span className="font-medium text-foreground">{c.ghiNhan}</span>
                        </p>
                        <p>
                          Đã gửi:{" "}
                          <span className="font-medium text-foreground">
                            {c.daSent} tin SĐT
                          </span>
                        </p>
                        <p>
                          Gửi thành công:{" "}
                          <span className="font-medium text-foreground">
                            {c.daSent} ({c.successRate}%)
                          </span>
                        </p>
                        <p>
                          Tổng chi dự kiến:{" "}
                          <span className="font-medium text-foreground">{c.tongChi}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right filter panel */}
            <aside className="w-52 shrink-0 border-l border-border p-4 overflow-y-auto">
              <FilterSection
                title="Lọc theo mục đích CSKH"
                options={["Tất cả", "Giao dịch", "Chăm sóc khách hàng", "Hậu mãi"]}
                selected={cskhFilter}
                onSelect={setCskhFilter}
              />
              <FilterSection
                title="Lọc theo trạng thái"
                options={[
                  "Tất cả",
                  "Nháp",
                  "Hẹn giờ gửi",
                  "Đang gửi",
                  "Hoàn tất",
                  "Thất bại",
                  "Không đủ ngân sách",
                  "Hủy",
                ]}
                selected={statusFilter}
                onSelect={setStatusFilter}
              />
            </aside>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
