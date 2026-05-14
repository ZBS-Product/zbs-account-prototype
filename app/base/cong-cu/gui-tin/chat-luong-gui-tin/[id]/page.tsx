"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, ChevronDown, Info } from "lucide-react"
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts"

// ── Mock data per OA ──────────────────────────────────────────────────────────

const oaDetails: Record<string, { name: string; app: string; limit: number; quality: string; totalSent: number }> = {
  "1":  { name: "Trợ lý tin doanh nghiệp", app: "ZNS Service",      limit: 5000,  quality: "Tốt",           totalSent: 120 },
  "2":  { name: "Qc Test ZNS 4",            app: "ZNS Service",      limit: 50000, quality: "Tốt",           totalSent: 120 },
  "3":  { name: "Test ZNS",                 app: "QC Test ZNS 3",    limit: 5000,  quality: "Tốt",           totalSent: 45  },
  "4":  { name: "ZBS Account",              app: "ZNS Service",      limit: 0,     quality: "Tốt",           totalSent: 88  },
  "5":  { name: "Zalo Business Solutions",  app: "Test ZBS App",     limit: 5000,  quality: "Tốt",           totalSent: 67  },
  "6":  { name: "QC OA 1",                  app: "QC Test App New",  limit: 50000, quality: "Tốt",           totalSent: 230 },
  "7":  { name: "Hệ thống thu thập TT",     app: "zFood - Dev",      limit: 20000, quality: "Chưa xác định", totalSent: 12  },
  "8":  { name: "Doanh nghiệp đa năng 3",   app: "zFood - Dev",      limit: 20000, quality: "Chưa xác định", totalSent: 5   },
  "9":  { name: "Ngân hàng X",              app: "ZNS Service",      limit: 20000, quality: "Chưa xác định", totalSent: 30  },
  "10": { name: "Andy Hotel",               app: "Andy Hotel",       limit: 20000, quality: "Chưa xác định", totalSent: 8   },
  "11": { name: "Sarimi Runner DEV",         app: "QC Test ZNS 4",   limit: 10000, quality: "Trung bình",    totalSent: 155 },
  "12": { name: "ZBS Test OA",              app: "Test ZBS App",     limit: 1000,  quality: "Kém",           totalSent: 500 },
}

const chartData = [
  { date: "08/05", gd: 8,   cskh: 0, hm: 0, bx: 0 },
  { date: "09/05", gd: 0,   cskh: 0, hm: 0, bx: 0 },
  { date: "10/05", gd: 0,   cskh: 0, hm: 0, bx: 0 },
  { date: "11/05", gd: 0,   cskh: 0, hm: 0, bx: 0 },
  { date: "12/05", gd: 0,   cskh: 0, hm: 0, bx: 0 },
  { date: "13/05", gd: 112, cskh: 0, hm: 0, bx: 4 },
  { date: "14/05", gd: 0,   cskh: 0, hm: 0, bx: 0 },
]

const historyData = [
  { time: "01/01/2026", type: "Gửi tin SĐT hậu mãi hàng tháng", change: "Tăng", oldLimit: 82, newLimit: 87, reason: "Cập nhật hạn mức gửi tin ZNS hậu mãi hàng tháng" },
]

const LIMIT_STEPS = [
  { label: "1.000",       value: 1000  },
  { label: "5.000",       value: 5000  },
  { label: "20.000",      value: 20000 },
  { label: "50.000",      value: 50000 },
  { label: "Không giới hạn", value: 0 },
]

const qualityColor: Record<string, string> = {
  "Tốt":           "oklch(0.4 0.15 150)",
  "Trung bình":    "oklch(0.5 0.18 60)",
  "Kém":           "oklch(0.5 0.18 20)",
  "Chưa xác định": "oklch(0.5 0 0)",
}

// ── Limit slider ──────────────────────────────────────────────────────────────

