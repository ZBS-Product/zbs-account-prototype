"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Trash2 } from "lucide-react"

type Purpose = "all" | "giao-dich" | "cskh" | "hau-mai"
type CampStatus = "all" | "nhap" | "hen-gio" | "dang-gui" | "hoan-tat" | "that-bai" | "ngan-sach" | "huy"

interface Campaign {
  id: string
  campId: string
  name: string
  oaName: string
  oaColor: string
  oaInitial: string
  time: string
  status: Exclude<CampStatus, "all">
  templateId: string
  appName: string
  recorded: number
  sent: number
  successRate: number
  totalCost: string
  purpose: Exclude<Purpose, "all">
}

const campaigns: Campaign[] = [
  { id: "1", campId: "50003367599193728", name: "Chiến dịch 08/05/2026", oaName: "Zalo Business Solutions", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "16h31 08/05/2026", status: "hoan-tat", templateId: "577125", appName: "Test ZBS App", recorded: 1, sent: 1, successRate: 100, totalCost: "330 VND", purpose: "giao-dich" },
  { id: "2", campId: "2557324455429294186", name: "Chiến dịch 04/04/2026", oaName: "Qc Test ZNS 4", oaColor: "oklch(0.3 0 0)", oaInitial: "Q", time: "12h55 04/04/2026", status: "hoan-tat", templateId: "561797", appName: "QC Test ZNS 1", recorded: 2, sent: 2, successRate: 100, totalCost: "660 VND", purpose: "cskh" },
  { id: "3", campId: "3965644319137745339", name: "Chiến dịch 17/03/2026", oaName: "Qc Test ZNS 4", oaColor: "oklch(0.3 0 0)", oaInitial: "Q", time: "10h41 17/03/2026", status: "hoan-tat", templateId: "552986", appName: "QC Test ZNS 1", recorded: 2, sent: 2, successRate: 50, totalCost: "880 VND", purpose: "giao-dich" },
  { id: "4", campId: "7577511395879897444", name: "Chiến dịch 16/03/2026", oaName: "Zalo Business Solutions", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "10h42 16/03/2026", status: "hoan-tat", templateId: "552235", appName: "Test ZBS App", recorded: 1, sent: 1, successRate: 100, totalCost: "660 VND", purpose: "hau-mai" },
  { id: "5", campId: "5887474344994387372", name: "Chiến dịch 02/03/2026", oaName: "Zalo Business Solutions", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "16h40 02/03/2026", status: "hoan-tat", templateId: "534072", appName: "Test ZBS App", recorded: 1, sent: 1, successRate: 100, totalCost: "1.210 VND", purpose: "giao-dich" },
  { id: "6", campId: "5995287041548897897", name: "Chiến dịch 10/02/2026", oaName: "ZBS Account", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "11h40 10/02/2026", status: "hoan-tat", templateId: "520786", appName: "ZNS Service", recorded: 1, sent: 1, successRate: 100, totalCost: "330 VND", purpose: "cskh" },
  { id: "7", campId: "1122334455667788990", name: "Chiến dịch 05/01/2026", oaName: "Test ZNS", oaColor: "oklch(0.25 0 0)", oaInitial: "T", time: "09h00 05/01/2026", status: "that-bai", templateId: "510023", appName: "QC Test ZNS 3", recorded: 5, sent: 3, successRate: 0, totalCost: "0 VND", purpose: "giao-dich" },
  { id: "8", campId: "9988776655443322110", name: "Chiến dịch 20/12/2025", oaName: "QC OA 1", oaColor: "oklch(0.55 0.1 150)", oaInitial: "Q", time: "14h20 20/12/2025", status: "huy", templateId: "498761", appName: "QC Test App New", recorded: 0, sent: 0, successRate: 0, totalCost: "0 VND", purpose: "hau-mai" },
  { id: "9", campId: "1029384756473829100", name: "Chiến dịch 15/12/2025", oaName: "Zalo Business Solutions", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "08h30 15/12/2025", status: "nhap", templateId: "495003", appName: "Test ZBS App", recorded: 0, sent: 0, successRate: 0, totalCost: "0 VND", purpose: "cskh" },
  { id: "10", campId: "1122334455000099887", name: "Chiến dịch 10/11/2025", oaName: "ZBS Account", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", time: "10h15 10/11/2025", status: "ngan-sach", templateId: "480115", appName: "ZNS Service", recorded: 100, sent: 40, successRate: 60, totalCost: "13.200 VND", purpose: "giao-dich" },
]

const statusConfig: Record<Exclude<CampStatus, "all">, { label: string; bg: string; color: string }> = {
  nhap:      { label: "Nháp",              bg: "oklch(0.94 0 0)",       color: "oklch(0.45 0 0)" },
  "hen-gio": { label: "Hẹn giờ gửi",      bg: "oklch(0.93 0.08 70)",   color: "oklch(0.55 0.18 60)" },
  "dang-gui":{ label: "Đang gửi",         bg: "oklch(0.93 0.08 220)",  color: "oklch(0.45 0.2 220)" },
  "hoan-tat":{ label: "Hoàn tất",         bg: "oklch(0.92 0.1 150)",   color: "oklch(0.4 0.15 150)" },
  "that-bai":{ label: "Thất bại",         bg: "oklch(0.95 0.05 20)",   color: "oklch(0.5 0.18 20)" },
  "ngan-sach":{ label: "Không đủ ngân sách", bg: "oklch(0.95 0.05 50)", color: "oklch(0.55 0.18 50)" },
  huy:       { label: "Hủy",              bg: "oklch(0.94 0 0)",       color: "oklch(0.5 0 0)" },
}

const purposeLabels: Record<Exclude<Purpose, "all">, string> = {
  "giao-dich": "Giao dịch",
  cskh:        "Chăm sóc khách hàng",
  "hau-mai":   "Hậu mãi",
}

export default function GuiTheoChienDichPage() {
  const [search, setSearch] = useState("")
  const [purpose, setPurpose] = useState<Purpose>("all")
  const [status, setStatus] = useState<CampStatus>("all")

  const filtered = useMemo(() => campaigns.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.campId.includes(q) || c.oaName.toLowerCase().includes(q)
    const matchPurpose = purpose === "all" || c.purpose === purpose
    const matchStatus = status === "all" || c.status === status
    return matchSearch && matchPurpose && matchStatus
  }), [search, purpose, status])

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 h-[calc(100vh-56px)]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Gửi theo chiến dịch</h1>
            <Button className="text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>
              Tạo chiến dịch
            </Button>
          </div>

          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold mb-3">Danh sách chiến dịch</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm theo tên hoặc ID của chiến dịch/ứng dụng/OA" className="pl-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                  <span>Sắp xếp theo:</span>
                  <span className="font-medium text-foreground">Thời gian tạo</span>
                  <span>▾</span>
                </div>
              </div>

              <div className="rounded border border-border bg-white divide-y divide-border">
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-sm text-muted-foreground">Không tìm thấy kết quả</div>
                )}
                {filtered.map((c) => {
                  const s = statusConfig[c.status]
                  return (
                    <div key={c.id} className="flex items-start gap-4 px-5 py-4">
                      {/* Left: campaign info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold">{c.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-0.5">Camp ID <span className="font-semibold text-foreground">{c.campId}</span></div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
                          <div className="h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: c.oaColor }}>{c.oaInitial}</div>
                          {c.oaName}
                        </div>
                        <div className="text-xs text-muted-foreground">⏱ {c.time}</div>
                      </div>

                      {/* Middle: template info */}
                      <div className="w-48 shrink-0 text-xs text-muted-foreground space-y-0.5 pt-0.5">
                        <div>ID mẫu ZBS <span className="font-semibold text-foreground">{c.templateId}</span></div>
                        <div>Ứng dụng <span className="font-semibold text-foreground">{c.appName}</span></div>
                      </div>

                      {/* Right: stats */}
                      <div className="w-44 shrink-0 text-xs text-muted-foreground space-y-0.5 pt-0.5">
                        <div>Đã ghi nhận: <span className="font-semibold text-foreground">{c.recorded}</span></div>
                        <div>Đã gửi: <span className="font-semibold text-foreground">{c.sent} tin SĐT</span></div>
                        <div>Gửi thành công: <span className="font-semibold text-foreground">{c.sent} ({c.successRate}%)</span></div>
                        <div>Tổng chi dự kiến: <span className="font-semibold text-foreground">{c.totalCost}</span></div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-0.5 shrink-0">
                        <button className="text-muted-foreground hover:text-foreground"><Download className="h-4 w-4" /></button>
                        <button className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filter sidebar */}
            <div className="w-52 shrink-0 space-y-4">
              {/* Purpose filter */}
              <div className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between text-sm font-semibold mb-3">
                  Lọc theo mục đích CSKH
                  <span className="text-muted-foreground text-xs">▲</span>
                </div>
                {([["all", "Tất cả"], ["giao-dich", "Giao dịch"], ["cskh", "Chăm sóc khách hàng"], ["hau-mai", "Hậu mãi"]] as const).map(([val, lbl]) => (
                  <button key={val} onClick={() => setPurpose(val)} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${purpose === val ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-accent text-foreground"}`}>
                    {purpose === val && <span className="h-3 w-0.5 rounded bg-blue-600 shrink-0" />}
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between text-sm font-semibold mb-3">
                  Lọc theo trạng thái
                  <span className="text-muted-foreground text-xs">▲</span>
                </div>
                {([
                  ["all", "Tất cả"],
                  ["nhap", "Nháp"],
                  ["hen-gio", "Hẹn giờ gửi"],
                  ["dang-gui", "Đang gửi"],
                  ["hoan-tat", "Hoàn tất"],
                  ["that-bai", "Thất bại"],
                  ["ngan-sach", "Không đủ ngân sách"],
                  ["huy", "Hủy"],
                ] as const).map(([val, lbl]) => (
                  <button key={val} onClick={() => setStatus(val)} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${status === val ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-accent text-foreground"}`}>
                    {status === val && <span className="h-3 w-0.5 rounded bg-blue-600 shrink-0" />}
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
