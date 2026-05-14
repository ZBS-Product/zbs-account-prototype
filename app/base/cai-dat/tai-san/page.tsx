"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const linkedApps = [
  { name: "QC Test ZNS 4", id: "2153836055162768957" },
  { name: "zFormRender", id: "4226882131881490854" },
  { name: "Jellycat", id: "2733222334516797308​6" },
  { name: "Kira Test Official 0605", id: "4175805573181393355" },
  { name: "QC Test App 1", id: "1020067114721279​20" },
  { name: "QC Test ZNS 1", id: "4124674249555570898" },
  { name: "Test ZBS App", id: "4577149973578386200" },
  { name: "Test ứng dụng Hello", id: "3385767450006935358" },
]

const linkedOAs = [
  { name: "ZaloHotel", id: "1196255914348396017", avatar: "H", color: "oklch(0.7 0.13 185)" },
  { name: "QC Zinstant", id: "3389316482662631942", avatar: "Q", color: "oklch(0.6 0.05 285)" },
  { name: "Zalo Business Solutions", id: "4506881697418666​28", avatar: "Z", color: "oklch(0.488 0.243 264.376)" },
  { name: "Zalo Mini App – Đối Tác", id: "4318657068771012646", avatar: "M", color: "oklch(0.488 0.243 264.376)" },
  { name: "Life at team OA", id: "1218843928939179145", avatar: "L", color: "oklch(0.6 0.1 140)" },
  { name: "ZC Internal Support Agent", id: "1366340883771084465", avatar: "ZC", color: "oklch(0.488 0.243 264.376)" },
  { name: "Alert Assistant", id: "1793960537551145​52", avatar: "A", color: "oklch(0.7 0.2 50)" },
  { name: "ZBS Test OA", id: "3852345004858372493", avatar: "ZB", color: "oklch(0.488 0.243 264.376)" },
]

const newOAs = [
  { name: "QC Test OA 1", id: "3408185541672040161", avatar: "Q", color: "oklch(0.6 0.15 30)", status: "link" },
  { name: "Bot Pitrack", id: "3797524600620580047", avatar: "B", color: "oklch(0.488 0.243 264.376)", status: "unverified" },
  { name: "Bot Cá Chúi", id: "2607516281836228452", avatar: "B", color: "oklch(0.488 0.243 264.376)", status: "unverified" },
]

function OaAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