function LimitSlider({ currentLimit }: { currentLimit: number }) {
  const currentIdx = currentLimit === 0
    ? 4
    : LIMIT_STEPS.findIndex((s) => s.value === currentLimit)

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold">Hạn mức gửi tin SĐT <Info className="inline h-3.5 w-3.5 text-muted-foreground align-middle" /></span>
      </div>
      <div className="relative mt-6 mb-2">
        {/* Track */}
        <div className="h-0.5 w-full rounded-full" style={{ background: "oklch(0.88 0 0)" }} />
        {/* Active track */}
        <div className="absolute top-0 left-0 h-0.5 rounded-full" style={{ width: `${(currentIdx / (LIMIT_STEPS.length - 1)) * 100}%`, background: "oklch(0.488 0.243 264.376)" }} />
        {/* Milestones */}
        {LIMIT_STEPS.map((step, i) => {
          const pct = (i / (LIMIT_STEPS.length - 1)) * 100
          const isActive = i === currentIdx
          const isPast = i <= currentIdx
          return (
            <div key={step.value} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${pct}%`, transform: "translateX(-50%) translateY(-50%)" }}>
              {isActive && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap" style={{ color: "oklch(0.488 0.243 264.376)" }}>
                  Hạn mức hiện tại
                </div>
              )}
              {/* Marker */}
              <div className={`h-3 w-3 rotate-45 border-2 ${isActive ? "border-blue-600 bg-blue-600" : isPast ? "border-blue-600 bg-white" : "border-gray-300 bg-white"}`} />
              <div className="absolute top-5 text-xs text-muted-foreground whitespace-nowrap font-medium" style={{ color: isActive ? "oklch(0.488 0.243 264.376)" : undefined, fontWeight: isActive ? 700 : undefined }}>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-8" />
      <button className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
        Xem cơ chế tăng hạn mức <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BaoCaoChiTietPage() {
  const { id } = useParams<{ id: string }>()
  const oa = oaDetails[id] ?? oaDetails["2"]
  const [activeTab, setActiveTab] = useState<"Ngày" | "Tuần" | "Tháng">("Ngày")
  const [pageSize] = useState(10)

  const initials = oa.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/cong-cu/gui-tin/chat-luong-gui-tin" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">Báo cáo chất lượng gửi tin SĐT</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "oklch(0.3 0 0)" }}>
                  {initials}
                </div>
                <span className="text-sm font-semibold">{oa.name}</span>
              </div>
              <div className="h-5 w-px bg-border" />
              <span className="text-sm text-muted-foreground">Ứng dụng <span className="font-semibold text-foreground">{oa.app}</span></span>
            </div>
          </div>

          {/* Limit card */}
          <div className="rounded border border-border bg-white p-6">
            <LimitSlider currentLimit={oa.limit} />
          </div>

          {/* Quality summary */}
          <div className="rounded border border-border bg-white p-6">
            <h2 className="text-base font-semibold mb-4">Chất lượng tổng quát</h2>
            <div className="grid grid-cols-2 divide-x divide-border rounded border border-border">
              <div className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Tổng số tin SĐT đã gửi 7 ngày gần nhất</p>
                <p className="text-3xl font-bold">{oa.totalSent}</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Chất lượng gửi tin SĐT 7 ngày gần nhất</p>
                <p className="text-3xl font-bold" style={{ color: qualityColor[oa.quality] }}>{oa.quality}</p>
              </div>
            </div>
          </div>

          {/* Chart card */}
          <div className="rounded border border-border bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-2 text-sm border border-border rounded px-3 py-1.5 hover:bg-gray-50">
                <span>📅</span>
                07-05-2026 → 14-05-2026
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-4 border-b border-border">
              {(["Ngày", "Tuần", "Tháng"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.93 0 0)" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Số tin SĐT", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "oklch(0.55 0 0)" }, dx: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 5]} label={{ value: "Số lượng báo xấu", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "oklch(0.55 0 0)" }, dx: -10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar yAxisId="left" dataKey="gd"   name="Tin giao dịch" stackId="a" fill="oklch(0.45 0.22 265)"  />
                <Bar yAxisId="left" dataKey="cskh" name="Tin CSKH"      stackId="a" fill="oklch(0.65 0.18 150)" />
                <Bar yAxisId="left" dataKey="hm"   name="Tin hậu mãi"   stackId="a" fill="oklch(0.7 0.2 60)"   />
                <Line yAxisId="right" type="monotone" dataKey="bx" name="Số lượng báo xấu" stroke="oklch(0.55 0.22 25)" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>

            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              Số lượng báo xấu từ người nhận sẽ được sử dụng để xét duyệt chất lượng gửi tin SĐT. Tìm hiểu thêm <span className="text-blue-600 cursor-pointer hover:underline">tại đây.</span>
            </p>
          </div>

          {/* History table */}
          <div className="rounded border border-border bg-white p-6">
            <h2 className="text-base font-semibold mb-4">Lịch sử thay đổi</h2>
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-2 text-sm border border-border rounded px-3 py-1.5 hover:bg-gray-50">
                <span>📅</span>
                02-12-2025 → 02-03-2026
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-sm">Thời gian</th>
                    <th className="text-left px-4 py-3 font-semibold text-sm">Loại hạn mức</th>
                    <th className="text-left px-4 py-3 font-semibold text-sm">Thay đổi</th>
                    <th className="text-right px-4 py-3 font-semibold text-sm">Hạn mức cũ</th>
                    <th className="text-right px-4 py-3 font-semibold text-sm">Hạn mức mới</th>
                    <th className="text-left px-4 py-3 font-semibold text-sm">Lý do</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-sm">{row.time}</td>
                      <td className="px-4 py-3 text-sm">{row.type}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block text-xs px-2 py-0.5 rounded font-medium" style={{ background: "oklch(0.92 0.1 150)", color: "oklch(0.4 0.15 150)" }}>
                          {row.change}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{row.oldLimit}</td>
                      <td className="px-4 py-3 text-sm text-right">{row.newLimit}</td>
                      <td className="px-4 py-3 text-sm">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>1-{historyData.length} trên {historyData.length} mục</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 rounded border border-border flex items-center justify-center text-xs hover:bg-gray-50 disabled:opacity-40" disabled>‹</button>
                  <button className="h-7 w-7 rounded flex items-center justify-center text-xs font-semibold text-white" style={{ background: "oklch(0.488 0.243 264.376)" }}>1</button>
                  <button className="h-7 w-7 rounded border border-border flex items-center justify-center text-xs hover:bg-gray-50 disabled:opacity-40" disabled>›</button>
                </div>
                <div className="relative">
                  <select className="appearance-none border border-border rounded px-2 py-1 text-xs pr-6 bg-white focus:outline-none">
                    <option>10 / trang</option>
                    <option>20 / trang</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
