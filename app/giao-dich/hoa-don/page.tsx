"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, CalendarDays, Info, Pencil, Download, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Invoice = {
  id: number
  date: string
  invoiceNo: string
  company: string
  mst: string
  address: string
  channel: string
  total: number
  exported: boolean
}

const companies = [
  { name: "Công ty Cổ Phần VNN",          address: "12 Tran Hung Dao Street, District 5, Ho Chi Minh City" },
  { name: "Công ty Cổ Phần Minh Phát",    address: "34 Le Duan Street, Hai Chau District, Da Nang" },
  { name: "Công ty TNHH Sao Mai",         address: "42 Bach Dang Street, District 1, Da Nang" },
  { name: "Công ty TNHH Ánh Dương",       address: "88 Le Loi Street, District 1, Hue" },
  { name: "Công ty TNHH Ngân Hà",         address: "23 Phan Boi Chau Street, Hoi An, Quang Nam" },
  { name: "Công ty TNHH Đại Dương Xanh",  address: "15 Hoang Dieu Street, Hai Chau District, Da Nang" },
  { name: "Công ty TNHH Cửu Long",        address: "76 Tran Phu Street, Nha Trang, Khanh Hoa" },
  { name: "Công ty TNHH Sông Hồng",       address: "5 Nguyen Hue Street, District 1, Ho Chi Minh City" },
  { name: "Công ty TNHH Lam Sơn",         address: "99 Vo Van Tan Street, District 3, Ho Chi Minh City" },
  { name: "Công ty TNHH Trường Sơn",      address: "45 Dien Bien Phu Street, Ba Dinh District, Hanoi" },
  { name: "Công ty CP Bình Minh",         address: "10 Ly Thuong Kiet Street, Hoan Kiem, Hanoi" },
  { name: "Công ty TNHH Hải Vân",         address: "33 Nguyen Van Linh Street, Nam Tu Liem, Hanoi" },
  { name: "Công ty CP Phú Quý",           address: "67 Tran Duy Hung Street, Cau Giay, Hanoi" },
  { name: "Công ty TNHH Thiên Long",      address: "21 Hoang Van Thu Street, Phu Nhuan, Ho Chi Minh City" },
  { name: "Công ty CP Đông Á",            address: "8 Nguyen Thi Minh Khai Street, District 3, HCMC" },
  { name: "Công ty TNHH Vạn Xuân",        address: "55 Cach Mang Thang 8 Street, Tan Binh, HCMC" },
  { name: "Công ty CP Hoàng Gia",         address: "18 Ba Trieu Street, Hai Ba Trung, Hanoi" },
  { name: "Công ty TNHH Kim Ngân",        address: "90 Pham Ngoc Thach Street, District 3, HCMC" },
  { name: "Công ty CP Mê Kông",           address: "14 Le Van Sy Street, District 3, Ho Chi Minh City" },
  { name: "Công ty TNHH Bảo Châu",        address: "38 Nguyen Dinh Chieu Street, District 1, HCMC" },
]

const channels = ["Zalopay", "Zalopay", "Zalopay", "Chuyển khoản nhanh", "Zalopay", "Chuyển khoản nhanh"]
const invoiceNos = ["KI54738291", "KI54738292", "KI54738293", "KI54738294", "KI54738295"]
const mstBase = ["5296140837", "3109872456", "0312456789", "4201938475", "7834591026"]

function generateInvoices(): Invoice[] {
  const result: Invoice[] = []
  const dates = ["31/01/2026", "30/01/2026", "29/01/2026", "28/01/2026", "27/01/2026"]
  const totals = [300000, 11300000, 2300000, 4900600, 6700400, 8100200, 2500700, 7800900, 1200300, 3400500,
                  5600000, 9200000, 1800000, 4100000, 7300000, 2900000, 6500000, 3700000, 8900000, 1500000]
  for (let i = 0; i < 500; i++) {
    const co = companies[i % companies.length]
    result.push({
      id: i + 1,
      date: dates[Math.floor(i / 10) % dates.length],
      invoiceNo: invoiceNos[i % invoiceNos.length],
      company: co.name,
      mst: mstBase[i % mstBase.length],
      address: co.address,
      channel: channels[i % channels.length],
      total: totals[i % totals.length],
      exported: i % 3 !== 0,
    })
  }
  return result
}

const allInvoices = generateInvoices()

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

function truncate(s: string, len = 45) {
  return s.length > len ? s.slice(0, len) + "..." : s
}

const pageSizes = [10, 20, 50]

