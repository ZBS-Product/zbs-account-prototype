"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

const barData = [
  { date: "06/05", guiTin: 1200, oa: 0, ai: 0 },
  { date: "07/05", guiTin: 2100, oa: 0, ai: 80 },
  { date: "08/05", guiTin: 1800, oa: 200, ai: 0 },
  { date: "09/05", guiTin: 2600, oa: 0, ai: 120 },
  { date: "10/05", guiTin: 900, oa: 0, ai: 0 },
  { date: "11/05", guiTin: 1500, oa: 0, ai: 0 },
  { date: "12/05", guiTin: 2200, oa: 300, ai: 60 },
  { date: "13/05", guiTin: 1100, oa: 0, ai: 0 },
  { date: "14/05", guiTin: 1900, oa: 0, ai: 100 },
]

const chartConfig = {
  guiTin: { label: "Dịch vụ gửi tin", color: "oklch(0.45 0.22 265)" },
  oa: { label: "Dịch vụ OA", color: "oklch(0.7 0.2 50)" },
  ai: { label: "Dịch vụ AI", color: "oklch(0.7 0.13 185)" },
} satisfies ChartConfig

const pieData = [
  { name: "Dịch vụ gửi tin", value: 14288430, color: "oklch(0.45 0.22 265)" },
  { name: "Dịch vụ OA", value: 1, color: "oklch(0.7 0.2 50)" },
  { name: "Dịch vụ AI", value: 1, color: "oklch(0.7 0.13 185)" },
]

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " đ"
}

export default function TongQuanPage() {
  const [activeTab, setActiveTab] = useState("ngay")

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <h1 className="text-xl font-semibold text-foreground">Tổng quan</h1>

          {/* Date range + total */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
              <span>07-05-2026</span>
              <span>→</span>
              <span>14-05-2026</span>
            </div>
            <div className="flex-1" />
            <div className="text-sm text-muted-foreground">
              Tổng chi tiêu:{" "}
              <span className="font-semibold text-foreground">
                {formatVND(14288430.2)}
              </span>
            </div>
          </div>

          {/* Tabs + download */}
          <div className="flex items-center gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-8">
                <TabsTrigger value="ngay" className="text-xs px-3">Ngày</TabsTrigger>
                <TabsTrigger value="tuan" className="text-xs px-3">Tuần</TabsTrigger>
                <TabsTrigger value="thang" className="text-xs px-3">Tháng</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex-1" />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Stacked bar chart */}
          <Card>
            <CardContent className="pt-4">
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                    tick={{ fontSize: 11 }}
                    domain={[0, 3000]}
                  />
                  <ChartTooltip
                    formatter={(value: unknown, name: unknown) => [
                      `${String(value).toLocaleString()}K đ`,
                      chartConfig[name as keyof typeof chartConfig]?.label ?? String(name),
                    ]}
                  />
                  <Bar dataKey="guiTin" stackId="a" fill="oklch(0.45 0.22 265)" />
                  <Bar dataKey="oa" stackId="a" fill="oklch(0.7 0.2 50)" />
                  <Bar dataKey="ai" stackId="a" fill="oklch(0.7 0.13 185)" radius={[3, 3, 0, 0]} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bottom two cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tổng chi tiêu theo dịch vụ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Dịch vụ gửi tin", value: 14288430.2, color: "oklch(0.45 0.22 265)" },
                  { label: "Dịch vụ OA", value: 0, color: "oklch(0.7 0.2 50)" },
                  { label: "Dịch vụ AI", value: 0, color: "oklch(0.7 0.13 185)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <div
                      className="h-3 w-3 rounded-sm shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1 text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{formatVND(item.value)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">Biểu đồ chi tiêu theo dịch vụ</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: unknown, name: unknown) => [
                        String(name) === "Dịch vụ gửi tin" ? formatVND(14288430.2) : "0 đ",
                        String(name),
                      ]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span className="text-xs text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
