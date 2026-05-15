"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type Recipient = {
  label: string
  color: "pink" | "green"
}

type Notification = {
  id: string
  title: string
  description: string
  extra?: string
  enabled: boolean
  recipients: Recipient[][]
}

const initialNotifications: Notification[] = [
  {
    id: "bien-dong-so-du",
    title: "Thông báo biến động số dư",
    description: "Các loại thông báo liên quan tới nạp tiền, khuyến mãi, chuyển thưởng của ZBS Account.",
    enabled: true,
    recipients: [
      [
        { label: "Quản trị viên", color: "pink" },
        { label: "Quản trị viên cấp cao", color: "pink" },
      ],
    ],
  },
  {
    id: "han-muc-tai-khoan",
    title: "Thông báo hạn mức tài khoản",
    description: "Thông báo hạn mức tài khoản khi đạt ngưỡng nhất định.",
    extra: "Ngưỡng cài đặt: 1,000,000,000 đ",
    enabled: true,
    recipients: [
      [
        { label: "Quản trị viên", color: "pink" },
        { label: "Quản trị viên cấp cao", color: "pink" },
      ],
    ],
  },
  {
    id: "ve-template",
    title: "Thông báo về Template",
    description: "Thông báo liên quan đến trạng thái xét duyệt, quyền lợi và chất lượng Template.",
    enabled: true,
    recipients: [
      [
        { label: "Quản trị viên", color: "pink" },
        { label: "Quản trị viên cấp cao", color: "pink" },
      ],
      [
        { label: "Biên tập viên", color: "green" },
        { label: "Tài chính viên", color: "green" },
      ],
    ],
  },
]

const recipientColors = {
  pink: "bg-[oklch(0.94_0.04_10)] text-[oklch(0.45_0.15_10)]",
  green: "bg-[oklch(0.93_0.06_145)] text-[oklch(0.4_0.12_145)]",
}

export default function QuanLyThongBaoPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  function toggle(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  return (
    <SidebarProvider>
      <ZbsSidebar basePath="/base" />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 space-y-5 h-[calc(100vh-56px)]">
          <div>
            <h1 className="text-2xl font-bold">Quản lý thông báo</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Quản lý việc nhận thông báo từ Zalo Business Solutions và các dịch vụ liên quan
            </p>
          </div>

          <div className="rounded border border-border bg-white">
            {/* Header row */}
            <div className="grid grid-cols-[80px_1fr_260px_120px] border-b border-border px-5 py-3">
              <span className="text-sm font-semibold">Bật/Tắt</span>
              <span className="text-sm font-semibold">Loại thông báo</span>
              <span className="text-sm font-semibold">Người nhận</span>
              <span className="text-sm font-semibold">Thao tác</span>
            </div>

            {notifications.map((n, i) => (
              <div
                key={n.id}
                className={`grid grid-cols-[80px_1fr_260px_120px] items-start px-5 py-4 ${
                  i < notifications.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Toggle */}
                <div className="pt-0.5">
                  <Switch
                    checked={n.enabled}
                    onCheckedChange={() => toggle(n.id)}
                  />
                </div>

                {/* Title + description */}
                <div className="space-y-1 pr-6">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.description}</p>
                  {n.extra && (
                    <p className="text-sm text-muted-foreground">
                      {n.extra.split(/([\d,]+\s*đ)/).map((part, idx) =>
                        /[\d,]+\s*đ/.test(part) ? (
                          <strong key={idx} className="font-semibold text-foreground">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  )}
                </div>

                {/* Recipients */}
                <div className="space-y-2">
                  {n.recipients.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex flex-wrap gap-1.5">
                      {row.map((r) => (
                        <span
                          key={r.label}
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${recipientColors[r.color]}`}
                        >
                          {r.label}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Action */}
                <div>
                  <Button variant="secondary" size="sm">
                    Chỉnh sửa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