export default function QuanLyHoaDonPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = allInvoices.filter(
    (inv) =>
      search === "" ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, filtered.length)

  const totalAmount = allInvoices.reduce((s, inv) => s + inv.total, 0)

  function changePage(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  const pageNumbers = (() => {
    const pages: number[] = []
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 2 || i > totalPages - 2 || Math.abs(i - currentPage) <= 1) pages.push(i)
    }
    return pages.slice(0, 7)
  })()

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Quản lý hóa đơn</h1>
            <p className="mt-1 text-sm text-muted-foreground">Quản lý thông tin hóa đơn giao dịch</p>
          </div>

          {/* Date range + Search */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 rounded border border-border bg-white px-3 py-2 text-sm hover:bg-accent transition-colors">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              11/04/2022 – 25/04/2022
            </button>
            <div className="relative ml-auto w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm theo số hóa đơn VAT"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-0 rounded border border-border bg-white">
            <div className="px-6 py-5 border-r border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                Tổng số hóa đơn
                <Info className="h-3.5 w-3.5" />
              </div>
              <p className="text-2xl font-bold">{allInvoices.length}</p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                Tổng số tiền xuất hóa đơn (VNĐ)
                <Info className="h-3.5 w-3.5" />
              </div>
              <p className="text-2xl font-bold">{totalAmount.toLocaleString("vi-VN")}</p>
            </div>
          </div>

          {/* Detail section */}
          <div className="rounded border border-border bg-white">
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <h2 className="text-base font-semibold mb-2">Chi tiết hoá đơn</h2>
              <ul className="space-y-0.5 text-sm text-muted-foreground list-disc list-inside">
                <li>Giao dịch trước 21h: hóa đơn được xuất vào 21h cùng ngày, có thể điều chỉnh thông tin trước thời gian này</li>
                <li>Giao dịch sau 21h cùng ngày: hóa đơn được xuất vào thời điểm phát sinh</li>
                <li>Thông tin hóa đơn có thể hiển thị trễ do quá trình đồng bộ. Vui lòng chờ và kiểm tra lại sau</li>
              </ul>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold w-32">Ngày xuất</th>
                  <th className="px-4 py-3 text-left font-semibold w-32">Số hoá đơn</th>
                  <th className="px-4 py-3 text-left font-semibold">Thông tin xuất hóa đơn</th>
                  <th className="px-4 py-3 text-left font-semibold w-40">Kênh thanh toán</th>
                  <th className="px-4 py-3 text-right font-semibold w-36">Tổng tiền (có VAT)</th>
                  <th className="px-4 py-3 text-left font-semibold w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((inv, i) => (
                  <tr key={inv.id} className={i < paged.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                    <td className="px-4 py-3">{inv.invoiceNo}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{inv.company}</p>
                      <p className="text-muted-foreground">MST: {inv.mst}</p>
                      <p className="text-muted-foreground">{truncate(inv.address)}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{inv.channel}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmtVND(inv.total)}</td>
                    <td className="px-4 py-3">
                      {inv.exported ? (
                        <div className="space-y-1.5">
                          <div>
                            <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold bg-[oklch(0.93_0.06_145)] text-[oklch(0.38_0.12_145)]">
                              Đã xuất HĐ
                            </span>
                          </div>
                          <button className="flex items-center gap-1 text-xs text-[oklch(0.488_0.243_264.376)] hover:opacity-80">
                            <Download className="h-3.5 w-3.5" />
                            Tải xuống
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground">Chưa xuất HĐ</p>
                          <button className="flex items-center gap-1 text-xs text-[oklch(0.488_0.243_264.376)] hover:opacity-80">
                            <Pencil className="h-3.5 w-3.5" />
                            Chỉnh sửa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                      Không tìm thấy hóa đơn nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border text-sm text-muted-foreground">
              <span>{filtered.length === 0 ? "0 mục" : `${start}–${end} trên ${filtered.length} mục`}</span>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>
                  &lt;
                </Button>
                {pageNumbers.map((p, idx) => {
                  const prev = pageNumbers[idx - 1]
                  return (
                    <span key={p} className="flex items-center gap-1">
                      {prev && p - prev > 1 && <span className="px-0.5 text-muted-foreground">...</span>}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        style={currentPage === p ? { color: "oklch(0.488 0.243 264.376)", fontWeight: 700, background: "oklch(0.93 0.04 264)" } : {}}
                        onClick={() => changePage(p)}
                      >
                        {p}
                      </Button>
                    </span>
                  )
                })}
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>
                  &gt;
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 font-normal">
                    {pageSize} / trang <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pageSizes.map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => { setPageSize(s); setPage(1) }} className={pageSize === s ? "font-semibold" : ""}>
                      {s} / trang
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
