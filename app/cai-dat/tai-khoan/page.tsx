"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fields = [
  { label: "Mã khách hàng",             key: "maKhachHang",    value: "ZNS-Test-112326" },
  { label: "Mã hợp đồng",               key: "maHopDong",      value: "" },
  { label: "Tên công ty",               key: "tenCongTy",      value: "Test Công Ty ABC" },
  { label: "Mã số thuế",                key: "maSoThue",       value: "32323282453233" },
  { label: "Địa chỉ công ty",           key: "diaChi",         value: "Số 44 Đường 16, Phường Tân Hưng, Thành phố Hồ Chí Minh, Việt Nam" },
  { label: "Tên người đại diện",        key: "nguoiDaiDien",   value: "Test Công Ty 1 31 1" },
  { label: "Số điện thoại doanh nghiệp", key: "soDienThoai",   value: "02437959595" },
  { label: "Email doanh nghiệp",        key: "email",          value: "abc@gmail.com" },
]

export default function ThongTinTaiKhoanPage() {
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState(Object.fromEntries(fields.map((f) => [f.key, f.value])))
  const [draft, setDraft] = useState({ ...data })

  function startEdit() {
    setDraft({ ...data })
    setEditing(true)
  }

  function save() {
    setData({ ...draft })
    setEditing(false)
  }

  function cancel() {
    setEditing(false)
  }

  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Thông tin tài khoản</h1>
            {editing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={cancel}>Hủy</Button>
                <Button onClick={save} style={{ background: "oklch(0.488 0.243 264.376)" }} className="text-white hover:opacity-90">
                  Lưu thay đổi
                </Button>
              </div>
            ) : (
              <Button onClick={startEdit} style={{ background: "oklch(0.488 0.243 264.376)" }} className="text-white hover:opacity-90">
                Chỉnh sửa
              </Button>
            )}
          </div>

          <div className="rounded border border-border bg-white">
            {fields.map((f, i) => (
              <div
                key={f.key}
                className={`grid grid-cols-[220px_1fr] items-center px-6 py-4 ${i < fields.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-sm font-semibold">{f.label}</span>
                {editing ? (
                  <Input
                    value={draft[f.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                    className="max-w-md"
                    placeholder={`Nhập ${f.label.toLowerCase()}`}
                  />
                ) : (
                  <span className="text-sm text-foreground">{data[f.key] || <span className="text-muted-foreground">—</span>}</span>
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground space-y-1.5">
            <p className="font-semibold text-foreground">Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li>
                Yêu cầu doanh nghiệp nhập đúng thông tin "Tên người đại diện" giống với CMND/CCCD và cung cấp các thông tin khác chính xác bằng Tiếng Việt có dấu (đối với thông tin tiếng Việt). Zalo Business Solutions sẽ không chịu trách nhiệm hoặc sẽ hủy bỏ hóa đơn đã xuất nếu có sai sót thông tin.
              </li>
              <li>
                Dữ liệu doanh nghiệp sẽ được Zalo Business Solutions sử dụng để liên lạc và hỗ trợ doanh nghiệp. Để yêu cầu thu hồi thông tin này, vui lòng gửi email tới{" "}
                <a href="mailto:support@zalo.solutions" className="text-[oklch(0.488_0.243_264.376)] hover:underline">
                  support@zalo.solutions
                </a>
                .
              </li>
            </ul>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
