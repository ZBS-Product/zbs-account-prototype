"use client"

import { Info, Download, Search } from "lucide-react"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ---------- Mock data ---------- */

const comboData = [
  { date: "11/4", uid: 120, sdt: 60, chiTieu: 400 },
  { date: "13/4", uid: 200, sdt: 80, chiTieu: 700 },
  { date: "15/4", uid: 150, sdt: 100, chiTieu: 550 },
  { date: "17/4", uid: 300, sdt: 120, chiTieu: 900 },
  { date: "19/4", uid: 180, sdt: 90, chiTieu: 650 },
  { date: "21/4", uid: 400, sdt: 150, chiTieu: 1100 },
  { date: "23/4", uid: 220, sdt: 80, chiTieu: 750 },
  { date: "25/4", uid: 350, sdt: 130, chiTieu: 980 },
]

const pieAppData = [
  { name: "App Mua Sắm", value: 35, color: "oklch(0.45 0.22 265)" },
  { name: "App Ví Điện Tử", value: 22, color: "oklch(0.55 0.2 265)" },
  { name: "App Ngân Hàng", value: 18, color: "oklch(0.65 0.18 265)" },
  { name: "App Bán Lẻ", value: 14, color: "oklch(0.7 0.13 185)" },
  { name: "App Giải Trí", value: 8, color: "oklch(0.7 0.2 50)" },
  { name: "Khác", value: 3, color: "oklch(0.8 0.01 0)" },
]

const pieOAData = [
  { name: "OA Thương Mại", value: 40, color: "oklch(0.45 0.22 265)" },
  { name: "OA Tài Chính", value: 25, color: "oklch(0.55 0.2 265)" },
  { name: "OA Dịch Vụ", value: 15, color: "oklch(0.65 0.18 265)" },
  { name: "OA Bán Hàng", value: 12, color: "oklch(0.7 0.13 185)" },
  { name: "OA Giáo Dục", value: 6, color: "oklch(0.7 0.2 50)" },
  { name: "Khác", value: 2, color: "oklch(0.8 0.01 0)" },
]

const tableData = [
  { ngay: "25/04/2026", idMau: "TMP001", tenMau: "Thông báo đơn hàng mới", ungDung: "App Mua Sắm VN", oa: "OA Thương Mại", hinhThuc: "UID", phanLoai: "Giao dịch" },
  { ngay: "24/04/2026", idMau: "TMP002", tenMau: "Xác nhận thanh toán", ungDung: "App Ví Điện Tử", oa: "OA Tài Chính", hinhThuc: "SĐT", phanLoai: "OTP" },
  { ngay: "24/04/2026", idMau: "TMP003", tenMau: "Nhắc nhở nộp phí", ungDung: "App Ngân Hàng", oa: "OA Tài Chính", hinhThuc: "UID", phanLoai: "Chăm sóc" },
  { ngay: "23/04/2026", idMau: "TMP004", tenMau: "Chương trình khuyến mãi", ungDung: "App Bán Lẻ", oa: "OA Bán Hàng", hinhThuc: "SĐT", phanLoai: "Quảng cáo" },
  { ngay: "23/04/2026", idMau: "TMP005", tenMau: "Cập nhật điểm thưởng", ungDung: "App Mua Sắm VN", oa: "OA Thương Mại", hinhThuc: "UID", phanLoai: "Chăm sóc" },
  { ngay: "22/04/2026", idMau: "TMP006", tenMau: "Thông báo vận chuyển", ungDung: "App Mua Sắm VN", oa: "OA Thương Mại", hinhThuc: "UID", phanLoai: "Giao dịch" },
  { ngay: "22/04/2026", idMau: "TMP007", tenMau: "Mã xác minh đăng nhập", ungDung: "App Ví Điện Tử", oa: "OA Tài Chính", hinhThuc: "SĐT", phanLoai: "OTP" },
  { ngay: "21/04/2026", idMau: "TMP008", tenMau: "Ưu đãi cuối tuần", ungDung: "App Giải Trí", oa: "OA Dịch Vụ", hinhThuc: "UID", phanLoai: "Quảng cáo" },
  { ngay: "21/04/2026", idMau: "TMP009", tenMau: "Nhắc lịch sự kiện", ungDung: "App Bán Lẻ", oa: "OA Bán Hàng", hinhThuc: "SĐT", phanLoai: "Chăm sóc" },
  { ngay: "20/04/2026", idMau: "TMP010", tenMau: "Thông báo hoàn tiền", ungDung: "App Ngân Hàng", oa: "OA Tài Chính", hinhThuc: "UID", phanLoai: "Giao dịch" },
]

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " đ"
}

