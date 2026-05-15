"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Trash2, UserPlus, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Member = {
  id: number
  assignedAt: string | null
  name: string
  role: string
}

const allMembers: Member[] = [
  { id: 1,  assignedAt: "25/07/2024 09:56", name: "Hiến",            role: "Quản trị viên" },
  { id: 2,  assignedAt: null,               name: "Nguyen Trong Tai", role: "Quản trị viên" },
  { id: 3,  assignedAt: "03/04/2025 16:16", name: "Nguyễn Hữu Phát", role: "Quản trị viên" },
  { id: 4,  assignedAt: "14/01/2025 17:01", name: "Anh Trần",         role: "Quản trị viên" },
  { id: 5,  assignedAt: "13/05/2026 14:02", name: "Heal",             role: "Biên tập viên" },
  { id: 6,  assignedAt: "13/05/2026 14:08", name: "Kien Nguyen",      role: "Biên tập viên" },
  { id: 7,  assignedAt: null,               name: "Vịnh Lưu",         role: "Quản trị viên" },
  { id: 8,  assignedAt: "30/10/2025 09:53", name: "Hieutm",           role: "Quản trị viên" },
  { id: 9,  assignedAt: "01/12/2025 12:06", name: "Hân",              role: "Quản trị viên" },
  { id: 10, assignedAt: "29/10/2025 17:35", name: "Xuân Yến",         role: "Quản trị viên" },
  { id: 11, assignedAt: "02/03/2025 08:20", name: "Minh Châu",        role: "Tài chính viên" },
  { id: 12, assignedAt: "15/06/2024 11:45", name: "Bảo Trân",         role: "Quản trị viên" },
  { id: 13, assignedAt: "07/09/2025 10:00", name: "Long Nguyễn",      role: "Biên tập viên" },
  { id: 14, assignedAt: null,               name: "Thùy Linh",        role: "Tài chính viên" },
  { id: 15, assignedAt: "20/11/2024 14:30", name: "Đức Anh",          role: "Quản trị viên" },
  { id: 16, assignedAt: "05/02/2026 09:15", name: "Phương Thảo",      role: "Biên tập viên" },
  { id: 17, assignedAt: "18/08/2025 16:22", name: "Tuấn Kiệt",        role: "Quản trị viên" },
  { id: 18, assignedAt: "12/12/2024 13:00", name: "Thu Hương",        role: "Tài chính viên" },
  { id: 19, assignedAt: null,               name: "Gia Huy",          role: "Quản trị viên" },
  { id: 20, assignedAt: "27/03/2025 11:10", name: "Ngọc Mai",         role: "Biên tập viên" },
  { id: 21, assignedAt: "09/07/2024 08:45", name: "Văn Tùng",         role: "Quản trị viên" },
  { id: 22, assignedAt: "23/01/2026 15:30", name: "Hoài An",          role: "Biên tập viên" },
  { id: 23, assignedAt: "11/05/2025 10:20", name: "Thanh Bình",       role: "Quản trị viên" },
  { id: 24, assignedAt: null,               name: "Hồng Nhung",       role: "Tài chính viên" },
  { id: 25, assignedAt: "04/10/2025 09:00", name: "Quốc Bảo",         role: "Quản trị viên" },
  { id: 26, assignedAt: "16/04/2026 14:55", name: "Lan Anh",          role: "Biên tập viên" },
  { id: 27, assignedAt: "28/06/2024 11:00", name: "Trọng Nghĩa",      role: "Quản trị viên" },
  { id: 28, assignedAt: "03/11/2025 08:30", name: "Diệu Linh",        role: "Tài chính viên" },
  { id: 29, assignedAt: null,               name: "Minh Khoa",        role: "Quản trị viên" },
  { id: 30, assignedAt: "21/02/2025 13:45", name: "Yến Nhi",          role: "Biên tập viên" },
  { id: 31, assignedAt: "08/08/2025 10:10", name: "Tiến Đạt",         role: "Quản trị viên" },
  { id: 32, assignedAt: "17/03/2026 09:25", name: "Phúc Nguyên",      role: "Biên tập viên" },
  { id: 33, assignedAt: null,               name: "Tuyết Mai",        role: "Tài chính viên" },
  { id: 34, assignedAt: "10/09/2024 16:40", name: "Bình Minh",        role: "Quản trị viên" },
  { id: 35, assignedAt: "25/12/2025 12:00", name: "Khánh Linh",       role: "Biên tập viên" },
  { id: 36, assignedAt: "06/06/2025 08:50", name: "Hoàng Nam",        role: "Quản trị viên" },
  { id: 37, assignedAt: null,               name: "Ánh Tuyết",        role: "Tài chính viên" },
  { id: 38, assignedAt: "19/01/2026 11:35", name: "Trường Giang",     role: "Quản trị viên" },
  { id: 39, assignedAt: "31/07/2025 15:00", name: "Nhật Hào",         role: "Biên tập viên" },
  { id: 40, assignedAt: "14/04/2026 10:45", name: "Thu Trang",        role: "Quản trị viên" },
]

const roles = ["Tất cả", "Quản trị viên", "Biên tập viên", "Tài chính viên"]
const pageSizes = [10, 20, 50]

export default function QuanLyThanhVienPage() {
  const [members, setMembers] = useState(allMembers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("Tất cả")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = members.filter((m) => {
    const matchName = m.name.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "Tất cả" || m.role === roleFilter
    return matchName && matchRole
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, filtered.length)

  function deleteMember(id: number) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function changePage(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Danh sách thành viên</h1>
            <Button style={{ background: "oklch(0.488 0.243 264.376)" }} className="text-white hover:opacity-90">
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm thành viên
            </Button>
          </div>

          {/* Search + Filter */}
          <div className="flex items-center gap-4">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm tên thành viên"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Lọc theo</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-44 justify-between font-normal">
                    {roleFilter}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {roles.map((r) => (
                    <DropdownMenuItem
                      key={r}
                      onSelect={() => { setRoleFilter(r); setPage(1) }}
                      className={roleFilter === r ? "font-semibold" : ""}
                    >
                      {r}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="rounded border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left font-semibold w-48">Ngày phân quyền</th>
                  <th className="px-5 py-3 text-left font-semibold">Tên thành viên</th>
                  <th className="px-5 py-3 text-left font-semibold w-48">Vai trò</th>
                  <th className="px-5 py-3 text-left font-semibold w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((m, i) => (
                  <tr key={m.id} className={i < paged.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-5 py-3 text-muted-foreground">{m.assignedAt ?? "–"}</td>
                    <td className="px-5 py-3">{m.name}</td>
                    <td className="px-5 py-3 font-semibold">{m.role}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteMember(m.id)}
                        className="flex items-center gap-1.5 text-sm text-destructive hover:opacity-80 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa thành viên
                      </button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                      Không tìm thấy thành viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border text-sm text-muted-foreground">
              <span>{filtered.length === 0 ? "0 mục" : `${start}–${end} trên ${filtered.length} mục`}</span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  &lt;
                </Button>
                {pageNumbers.map((p, idx) => {
                  const prev = pageNumbers[idx - 1]
                  return (
                    <span key={p} className="flex items-center gap-1">
                      {prev && p - prev > 1 && <span className="px-1">…</span>}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                >
                  &gt;
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 font-normal">
                    {pageSize} / trang
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pageSizes.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onSelect={() => { setPageSize(s); setPage(1) }}
                      className={pageSize === s ? "font-semibold" : ""}
                    >
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
