"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Search, ImageOff } from "lucide-react"

type LogoStatus = "has" | "none"

interface LogoItem {
  id: string
  oaName: string
  oaColor: string
  oaInitial: string
  appName: string
  time: string
  lightLogo: string | null
  darkLogo: string | null
}

const logos: LogoItem[] = [
  { id: "1", oaName: "Qc Test ZNS 4", oaColor: "oklch(0.3 0 0)", oaInitial: "Q", appName: "QC Test ZNS 1", time: "10h50 06/05/2026", lightLogo: "ATP", darkLogo: "ATP" },
  { id: "2", oaName: "ZBS Test OA", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", appName: "Test ZBS App", time: "15h27 11/02/2026", lightLogo: "ZBS", darkLogo: "ZBS" },
  { id: "3", oaName: "Zalo Business Solutions", oaColor: "oklch(0.3 0.15 260)", oaInitial: "Z", appName: "Test ZBS App", time: "14h24 23/01/2026", lightLogo: "ZBS", darkLogo: "ZBS" },
  { id: "4", oaName: "QC OA 1", oaColor: "oklch(0.55 0.1 150)", oaInitial: "Q", appName: "QC Test App New", time: "11h36 11/12/2025", lightLogo: "BVMQT", darkLogo: "BVMQT" },
  { id: "5", oaName: "Qc Test ZNS 3", oaColor: "oklch(0.3 0 0)", oaInitial: "Q", appName: "QC Test ZNS 1", time: "14h10 01/12/2025", lightLogo: "BVMQT", darkLogo: "BVMQT" },
  { id: "6", oaName: "Test ZNS", oaColor: "oklch(0.25 0 0)", oaInitial: "T", appName: "QC Test ZNS 3", time: "13h45 18/09/2025", lightLogo: "VNA", darkLogo: "VNA" },
  { id: "7", oaName: "Sarimi Runner DEV", oaColor: "oklch(0.55 0.1 30)", oaInitial: "S", appName: "QC Test ZNS 4", time: "11h12 10/07/2025", lightLogo: "ZNS", darkLogo: "PROPZY" },
  { id: "8", oaName: "Sarimi Runner DEV", oaColor: "oklch(0.55 0.1 30)", oaInitial: "S", appName: "Sarimi Runner", time: "12h42 25/06/2025", lightLogo: "ZNS", darkLogo: null },
  { id: "9", oaName: "ZBS Account", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", appName: "ZNS Service", time: "09h15 10/05/2025", lightLogo: null, darkLogo: null },
  { id: "10", oaName: "Ngân hàng X", oaColor: "oklch(0.3 0 0)", oaInitial: "N", appName: "ZNS Service", time: "08h00 01/03/2025", lightLogo: null, darkLogo: null },
]

const logoColors: Record<string, { bg: string; text: string; label: string }> = {
  ATP:    { bg: "oklch(0.2 0.02 40)", text: "oklch(0.75 0.2 45)", label: "ATP SOFTWARE" },
  ZBS:    { bg: "oklch(0.98 0 0)", text: "oklch(0.488 0.243 264.376)", label: "Zalo Business Solutions" },
  BVMQT: { bg: "oklch(0.98 0 0)", text: "oklch(0.45 0.17 200)", label: "Bệnh viện Mắt Quốc tế" },
  VNA:   { bg: "oklch(0.98 0 0)", text: "oklch(0.45 0.12 45)", label: "Vietnam Airlines" },
  ZNS:   { bg: "oklch(0.98 0 0)", text: "oklch(0.488 0.243 264.376)", label: "Zalo Notification" },
  PROPZY:{ bg: "oklch(0.18 0.02 40)", text: "oklch(0.75 0.15 50)", label: "PROPZY" },
}

function LogoBox({ code, dark }: { code: string | null; dark?: boolean }) {
  if (!code) {
    return (
      <div className="w-28 h-16 rounded border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground" style={{ background: dark ? "oklch(0.15 0 0)" : "oklch(0.97 0 0)" }}>
        <ImageOff className="h-4 w-4 opacity-40" />
        <span className="text-[10px] opacity-40">Chưa có</span>
      </div>
    )
  }
  const c = logoColors[code] ?? { bg: "oklch(0.97 0 0)", text: "oklch(0.4 0 0)", label: code }
  const bg = dark ? "oklch(0.15 0 0)" : c.bg
  return (
    <div className="w-28 h-16 rounded border border-border flex items-center justify-center px-2" style={{ background: bg }}>
      <span className="text-xs font-bold text-center leading-tight" style={{ color: dark ? "white" : c.text }}>{c.label}</span>
    </div>
  )
}

export default function QuanLyLogoPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "has" | "none">("all")

  const filtered = logos.filter((l) => {
    const q = search.toLowerCase()
    const matchSearch = !q || l.oaName.toLowerCase().includes(q) || l.appName.toLowerCase().includes(q) || l.id.includes(q)
    const hasLogo = l.lightLogo !== null || l.darkLogo !== null
    const matchFilter = filter === "all" || (filter === "has" && hasLogo) || (filter === "none" && !hasLogo)
    return matchSearch && matchFilter
  })

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 h-[calc(100vh-56px)]">
          <h1 className="text-2xl font-bold mb-6">Quản lý logo</h1>

          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold mb-3">Danh sách logo</h2>
              <div className="relative mb-4 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc ID của ứng dụng/OA"
                  className="pl-9 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="rounded border border-border bg-white divide-y divide-border">
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-sm text-muted-foreground">Không tìm thấy kết quả</div>
                )}
                {filtered.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                    {/* OA info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: item.oaColor }}>
                          {item.oaInitial}
                        </div>
                        <span className="text-sm font-semibold truncate">{item.oaName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground pl-8">Ứng dụng <span className="font-semibold text-foreground">{item.appName}</span></div>
                      <div className="text-xs text-muted-foreground pl-8 flex items-center gap-1 mt-0.5">
                        <span>⏱</span>{item.time}
                      </div>
                    </div>

                    {/* Logo boxes */}
                    <div className="flex items-center gap-3 shrink-0">
                      <LogoBox code={item.lightLogo} dark={false} />
                      <LogoBox code={item.darkLogo} dark={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter sidebar */}
            <div className="w-52 shrink-0">
              <div className="rounded border border-border bg-white p-3">
                <button
                  className="flex w-full items-center justify-between text-sm font-semibold mb-3"
                  onClick={() => {}}
                >
                  Lọc theo trạng thái
                  <span className="text-muted-foreground text-xs">▲</span>
                </button>
                {[
                  { value: "all", label: "Tất cả" },
                  { value: "has", label: "Đã có logo" },
                  { value: "none", label: "Chưa có logo" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value as "all" | "has" | "none")}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                      filter === opt.value
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "hover:bg-accent text-foreground"
                    }`}
                  >
                    {filter === opt.value && <span className="h-3 w-0.5 rounded bg-blue-600 shrink-0" />}
                    {opt.label}
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