export default function ChiTieuTinTemplatePage() {
  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-56px)]">
          {/* Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-foreground">Chi tiêu tin Template</h1>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-muted-foreground">
              <span>11-04-2026</span>
              <span>→</span>
              <span>25-04-2026</span>
            </div>
            <Select>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="Hình thức gửi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uid">Gửi qua UID</SelectItem>
                <SelectItem value="sdt">Gửi qua SĐT</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] h-9 text-sm">
                <SelectValue placeholder="Phân loại tin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="giao-dich">Giao dịch</SelectItem>
                <SelectItem value="otp">OTP</SelectItem>
                <SelectItem value="cham-soc">Chăm sóc</SelectItem>
                <SelectItem value="quang-cao">Quảng cáo</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-8 h-9 w-[200px] text-sm" />
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      Tổng chi tiêu
                      <Info className="h-3 w-3" />
                    </p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      {formatVND(121216213)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Số tin đã gửi</p>
                <p className="text-2xl font-bold mt-1">{(216213).toLocaleString("vi-VN")}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  Số tin tính phí
                  <Info className="h-3 w-3" />
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">{(31121).toLocaleString("vi-VN")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Combo chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Biểu đồ chi tiêu và số lượng tin</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={comboData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v: number) => `${v}K`}
                    tick={{ fontSize: 11 }}
                    domain={[0, 1200]}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 11 }}
                    domain={[0, 600]}
                  />
                  <Tooltip />
                  <Legend
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        uid: "Tin gửi qua UID",
                        sdt: "Tin gửi qua SĐT",
                        chiTieu: "Tổng chi tiêu",
                      }
                      return labels[value] ?? value
                    }}
                  />
                  <Bar yAxisId="left" dataKey="uid" stackId="a" fill="oklch(0.45 0.22 265)" name="uid" />
                  <Bar yAxisId="left" dataKey="sdt" stackId="a" fill="oklch(0.7 0.13 185)" name="sdt" radius={[3, 3, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="chiTieu"
                    stroke="oklch(0.7 0.2 50)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="chiTieu"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Two pie charts */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chi tiêu theo ứng dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieAppData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieAppData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: unknown) => [`${String(v)}%`, ""]} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span className="text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chi tiêu theo OA</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieOAData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {pieOAData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: unknown) => [`${String(v)}%`, ""]} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span className="text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Data table */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Lịch sử chi tiêu</CardTitle>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs">
                <Download className="h-3 w-3" />
                Xuất file
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>Ngày giao dịch</TableHead>
                    <TableHead>ID mẫu tin</TableHead>
                    <TableHead>Tên mẫu tin</TableHead>
                    <TableHead>Tên ứng dụng</TableHead>
                    <TableHead>Tên OA</TableHead>
                    <TableHead>Hình thức gửi</TableHead>
                    <TableHead>Phân loại tin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, i) => (
                    <TableRow key={i} className="text-xs">
                      <TableCell className="text-muted-foreground">{row.ngay}</TableCell>
                      <TableCell className="font-mono">{row.idMau}</TableCell>
                      <TableCell>{row.tenMau}</TableCell>
                      <TableCell>{row.ungDung}</TableCell>
                      <TableCell>{row.oa}</TableCell>
                      <TableCell>{row.hinhThuc}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 text-[10px]">
                          {row.phanLoai}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">1–10 trên 500 mục</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, "...", 50].map((p, i) => (
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
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
