"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

type Quality = "all" | "tot" | "trung-binh" | "kem"

interface OAItem {
  id: string
  oaId: string
  oaName: string
  oaColor: string
  oaInitial: string
  appName: string
  quality: Exclude<Quality, "all"> | "chua-xac-dinh"
  limit: string
}

const oas: OAItem[] = [
  { id: "1", oaId: "1001243054065825554", oaName: "Trợ lý tin doanh nghiệp", oaColor: "oklch(0.55 0.1 185)", oaInitial: "T", appName: "ZNS Service", quality: "tot", limit: "5.000 tin SĐT" },
  { id: "2", oaId: "3042881048992527255", oaName: "Qc Test ZNS 4", oaColor: "oklch(0.3 0 0)", oaInitial: "Q", appName: "ZNS Service", quality: "tot", limit: "50.000 tin SĐT" },
  { id: "3", oaId: "3886651700907664415", oaName: "Test ZNS", oaColor: "oklch(0.25 0 0)", oaInitial: "T", appName: "QC Test ZNS 3", quality: "tot", limit: "5.000 tin SĐT" },
  { id: "4", oaId: "1088627745287650843", oaName: "ZBS Account", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", appName: "ZNS Service", quality: "tot", limit: "Không giới hạn" },
  { id: "5", oaId: "450688169741866628", oaName: "Zalo Business Solutions", oaColor: "oklch(0.3 0.15 260)", oaInitial: "Z", appName: "Test ZBS App", quality: "tot", limit: "5.000 tin SĐT" },
  { id: "6", oaId: "3408185541672040161", oaName: "QC OA 1", oaColor: "oklch(0.55 0.1 150)", oaInitial: "Q", appName: "QC Test App New", quality: "tot", limit: "50.000 tin SĐT" },
  { id: "7", oaId: "7288188702995453932", oaName: "Hệ thống thu thập thông tin", oaColor: "oklch(0.55 0.12 100)", oaInitial: "H", appName: "zFood - Dev", quality: "chua-xac-dinh", limit: "20.000 tin SĐT" },
  { id: "8", oaId: "2368614949373723201", oaName: "Doanh nghiệp đa năng 3", oaColor: "oklch(0.55 0.1 40)", oaInitial: "D", appName: "zFood - Dev", quality: "chua-xac-dinh", limit: "20.000 tin SĐT" },
  { id: "9", oaId: "2352868362652028486", oaName: "Ngân hàng X", oaColor: "oklch(0.3 0 0)", oaInitial: "N", appName: "ZNS Service", quality: "chua-xac-dinh", limit: "20.000 tin SĐT" },
  { id: "10", oaId: "3757103430892065485", oaName: "Andy Hotel", oaColor: "oklch(0.55 0.18 25)", oaInitial: "A", appName: "Andy Hotel", quality: "chua-xac-dinh", limit: "20.000 tin SĐT" },
  { id: "11", oaId: "9988776655001122334", oaName: "Sarimi Runner DEV", oaColor: "oklch(0.55 0.1 30)", oaInitial: "S", appName: "QC Test ZNS 4", quality: "trung-binh", limit: "10.000 tin SĐT" },
  { id: "12", oaId: "1122334499887766550", oaName: "ZBS Test OA", oaColor: "oklch(0.488 0.243 264.376)", oaInitial: "Z", appName: "Test ZBS App", quality: "kem", limit: "1.000 tin SĐT" },
]

const qualityConfig: Record<OAItem["quality"], { label: string; bg: string; color: string }> = {
  tot:             { label: "Tốt",           bg: "oklch(0.92 0.1 150)",  color: "oklch(0.4 0.15 150)" },
  "trung-binh":    { label: "Trung bình",    bg: "oklch(0.93 0.08 70)",  color: "oklch(0.5 0.18 60)" },
  kem:             { label: "Kém",           bg: "oklch(0.95 0.05 20)",  color: "oklch(0.5 0.18 20)" },
  "chua-xac-dinh": { label: "Chưa xác định", bg: "oklch(0.94 0 0)",     color: "oklch(0.5 0 0)" },
}

export default function ChatLuongGuiTinPage() {
  const [search, setSearch] = useState("")
  const [quality, setQuality] = useState<Quality>("all")

  const filtered = useMemo(() => oas.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.oaName.toLowerCase().includes(q) || o.oaId.includes(q) || o.appName.toLowerCase().includes(q)
    const matchQuality = quality === "all" || (quality === "tot" && o.quality === "tot") || (quality === "trung-binh" && o.quality === "trung-binh") || (quality === "kem" && o.quality === "kem")
    return matchSearch && matchQuality
  }), [search, quality])

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 h-[calc(100vh-56px)]">
          <h1 className="text-2xl font-bold mb-6">Chất lượng gửi tin qua SĐT</h1>

          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold mb-3">Danh sách OA</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Tìm theo tên hoặc ID của ứng dụng/OA" className="pl-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
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
                {filtered.map((item) => {
                  const qc = qualityConfig[item.quality]
                  return (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                      {/* OA info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: item.oaColor }}>
                            {item.oaInitial}
                          </div>
                          <span className="text-sm font-semibold truncate">{item.oaName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-8">ID <span className="font-mono">{item.oaId}</span></div>
                      </div>

                      {/* App + level */}
                      <div className="w-44 shrink-0 text-xs text-muted-foreground space-y-0.5">
                        <div>Ứng dụng <span className="font-semibold text-foreground">{item.appName}</span></div>
                        <div className="flex items-center gap-1">
                          <span>ℹ</span> Cấp độ được gửi <span className="font-semibold text-foreground">1,2,3</span>
                        </div>
                      </div>

                      {/* Quality badge */}
                      <div className="w-28 shrink-0">
                        <span className="inline-block text-xs px-2.5 py-1 rounded font-medium" style={{ background: qc.bg, color: qc.color }}>{qc.label}</span>
                      </div>

                      {/* Limit */}
                      <div className="w-40 shrink-0 text-sm">
                        Hạn mức <span className="font-semibold">{item.limit}</span>
                      </div>

                      {/* Action */}
                      <Button variant="outline" size="sm" className="shrink-0 text-xs h-8" asChild>
                        <Link href={`/cong-cu/gui-tin/chat-luong-gui-tin/${item.id}`}>Xem báo cáo</Link>
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filter sidebar */}
            <div className="w-52 shrink-0">
              <div className="rounded border border-border bg-white p-3">
                <div className="flex items-center justify-between text-sm font-semibold mb-3">
                  Lọc theo chất lượng gửi
                  <span className="text-muted-foreground text-xs">▲</span>
                </div>
                {([["all", "Tất cả"], ["tot", "Tốt"], ["trung-binh", "Trung bình"], ["kem", "Kém"]] as const).map(([val, lbl]) => (
                  <button key={val} onClick={() => setQuality(val)} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${quality === val ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-accent text-foreground"}`}>
                    {quality === val && <span className="h-3 w-0.5 rounded bg-blue-600 shrink-0" />}
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