export default function QuanLyTaiSanPage() {
  const [tab, setTab] = useState<"app" | "oa">("app")
  const [appSearch, setAppSearch] = useState("")
  const [oaSearch, setOaSearch] = useState("")
  const [oaPage, setOaPage] = useState(1)
  const oaPageSize = 10

  const filteredApps = linkedApps.filter(
    (a) =>
      a.name.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.id.includes(appSearch)
  )

  const filteredLinkedOAs = linkedOAs.filter(
    (o) =>
      o.name.toLowerCase().includes(oaSearch.toLowerCase()) ||
      o.id.includes(oaSearch)
  )

  const filteredNewOAs = newOAs.filter(
    (o) =>
      o.name.toLowerCase().includes(oaSearch.toLowerCase()) ||
      o.id.includes(oaSearch)
  )

  const totalNewOAs = filteredNewOAs.length
  const pagedNewOAs = filteredNewOAs.slice((oaPage - 1) * oaPageSize, oaPage * oaPageSize)

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          <h1 className="text-2xl font-bold">Quản lý tài sản</h1>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setTab("app")}
              className={`px-4 pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                tab === "app"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={tab === "app" ? { borderBottomColor: "oklch(0.488 0.243 264.376)" } : {}}
            >
              Liên kết ứng dụng
            </button>
            <button
              onClick={() => setTab("oa")}
              className={`px-4 pb-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                tab === "oa"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={tab === "oa" ? { borderBottomColor: "oklch(0.488 0.243 264.376)" } : {}}
            >
              Liên kết OA
            </button>
          </div>

          {/* Tab: Liên kết ứng dụng */}
          {tab === "app" && (
            <div className="space-y-5">
              <p className="text-sm text-foreground">
                Tài khoản ZBS cần liên kết với ứng dụng để ủy quyền sử dụng các tính năng trả phí. Để liên kết ứng dụng, bạn cần có quyền Quản trị viên của ứng dụng đó.
              </p>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Tìm theo tên hoặc ID của ứng dụng"
                  value={appSearch}
                  onChange={(e) => setAppSearch(e.target.value)}
                />
              </div>

              <div className="rounded border border-border bg-white">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-base font-semibold">Ứng dụng đã liên kết</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Tên ứng dụng</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">ID ứng dụng</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((app, i) => (
                      <tr key={app.id} className={i < filteredApps.length - 1 ? "border-b border-border" : ""}>
                        <td className="px-5 py-3">{app.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">{app.id}</td>
                        <td className="px-5 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
                          >
                            Hủy liên kết
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredApps.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                          Không tìm thấy ứng dụng nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Liên kết OA */}
          {tab === "oa" && (
            <div className="space-y-5">
              <p className="text-sm text-foreground">
                Tài khoản ZBS cần liên kết với Official Account (OA) để ủy quyền sử dụng các tính năng trả phí. Để liên kết OA, bạn cần có quyền Quản trị viên của OA đó.
              </p>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Tìm theo tên hoặc ID của OA"
                  value={oaSearch}
                  onChange={(e) => setOaSearch(e.target.value)}
                />
              </div>

              {/* OA đã liên kết */}
              <div className="rounded border border-border bg-white">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-base font-semibold">OA đã liên kết</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Tên tài khoản OA</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">ID tài khoản OA</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLinkedOAs.map((oa, i) => (
                      <tr key={oa.id} className={i < filteredLinkedOAs.length - 1 ? "border-b border-border" : ""}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <OaAvatar name={oa.name} color={oa.color} />
                            <span>{oa.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{oa.id}</td>
                        <td className="px-5 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
                          >
                            Hủy liên kết
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredLinkedOAs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                          Không tìm thấy OA nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Liên kết OA mới */}
              <div className="rounded border border-border bg-white">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="text-base font-semibold">Liên kết OA mới</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Tên tài khoản OA</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">ID tài khoản OA</th>
                      <th className="px-5 py-3 text-left font-semibold text-foreground">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedNewOAs.map((oa, i) => (
                      <tr key={oa.id} className={i < pagedNewOAs.length - 1 ? "border-b border-border" : ""}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <OaAvatar name={oa.name} color={oa.color} />
                            <span>{oa.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{oa.id}</td>
                        <td className="px-5 py-3">
                          {oa.status === "link" ? (
                            <Button variant="secondary" size="sm">
                              Liên kết
                            </Button>
                          ) : (
                            <span className="inline-flex items-center rounded border border-destructive/40 px-2.5 py-1 text-xs font-medium text-destructive bg-destructive/5">
                              OA chưa xác thực
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {pagedNewOAs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-muted-foreground">
                          Không tìm thấy OA nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-border text-sm text-muted-foreground">
                  <span>
                    {totalNewOAs === 0
                      ? "0 mục"
                      : `${(oaPage - 1) * oaPageSize + 1}-${Math.min(oaPage * oaPageSize, totalNewOAs)} trên ${totalNewOAs} mục`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={oaPage === 1}
                      onClick={() => setOaPage((p) => p - 1)}
                    >
                      &lt;
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 font-semibold"
                      style={{ color: "oklch(0.488 0.243 264.376)" }}
                    >
                      {oaPage}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={oaPage * oaPageSize >= totalNewOAs}
                      onClick={() => setOaPage((p) => p + 1)}
                    >
                      &gt;
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{oaPageSize} / trang</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
