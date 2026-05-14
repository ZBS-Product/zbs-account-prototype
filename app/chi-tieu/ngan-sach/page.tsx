"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import ZbsSidebar from "@/components/zbs-sidebar"
import ZbsHeader from "@/components/zbs-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Gauge, BellRing } from "lucide-react"

const features = [
  {
    icon: Wallet,
    iconBg: "oklch(0.94 0.04 10)",
    iconColor: "oklch(0.55 0.2 10)",
    title: "Tạo Ngân Sách",
    desc: "Tạo ngân sách linh hoạt theo thời gian hoặc chiến dịch",
  },
  {
    icon: Gauge,
    iconBg: "oklch(0.93 0.06 185)",
    iconColor: "oklch(0.45 0.12 185)",
    title: "Đặt Ngưỡng",
    desc: "Hệ thống nhắc nhở tự động khi chạm ngưỡng 80% - 100%",
  },
  {
    icon: BellRing,
    iconBg: "oklch(0.95 0.08 70)",
    iconColor: "oklch(0.6 0.18 60)",
    title: "Nhận Thông Báo",
    desc: "Gửi thông báo đến đúng nhân sự phụ trách",
  },
]

export default function QuanLyNganSachPage() {
  return (
    <SidebarProvider>
      <ZbsSidebar />
      <SidebarInset>
        <ZbsHeader />
        <main className="flex-1 overflow-y-auto p-6 h-[calc(100vh-56px)]">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold">Quản lý ngân sách</h1>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">Beta</Badge>
          </div>

          {/* Empty state promo */}
          <div className="flex flex-col items-center justify-center py-10 text-center">
            {/* Illustration */}
            <div className="mb-6 relative w-52 h-44 select-none">
              {/* Stack of cards / budget illustration using CSS */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Back card */}
                  <rect x="30" y="50" width="140" height="90" rx="12" fill="oklch(0.75 0.18 250)" opacity="0.4" transform="rotate(-8 100 95)"/>
                  {/* Middle card */}
                  <rect x="30" y="50" width="140" height="90" rx="12" fill="oklch(0.6 0.22 260)" opacity="0.6" transform="rotate(-3 100 95)"/>
                  {/* Front card */}
                  <rect x="25" y="45" width="150" height="95" rx="12" fill="oklch(0.488 0.243 264.376)"/>
                  {/* Card shine */}
                  <rect x="25" y="45" width="150" height="35" rx="12" fill="white" opacity="0.12"/>
                  {/* Chart bars on card */}
                  <rect x="45" y="90" width="14" height="30" rx="3" fill="white" opacity="0.5"/>
                  <rect x="65" y="80" width="14" height="40" rx="3" fill="white" opacity="0.7"/>
                  <rect x="85" y="72" width="14" height="48" rx="3" fill="white" opacity="0.9"/>
                  <rect x="105" y="82" width="14" height="38" rx="3" fill="white" opacity="0.7"/>
                  <rect x="125" y="68" width="14" height="52" rx="3" fill="white" opacity="0.95"/>
                  {/* Coin stack */}
                  <ellipse cx="162" cy="50" rx="18" ry="8" fill="oklch(0.82 0.18 80)"/>
                  <rect x="144" y="42" width="36" height="12" fill="oklch(0.78 0.18 80)"/>
                  <ellipse cx="162" cy="42" rx="18" ry="8" fill="oklch(0.85 0.2 80)"/>
                  <rect x="144" y="34" width="36" height="10" fill="oklch(0.8 0.18 80)"/>
                  <ellipse cx="162" cy="34" rx="18" ry="8" fill="oklch(0.88 0.2 80)"/>
                  {/* Dollar sign on coin */}
                  <text x="157" y="38" fontSize="10" fill="oklch(0.6 0.15 80)" fontWeight="bold">$</text>
                  {/* Shield / lock icon */}
                  <circle cx="44" cy="50" r="14" fill="oklch(0.75 0.15 185)"/>
                  <text x="38" y="55" fontSize="14" fill="white">🔒</text>
                </svg>
              </div>
            </div>

            {/* Tag */}
            <span className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "oklch(0.95 0.08 70)", color: "oklch(0.55 0.18 60)" }}>
              Tính năng mới
            </span>

            {/* Heading */}
            <h2 className="text-xl font-bold mb-2">Chủ động kiểm soát Ngân Sách ZBS</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-10">
              Thay thế theo dõi thủ công bằng hệ thống Ngân Sách tự động. Thiết lập một lần, yên tâm vận hành.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-8 mb-10 max-w-xl">
              {features.map((f) => (
                <div key={f.title} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-1" style={{ background: f.iconBg }}>
                    <f.icon className="h-6 w-6" style={{ color: f.iconColor }} />
                  </div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button
              className="px-8 text-white"
              style={{ background: "oklch(0.488 0.243 264.376)" }}
            >
              Đăng ký dùng thử
            </Button>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
